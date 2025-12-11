import { apiService } from './api';

export interface GasAnalysisResult {
  id: string;
  code: string;
  totalEstimatedGas: number;
  functionEstimates: GasEstimate[];
  optimizations: GasOptimization[];
  summary: {
    totalFunctions: number;
    averageGasPerFunction: number;
    mostExpensiveFunction: string;
    totalOptimizationPotential: number;
  };
  createdAt: Date;
}

export interface GasEstimate {
  function: string;
  module: string;
  estimatedGas: number;
  confidence: 'low' | 'medium' | 'high';
  breakdown: GasBreakdown;
}

export interface GasBreakdown {
  computation: number;
  storage: number;
  objectCreation: number;
  eventEmission: number;
  packagePublishing?: number;
}

export interface GasOptimization {
  function: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
  potentialSavings: number;
  lineNumber?: number;
}

export interface GasComparison {
  before: GasAnalysisResult;
  after: GasAnalysisResult;
  improvements: {
    totalGasSaved: number;
    percentageImprovement: number;
    functionsImproved: string[];
  };
}

export interface TransactionGasEstimate {
  transactionType: string;
  totalGas: number;
  breakdown: GasBreakdown;
}

class GasService {
  async analyzeGas(code: string): Promise<{ success: boolean; data?: GasAnalysisResult; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: GasAnalysisResult }>('/gas/analyze', {
        code
      });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getAnalysis(analysisId: string): Promise<{ success: boolean; data?: GasAnalysisResult; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: GasAnalysisResult }>(`/gas/analysis/${analysisId}`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async compareAnalyses(beforeId: string, afterId: string): Promise<{ success: boolean; data?: GasComparison; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: GasComparison }>('/gas/compare', {
        beforeId,
        afterId
      });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getTransactionEstimate(transactionType: 'simple_transfer' | 'nft_mint' | 'defi_swap' | 'package_publish'): Promise<{ success: boolean; data?: TransactionGasEstimate; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: TransactionGasEstimate }>('/gas/transaction-estimate', {
        transactionType
      });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async generateReport(analysisId: string): Promise<{ success: boolean; data?: { report: string; format: string }; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: { report: string; format: string } }>(`/gas/analysis/${analysisId}/report`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const gasService = new GasService();