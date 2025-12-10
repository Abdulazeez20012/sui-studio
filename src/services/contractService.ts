import { apiService } from './api';

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
  fields: Array<{
    name: string;
    type: string;
  }>;
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

class ContractService {
  async getContractInfo(packageId: string): Promise<{ success: boolean; data?: ContractInfo; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: ContractInfo }>(`/contract/${packageId}`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async callContract(params: CallContractParams): Promise<{ success: boolean; data?: TransactionResult; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: TransactionResult }>('/contract/call', params);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async dryRunTransaction(params: CallContractParams): Promise<{ success: boolean; data?: { gasUsed: number; effects: any; error?: string }; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: { gasUsed: number; effects: any; error?: string } }>('/contract/dry-run', params);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async estimateGas(params: Omit<CallContractParams, 'gasBudget' | 'sender'>): Promise<{ success: boolean; data?: { gasEstimate: number; gasBudget: number }; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: { gasEstimate: number; gasBudget: number } }>('/contract/estimate-gas', params);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getObject(objectId: string): Promise<{ success: boolean; data?: ContractObject; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: ContractObject }>(`/contract/object/${objectId}`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getOwnedObjects(address: string, objectType?: string): Promise<{ success: boolean; data?: ContractObject[]; total?: number; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: ContractObject[]; total: number }>('/contract/owned-objects', {
        address,
        objectType
      });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getTransactionHistory(address: string, limit: number = 20): Promise<{ success: boolean; data?: TransactionResult[]; total?: number; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: TransactionResult[]; total: number }>(`/contract/transactions/${address}?limit=${limit}`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const contractService = new ContractService();