import { apiService } from './apiService';

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
  /**
   * Get all available packages
   */
  async getPackages(): Promise<SuiPackage[]> {
    try {
      const response = await apiService.get('/packages');
      return response.data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      return [];
    }
  }

  /**
   * Search packages
   */
  async searchPackages(query?: string, category?: string): Promise<PackageSearchResult> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (category) params.append('category', category);
      
      const response = await apiService.get(`/packages/search?${params}`);
      return {
        packages: response.data,
        total: response.total,
        categories: []
      };
    } catch (error) {
      console.error('Error searching packages:', error);
      return { packages: [], total: 0, categories: [] };
    }
  }

  /**
   * Get all package categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await apiService.get('/packages/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Get package details
   */
  async getPackageDetails(packageName: string): Promise<SuiPackage | null> {
    try {
      const response = await apiService.get(`/packages/${packageName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching package details:', error);
      return null;
    }
  }

  /**
   * Install a package
   */
  async installPackage(packageName: string, projectPath?: string): Promise<InstallResult> {
    try {
      const response = await apiService.post('/packages/install', {
        packageName,
        projectPath
      });
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        package: packageName, 
        version: '', 
        error: error.message 
      };
    }
  }

  /**
   * Uninstall a package
   */
  async uninstallPackage(packageName: string, projectPath?: string): Promise<InstallResult> {
    try {
      const response = await apiService.post('/packages/uninstall', {
        packageName,
        projectPath
      });
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        package: packageName, 
        version: '', 
        error: error.message 
      };
    }
  }

  /**
   * Generate Move.toml with selected packages
   */
  async generateMoveToml(projectName: string, packages: string[]): Promise<{ toml: string; packages: SuiPackage[] }> {
    try {
      const response = await apiService.post('/packages/generate-toml', {
        projectName,
        packages
      });
      return response.data;
    } catch (error) {
      console.error('Error generating Move.toml:', error);
      throw error;
    }
  }

  /**
   * Verify package integrity
   */
  async verifyPackage(packageName: string): Promise<boolean> {
    try {
      const response = await apiService.get(`/packages/${packageName}/verify`);
      return response.data.verified;
    } catch (error) {
      console.error('Error verifying package:', error);
      return false;
    }
  }
}

export const packageService = new PackageService();