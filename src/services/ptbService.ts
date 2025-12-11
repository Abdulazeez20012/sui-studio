import { apiService } from './apiService';

export interface PTBCommand {
  id: string;
  type: 'moveCall' | 'transferObjects' | 'splitCoins' | 'mergeCoins' | 'makeMoveVec' | 'publish';
  params: any;
  result?: string;
}

export interface PTBSession {
  id: string;
  network: string;
  commands: PTBCommand[];
  gasConfig: {
    budget?: number;
    price?: number;
    payment?: string;
  };
  sender?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PTBSimulationResult {
  success: boolean;
  effects?: any;
  gasUsed?: number;
  error?: string;
  events?: any[];
}

class PTBService {
  /**
   * Create a new PTB session
   */
  async createSession(network: string = 'testnet'): Promise<PTBSession> {
    try {
      const response = await apiService.post('/ptb/session', { network });
      return response.data;
    } catch (error) {
      console.error('Error creating PTB session:', error);
      throw error;
    }
  }

  /**
   * Get PTB session
   */
  async getSession(sessionId: string): Promise<PTBSession> {
    try {
      const response = await apiService.get(`/ptb/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching PTB session:', error);
      throw error;
    }
  }

  /**
   * Get all PTB sessions
   */
  async getAllSessions(): Promise<PTBSession[]> {
    try {
      const response = await apiService.get('/ptb/sessions');
      return response.data;
    } catch (error) {
      console.error('Error fetching PTB sessions:', error);
      return [];
    }
  }

  /**
   * Add command to PTB
   */
  async addCommand(sessionId: string, type: PTBCommand['type'], params: any): Promise<PTBSession> {
    try {
      const response = await apiService.post('/ptb/command/add', {
        sessionId,
        type,
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding command:', error);
      throw error;
    }
  }

  /**
   * Remove command from PTB
   */
  async removeCommand(sessionId: string, commandId: string): Promise<PTBSession> {
    try {
      const response = await apiService.post('/ptb/command/remove', {
        sessionId,
        commandId,
      });
      return response.data;
    } catch (error) {
      console.error('Error removing command:', error);
      throw error;
    }
  }

  /**
   * Update command in PTB
   */
  async updateCommand(sessionId: string, commandId: string, updates: Partial<PTBCommand>): Promise<PTBSession> {
    try {
      const response = await apiService.post('/ptb/command/update', {
        sessionId,
        commandId,
        updates,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating command:', error);
      throw error;
    }
  }

  /**
   * Build transaction from PTB
   */
  async buildTransaction(sessionId: string): Promise<{ bytes: number[]; commands: any[] }> {
    try {
      const response = await apiService.post('/ptb/build', { sessionId });
      return response.data;
    } catch (error) {
      console.error('Error building transaction:', error);
      throw error;
    }
  }

  /**
   * Simulate PTB execution
   */
  async simulateTransaction(sessionId: string, sender: string): Promise<PTBSimulationResult> {
    try {
      const response = await apiService.post('/ptb/simulate', {
        sessionId,
        sender,
      });
      return response.data;
    } catch (error) {
      console.error('Error simulating transaction:', error);
      throw error;
    }
  }

  /**
   * Estimate gas for PTB
   */
  async estimateGas(sessionId: string, sender: string): Promise<number> {
    try {
      const response = await apiService.post('/ptb/estimate-gas', {
        sessionId,
        sender,
      });
      return response.data.gasEstimate;
    } catch (error) {
      console.error('Error estimating gas:', error);
      return 0;
    }
  }

  /**
   * Export PTB as JSON
   */
  async exportSession(sessionId: string): Promise<string> {
    try {
      const response = await apiService.get(`/ptb/export/${sessionId}`);
      return response.data.json;
    } catch (error) {
      console.error('Error exporting PTB:', error);
      throw error;
    }
  }

  /**
   * Import PTB from JSON
   */
  async importSession(json: string): Promise<PTBSession> {
    try {
      const response = await apiService.post('/ptb/import', { json });
      return response.data;
    } catch (error) {
      console.error('Error importing PTB:', error);
      throw error;
    }
  }

  /**
   * Delete PTB session
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/ptb/session/${sessionId}`);
      return response.success;
    } catch (error) {
      console.error('Error deleting PTB session:', error);
      return false;
    }
  }
}

export const ptbService = new PTBService();
