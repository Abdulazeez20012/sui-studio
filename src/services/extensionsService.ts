import { apiService } from './api';

export interface Extension {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  tags: string[];
  downloads: number;
  rating: number;
  reviewCount: number;
  icon?: string;
  screenshots?: string[];
  repository?: string;
  homepage?: string;
  license: string;
  size: number;
  lastUpdated: Date;
  verified: boolean;
  featured: boolean;
  dependencies?: string[];
  permissions?: string[];
  changelog?: string;
}

export interface ExtensionInstallation {
  id: string;
  userId: string;
  extensionId: string;
  version: string;
  enabled: boolean;
  installedAt: Date;
  settings?: Record<string, any>;
  extension?: Extension;
}

export interface ExtensionSearchResult {
  extensions: Extension[];
  total: number;
  categories: string[];
}

class ExtensionsService {
  async getExtensions(): Promise<{ success: boolean; data?: Extension[]; total?: number; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: Extension[]; total: number }>('/extensions');
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async searchExtensions(
    query?: string,
    category?: string,
    tags?: string[],
    verified?: boolean,
    featured?: boolean
  ): Promise<{ success: boolean; data?: Extension[]; total?: number; categories?: string[]; error?: string }> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (category) params.append('category', category);
      if (tags) tags.forEach(tag => params.append('tags', tag));
      if (verified !== undefined) params.append('verified', verified.toString());
      if (featured !== undefined) params.append('featured', featured.toString());
      
      const response = await apiService.get<{ success: boolean; data: Extension[]; total: number; categories: string[] }>(`/extensions/search?${params}`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getFeaturedExtensions(): Promise<{ success: boolean; data?: Extension[]; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: Extension[] }>('/extensions/featured');
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getPopularExtensions(limit: number = 10): Promise<{ success: boolean; data?: Extension[]; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: Extension[] }>(`/extensions/popular?limit=${limit}`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getCategories(): Promise<{ success: boolean; data?: string[]; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: string[] }>('/extensions/categories');
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getExtension(extensionId: string): Promise<{ success: boolean; data?: Extension; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: Extension }>(`/extensions/${extensionId}`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getUserExtensions(userId: string): Promise<{ success: boolean; data?: ExtensionInstallation[]; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: ExtensionInstallation[] }>(`/extensions/user/${userId}/installed`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async installExtension(userId: string, extensionId: string, version?: string): Promise<{ success: boolean; data?: ExtensionInstallation; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: ExtensionInstallation }>(`/extensions/user/${userId}/install`, {
        extensionId,
        version
      });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async uninstallExtension(userId: string, extensionId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await apiService.delete<{ success: boolean; message: string }>(`/extensions/user/${userId}/uninstall/${extensionId}`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async toggleExtension(userId: string, extensionId: string, enabled: boolean): Promise<{ success: boolean; data?: ExtensionInstallation; error?: string }> {
    try {
      const response = await apiService.patch<{ success: boolean; data: ExtensionInstallation }>(`/extensions/user/${userId}/toggle/${extensionId}`, {
        enabled
      });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateExtensionSettings(userId: string, extensionId: string, settings: Record<string, any>): Promise<{ success: boolean; data?: ExtensionInstallation; error?: string }> {
    try {
      const response = await apiService.put<{ success: boolean; data: ExtensionInstallation }>(`/extensions/user/${userId}/settings/${extensionId}`, {
        settings
      });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async submitReview(extensionId: string, rating: number, comment?: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(`/extensions/${extensionId}/review`, {
        rating,
        comment
      });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getExtensionStats(extensionId: string): Promise<{ success: boolean; data?: { downloads: number; rating: number; reviewCount: number; activeInstallations: number }; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: { downloads: number; rating: number; reviewCount: number; activeInstallations: number } }>(`/extensions/${extensionId}/stats`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const extensionsService = new ExtensionsService();