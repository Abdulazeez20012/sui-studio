import { config } from '../config';

const API_URL = config.api.baseUrl;

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

export interface ProfilingOptions {
  sampleRate?: number;
  includeMemory?: boolean;
  includeGas?: boolean;
  duration?: number;
}

class ProfilerService {
  private async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Create profiling session
   */
  async createSession(code: string): Promise<ProfileSession> {
    try {
      const response = await this.request('/api/profiler/session', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating profiling session:', error);
      throw error;
    }
  }

  /**
   * Get session
   */
  async getSession(sessionId: string): Promise<ProfileSession> {
    try {
      const response = await this.request(`/api/profiler/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session:', error);
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
