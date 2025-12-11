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
  size: number; // in KB
  lastUpdated: Date;
  verified: boolean;
  featured: boolean;
  dependencies?: string[];
  permissions?: string[];
  changelog?: string;
}

export interface ExtensionSearchResult {
  extensions: Extension[];
  total: number;
  categories: string[];
}

export interface ExtensionInstallation {
  id: string;
  userId: string;
  extensionId: string;
  version: string;
  enabled: boolean;
  installedAt: Date;
  settings?: Record<string, any>;
}

class ExtensionsMarketplaceService {
  private extensions: Extension[] = [];
  private installations: Map<string, ExtensionInstallation[]> = new Map();

  constructor() {
    this.initializeExtensions();
  }

  /**
   * Initialize with curated extensions
   */
  private initializeExtensions(): void {
    this.extensions = [
      {
        id: 'move-analyzer',
        name: 'Move Analyzer',
        description: 'Advanced static analysis for Move code with real-time error detection and suggestions',
        version: '2.1.0',
        author: 'Sui Studio Team',
        category: 'Language Support',
        tags: ['analysis', 'linting', 'move', 'static-analysis'],
        downloads: 15420,
        rating: 4.8,
        reviewCount: 234,
        icon: 'https://example.com/icons/move-analyzer.png',
        repository: 'https://github.com/sui-studio/move-analyzer',
        license: 'MIT',
        size: 2400,
        lastUpdated: new Date('2024-12-01'),
        verified: true,
        featured: true,
        permissions: ['read-files', 'show-notifications']
      },
      {
        id: 'sui-formatter',
        name: 'Sui Code Formatter',
        description: 'Automatic code formatting for Move and Sui projects with customizable style rules',
        version: '1.5.2',
        author: 'Mysten Labs',
        category: 'Formatters',
        tags: ['formatting', 'style', 'move', 'prettier'],
        downloads: 12890,
        rating: 4.6,
        reviewCount: 187,
        repository: 'https://github.com/MystenLabs/sui-formatter',
        license: 'Apache-2.0',
        size: 1800,
        lastUpdated: new Date('2024-11-28'),
        verified: true,
        featured: true,
        permissions: ['modify-files']
      },
      {
        id: 'gas-optimizer',
        name: 'Gas Optimizer Pro',
        description: 'AI-powered gas optimization suggestions with detailed analysis and refactoring tools',
        version: '1.3.0',
        author: 'OptimizeDAO',
        category: 'Optimization',
        tags: ['gas', 'optimization', 'ai', 'analysis'],
        downloads: 8750,
        rating: 4.7,
        reviewCount: 156,
        license: 'GPL-3.0',
        size: 3200,
        lastUpdated: new Date('2024-11-25'),
        verified: true,
        featured: false,
        permissions: ['read-files', 'show-notifications', 'network-access']
      },
      {
        id: 'sui-snippets',
        name: 'Sui Code Snippets',
        description: 'Comprehensive collection of Move code snippets for common patterns and use cases',
        version: '2.0.1',
        author: 'Community',
        category: 'Snippets',
        tags: ['snippets', 'templates', 'move', 'productivity'],
        downloads: 11200,
        rating: 4.5,
        reviewCount: 203,
        license: 'MIT',
        size: 950,
        lastUpdated: new Date('2024-11-30'),
        verified: true,
        featured: false,
        permissions: ['read-files']
      },
      {
        id: 'blockchain-explorer',
        name: 'Sui Blockchain Explorer',
        description: 'Integrated blockchain explorer for viewing transactions, objects, and network stats',
        version: '1.8.0',
        author: 'Sui Studio Team',
        category: 'Tools',
        tags: ['explorer', 'blockchain', 'transactions', 'network'],
        downloads: 9340,
        rating: 4.4,
        reviewCount: 142,
        license: 'MIT',
        size: 4100,
        lastUpdated: new Date('2024-12-05'),
        verified: true,
        featured: true,
        permissions: ['network-access', 'show-notifications']
      },
      {
        id: 'test-runner-pro',
        name: 'Advanced Test Runner',
        description: 'Enhanced testing capabilities with coverage reports, parallel execution, and CI/CD integration',
        version: '1.4.3',
        author: 'TestLabs',
        category: 'Testing',
        tags: ['testing', 'coverage', 'ci-cd', 'parallel'],
        downloads: 6780,
        rating: 4.6,
        reviewCount: 98,
        license: 'MIT',
        size: 2800,
        lastUpdated: new Date('2024-11-22'),
        verified: true,
        featured: false,
        permissions: ['execute-commands', 'read-files', 'write-files']
      },
      {
        id: 'nft-toolkit',
        name: 'NFT Development Toolkit',
        description: 'Complete toolkit for NFT development including templates, metadata tools, and marketplace integration',
        version: '1.2.0',
        author: 'NFT Builders',
        category: 'NFT',
        tags: ['nft', 'templates', 'metadata', 'marketplace'],
        downloads: 5420,
        rating: 4.3,
        reviewCount: 87,
        license: 'MIT',
        size: 3600,
        lastUpdated: new Date('2024-11-18'),
        verified: false,
        featured: false,
        permissions: ['read-files', 'write-files', 'network-access']
      },
      {
        id: 'defi-templates',
        name: 'DeFi Protocol Templates',
        description: 'Ready-to-use templates for common DeFi protocols including AMM, lending, and staking',
        version: '1.1.5',
        author: 'DeFi Collective',
        category: 'Templates',
        tags: ['defi', 'templates', 'amm', 'lending', 'staking'],
        downloads: 4890,
        rating: 4.5,
        reviewCount: 76,
        license: 'MIT',
        size: 5200,
        lastUpdated: new Date('2024-11-15'),
        verified: true,
        featured: false,
        permissions: ['read-files', 'write-files']
      },
      {
        id: 'security-scanner',
        name: 'Move Security Scanner',
        description: 'Comprehensive security analysis for Move smart contracts with vulnerability detection',
        version: '1.0.8',
        author: 'SecureMove',
        category: 'Security',
        tags: ['security', 'vulnerability', 'analysis', 'audit'],
        downloads: 3210,
        rating: 4.7,
        reviewCount: 54,
        license: 'Commercial',
        size: 2900,
        lastUpdated: new Date('2024-12-03'),
        verified: true,
        featured: true,
        permissions: ['read-files', 'network-access', 'show-notifications']
      },
      {
        id: 'theme-pack',
        name: 'Professional Theme Pack',
        description: 'Collection of beautiful themes for the Sui Studio IDE with syntax highlighting',
        version: '2.3.0',
        author: 'Design Studio',
        category: 'Themes',
        tags: ['themes', 'ui', 'design', 'syntax-highlighting'],
        downloads: 7650,
        rating: 4.2,
        reviewCount: 134,
        license: 'MIT',
        size: 1200,
        lastUpdated: new Date('2024-11-20'),
        verified: true,
        featured: false,
        permissions: ['modify-ui']
      }
    ];
  }

  /**
   * Get all extensions
   */
  async getExtensions(): Promise<Extension[]> {
    return this.extensions;
  }

  /**
   * Search extensions
   */
  async searchExtensions(
    query?: string,
    category?: string,
    tags?: string[],
    verified?: boolean,
    featured?: boolean
  ): Promise<ExtensionSearchResult> {
    let filtered = [...this.extensions];

    // Filter by query
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(ext =>
        ext.name.toLowerCase().includes(lowerQuery) ||
        ext.description.toLowerCase().includes(lowerQuery) ||
        ext.author.toLowerCase().includes(lowerQuery) ||
        ext.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(ext => ext.category === category);
    }

    // Filter by tags
    if (tags && tags.length > 0) {
      filtered = filtered.filter(ext =>
        tags.some(tag => ext.tags.includes(tag))
      );
    }

    // Filter by verified status
    if (verified !== undefined) {
      filtered = filtered.filter(ext => ext.verified === verified);
    }

    // Filter by featured status
    if (featured !== undefined) {
      filtered = filtered.filter(ext => ext.featured === featured);
    }

    // Get unique categories
    const categories = [...new Set(this.extensions.map(ext => ext.category))];

    return {
      extensions: filtered,
      total: filtered.length,
      categories
    };
  }

  /**
   * Get extension by ID
   */
  async getExtension(id: string): Promise<Extension | null> {
    return this.extensions.find(ext => ext.id === id) || null;
  }

  /**
   * Get featured extensions
   */
  async getFeaturedExtensions(): Promise<Extension[]> {
    return this.extensions.filter(ext => ext.featured);
  }

  /**
   * Get popular extensions
   */
  async getPopularExtensions(limit: number = 10): Promise<Extension[]> {
    return this.extensions
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);
  }

  /**
   * Get extensions by category
   */
  async getExtensionsByCategory(category: string): Promise<Extension[]> {
    return this.extensions.filter(ext => ext.category === category);
  }

  /**
   * Get user's installed extensions
   */
  async getUserExtensions(userId: string): Promise<ExtensionInstallation[]> {
    return this.installations.get(userId) || [];
  }

  /**
   * Install extension for user
   */
  async installExtension(
    userId: string,
    extensionId: string,
    version?: string
  ): Promise<ExtensionInstallation> {
    const extension = this.extensions.find(ext => ext.id === extensionId);
    if (!extension) {
      throw new Error('Extension not found');
    }

    const userInstallations = this.installations.get(userId) || [];
    
    // Check if already installed
    const existing = userInstallations.find(inst => inst.extensionId === extensionId);
    if (existing) {
      // Update version if different
      if (version && existing.version !== version) {
        existing.version = version;
        existing.installedAt = new Date();
      }
      return existing;
    }

    // Create new installation
    const installation: ExtensionInstallation = {
      id: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      extensionId,
      version: version || extension.version,
      enabled: true,
      installedAt: new Date(),
      settings: {}
    };

    userInstallations.push(installation);
    this.installations.set(userId, userInstallations);

    // Increment download count
    extension.downloads++;

    return installation;
  }

  /**
   * Uninstall extension for user
   */
  async uninstallExtension(userId: string, extensionId: string): Promise<boolean> {
    const userInstallations = this.installations.get(userId) || [];
    const index = userInstallations.findIndex(inst => inst.extensionId === extensionId);
    
    if (index === -1) {
      return false;
    }

    userInstallations.splice(index, 1);
    this.installations.set(userId, userInstallations);
    return true;
  }

  /**
   * Toggle extension enabled state
   */
  async toggleExtension(
    userId: string,
    extensionId: string,
    enabled: boolean
  ): Promise<ExtensionInstallation | null> {
    const userInstallations = this.installations.get(userId) || [];
    const installation = userInstallations.find(inst => inst.extensionId === extensionId);
    
    if (!installation) {
      return null;
    }

    installation.enabled = enabled;
    return installation;
  }

  /**
   * Update extension settings
   */
  async updateExtensionSettings(
    userId: string,
    extensionId: string,
    settings: Record<string, any>
  ): Promise<ExtensionInstallation | null> {
    const userInstallations = this.installations.get(userId) || [];
    const installation = userInstallations.find(inst => inst.extensionId === extensionId);
    
    if (!installation) {
      return null;
    }

    installation.settings = { ...installation.settings, ...settings };
    return installation;
  }

  /**
   * Get extension categories
   */
  async getCategories(): Promise<string[]> {
    return [...new Set(this.extensions.map(ext => ext.category))];
  }

  /**
   * Get extension tags
   */
  async getTags(): Promise<string[]> {
    const allTags = this.extensions.flatMap(ext => ext.tags);
    return [...new Set(allTags)];
  }

  /**
   * Submit extension review
   */
  async submitReview(
    extensionId: string,
    userId: string,
    rating: number,
    comment?: string
  ): Promise<boolean> {
    const extension = this.extensions.find(ext => ext.id === extensionId);
    if (!extension) {
      return false;
    }

    // In a real implementation, this would store the review in a database
    // For now, just update the aggregate rating
    const newTotal = extension.rating * extension.reviewCount + rating;
    extension.reviewCount++;
    extension.rating = Math.round((newTotal / extension.reviewCount) * 10) / 10;

    return true;
  }

  /**
   * Get extension statistics
   */
  async getExtensionStats(extensionId: string): Promise<{
    downloads: number;
    rating: number;
    reviewCount: number;
    activeInstallations: number;
  } | null> {
    const extension = this.extensions.find(ext => ext.id === extensionId);
    if (!extension) {
      return null;
    }

    // Count active installations across all users
    let activeInstallations = 0;
    for (const userInstallations of this.installations.values()) {
      const installation = userInstallations.find(inst => 
        inst.extensionId === extensionId && inst.enabled
      );
      if (installation) {
        activeInstallations++;
      }
    }

    return {
      downloads: extension.downloads,
      rating: extension.rating,
      reviewCount: extension.reviewCount,
      activeInstallations
    };
  }
}

export const extensionsMarketplace = new ExtensionsMarketplaceService();