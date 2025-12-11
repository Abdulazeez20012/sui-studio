/**
 * Real Contract Interaction Service
 * Queries actual Sui blockchain for contract data
 */

import { SuiClient, SuiObjectResponse } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

export interface ContractFunction {
  name: string;
  parameters: ContractParameter[];
  returnType?: string;
  visibility: 'public' | 'private' | 'entry';
  isEntry: boolean;
  gasEstimate: number;
}

export interface ContractParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface ContractObject {
  id: string;
  type: string;
  fields: Record<string, any>;
  owner?: string;
  version: number;
  digest?: string;
}

export interface TransactionResult {
  digest: string;
  status: 'success' | 'failure';
  gasUsed: number;
  effects: {
    created?: ContractObject[];
    mutated?: ContractObject[];
    deleted?: string[];
    events?: any[];
  };
  error?: string;
}

export interface ContractInfo {
  packageId: string;
  moduleName: string;
  functions: ContractFunction[];
  structs: ContractStruct[];
  address: string;
  version: string;
  publisher?: string;
  publishedAt?: Date;
}

export interface ContractStruct {
  name: string;
  fields: Array<{ name: string; type: string }>;
  abilities: string[];
}

export interface CallContractParams {
  packageId: string;
  moduleName: string;
  functionName: string;
  arguments: any[];
  typeArguments?: string[];
  gasBudget?: number;
  sender?: string;
}

const RPC_URLS: Record<string, string> = {
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  testnet: 'https://fullnode.testnet.sui.io:443',
  devnet: 'https://fullnode.devnet.sui.io:443',
};

class ContractInteractionService {
  private clients: Map<string, SuiClient> = new Map();
  private contractCache: Map<string, ContractInfo> = new Map();

  private getClient(network: string = 'testnet'): SuiClient {
    if (!this.clients.has(network)) {
      this.clients.set(network, new SuiClient({ url: RPC_URLS[network] || RPC_URLS.testnet }));
    }
    return this.clients.get(network)!;
  }

  /**
   * Get real contract/package information from blockchain
   */
  async getContractInfo(packageId: string, network: string = 'testnet'): Promise<ContractInfo | null> {
    const cacheKey = `${network}:${packageId}`;
    if (this.contractCache.has(cacheKey)) {
      return this.contractCache.get(cacheKey)!;
    }

    try {
      const client = this.getClient(network);
      
      // Get package object
      const packageObj = await client.getObject({
        id: packageId,
        options: {
          showContent: true,
          showType: true,
          showOwner: true,
        },
      });

      if (!packageObj.data) {
        return null;
      }

      // Get normalized module info
      const normalizedModules = await client.getNormalizedMoveModulesByPackage({
        package: packageId,
      });

      const modules = Object.entries(normalizedModules);
      if (modules.length === 0) return null;

      // Parse first module (or could return all)
      const [moduleName, moduleData] = modules[0];
      
      // Extract functions
      const functions: ContractFunction[] = Object.entries(moduleData.exposedFunctions || {}).map(
        ([funcName, funcData]: [string, any]) => ({
          name: funcName,
          parameters: (funcData.parameters || []).map((param: any, idx: number) => ({
            name: `arg${idx}`,
            type: this.formatType(param),
            required: true,
          })),
          returnType: funcData.return?.length > 0 ? this.formatType(funcData.return[0]) : undefined,
          visibility: funcData.visibility?.toLowerCase() || 'private',
          isEntry: funcData.isEntry || false,
          gasEstimate: this.estimateFunctionGas(funcData),
        })
      );

      // Extract structs
      const structs: ContractStruct[] = Object.entries(moduleData.structs || {}).map(
        ([structName, structData]: [string, any]) => ({
          name: structName,
          fields: (structData.fields || []).map((field: any) => ({
            name: field.name,
            type: this.formatType(field.type),
          })),
          abilities: structData.abilities?.abilities || [],
        })
      );

      const contractInfo: ContractInfo = {
        packageId,
        moduleName,
        functions,
        structs,
        address: packageId,
        version: '1.0.0',
      };

      this.contractCache.set(cacheKey, contractInfo);
      return contractInfo;
    } catch (error) {
      console.error('Error fetching contract info:', error);
      return null;
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
      return `${s.address}::${s.module}::${s.name}`;
    }
    if (typeData.TypeParameter) return `T${typeData.TypeParameter}`;
    if (typeData.Reference) return `&${this.formatType(typeData.Reference)}`;
    if (typeData.MutableReference) return `&mut ${this.formatType(typeData.MutableReference)}`;
    return JSON.stringify(typeData);
  }

  /**
   * Estimate gas for function based on complexity
   */
  private estimateFunctionGas(funcData: any): number {
    let gas = 1000; // Base
    gas += (funcData.parameters?.length || 0) * 200;
    if (funcData.isEntry) gas += 500;
    return gas;
  }

  /**
   * Get real object from blockchain
   */
  async getObject(objectId: string, network: string = 'testnet'): Promise<ContractObject | null> {
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

      if (!response.data) return null;

      const owner = response.data.owner;
      let ownerAddress: string | undefined;
      if (owner && typeof owner === 'object') {
        if ('AddressOwner' in owner) ownerAddress = owner.AddressOwner;
        else if ('ObjectOwner' in owner) ownerAddress = owner.ObjectOwner;
      }

      return {
        id: response.data.objectId,
        type: response.data.type || 'unknown',
        fields: (response.data.content as any)?.fields || {},
        owner: ownerAddress,
        version: Number(response.data.version),
        digest: response.data.digest,
      };
    } catch (error) {
      console.error('Error fetching object:', error);
      return null;
    }
  }

  /**
   * Get objects owned by address from blockchain
   */
  async getOwnedObjects(
    address: string,
    network: string = 'testnet',
    objectType?: string
  ): Promise<ContractObject[]> {
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

      return response.data
        .filter((obj) => obj.data)
        .map((obj) => ({
          id: obj.data!.objectId,
          type: obj.data!.type || 'unknown',
          fields: (obj.data!.content as any)?.fields || {},
          owner: address,
          version: Number(obj.data!.version),
          digest: obj.data!.digest,
        }));
    } catch (error) {
      console.error('Error fetching owned objects:', error);
      return [];
    }
  }

  /**
   * Build transaction for contract call (to be signed by wallet)
   */
  buildTransaction(params: CallContractParams): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${params.packageId}::${params.moduleName}::${params.functionName}`,
      arguments: params.arguments.map((arg) => {
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
          return tx.pure.string(arg);
        }
        return tx.pure.u64(0);
      }),
      typeArguments: params.typeArguments,
    });

    if (params.gasBudget) {
      tx.setGasBudget(params.gasBudget);
    }

    return tx;
  }

  /**
   * Dry run transaction to estimate gas
   */
  async dryRunTransaction(
    tx: Transaction,
    sender: string,
    network: string = 'testnet'
  ): Promise<{ gasUsed: number; effects: any; error?: string }> {
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
        gasUsed: totalGas,
        effects: result.effects,
        error: result.effects.status.status === 'failure' 
          ? JSON.stringify(result.effects.status.error) 
          : undefined,
      };
    } catch (error: any) {
      return { gasUsed: 0, effects: {}, error: error.message };
    }
  }

  /**
   * Get real transaction history for address
   */
  async getTransactionHistory(
    address: string,
    network: string = 'testnet',
    limit: number = 20
  ): Promise<TransactionResult[]> {
    try {
      const client = this.getClient(network);
      const response = await client.queryTransactionBlocks({
        filter: { FromAddress: address },
        options: {
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        },
        limit,
        order: 'descending',
      });

      return response.data.map((tx) => {
        const gasUsed = tx.effects?.gasUsed;
        const totalGas = gasUsed
          ? Number(gasUsed.computationCost) + Number(gasUsed.storageCost) - Number(gasUsed.storageRebate)
          : 0;

        return {
          digest: tx.digest,
          status: tx.effects?.status.status === 'success' ? 'success' : 'failure',
          gasUsed: totalGas,
          effects: {
            created: tx.objectChanges?.filter((c) => c.type === 'created').map((c: any) => ({
              id: c.objectId,
              type: c.objectType,
              fields: {},
              version: Number(c.version),
            })) || [],
            mutated: tx.objectChanges?.filter((c) => c.type === 'mutated').map((c: any) => ({
              id: c.objectId,
              type: c.objectType,
              fields: {},
              version: Number(c.version),
            })) || [],
            deleted: tx.objectChanges?.filter((c) => c.type === 'deleted').map((c: any) => c.objectId) || [],
            events: tx.events || [],
          },
          error: tx.effects?.status.status === 'failure' 
            ? JSON.stringify(tx.effects.status.error) 
            : undefined,
        };
      });
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }

  /**
   * Get coin balance for address
   */
  async getBalance(address: string, coinType: string = '0x2::sui::SUI', network: string = 'testnet'): Promise<bigint> {
    try {
      const client = this.getClient(network);
      const balance = await client.getBalance({ owner: address, coinType });
      return BigInt(balance.totalBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      return BigInt(0);
    }
  }

  /**
   * Get all coin balances for address
   */
  async getAllBalances(address: string, network: string = 'testnet'): Promise<Array<{ coinType: string; balance: bigint }>> {
    try {
      const client = this.getClient(network);
      const balances = await client.getAllBalances({ owner: address });
      return balances.map((b) => ({
        coinType: b.coinType,
        balance: BigInt(b.totalBalance),
      }));
    } catch (error) {
      console.error('Error fetching all balances:', error);
      return [];
    }
  }

  clearCache(): void {
    this.contractCache.clear();
  }
}

export const contractInteraction = new ContractInteractionService();
