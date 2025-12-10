import { error } from 'console';
import { error } from 'console';
import { error } from 'console';
import { error } from 'console';
import { apiService } from './api';

export interface ProfileSession {
  id: string;
  code: string;
  status: 'idle' | 'recording' | 'analyzing' | 'complete';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  profileData: ProfileData[];
  memorySnapshots: MemorySnapshot[];
  gasAnalysis: GasAnalysis;
  hotspots: Hotspot[];
  recommendations: string[];
  createdAt: Date;
}

export interface ProfileData {
  function: string;
  module: string;
  gasUsed: number;
  executionTime: number;
  calls: number;
  percentage: number;
}

export interface MemorySnapshot {
  timestamp: number;
  heapUsed: number;
  objectCount: number;
  totalAllocated: number;
}

export interface GasAnalysis {
  totalGas: number;
  averageGas: number;
  maxGas: number;
  minGas: number;
  gasPerFunction: Record<string, number>;
  optimizationPotential: number;
}

export interface Hotspot {
  function: string;
  module: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
  gasImpact: number;
}

export interface ProfilingOptions {
  sampleRate?: number;
  includeMemory?: boolean;
  includeGas?: boolean;
  duration?: number;
}

class ProfilerService {
  async createSession(code: string): Promise<{ success: boolean; data?: ProfileSession; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: ProfileSession }>('/profiler/session', {
        code
      });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getSession(sessionId: string): Promise<{ success: boolean; data?: ProfileSession; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: ProfileSession }>(`/profiler/session/${sessionId}`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async startProfiling(sessionId: string, options: ProfilingOptions = {}): Promise<{ success: boolean; data?: ProfileSession; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: ProfileSession }>(`/profiler/session/${sessionId}/start`, options);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async stopProfiling(sessionId: string): Promise<{ success: boolean; data?: ProfileSession; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: ProfileSession }>(`/profiler/session/${sessionId}/stop`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getGasAnalysis(sessionId: string): Promise<{ success: boolean; data?: GasAnalysis; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: GasAnalysis }>(`/profiler/session/${sessionId}/gas-analysis`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getHotspots(sessionId: string): Promise<{ success: boolean; data?: Hotspot[]; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: Hotspot[] }>(`/profiler/session/${sessionId}/hotspots`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getRecommendations(sessionId: string): Promise<{ success: boolean; data?: string[]; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: string[] }>(`/profiler/session/${sessionId}/recommendations`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async exportProfile(sessionId: string): Promise<{ success: boolean; data?: { json: string }; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: { json: string } }>(`/profiler/session/${sessionId}/export`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const profilerService = new ProfilerService(); error);
      throw error;
    }
  }

  /**
   * Start profiling
   */
  async startProfiling(sessionId: string, options?: ProfilingOptions): Promise<ProfileSession> {
    try {
      const response = await this.request(`/api/profiler/session/${sessionId}/start`, {
        method: 'POST',
        body: JSON.stringify(options || {}),
      });
      return response.data;
    } catch (error) {
      console.error('Error starting profiling:', error);
      throw error;
    }
  }

  /**
   * Stop profiling
   */
  async stopProfiling(sessionId: string): Promise<ProfileSession> {
    try {
      const response = await this.request(`/api/profiler/session/${sessionId}/stop`, {
        method: 'POST',
      });
      return response.data;
    } catch (error) {
      console.error('Error stopping profiling:', error);
      throw error;
    }
  }

  /**
   * Get gas analysis
   */
  async getGasAnalysis(sessionId: string): Promise<GasAnalysis> {
    try {
      const response = await this.request(`/api/profiler/session/${sessionId}/gas-analysis`);
      return response.data;
    } catch (error) {
      console.error('Error fetching gas analysis:', error);
      throw error;
    }
  }

  /**
   * Get hotspots
   */
  async getHotspots(sessionId: string): Promise<Hotspot[]> {
    try {
      const response = await this.request(`/api/profiler/session/${sessionId}/hotspots`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hotspots:', error);
      return [];
    }
  }

  /**
   * Get recommendations
   */
  async getRecommendations(sessionId: string): Promise<string[]> {
    try {
      const response = await this.request(`/api/profiler/session/${sessionId}/recommendations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }

  /**
   * Export profile
   */
  async exportProfile(sessionId: string): Promise<string> {
    try {
      const response = await this.request(`/api/profiler/session/${sessionId}/export`);
      return response.data.json;
    } catch (error) {
      console.error('Error exporting profile:', error);
      throw error;
    }
  }
}

export const profilerService = new ProfilerService();
