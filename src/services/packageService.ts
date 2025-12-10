import { apiService } from './api';

export interface SuiPackage {
  name: string;
  version: string;
  description: string;
  author: string;
  repository?: string;
  dependencies: Record<string, string>;
  installed: boolean;
  verified: boolean;
  category?: string;
  downloads?: number;
  lastUpdated?: string;
}

export interface PackageSearchResult {
  packages: SuiPackage[];
  total: number;
  categories: string[];
}

export interface InstallResult {
  success: boolean;
  package: string;
  version: string;
  dependencies?: string[];
  error?: string;
}

class PackageService {
  async getPackages(): Promise<{ success: boolean; data?: SuiPackage[]; total?: number; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: SuiPackage[]; total: number }>('/packages');
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async searchPackages(query?: string, category?: string): Promise<{ success: boolean; data?: SuiPackage[]; total?: number; error?: string }> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (category) params.append('category', category);
      
      const response = await apiService.get<{ success: boolean; data: SuiPackage[]; total: number }>(`/packages/search?${params}`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getCategories(): Promise<{ success: boolean; data?: string[]; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: string[] }>('/packages/categories');
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getPackageDetails(packageName: string): Promise<{ success: boolean; data?: SuiPackage; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: SuiPackage }>(`/packages/${packageName}`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async installPackage(packageName: string, projectPath?: string): Promise<InstallResult> {
    try {
      const response = await apiService.post<InstallResult>('/packages/install', {
        packageName,
        projectPath
      });
      return response;
    } catch (error: any) {
      return { success: false, package: packageName, version: '', error: error.message };
    }
  }

  async uninstallPackage(packageName: string, projectPath?: string): Promise<InstallResult> {
    try {
      const response = await apiService.post<InstallResult>('/packages/uninstall', {
        packageName,
        projectPath
      });
      return response;
    } catch (error: any) {
      return { success: false, package: packageName, version: '', error: error.message };
    }
  }

  async generateMoveToml(projectName: string, packages: string[]): Promise<{ success: boolean; data?: { toml: string; packages: SuiPackage[] }; error?: string }> {
    try {
      const response = await apiService.post<{ success: boolean; data: { toml: string; packages: SuiPackage[] } }>('/packages/generate-toml', {
        projectName,
        packages
      });
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async verifyPackage(packageName: string): Promise<{ success: boolean; data?: { package: string; verified: boolean }; error?: string }> {
    try {
      const response = await apiService.get<{ success: boolean; data: { package: string; verified: boolean } }>(`/packages/${packageName}/verify`);
      return response;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const packageService = new PackageService();