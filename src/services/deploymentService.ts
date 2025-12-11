/**
 * Real Deployment Service
 * Handles contract deployment to Sui blockchain via wallet signing
 */

import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { apiService } from './apiService';

export interface DeploymentOptions {
  code: string;
  packageName: string;
  network: 'testnet' | 'devnet' | 'mainnet';
  projectId?: string;
}

export interface DeploymentResult {
  success: boolean;
  packageId?: string;
  transactionDigest?: string;
  gasUsed?: number;
  error?: string;
  explorerUrl?: string;
  packageExplorerUrl?: string;
}

export interface GasEstimate {
  estimatedGas: number;
  bytecodeSize: number;
  recommendedBudget: number;
  breakdown: {
    base: number;
    bytecode: number;
    dryRun?: number;
  };
}

const RPC_URLS: Record<string, string> = {
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  testnet: 'https://fullnode.testnet.sui.io:443',
  devnet: 'https://fullnode.devnet.sui.io:443',
};

class DeploymentService {
  private getClient(network: string): SuiClient {
    return new SuiClient({ url: RPC_URLS[network] || RPC_URLS.testnet });
  }

  /**
   * Deploy a Move package using wallet signing
   * This is the main deployment method that:
   * 1. Sends code to backend for compilation
   * 2. Gets transaction bytes back
   * 3. Signs with wallet
   * 4. Submits to blockchain
   * 5. Confirms deployment
   */
  async deployPackage(
    options: DeploymentOptions,
    senderAddress: string,
    signAndExecute: (params: { transaction: Transaction }) => Promise<{ digest: string }>
  ): Promise<DeploymentResult> {
    try {
      // Step 1: Prepare deployment (compile on backend)
      const prepareResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/deploy/prepare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          code: options.code,
          packageName: options.packageName,
          network: options.network,
          sender: senderAddress,
          projectId: options.projectId,
        }),
      });

      const prepareResult = await prepareResponse.json();

      if (!prepareResult.success) {
        return {
          success: false,
          error: prepareResult.error || 'Compilation failed',
        };
      }

      // Step 2: Deserialize transaction and sign with wallet
      const client = this.getClient(options.network);
      const txBytes = Uint8Array.from(Buffer.from(prepareResult.transactionBytes, 'base64'));
      
      // Create transaction from bytes
      const tx = Transaction.from(txBytes);

      // Step 3: Sign and execute with wallet
      const result = await signAndExecute({ transaction: tx });

      if (!result.digest) {
        return {
          success: false,
          error: 'Transaction failed - no digest returned',
        };
      }

      // Step 4: Wait for transaction to be confirmed
      await client.waitForTransaction({
        digest: result.digest,
        options: { showEffects: true },
      });

      // Step 5: Confirm deployment with backend
      const confirmResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/deploy/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          deploymentId: prepareResult.deploymentId,
          transactionDigest: result.digest,
          network: options.network,
        }),
      });

      const confirmResult = await confirmResponse.json();

      if (!confirmResult.success) {
        return {
          success: false,
          error: confirmResult.error || 'Deployment confirmation failed',
          transactionDigest: result.digest,
        };
      }

      return {
        success: true,
        packageId: confirmResult.packageId,
        transactionDigest: result.digest,
        gasUsed: confirmResult.gasUsed,
        explorerUrl: confirmResult.explorerUrl,
        packageExplorerUrl: confirmResult.packageExplorerUrl,
      };
    } catch (error: any) {
      console.error('Deployment error:', error);
      return {
        success: false,
        error: error.message || 'Deployment failed',
      };
    }
  }

  /**
   * Estimate gas for deployment
   */
  async estimateGas(
    code: string,
    packageName: string,
    network: string,
    senderAddress?: string
  ): Promise<GasEstimate> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/deploy/estimate-gas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          code,
          packageName,
          network,
          sender: senderAddress,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Gas estimation failed');
      }

      return {
        estimatedGas: result.estimatedGas,
        bytecodeSize: result.bytecodeSize,
        recommendedBudget: result.recommendedBudget,
        breakdown: result.breakdown,
      };
    } catch (error: any) {
      // Fallback estimation
      const codeLength = code.length;
      const baseGas = 10000000;
      const estimatedGas = baseGas + codeLength * 100;

      return {
        estimatedGas,
        bytecodeSize: codeLength,
        recommendedBudget: Math.ceil(estimatedGas * 1.5),
        breakdown: {
          base: baseGas,
          bytecode: codeLength * 100,
        },
      };
    }
  }

  /**
   * Verify a deployed package
   */
  async verifyPackage(
    packageId: string,
    network: string
  ): Promise<{
    success: boolean;
    modules?: string[];
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || ''}/api/deploy/verify/${packageId}?network=${network}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error };
      }

      return {
        success: true,
        modules: result.modules,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get deployment history
   */
  async getDeploymentHistory(): Promise<any[]> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/deploy/history/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      const result = await response.json();
      return result.deployments || [];
    } catch (error) {
      console.error('Failed to fetch deployment history:', error);
      return [];
    }
  }

  /**
   * Get deployment by ID
   */
  async getDeployment(deploymentId: string): Promise<any | null> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/deploy/${deploymentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      const result = await response.json();
      return result.deployment || null;
    } catch (error) {
      console.error('Failed to fetch deployment:', error);
      return null;
    }
  }

  /**
   * Get explorer URL for transaction
   */
  getExplorerUrl(network: string, txDigest: string): string {
    return `https://suiexplorer.com/txblock/${txDigest}?network=${network}`;
  }

  /**
   * Get explorer URL for package
   */
  getPackageExplorerUrl(network: string, packageId: string): string {
    return `https://suiexplorer.com/object/${packageId}?network=${network}`;
  }

  /**
   * Check if package exists on chain
   */
  async packageExists(packageId: string, network: string): Promise<boolean> {
    try {
      const client = this.getClient(network);
      const obj = await client.getObject({ id: packageId });
      return !!obj.data;
    } catch {
      return false;
    }
  }

  /**
   * Get package modules
   */
  async getPackageModules(packageId: string, network: string): Promise<string[]> {
    try {
      const client = this.getClient(network);
      const modules = await client.getNormalizedMoveModulesByPackage({
        package: packageId,
      });
      return Object.keys(modules);
    } catch {
      return [];
    }
  }
}

export const deploymentService = new DeploymentService();
