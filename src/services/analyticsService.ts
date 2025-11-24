import { apiService } from './apiService';

interface UserAnalytics {
  projects: number;
  deployments: {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
  };
  gas: {
    totalUsed: number;
    averagePerDeployment: number;
  };
  compilations: {
    last30Days: number;
  };
  activity: Record<string, number>;
}

interface ProjectAnalytics {
  project: {
    id: string;
    name: string;
    createdAt: Date;
  };
  deployments: {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
  };
  gas: {
    total: number;
    average: number;
  };
  networks: Record<string, number>;
  recentDeployments: any[];
}

class AnalyticsService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getUserAnalytics(forceRefresh = false): Promise<UserAnalytics | null> {
    const cacheKey = 'user-analytics';
    
    if (!forceRefresh) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const data = await apiService.getUserAnalytics();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch user analytics:', error);
      return null;
    }
  }

  async getProjectAnalytics(projectId: string, forceRefresh = false): Promise<ProjectAnalytics | null> {
    const cacheKey = `project-analytics-${projectId}`;
    
    if (!forceRefresh) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const data = await apiService.getProjectAnalytics(projectId);
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch project analytics:', error);
      return null;
    }
  }

  async trackEvent(event: string, metadata?: any): Promise<void> {
    try {
      await apiService.trackEvent(event, {
        ...metadata,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  // Track specific IDE events
  trackFileOpen(fileName: string, language: string) {
    this.trackEvent('file_open', { fileName, language });
  }

  trackCodeCompile(success: boolean, duration: number) {
    this.trackEvent('code_compile', { success, duration });
  }

  trackDeployment(network: string, success: boolean) {
    this.trackEvent('deployment', { network, success });
  }

  trackExtensionInstall(extensionId: string, extensionName: string) {
    this.trackEvent('extension_install', { extensionId, extensionName });
  }

  trackAIQuery(query: string, responseTime: number) {
    this.trackEvent('ai_query', { 
      queryLength: query.length,
      responseTime,
    });
  }

  // Cache helpers
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const analyticsService = new AnalyticsService();
