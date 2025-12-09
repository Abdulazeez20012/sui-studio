import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

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

class PackageManagerService {
  private packagesCache: SuiPackage[] | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get curated list of Sui packages
   */
  async getPackages(): Promise<SuiPackage[]> {
    // Return cached data if still valid
    if (this.packagesCache && Date.now() < this.cacheExpiry) {
      return this.packagesCache;
    }

    // Curated list of official Sui packages
    const packages: SuiPackage[] = [
      {
        name: 'Sui',
        version: '1.0.0',
        description: 'Core Sui framework with fundamental types and functions',
        author: 'Mysten Labs',
        repository: 'https://github.com/MystenLabs/sui',
        dependencies: {},
        installed: true,
        verified: true,
        category: 'Framework',
        downloads: 100000,
        lastUpdated: '2024-12-01'
      },
      {
        name: 'DeepBook',
        version: '2.1.0',
        description: 'Decentralized exchange protocol with CLOB (Central Limit Order Book)',
        author: 'Mysten Labs',
        repository: 'https://github.com/MystenLabs/sui',
        dependencies: { 'Sui': '1.0.0' },
        installed: false,
        verified: true,
        category: 'DeFi',
        downloads: 5000,
        lastUpdated: '2024-11-28'
      },
      {
        name: 'Kiosk',
        version: '1.2.0',
        description: 'NFT marketplace primitives and trading infrastructure',
        author: 'Mysten Labs',
        repository: 'https://github.com/MystenLabs/sui',
        dependencies: { 'Sui': '1.0.0' },
        installed: false,
        verified: true,
        category: 'NFT',
        downloads: 3500,
        lastUpdated: '2024-11-25'
      },
      {
        name: 'SuiNS',
        version: '1.0.0',
        description: 'Sui Name Service for human-readable addresses',
        author: 'Mysten Labs',
        repository: 'https://github.com/MystenLabs/suins-contracts',
        dependencies: { 'Sui': '1.0.0' },
        installed: false,
        verified: true,
        category: 'Identity',
        downloads: 2800,
        lastUpdated: '2024-11-20'
      },
      {
        name: 'Pyth',
        version: '1.1.0',
        description: 'Pyth Network oracle for real-time price feeds',
        author: 'Pyth Network',
        repository: 'https://github.com/pyth-network/pyth-crosschain',
        dependencies: { 'Sui': '1.0.0' },
        installed: false,
        verified: true,
        category: 'Oracle',
        downloads: 4200,
        lastUpdated: '2024-11-30'
      },
      {
        name: 'Cetus',
        version: '1.3.0',
        description: 'Concentrated liquidity protocol for efficient trading',
        author: 'Cetus Protocol',
        repository: 'https://github.com/CetusProtocol/cetus-clmm-sui',
        dependencies: { 'Sui': '1.0.0' },
        installed: false,
        verified: true,
        category: 'DeFi',
        downloads: 3100,
        lastUpdated: '2024-11-27'
      },
      {
        name: 'Walrus',
        version: '0.9.0',
        description: 'Decentralized storage protocol built on Sui',
        author: 'Mysten Labs',
        repository: 'https://github.com/MystenLabs/walrus-docs',
        dependencies: { 'Sui': '1.0.0' },
        installed: false,
        verified: true,
        category: 'Storage',
        downloads: 1500,
        lastUpdated: '2024-12-05'
      },
      {
        name: 'Aftermath',
        version: '1.0.0',
        description: 'Multi-asset liquidity protocol',
        author: 'Aftermath Finance',
        repository: 'https://github.com/AftermathFinance/aftermath-ts-sdk',
        dependencies: { 'Sui': '1.0.0' },
        installed: false,
        verified: true,
        category: 'DeFi',
        downloads: 1200,
        lastUpdated: '2024-11-22'
      }
    ];

    this.packagesCache = packages;
    this.cacheExpiry = Date.now() + this.CACHE_DURATION;

    return packages;
  }

  /**
   * Search packages by query
   */
  async searchPackages(query: string, category?: string): Promise<PackageSearchResult> {
    const allPackages = await this.getPackages();
    const lowerQuery = query.toLowerCase();

    let filtered = allPackages.filter(pkg =>
      pkg.name.toLowerCase().includes(lowerQuery) ||
      pkg.description.toLowerCase().includes(lowerQuery) ||
      pkg.author.toLowerCase().includes(lowerQuery)
    );

    if (category && category !== 'all') {
      filtered = filtered.filter(pkg => pkg.category === category);
    }

    return {
      packages: filtered,
      total: filtered.length
    };
  }

  /**
   * Get package details
   */
  async getPackageDetails(packageName: string): Promise<SuiPackage | null> {
    const packages = await this.getPackages();
    return packages.find(pkg => pkg.name === packageName) || null;
  }

  /**
   * Install package (add to Move.toml)
   */
  async installPackage(
    packageName: string,
    projectPath: string
  ): Promise<InstallResult> {
    try {
      const pkg = await this.getPackageDetails(packageName);
      if (!pkg) {
        return {
          success: false,
          package: packageName,
          version: '',
          error: 'Package not found'
        };
      }

      // Read existing Move.toml
      const moveTomlPath = path.join(projectPath, 'Move.toml');
      let moveToml: string;

      try {
        moveToml = await fs.readFile(moveTomlPath, 'utf-8');
      } catch {
        // Create new Move.toml if it doesn't exist
        moveToml = this.generateBasicMoveToml(path.basename(projectPath));
      }

      // Add dependency
      const updatedToml = this.addDependencyToToml(moveToml, pkg);
      await fs.writeFile(moveTomlPath, updatedToml);

      // Get list of all dependencies (including transitive)
      const allDeps = this.getAllDependencies(pkg);

      return {
        success: true,
        package: packageName,
        version: pkg.version,
        dependencies: allDeps
      };
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
   * Uninstall package (remove from Move.toml)
   */
  async uninstallPackage(
    packageName: string,
    projectPath: string
  ): Promise<InstallResult> {
    try {
      const moveTomlPath = path.join(projectPath, 'Move.toml');
      const moveToml = await fs.readFile(moveTomlPath, 'utf-8');

      const updatedToml = this.removeDependencyFromToml(moveToml, packageName);
      await fs.writeFile(moveTomlPath, updatedToml);

      return {
        success: true,
        package: packageName,
        version: ''
      };
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
   * Generate Move.toml with dependencies
   */
  generateMoveToml(
    projectName: string,
    packages: SuiPackage[]
  ): string {
    let toml = `[package]
name = "${projectName}"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
`;

    packages.forEach(pkg => {
      const depConfig = this.getDependencyConfig(pkg);
      toml += `${pkg.name} = ${depConfig}\n`;
    });

    toml += `
[addresses]
${projectName} = "0x0"
`;

    return toml;
  }

  /**
   * Get dependency configuration string
   */
  private getDependencyConfig(pkg: SuiPackage): string {
    if (pkg.name === 'Sui') {
      return '{ git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }';
    }

    // Map package names to their git locations
    const packagePaths: Record<string, string> = {
      'DeepBook': 'crates/sui-framework/packages/deepbook',
      'Kiosk': 'crates/sui-framework/packages/kiosk',
      'SuiNS': 'packages/suins',
      'Walrus': 'contracts/walrus'
    };

    const subdir = packagePaths[pkg.name];
    if (subdir) {
      return `{ git = "${pkg.repository}", subdir = "${subdir}", rev = "main" }`;
    }

    // Default configuration
    return `{ git = "${pkg.repository}", rev = "main" }`;
  }

  /**
   * Add dependency to existing Move.toml
   */
  private addDependencyToToml(toml: string, pkg: SuiPackage): string {
    const depConfig = this.getDependencyConfig(pkg);
    const depLine = `${pkg.name} = ${depConfig}`;

    // Find [dependencies] section
    const depsMatch = toml.match(/\[dependencies\]([\s\S]*?)(?=\n\[|$)/);
    if (depsMatch) {
      const depsSection = depsMatch[1];
      // Check if package already exists
      if (depsSection.includes(`${pkg.name} =`)) {
        // Replace existing
        return toml.replace(
          new RegExp(`${pkg.name} = .*`),
          depLine
        );
      } else {
        // Add new
        return toml.replace(
          /\[dependencies\]/,
          `[dependencies]\n${depLine}`
        );
      }
    }

    // No [dependencies] section, add it
    return toml + `\n[dependencies]\n${depLine}\n`;
  }

  /**
   * Remove dependency from Move.toml
   */
  private removeDependencyFromToml(toml: string, packageName: string): string {
    // Remove the dependency line
    return toml.replace(new RegExp(`${packageName} = .*\n`, 'g'), '');
  }

  /**
   * Generate basic Move.toml
   */
  private generateBasicMoveToml(projectName: string): string {
    return `[package]
name = "${projectName}"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
${projectName} = "0x0"
`;
  }

  /**
   * Get all dependencies including transitive ones
   */
  private getAllDependencies(pkg: SuiPackage): string[] {
    const deps: string[] = [];
    const visited = new Set<string>();

    const collectDeps = (p: SuiPackage) => {
      if (visited.has(p.name)) return;
      visited.add(p.name);

      Object.keys(p.dependencies).forEach(depName => {
        if (!visited.has(depName)) {
          deps.push(depName);
          // In a real implementation, we'd recursively fetch dependencies
        }
      });
    };

    collectDeps(pkg);
    return deps;
  }

  /**
   * Get package categories
   */
  async getCategories(): Promise<string[]> {
    const packages = await this.getPackages();
    const categories = new Set(packages.map(p => p.category).filter(Boolean));
    return Array.from(categories) as string[];
  }

  /**
   * Verify package integrity
   */
  async verifyPackage(packageName: string): Promise<boolean> {
    const pkg = await this.getPackageDetails(packageName);
    return pkg?.verified || false;
  }
}

export const packageManager = new PackageManagerService();
