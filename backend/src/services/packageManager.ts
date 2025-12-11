/**
 * Real Move Package Manager Service
 * Manages Move dependencies using Sui CLI and Git
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export interface Package {
  name: string;
  version: string;
  source: PackageSource;
  description?: string;
  dependencies?: string[];
  installed: boolean;
  path?: string;
}

export interface PackageSource {
  type: 'git' | 'local' | 'registry';
  url?: string;
  rev?: string;
  subdir?: string;
  path?: string;
}

export interface PackageSearchResult {
  name: string;
  description: string;
  version: string;
  source: string;
  stars?: number;
  downloads?: number;
}

export interface InstallResult {
  success: boolean;
  package: string;
  version: string;
  message: string;
  dependencies?: string[];
}

// Known Sui ecosystem packages
const KNOWN_PACKAGES: Record<string, Package> = {
  'Sui': {
    name: 'Sui',
    version: 'framework/mainnet',
    source: {
      type: 'git',
      url: 'https://github.com/MystenLabs/sui.git',
      subdir: 'crates/sui-framework/packages/sui-framework',
      rev: 'framework/mainnet',
    },
    description: 'Sui Framework - Core Move library for Sui blockchain',
    installed: false,
  },
  'SuiSystem': {
    name: 'SuiSystem',
    version: 'framework/mainnet',
    source: {
      type: 'git',
      url: 'https://github.com/MystenLabs/sui.git',
      subdir: 'crates/sui-framework/packages/sui-system',
      rev: 'framework/mainnet',
    },
    description: 'Sui System - System-level contracts',
    installed: false,
  },
  'MoveStdlib': {
    name: 'MoveStdlib',
    version: 'framework/mainnet',
    source: {
      type: 'git',
      url: 'https://github.com/MystenLabs/sui.git',
      subdir: 'crates/sui-framework/packages/move-stdlib',
      rev: 'framework/mainnet',
    },
    description: 'Move Standard Library',
    installed: false,
  },
  'DeepBook': {
    name: 'DeepBook',
    version: 'main',
    source: {
      type: 'git',
      url: 'https://github.com/MystenLabs/deepbook.git',
      subdir: 'packages/deepbook',
      rev: 'main',
    },
    description: 'DeepBook - Decentralized order book for Sui',
    installed: false,
  },
  'Pyth': {
    name: 'Pyth',
    version: 'main',
    source: {
      type: 'git',
      url: 'https://github.com/pyth-network/pyth-crosschain.git',
      subdir: 'target_chains/sui/contracts',
      rev: 'main',
    },
    description: 'Pyth Network - Oracle price feeds',
    installed: false,
  },
  'Wormhole': {
    name: 'Wormhole',
    version: 'main',
    source: {
      type: 'git',
      url: 'https://github.com/wormhole-foundation/wormhole.git',
      subdir: 'sui/wormhole',
      rev: 'main',
    },
    description: 'Wormhole - Cross-chain messaging',
    installed: false,
  },
};

class PackageManagerService {
  private tempDir: string = '/tmp/sui-packages';
  private suiCliAvailable: boolean | null = null;
  private gitAvailable: boolean | null = null;

  constructor() {
    this.initTempDir();
  }

  private async initTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  /**
   * Check if Sui CLI is available
   */
  async checkSuiCLI(): Promise<boolean> {
    if (this.suiCliAvailable !== null) {
      return this.suiCliAvailable;
    }

    try {
      await execAsync('sui --version', { timeout: 5000 });
      this.suiCliAvailable = true;
      return true;
    } catch {
      this.suiCliAvailable = false;
      return false;
    }
  }

  /**
   * Check if Git is available
   */
  async checkGit(): Promise<boolean> {
    if (this.gitAvailable !== null) {
      return this.gitAvailable;
    }

    try {
      await execAsync('git --version', { timeout: 5000 });
      this.gitAvailable = true;
      return true;
    } catch {
      this.gitAvailable = false;
      return false;
    }
  }

  /**
   * Search for packages
   */
  async searchPackages(query: string): Promise<PackageSearchResult[]> {
    const results: PackageSearchResult[] = [];
    const queryLower = query.toLowerCase();

    // Search known packages
    for (const [name, pkg] of Object.entries(KNOWN_PACKAGES)) {
      if (
        name.toLowerCase().includes(queryLower) ||
        pkg.description?.toLowerCase().includes(queryLower)
      ) {
        results.push({
          name: pkg.name,
          description: pkg.description || '',
          version: pkg.version,
          source: pkg.source.url || 'local',
        });
      }
    }

    // Search GitHub for Move packages
    if (await this.checkGit()) {
      try {
        const githubResults = await this.searchGitHub(query);
        results.push(...githubResults);
      } catch (error) {
        console.error('GitHub search failed:', error);
      }
    }

    return results;
  }

  /**
   * Search GitHub for Move packages
   */
  private async searchGitHub(query: string): Promise<PackageSearchResult[]> {
    try {
      // Use GitHub API to search for Move packages
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query + ' language:move')}&sort=stars&per_page=10`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'Sui-Studio-IDE',
          },
        }
      );

      if (!response.ok) return [];

      const data = await response.json() as any;
      return ((data.items as any[]) || []).map((repo: any) => ({
        name: repo.name,
        description: repo.description || '',
        version: repo.default_branch || 'main',
        source: repo.html_url,
        stars: repo.stargazers_count,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get package info
   */
  async getPackageInfo(packageName: string): Promise<Package | null> {
    // Check known packages
    if (KNOWN_PACKAGES[packageName]) {
      return { ...KNOWN_PACKAGES[packageName] };
    }

    // Try to fetch from GitHub
    try {
      const response = await fetch(`https://api.github.com/repos/${packageName}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Sui-Studio-IDE',
        },
      });

      if (!response.ok) return null;

      const repo = await response.json() as any;
      return {
        name: repo.name as string,
        version: (repo.default_branch as string) || 'main',
        source: {
          type: 'git' as const,
          url: repo.clone_url as string,
          rev: (repo.default_branch as string) || 'main',
        },
        description: repo.description as string,
        installed: false,
      };
    } catch {
      return null;
    }
  }

  /**
   * Install a package to a project
   */
  async installPackage(
    packageName: string,
    projectPath: string,
    options: { version?: string; subdir?: string } = {}
  ): Promise<InstallResult> {
    const pkg = KNOWN_PACKAGES[packageName] || (await this.getPackageInfo(packageName));

    if (!pkg) {
      return {
        success: false,
        package: packageName,
        version: '',
        message: `Package '${packageName}' not found`,
      };
    }

    try {
      // Read existing Move.toml
      const moveTomlPath = path.join(projectPath, 'Move.toml');
      let moveToml: string;

      try {
        moveToml = await fs.readFile(moveTomlPath, 'utf-8');
      } catch {
        return {
          success: false,
          package: packageName,
          version: pkg.version,
          message: 'Move.toml not found in project',
        };
      }

      // Check if package already installed
      if (moveToml.includes(`${packageName} =`)) {
        return {
          success: true,
          package: packageName,
          version: pkg.version,
          message: `Package '${packageName}' is already installed`,
        };
      }

      // Generate dependency line
      const depLine = this.generateDependencyLine(pkg, options);

      // Add to Move.toml
      if (moveToml.includes('[dependencies]')) {
        moveToml = moveToml.replace('[dependencies]', `[dependencies]\n${depLine}`);
      } else {
        moveToml += `\n[dependencies]\n${depLine}\n`;
      }

      await fs.writeFile(moveTomlPath, moveToml);

      // Verify installation by building
      if (await this.checkSuiCLI()) {
        try {
          await execAsync(`sui move build --path ${projectPath}`, { timeout: 120000 });
        } catch (error: any) {
          // Revert changes if build fails
          const originalToml = moveToml.replace(`\n${depLine}`, '').replace(depLine + '\n', '');
          await fs.writeFile(moveTomlPath, originalToml);

          return {
            success: false,
            package: packageName,
            version: pkg.version,
            message: `Installation failed: ${error.message}`,
          };
        }
      }

      return {
        success: true,
        package: packageName,
        version: options.version || pkg.version,
        message: `Successfully installed ${packageName}@${options.version || pkg.version}`,
        dependencies: pkg.dependencies,
      };
    } catch (error: any) {
      return {
        success: false,
        package: packageName,
        version: pkg.version,
        message: `Installation failed: ${error.message}`,
      };
    }
  }

  /**
   * Generate dependency line for Move.toml
   */
  private generateDependencyLine(pkg: Package, options: { version?: string; subdir?: string }): string {
    const source = pkg.source;
    const version = options.version || source.rev || pkg.version;
    const subdir = options.subdir || source.subdir;

    if (source.type === 'git') {
      let line = `${pkg.name} = { git = "${source.url}", rev = "${version}"`;
      if (subdir) {
        line += `, subdir = "${subdir}"`;
      }
      line += ' }';
      return line;
    } else if (source.type === 'local') {
      return `${pkg.name} = { local = "${source.path}" }`;
    }

    return `${pkg.name} = "${version}"`;
  }

  /**
   * Uninstall a package from a project
   */
  async uninstallPackage(packageName: string, projectPath: string): Promise<InstallResult> {
    try {
      const moveTomlPath = path.join(projectPath, 'Move.toml');
      let moveToml = await fs.readFile(moveTomlPath, 'utf-8');

      // Find and remove the package line
      const lines = moveToml.split('\n');
      const filteredLines = lines.filter((line) => !line.trim().startsWith(`${packageName} =`));

      if (lines.length === filteredLines.length) {
        return {
          success: false,
          package: packageName,
          version: '',
          message: `Package '${packageName}' is not installed`,
        };
      }

      await fs.writeFile(moveTomlPath, filteredLines.join('\n'));

      return {
        success: true,
        package: packageName,
        version: '',
        message: `Successfully uninstalled ${packageName}`,
      };
    } catch (error: any) {
      return {
        success: false,
        package: packageName,
        version: '',
        message: `Uninstall failed: ${error.message}`,
      };
    }
  }

  /**
   * List installed packages in a project
   */
  async listInstalledPackages(projectPath: string): Promise<Package[]> {
    try {
      const moveTomlPath = path.join(projectPath, 'Move.toml');
      const moveToml = await fs.readFile(moveTomlPath, 'utf-8');

      const packages: Package[] = [];
      const depSection = moveToml.match(/\[dependencies\]([\s\S]*?)(?=\[|$)/);

      if (!depSection) return packages;

      const lines = depSection[1].split('\n');
      for (const line of lines) {
        const match = line.match(/^(\w+)\s*=\s*(.+)/);
        if (match) {
          const name = match[1];
          const value = match[2].trim();

          let pkg: Package = {
            name,
            version: 'unknown',
            source: { type: 'local' },
            installed: true,
          };

          // Parse git dependency
          const gitMatch = value.match(/git\s*=\s*"([^"]+)"/);
          const revMatch = value.match(/rev\s*=\s*"([^"]+)"/);
          const subdirMatch = value.match(/subdir\s*=\s*"([^"]+)"/);

          if (gitMatch) {
            pkg.source = {
              type: 'git',
              url: gitMatch[1],
              rev: revMatch?.[1],
              subdir: subdirMatch?.[1],
            };
            pkg.version = revMatch?.[1] || 'main';
          }

          // Parse local dependency
          const localMatch = value.match(/local\s*=\s*"([^"]+)"/);
          if (localMatch) {
            pkg.source = { type: 'local', path: localMatch[1] };
          }

          // Add description from known packages
          if (KNOWN_PACKAGES[name]) {
            pkg.description = KNOWN_PACKAGES[name].description;
          }

          packages.push(pkg);
        }
      }

      return packages;
    } catch {
      return [];
    }
  }

  /**
   * Update a package to latest version
   */
  async updatePackage(packageName: string, projectPath: string): Promise<InstallResult> {
    // Get latest version info
    const pkg = await this.getPackageInfo(packageName);
    if (!pkg) {
      return {
        success: false,
        package: packageName,
        version: '',
        message: `Package '${packageName}' not found`,
      };
    }

    // Uninstall and reinstall with latest version
    await this.uninstallPackage(packageName, projectPath);
    return this.installPackage(packageName, projectPath);
  }

  /**
   * Get available versions for a package
   */
  async getPackageVersions(packageName: string): Promise<string[]> {
    const pkg = KNOWN_PACKAGES[packageName];
    if (pkg?.source.type === 'git' && pkg.source.url) {
      try {
        // Get tags from GitHub
        const repoPath = pkg.source.url.replace('https://github.com/', '').replace('.git', '');
        const response = await fetch(`https://api.github.com/repos/${repoPath}/tags?per_page=20`, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'Sui-Studio-IDE',
          },
        });

        if (!response.ok) return [pkg.version];

        const tags = await response.json() as any[];
        return tags.map((tag: any) => tag.name as string);
      } catch {
        return [pkg.version];
      }
    }

    return [pkg?.version || 'main'];
  }

  /**
   * Verify all dependencies are valid
   */
  async verifyDependencies(projectPath: string): Promise<{ valid: boolean; errors: string[] }> {
    if (!(await this.checkSuiCLI())) {
      return { valid: true, errors: ['Sui CLI not available for verification'] };
    }

    try {
      await execAsync(`sui move build --path ${projectPath}`, { timeout: 120000 });
      return { valid: true, errors: [] };
    } catch (error: any) {
      const errors = this.parseErrors(error.stderr || error.message);
      return { valid: false, errors };
    }
  }

  private parseErrors(output: string): string[] {
    const errors: string[] = [];
    const lines = output.split('\n');

    for (const line of lines) {
      if (line.includes('error') || line.includes('Error')) {
        errors.push(line.trim());
      }
    }

    return errors.length > 0 ? errors : [output.trim()];
  }
}

export const packageManager = new PackageManagerService();
