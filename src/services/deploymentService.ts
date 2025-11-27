import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';

export interface DeploymentOptions {
  code: string;
  packageName: string;
  network: 'testnet' | 'devnet' | 'mainnet';
  dependencies?: string[];
}

export interface DeploymentResult {
  success: boolean;
  packageId?: string;
  transactionDigest?: string;
  gasUsed?: number;
  error?: string;
}

class DeploymentService {
  private getRpcUrl(network: string): string {
    const urls = {
      mainnet: 'https://fullnode.mainnet.sui.io:443',
      testnet: 'https://fullnode.testnet.sui.io:443',
      devnet: 'https://fullnode.devnet.sui.io:443',
    };
    return urls[network as keyof typeof urls] || urls.testnet;
  }

  /**
   * Publish a Move package to Sui network using connected wallet
   * This uses the wallet to sign and execute a real publish transaction
   */
  async publishPackage(
    options: DeploymentOptions,
    signAndExecute: (transaction: any) => Promise<any>
  ): Promise<DeploymentResult> {
    try {
      const client = new SuiClient({ url: this.getRpcUrl(options.network) });

      // Step 1: Compile the Move code to bytecode via backend
      const compileResponse = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: options.code,
          packageName: options.packageName,
        }),
      });

      if (!compileResponse.ok) {
        throw new Error('Compilation failed');
      }

      const compileResult = await compileResponse.json();
      
      if (!compileResult.success) {
        // Create detailed error message with all compilation errors
        const errorDetails = compileResult.errors?.map((err: any) => 
          `${err.message}${err.file ? ` (${err.file}:${err.line}:${err.column})` : ''}`
        ).join('\n') || 'Compilation failed';
        
        const error: any = new Error('Compilation failed');
        error.compilationErrors = compileResult.errors;
        error.fullOutput = compileResult.fullOutput;
        error.details = errorDetails;
        throw error;
      }

      // Step 2: Get compiled modules (bytecode)
      const compiledModules = compileResult.modules || [];
      const dependencies = compileResult.dependencies || [];

      if (compiledModules.length === 0) {
        throw new Error('No compiled modules found');
      }

      // Step 3: Create publish transaction
      const tx = new Transaction();

      // Add publish command with compiled bytecode
      const [upgradeCap] = tx.publish({
        modules: compiledModules,
        dependencies: dependencies,
      });

      // Transfer upgrade capability to sender
      tx.transferObjects([upgradeCap], tx.pure.address(await this.getSenderAddress(signAndExecute)));

      // Set gas budget
      const gasEstimate = await this.estimateGas(options.code);
      tx.setGasBudget(gasEstimate.gasBudget);

      // Step 4: Sign and execute transaction with wallet
      const result = await signAndExecute({
        transaction: tx,
      });

      // Step 5: Get transaction details
      if (result.digest) {
        const txDetails = await client.getTransactionBlock({
          digest: result.digest,
          options: {
            showEffects: true,
            showObjectChanges: true,
          },
        });

        // Extract package ID and gas used
        const packageId = this.extractPackageId(txDetails);
        const gasUsed = this.extractGasUsed(txDetails);

        return {
          success: true,
          packageId,
          transactionDigest: result.digest,
          gasUsed,
        };
      }

      throw new Error('Transaction failed');
    } catch (error: any) {
      console.error('Deployment error:', error);
      return {
        success: false,
        error: error.message || 'Deployment failed',
      };
    }
  }

  /**
   * Get sender address from wallet
   */
  private async getSenderAddress(signAndExecute: any): Promise<string> {
    // This will be provided by the wallet context
    // For now, return a placeholder that will be replaced
    return '0x0';
  }

  /**
   * Simulate deployment for testing (when real compilation isn't available)
   */
  async simulateDeployment(options: DeploymentOptions): Promise<DeploymentResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock IDs
    const mockPackageId = '0x' + this.generateRandomHex(64);
    const mockTxDigest = this.generateRandomHex(64);

    // Simulate gas calculation
    const gasEstimate = await this.estimateGas(options.code);

    return {
      success: true,
      packageId: mockPackageId,
      transactionDigest: mockTxDigest,
      gasUsed: gasEstimate.gasUsed,
    };
  }

  /**
   * Estimate gas for deployment
   */
  private async estimateGas(code: string): Promise<{ gasUsed: number; gasBudget: number }> {
    // Basic heuristic-based estimation
    const baseGas = 500000; // Base gas for publishing
    const codeLength = code.length;
    const gasPerChar = 100;

    const estimatedGas = baseGas + (codeLength * gasPerChar);
    const gasBudget = Math.ceil(estimatedGas * 1.5); // 50% buffer

    return {
      gasUsed: estimatedGas,
      gasBudget,
    };
  }

  /**
   * Generate Move.toml content
   */
  private generateMoveToml(packageName: string, dependencies?: string[]): string {
    const deps = dependencies || ['Sui'];
    
    return `[package]
name = "${packageName}"
version = "0.0.1"

[dependencies]
${deps.map(dep => {
  if (dep === 'Sui') {
    return 'Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }';
  }
  return `${dep} = { local = "../${dep}" }`;
}).join('\n')}

[addresses]
${packageName} = "0x0"
`;
  }

  /**
   * Extract package ID from transaction result
   */
  private extractPackageId(txDetails: any): string | undefined {
    const objectChanges = txDetails.objectChanges || [];
    const publishedPackage = objectChanges.find(
      (change: any) => change.type === 'published'
    );
    return publishedPackage?.packageId;
  }

  /**
   * Extract gas used from transaction result
   */
  private extractGasUsed(txDetails: any): number {
    const effects = txDetails.effects;
    if (effects?.gasUsed) {
      const { computationCost, storageCost, storageRebate } = effects.gasUsed;
      return Number(computationCost) + Number(storageCost) - Number(storageRebate);
    }
    return 0;
  }

  /**
   * Generate random hex string
   */
  private generateRandomHex(length: number): string {
    let result = '';
    const characters = '0123456789abcdef';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
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
}

export const deploymentService = new DeploymentService();
