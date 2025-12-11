/**
 * Real Sui Service
 * Interacts with actual Sui blockchain
 */

import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

const SUI_NETWORK = import.meta.env.VITE_SUI_NETWORK || 'testnet';
const SUI_RPC_URL = import.meta.env.VITE_SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443';

const RPC_URLS: Record<string, string> = {
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  testnet: 'https://fullnode.testnet.sui.io:443',
  devnet: 'https://fullnode.devnet.sui.io:443',
};

class SuiService {
  private clients: Map<string, SuiClient> = new Map();
  private network: string;

  constructor() {
    this.network = SUI_NETWORK;
  }

  private getClient(network?: string): SuiClient {
    const net = network || this.network;
    if (!this.clients.has(net)) {
      this.clients.set(net, new SuiClient({ url: RPC_URLS[net] || SUI_RPC_URL }));
    }
    return this.clients.get(net)!;
  }

  /**
   * Get real network info from blockchain
   */
  async getNetworkInfo(network?: string) {
    try {
      const client = this.getClient(network);
      const chainId = await client.getChainIdentifier();
      const checkpoint = await client.getLatestCheckpointSequenceNumber();

      return {
        network: network || this.network,
        chainId,
        latestCheckpoint: Number(checkpoint),
        rpcUrl: RPC_URLS[network || this.network] || SUI_RPC_URL,
      };
    } catch (error) {
      console.error('Failed to get network info:', error);
      return null;
    }
  }

  /**
   * Get object from blockchain
   */
  async getObject(objectId: string, network?: string) {
    try {
      const client = this.getClient(network);
      const response = await client.getObject({
        id: objectId,
        options: {
          showContent: true,
          showType: true,
          showOwner: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get object:', error);
      return null;
    }
  }

  /**
   * Get objects owned by address
   */
  async getOwnedObjects(address: string, network?: string, objectType?: string) {
    try {
      const client = this.getClient(network);
      const response = await client.getOwnedObjects({
        owner: address,
        filter: objectType ? { StructType: objectType } : undefined,
        options: {
          showContent: true,
          showType: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get owned objects:', error);
      return [];
    }
  }

  /**
   * Get balance for address
   */
  async getBalance(address: string, coinType: string = '0x2::sui::SUI', network?: string) {
    try {
      const client = this.getClient(network);
      const balance = await client.getBalance({ owner: address, coinType });
      return {
        coinType: balance.coinType,
        totalBalance: BigInt(balance.totalBalance),
        coinObjectCount: balance.coinObjectCount,
      };
    } catch (error) {
      console.error('Failed to get balance:', error);
      return null;
    }
  }

  /**
   * Get all balances for address
   */
  async getAllBalances(address: string, network?: string) {
    try {
      const client = this.getClient(network);
      const balances = await client.getAllBalances({ owner: address });
      return balances.map((b) => ({
        coinType: b.coinType,
        totalBalance: BigInt(b.totalBalance),
        coinObjectCount: b.coinObjectCount,
      }));
    } catch (error) {
      console.error('Failed to get all balances:', error);
      return [];
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(digest: string, network?: string) {
    try {
      const client = this.getClient(network);
      const tx = await client.getTransactionBlock({
        digest,
        options: {
          showEffects: true,
          showEvents: true,
          showInput: true,
          showObjectChanges: true,
        },
      });
      return tx;
    } catch (error) {
      console.error('Failed to get transaction:', error);
      return null;
    }
  }

  /**
   * Get transaction history for address
   */
  async getTransactionHistory(address: string, network?: string, limit: number = 20) {
    try {
      const client = this.getClient(network);
      const response = await client.queryTransactionBlocks({
        filter: { FromAddress: address },
        options: {
          showEffects: true,
          showEvents: true,
        },
        limit,
        order: 'descending',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  /**
   * Get package/module info
   */
  async getPackageInfo(packageId: string, network?: string) {
    try {
      const client = this.getClient(network);
      const modules = await client.getNormalizedMoveModulesByPackage({
        package: packageId,
      });
      return {
        packageId,
        modules: Object.keys(modules),
        moduleDetails: modules,
      };
    } catch (error) {
      console.error('Failed to get package info:', error);
      return null;
    }
  }

  /**
   * Dry run a transaction
   */
  async dryRunTransaction(tx: Transaction, sender: string, network?: string) {
    try {
      const client = this.getClient(network);
      tx.setSender(sender);
      const bytes = await tx.build({ client });

      const result = await client.dryRunTransactionBlock({
        transactionBlock: bytes,
      });

      const gasUsed = result.effects.gasUsed;
      const totalGas =
        Number(gasUsed.computationCost) +
        Number(gasUsed.storageCost) -
        Number(gasUsed.storageRebate);

      return {
        success: result.effects.status.status === 'success',
        gasUsed: totalGas,
        effects: result.effects,
        events: result.events,
        error: result.effects.status.status === 'failure' 
          ? JSON.stringify(result.effects.status.error)
          : undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        gasUsed: 0,
        error: error.message,
      };
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(tx: Transaction, sender: string, network?: string) {
    const result = await this.dryRunTransaction(tx, sender, network);
    return {
      gasUsed: result.gasUsed,
      recommendedBudget: Math.ceil(result.gasUsed * 1.2),
    };
  }

  /**
   * Get coins for address (for transaction building)
   */
  async getCoins(address: string, coinType: string = '0x2::sui::SUI', network?: string) {
    try {
      const client = this.getClient(network);
      const coins = await client.getCoins({ owner: address, coinType });
      return coins.data;
    } catch (error) {
      console.error('Failed to get coins:', error);
      return [];
    }
  }

  /**
   * Get current gas price
   */
  async getGasPrice(network?: string) {
    try {
      const client = this.getClient(network);
      const price = await client.getReferenceGasPrice();
      return BigInt(price);
    } catch (error) {
      console.error('Failed to get gas price:', error);
      return BigInt(1000);
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(digest: string, network?: string) {
    try {
      const client = this.getClient(network);
      const result = await client.waitForTransaction({
        digest,
        options: {
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        },
      });
      return result;
    } catch (error) {
      console.error('Failed to wait for transaction:', error);
      return null;
    }
  }

  /**
   * Get explorer URL for transaction
   */
  getExplorerUrl(digest: string, network?: string): string {
    const net = network || this.network;
    return `https://suiexplorer.com/txblock/${digest}?network=${net}`;
  }

  /**
   * Get explorer URL for object
   */
  getObjectExplorerUrl(objectId: string, network?: string): string {
    const net = network || this.network;
    return `https://suiexplorer.com/object/${objectId}?network=${net}`;
  }

  /**
   * Get explorer URL for address
   */
  getAddressExplorerUrl(address: string, network?: string): string {
    const net = network || this.network;
    return `https://suiexplorer.com/address/${address}?network=${net}`;
  }

  /**
   * Get current network
   */
  getCurrentNetwork(): string {
    return this.network;
  }

  /**
   * Set current network
   */
  setNetwork(network: string): void {
    this.network = network;
  }
}

export const suiService = new SuiService();
