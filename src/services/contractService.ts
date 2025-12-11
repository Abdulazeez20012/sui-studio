/**
 * Real Contract Service
 * Interacts with deployed contracts on Sui blockchain
 */

import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

const RPC_URLS: Record<string, string> = {
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  testnet: 'https://fullnode.testnet.sui.io:443',
  devnet: 'https://fullnode.devnet.sui.io:443',
};

export interface ContractFunction {
  name: string;
  parameters: Array<{ name: string; type: string }>;
  returnType?: string;
  visibility: string;
  isEntry: boolean;
}

export interface ContractModule {
  name: string;
  functions: ContractFunction[];
  structs: Array<{
    name: string;
    fields: Array<{ name: string; type: string }>;
    abilities: string[];
  }>;
}

export interface CallResult {
  success: boolean;
  digest?: string;
  gasUsed?: number;
  effects?: any;
  events?: any[];
  error?: string;
}

class ContractService {
  private clients: Map<string, SuiClient> = new Map();

  private getClient(network: string = 'testnet'): SuiClient {
    if (!this.clients.has(network)) {
      this.clients.set(network, new SuiClient({ url: RPC_URLS[network] || RPC_URLS.testnet }));
    }
    return this.clients.get(network)!;
  }

  /**
   * Get contract/package modules from blockchain
   */
  async getContractModules(packageId: string, network: string = 'testnet'): Promise<ContractModule[]> {
    try {
      const client = this.getClient(network);
      const normalizedModules = await client.getNormalizedMoveModulesByPackage({
        package: packageId,
      });

      return Object.entries(normalizedModules).map(([moduleName, moduleData]: [string, any]) => ({
        name: moduleName,
        functions: Object.entries(moduleData.exposedFunctions || {}).map(
          ([funcName, funcData]: [string, any]) => ({
            name: funcName,
            parameters: (funcData.parameters || []).map((param: any, idx: number) => ({
              name: `arg${idx}`,
              type: this.formatType(param),
            })),
            returnType: funcData.return?.length > 0 ? this.formatType(funcData.return[0]) : undefined,
            visibility: funcData.visibility?.toLowerCase() || 'private',
            isEntry: funcData.isEntry || false,
          })
        ),
        structs: Object.entries(moduleData.structs || {}).map(
          ([structName, structData]: [string, any]) => ({
            name: structName,
            fields: (structData.fields || []).map((field: any) => ({
              name: field.name,
              type: this.formatType(field.type),
            })),
            abilities: structData.abilities?.abilities || [],
          })
        ),
      }));
    } catch (error) {
      console.error('Failed to get contract modules:', error);
      return [];
    }
  }

  /**
   * Format Move type for display
   */
  private formatType(typeData: any): string {
    if (typeof typeData === 'string') return typeData;
    if (typeData.Vector) return `vector<${this.formatType(typeData.Vector)}>`;
    if (typeData.Struct) {
      const s = typeData.Struct;
      const shortAddr = s.address.length > 10 ? `${s.address.slice(0, 6)}...` : s.address;
      return `${shortAddr}::${s.module}::${s.name}`;
    }
    if (typeData.TypeParameter) return `T${typeData.TypeParameter}`;
    if (typeData.Reference) return `&${this.formatType(typeData.Reference)}`;
    if (typeData.MutableReference) return `&mut ${this.formatType(typeData.MutableReference)}`;
    return JSON.stringify(typeData);
  }

  /**
   * Build a transaction for calling a contract function
   */
  buildCallTransaction(
    packageId: string,
    moduleName: string,
    functionName: string,
    args: any[],
    typeArgs?: string[]
  ): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${packageId}::${moduleName}::${functionName}`,
      arguments: args.map((arg) => {
        if (typeof arg === 'string' && arg.startsWith('0x')) {
          return tx.object(arg);
        }
        if (typeof arg === 'number' || typeof arg === 'bigint') {
          return tx.pure.u64(arg);
        }
        if (typeof arg === 'boolean') {
          return tx.pure.bool(arg);
        }
        if (typeof arg === 'string') {
          // Check if it looks like an address
          if (arg.length === 66 || arg.length === 64) {
            return tx.pure.address(arg.startsWith('0x') ? arg : `0x${arg}`);
          }
          return tx.pure.string(arg);
        }
        if (Array.isArray(arg)) {
          return tx.pure.vector('u8', arg);
        }
        return tx.pure.u64(0);
      }),
      typeArguments: typeArgs,
    });

    return tx;
  }

  /**
   * Dry run a contract call
   */
  async dryRunCall(
    packageId: string,
    moduleName: string,
    functionName: string,
    args: any[],
    sender: string,
    network: string = 'testnet',
    typeArgs?: string[]
  ): Promise<{ success: boolean; gasUsed: number; error?: string }> {
    try {
      const client = this.getClient(network);
      const tx = this.buildCallTransaction(packageId, moduleName, functionName, args, typeArgs);
      tx.setSender(sender);
      tx.setGasBudget(100000000);

      const bytes = await tx.build({ client });
      const result = await client.dryRunTransactionBlock({ transactionBlock: bytes });

      const gasUsed = result.effects.gasUsed;
      const totalGas =
        Number(gasUsed.computationCost) +
        Number(gasUsed.storageCost) -
        Number(gasUsed.storageRebate);

      return {
        success: result.effects.status.status === 'success',
        gasUsed: totalGas,
        error:
          result.effects.status.status === 'failure'
            ? JSON.stringify(result.effects.status.error)
            : undefined,
      };
    } catch (error: any) {
      return { success: false, gasUsed: 0, error: error.message };
    }
  }

  /**
   * Execute a contract call (requires wallet signing)
   */
  async executeCall(
    packageId: string,
    moduleName: string,
    functionName: string,
    args: any[],
    signAndExecute: (params: { transaction: Transaction }) => Promise<{ digest: string }>,
    network: string = 'testnet',
    typeArgs?: string[],
    gasBudget?: number
  ): Promise<CallResult> {
    try {
      const client = this.getClient(network);
      const tx = this.buildCallTransaction(packageId, moduleName, functionName, args, typeArgs);

      if (gasBudget) {
        tx.setGasBudget(gasBudget);
      }

      // Sign and execute with wallet
      const result = await signAndExecute({ transaction: tx });

      if (!result.digest) {
        return { success: false, error: 'Transaction failed - no digest' };
      }

      // Wait for confirmation and get details
      const txDetails = await client.waitForTransaction({
        digest: result.digest,
        options: {
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        },
      });

      const gasUsed = txDetails.effects?.gasUsed;
      const totalGas = gasUsed
        ? Number(gasUsed.computationCost) + Number(gasUsed.storageCost) - Number(gasUsed.storageRebate)
        : 0;

      return {
        success: txDetails.effects?.status.status === 'success',
        digest: result.digest,
        gasUsed: totalGas,
        effects: txDetails.effects,
        events: txDetails.events,
        error:
          txDetails.effects?.status.status === 'failure'
            ? JSON.stringify(txDetails.effects.status.error)
            : undefined,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Read contract state (view function)
   */
  async readState(objectId: string, network: string = 'testnet'): Promise<any> {
    try {
      const client = this.getClient(network);
      const response = await client.getObject({
        id: objectId,
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (!response.data?.content) return null;

      const content = response.data.content as any;
      return {
        type: response.data.type,
        fields: content.fields,
        version: response.data.version,
      };
    } catch (error) {
      console.error('Failed to read state:', error);
      return null;
    }
  }

  /**
   * Get events emitted by a package
   */
  async getPackageEvents(
    packageId: string,
    network: string = 'testnet',
    limit: number = 50
  ): Promise<any[]> {
    try {
      const client = this.getClient(network);
      const response = await client.queryEvents({
        query: { MoveModule: { package: packageId, module: '' } },
        limit,
        order: 'descending',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get events:', error);
      return [];
    }
  }

  /**
   * Get dynamic fields of an object
   */
  async getDynamicFields(parentId: string, network: string = 'testnet'): Promise<any[]> {
    try {
      const client = this.getClient(network);
      const response = await client.getDynamicFields({ parentId });
      return response.data;
    } catch (error) {
      console.error('Failed to get dynamic fields:', error);
      return [];
    }
  }

  /**
   * Get dynamic field value
   */
  async getDynamicFieldValue(
    parentId: string,
    name: { type: string; value: any },
    network: string = 'testnet'
  ): Promise<any> {
    try {
      const client = this.getClient(network);
      const response = await client.getDynamicFieldObject({ parentId, name });
      return response.data;
    } catch (error) {
      console.error('Failed to get dynamic field value:', error);
      return null;
    }
  }

  /**
   * Get explorer URL for transaction
   */
  getExplorerUrl(digest: string, network: string = 'testnet'): string {
    return `https://suiexplorer.com/txblock/${digest}?network=${network}`;
  }

  /**
   * Get explorer URL for object
   */
  getObjectExplorerUrl(objectId: string, network: string = 'testnet'): string {
    return `https://suiexplorer.com/object/${objectId}?network=${network}`;
  }
}

export const contractService = new ContractService();
