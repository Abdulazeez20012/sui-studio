import { config } from '../config';

const API_URL = config.api.baseUrl;

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
}

export interface InstallResult {
  success: boolean;
  package: string;
  version: string;
  dependencies?: string[];
  error?: string;
}

class PackageService {
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
   * Get all available packages
   */
  async getPackages(): Promise<SuiPackage[]> {
    try {
      const response = await this.request('/api/packages');
      return response.data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  }

  /**
   * Search packages
   */
  async searchPackages(query: string, category?: string): Promise<PackageSearchResult> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (category) params.append('category', category);

      const response = await this.request(`/api/packages/search?${params.toString()}`);
      return {
        packages: response.data,
        total: response.total
      };
    } catch (error) {
      console.error('Error searching packages:', error);
      throw error;
    }
  }

  /**
   * Get package details
   */
  async getPackageDetails(packageName: string): Promise<SuiPackage> {
    try {
      const response = await this.request(`/api/packages/${packageName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching package details:', error);
      throw error;
    }
  }

  /**
   * Install package
   */
  async installPackage(packageName: string, projectPath?: string): Promise<InstallResult> {
    try {
      const response = await this.request('/api/packages/install', {
        method: 'POST',
        body: JSON.stringify({ packageName, projectPath }),
      });
      return response.data;
    } catch (error: any) {
      console.error('Error installing package:', error);
      return {
        success: false,
        package: packageName,
        version: '',
        error: error.message
      };
    }
  }

  /**
   * Uninstall package
   */
  async uninstallPackage(packageName: string, projectPath?: string): Promise<InstallResult> {
    try {
      const response = await this.request('/api/packages/uninstall', {
        method: 'POST',
        body: JSON.stringify({ packageName, projectPath }),
      });
      return response.data;
    } catch (error: any) {
      console.error('Error uninstalling package:', error);
      return {
        success: false,
        package: packageName,
        version: '',
        error: error.message
      };
    }
  }

  /**
   * Generate Move.toml
   */
  async generateMoveToml(projectName: string, packages: string[]): Promise<string> {
    try {
      const response = await this.request('/api/packages/generate-toml', {
        method: 'POST',
        body: JSON.stringify({ projectName, packages }),
      });
      return response.data.toml;
    } catch (error) {
      console.error('Error generating Move.toml:', error);
      throw error;
    }
  }

  /**
   * Get package categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await this.request('/api/packages/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Verify package
   */
  async verifyPackage(packageName: string): Promise<boolean> {
    try {
      const response = await this.request(`/api/packages/${packageName}/verify`);
      return response.data.verified;
    } catch (error) {
      console.error('Error verifying package:', error);
      return false;
    }
  }
}

export const packageService = new PackageService();
