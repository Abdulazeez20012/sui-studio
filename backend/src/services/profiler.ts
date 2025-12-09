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
  private sessions: Map<string, ProfileSession> = new Map();

  /**
   * Create a new profiling session
   */
  createSession(code: string): ProfileSession {
    const session: ProfileSession = {
      id: `profile-${Date.now()}`,
      code,
      status: 'idle',
      profileData: [],
      memorySnapshots: [],
      gasAnalysis: {
        totalGas: 0,
        averageGas: 0,
        maxGas: 0,
        minGas: 0,
        gasPerFunction: {},
        optimizationPotential: 0
      },
      hotspots: [],
      recommendations: [],
      createdAt: new Date()
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Get session
   */
  getSession(id: string): ProfileSession | null {
    return this.sessions.get(id) || null;
  }

  /**
   * Start profiling
   */
  async startProfiling(sessionId: string, options: ProfilingOptions = {}): Promise<ProfileSession> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    session.status = 'recording';
    session.startTime = new Date();

    // Analyze code to extract functions
    const functions = this.extractFunctions(session.code);

    // Simulate profiling data
    session.profileData = functions.map((func, index) => ({
      function: func.name,
      module: func.module,
      gasUsed: this.simulateGasUsage(func.name),
      executionTime: this.simulateExecutionTime(func.name),
      calls: Math.floor(Math.random() * 200) + 50,
      percentage: 0 // Will be calculated later
    }));

    // Calculate percentages
    const totalTime = session.profileData.reduce((sum, p) => sum + p.executionTime * p.calls, 0);
    session.profileData.forEach(p => {
      p.percentage = Math.round((p.executionTime * p.calls / totalTime) * 100);
    });

    // Sort by percentage
    session.profileData.sort((a, b) => b.percentage - a.percentage);

    // Generate memory snapshots if requested
    if (options.includeMemory !== false) {
      session.memorySnapshots = this.generateMemorySnapshots(20);
    }

    // Analyze gas usage
    session.gasAnalysis = this.analyzeGasUsage(session.profileData);

    // Detect hotspots
    session.hotspots = this.detectHotspots(session.profileData);

    // Generate recommendations
    session.recommendations = this.generateRecommendations(session.profileData, session.hotspots);

    session.status = 'complete';
    session.endTime = new Date();
    session.duration = session.endTime.getTime() - session.startTime.getTime();

    return session;
  }

  /**
   * Stop profiling
   */
  async stopProfiling(sessionId: string): Promise<ProfileSession> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    session.status = 'complete';
    session.endTime = new Date();
    if (session.startTime) {
      session.duration = session.endTime.getTime() - session.startTime.getTime();
    }

    return session;
  }

  /**
   * Get gas analysis
   */
  getGasAnalysis(sessionId: string): GasAnalysis {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    return session.gasAnalysis;
  }

  /**
   * Get hotspots
   */
  getHotspots(sessionId: string): Hotspot[] {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    return session.hotspots;
  }

  /**
   * Get recommendations
   */
  getRecommendations(sessionId: string): string[] {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    return session.recommendations;
  }

  /**
   * Export profile data
   */
  exportProfile(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const exportData = {
      id: session.id,
      timestamp: new Date().toISOString(),
      duration: session.duration,
      profileData: session.profileData,
      gasAnalysis: session.gasAnalysis,
      hotspots: session.hotspots,
      recommendations: session.recommendations,
      summary: {
        totalFunctions: session.profileData.length,
        totalGas: session.gasAnalysis.totalGas,
        totalCalls: session.profileData.reduce((sum, p) => sum + p.calls, 0),
        averageExecutionTime: session.profileData.reduce((sum, p) => sum + p.executionTime, 0) / session.profileData.length
      }
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Extract functions from code
   */
  private extractFunctions(code: string): Array<{ name: string; module: string }> {
    const functions: Array<{ name: string; module: string }> = [];
    
    // Extract module name
    const moduleMatch = code.match(/module\s+(\w+)::(\w+)/);
    const moduleName = moduleMatch ? `${moduleMatch[1]}::${moduleMatch[2]}` : 'unknown';

    // Extract function names
    const functionMatches = code.matchAll(/(?:public\s+)?(?:entry\s+)?fun\s+(\w+)/g);
    
    for (const match of functionMatches) {
      functions.push({
        name: match[1],
        module: moduleName
      });
    }

    // If no functions found, create sample data
    if (functions.length === 0) {
      functions.push(
        { name: 'transfer', module: 'example::token' },
        { name: 'mint', module: 'example::token' },
        { name: 'burn', module: 'example::token' }
      );
    }

    return functions;
  }

  /**
   * Simulate gas usage for a function
   */
  private simulateGasUsage(functionName: string): number {
    // Different function types have different gas costs
    const baseGas = 1000;
    const multipliers: Record<string, number> = {
      transfer: 1.2,
      mint: 2.1,
      burn: 1.8,
      create: 3.5,
      swap: 1.9,
      deposit: 1.5,
      withdraw: 1.6
    };

    const multiplier = multipliers[functionName.toLowerCase()] || 1.0;
    return Math.floor(baseGas * multiplier + Math.random() * 500);
  }

  /**
   * Simulate execution time
   */
  private simulateExecutionTime(functionName: string): number {
    // Execution time in milliseconds
    const baseTime = 10;
    const variance = Math.random() * 20;
    return Math.floor(baseTime + variance);
  }

  /**
   * Generate memory snapshots
   */
  private generateMemorySnapshots(count: number): MemorySnapshot[] {
    const snapshots: MemorySnapshot[] = [];
    const startTime = Date.now();

    for (let i = 0; i < count; i++) {
      snapshots.push({
        timestamp: startTime + i * 500,
        heapUsed: 30 + Math.random() * 40,
        objectCount: Math.floor(500 + Math.random() * 500),
        totalAllocated: Math.floor(1000000 + Math.random() * 500000)
      });
    }

    return snapshots;
  }

  /**
   * Analyze gas usage
   */
  private analyzeGasUsage(profileData: ProfileData[]): GasAnalysis {
    const gasValues = profileData.map(p => p.gasUsed);
    const totalGas = gasValues.reduce((sum, gas) => sum + gas, 0);
    const averageGas = totalGas / gasValues.length;
    const maxGas = Math.max(...gasValues);
    const minGas = Math.min(...gasValues);

    const gasPerFunction: Record<string, number> = {};
    profileData.forEach(p => {
      gasPerFunction[p.function] = p.gasUsed;
    });

    // Calculate optimization potential (functions using > 2000 gas)
    const highGasFunctions = profileData.filter(p => p.gasUsed > 2000);
    const optimizationPotential = highGasFunctions.reduce((sum, p) => sum + (p.gasUsed - 2000), 0);

    return {
      totalGas,
      averageGas: Math.round(averageGas),
      maxGas,
      minGas,
      gasPerFunction,
      optimizationPotential
    };
  }

  /**
   * Detect performance hotspots
   */
  private detectHotspots(profileData: ProfileData[]): Hotspot[] {
    const hotspots: Hotspot[] = [];

    profileData.forEach(p => {
      // High gas usage
      if (p.gasUsed > 2500) {
        hotspots.push({
          function: p.function,
          module: p.module,
          issue: 'High gas consumption',
          severity: p.gasUsed > 3000 ? 'high' : 'medium',
          suggestion: 'Consider optimizing loops, reducing storage operations, or splitting into smaller functions',
          gasImpact: p.gasUsed - 2000
        });
      }

      // High execution time
      if (p.executionTime > 50) {
        hotspots.push({
          function: p.function,
          module: p.module,
          issue: 'Long execution time',
          severity: p.executionTime > 80 ? 'high' : 'medium',
          suggestion: 'Profile function internals, optimize algorithms, or reduce computational complexity',
          gasImpact: Math.floor((p.executionTime - 50) * 10)
        });
      }

      // High call frequency with moderate gas
      if (p.calls > 150 && p.gasUsed > 1500) {
        hotspots.push({
          function: p.function,
          module: p.module,
          issue: 'Frequently called with moderate gas cost',
          severity: 'medium',
          suggestion: 'Cache results, batch operations, or optimize for frequent calls',
          gasImpact: Math.floor((p.gasUsed - 1000) * (p.calls / 100))
        });
      }
    });

    return hotspots.sort((a, b) => b.gasImpact - a.gasImpact);
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(profileData: ProfileData[], hotspots: Hotspot[]): string[] {
    const recommendations: string[] = [];

    // General recommendations
    if (hotspots.length > 0) {
      recommendations.push(`Found ${hotspots.length} performance hotspot(s) that could be optimized`);
    }

    // Gas-specific recommendations
    const highGasFunctions = profileData.filter(p => p.gasUsed > 2000);
    if (highGasFunctions.length > 0) {
      recommendations.push(`${highGasFunctions.length} function(s) use more than 2000 MIST - consider optimization`);
      recommendations.push('Reduce storage operations and use more efficient data structures');
    }

    // Execution time recommendations
    const slowFunctions = profileData.filter(p => p.executionTime > 50);
    if (slowFunctions.length > 0) {
      recommendations.push(`${slowFunctions.length} function(s) have long execution times`);
      recommendations.push('Consider algorithmic optimizations or splitting complex functions');
    }

    // Call frequency recommendations
    const frequentFunctions = profileData.filter(p => p.calls > 150);
    if (frequentFunctions.length > 0) {
      recommendations.push(`${frequentFunctions.length} function(s) are called very frequently`);
      recommendations.push('Consider caching, memoization, or batching operations');
    }

    // Overall optimization potential
    const totalOptimization = hotspots.reduce((sum, h) => sum + h.gasImpact, 0);
    if (totalOptimization > 1000) {
      recommendations.push(`Potential gas savings: ~${totalOptimization} MIST through optimization`);
    }

    if (recommendations.length === 0) {
      recommendations.push('Code is well-optimized! No major issues detected.');
    }

    return recommendations;
  }

  /**
   * Clean up old sessions
   */
  cleanupSessions(maxAge: number = 3600000): void {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now - session.createdAt.getTime() > maxAge) {
        this.sessions.delete(id);
      }
    }
  }
}

export const profilerService = new ProfilerService();

// Cleanup old sessions every hour
setInterval(() => {
  profilerService.cleanupSessions();
}, 3600000);
