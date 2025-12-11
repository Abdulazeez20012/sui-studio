import React, { useState } from 'react';
import {
  Search,
  Download,
  Star,
  TrendingUp,
  Package,
  Zap,
  Shield,
  Code2,
  Wallet,
  Database,
  Globe,
  Terminal,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Filter,
  Grid3x3,
  List,
  Clock,
  Users,
  Award,
  Rocket
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  downloads: string;
  rating: number;
  verified: boolean;
  installed: boolean;
  version: string;
  author: string;
  tags: string[];
  link: string;
  featured?: boolean;
}

const MarketplacePanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating'>('popular');

  const categories = [
    { id: 'all', name: 'All Tools', icon: Grid3x3 },
    { id: 'wallets', name: 'Wallets', icon: Wallet },
    { id: 'frameworks', name: 'Frameworks', icon: Code2 },
    { id: 'libraries', name: 'Libraries', icon: Package },
    { id: 'tools', name: 'Dev Tools', icon: Terminal },
    { id: 'explorers', name: 'Explorers', icon: Globe },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  const tools: Tool[] = [
    {
      id: 'sui-wallet',
      name: 'Sui Wallet',
      description: 'Official Sui Wallet browser extension for managing your Sui assets',
      category: 'wallets',
      icon: <Wallet className="w-6 h-6" />,
      downloads: '100K+',
      rating: 4.8,
      verified: true,
      installed: false,
      version: '1.0.0',
      author: 'Mysten Labs',
      tags: ['wallet', 'official', 'browser-extension'],
      link: 'https://chrome.google.com/webstore/detail/sui-wallet',
      featured: true,
    },
    {
      id: 'sui-sdk',
      name: 'Sui TypeScript SDK',
      description: 'Official TypeScript/JavaScript SDK for building on Sui',
      category: 'libraries',
      icon: <Code2 className="w-6 h-6" />,
      downloads: '50K+',
      rating: 4.9,
      verified: true,
      installed: true,
      version: '1.45.2',
      author: 'Mysten Labs',
      tags: ['sdk', 'typescript', 'official'],
      link: 'https://www.npmjs.com/package/@mysten/sui',
      featured: true,
    },
    {
      id: 'suiscan',
      name: 'SuiScan Explorer',
      description: 'Comprehensive blockchain explorer for Sui network',
      category: 'explorers',
      icon: <Globe className="w-6 h-6" />,
      downloads: '200K+',
      rating: 4.7,
      verified: true,
      installed: false,
      version: '2.0.0',
      author: 'SuiScan Team',
      tags: ['explorer', 'analytics', 'monitoring'],
      link: 'https://suiscan.xyz',
      featured: true,
    },
    {
      id: 'move-analyzer',
      name: 'Move Analyzer',
      description: 'Static analysis tool for Move smart contracts',
      category: 'security',
      icon: <Shield className="w-6 h-6" />,
      downloads: '15K+',
      rating: 4.6,
      verified: true,
      installed: false,
      version: '0.9.0',
      author: 'Move Security',
      tags: ['security', 'analysis', 'audit'],
      link: 'https://github.com/move-language/move-analyzer',
    },
    {
      id: 'sui-dapp-kit',
      name: 'dApp Kit',
      description: 'React components and hooks for building Sui dApps',
      category: 'frameworks',
      icon: <Sparkles className="w-6 h-6" />,
      downloads: '30K+',
      rating: 4.8,
      verified: true,
      installed: true,
      version: '0.19.9',
      author: 'Mysten Labs',
      tags: ['react', 'dapp', 'ui', 'official'],
      link: 'https://www.npmjs.com/package/@mysten/dapp-kit',
      featured: true,
    },
    {
      id: 'sui-cli',
      name: 'Sui CLI',
      description: 'Command-line interface for Sui development',
      category: 'tools',
      icon: <Terminal className="w-6 h-6" />,
      downloads: '80K+',
      rating: 4.9,
      verified: true,
      installed: true,
      version: '1.0.0',
      author: 'Mysten Labs',
      tags: ['cli', 'development', 'official'],
      link: 'https://docs.sui.io/guides/developer/getting-started/sui-install',
    },
    {
      id: 'move-prover',
      name: 'Move Prover',
      description: 'Formal verification tool for Move smart contracts',
      category: 'security',
      icon: <Award className="w-6 h-6" />,
      downloads: '8K+',
      rating: 4.5,
      verified: true,
      installed: false,
      version: '1.0.0',
      author: 'Move Team',
      tags: ['verification', 'security', 'formal-methods'],
      link: 'https://github.com/move-language/move/tree/main/language/move-prover',
    },
    {
      id: 'sui-indexer',
      name: 'Sui Indexer',
      description: 'Index and query Sui blockchain data efficiently',
      category: 'tools',
      icon: <Database className="w-6 h-6" />,
      downloads: '12K+',
      rating: 4.4,
      verified: false,
      installed: false,
      version: '0.5.0',
      author: 'Community',
      tags: ['indexer', 'database', 'query'],
      link: 'https://github.com/MystenLabs/sui/tree/main/crates/sui-indexer',
    },
    {
      id: 'move-stdlib',
      name: 'Move Standard Library',
      description: 'Standard library modules for Move development',
      category: 'libraries',
      icon: <Package className="w-6 h-6" />,
      downloads: '100K+',
      rating: 4.9,
      verified: true,
      installed: true,
      version: '1.0.0',
      author: 'Move Team',
      tags: ['stdlib', 'core', 'official'],
      link: 'https://github.com/move-language/move/tree/main/language/move-stdlib',
    },
    {
      id: 'sui-graphql',
      name: 'Sui GraphQL',
      description: 'GraphQL API for querying Sui blockchain',
      category: 'tools',
      icon: <Zap className="w-6 h-6" />,
      downloads: '25K+',
      rating: 4.7,
      verified: true,
      installed: false,
      version: '2.0.0',
      author: 'Mysten Labs',
      tags: ['graphql', 'api', 'query'],
      link: 'https://docs.sui.io/guides/developer/advanced/graphql-rpc',
    },
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTools = [...filteredTools].sort((a, b) => {
    if (sortBy === 'popular') {
      return parseInt(b.downloads) - parseInt(a.downloads);
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  const featuredTools = tools.filter(t => t.featured);

  return (
    <div className="h-full bg-walrus-dark-950 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-walrus-cyan to-walrus-purple rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              Sui Marketplace
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Discover and install Sui ecosystem tools
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-walrus-cyan text-black'
                  : 'bg-walrus-dark-900 text-gray-400 hover:text-white'
              }`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-walrus-cyan text-black'
                  : 'bg-walrus-dark-900 text-gray-400 hover:text-white'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search tools, libraries, frameworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-walrus-dark-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-walrus-cyan/50"
          />
        </div>
      </div>

      {/* Categories & Filters */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-walrus-cyan text-black font-bold'
                    : 'bg-walrus-dark-900 text-gray-400 hover:text-white hover:bg-walrus-dark-800'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{cat.name}</span>
              </button>
            );
          })}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 bg-walrus-dark-900 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-walrus-cyan/50"
        >
          <option value="popular">Most Popular</option>
          <option value="recent">Recently Added</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Featured Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Star className="text-yellow-400" size={20} />
              Featured Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Tools */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">
            {selectedCategory === 'all' ? 'All Tools' : categories.find(c => c.id === selectedCategory)?.name}
            <span className="text-gray-500 text-sm ml-2">({sortedTools.length})</span>
          </h3>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTools.map((tool) => (
                <ToolCardList key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Tool Card Component (Grid View)
const ToolCard: React.FC<{ tool: Tool; featured?: boolean }> = ({ tool, featured }) => {
  return (
    <div
      className={`p-5 rounded-xl border transition-all hover:scale-105 cursor-pointer ${
        featured
          ? 'bg-gradient-to-br from-walrus-cyan/10 to-walrus-purple/10 border-walrus-cyan/30'
          : 'bg-walrus-dark-900 border-white/5 hover:border-white/20'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 bg-walrus-dark-800 rounded-xl flex items-center justify-center text-walrus-cyan">
          {tool.icon}
        </div>
        {tool.verified && (
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-full">
            <CheckCircle size={12} className="text-blue-400" />
            <span className="text-xs text-blue-400 font-bold">Verified</span>
          </div>
        )}
      </div>

      <h4 className="text-white font-bold mb-1">{tool.name}</h4>
      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{tool.description}</p>

      <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Download size={14} />
          <span>{tool.downloads}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span>{tool.rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{tool.author}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {tool.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-walrus-dark-800 text-gray-400 text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {tool.installed ? (
          <button className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle size={16} />
            Installed
          </button>
        ) : (
          <button className="flex-1 px-4 py-2 bg-walrus-cyan hover:bg-walrus-cyan-light text-black rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors">
            <Download size={16} />
            Install
          </button>
        )}
        <a
          href={tool.link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-walrus-dark-800 hover:bg-walrus-dark-700 text-gray-400 hover:text-white rounded-lg transition-colors"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

// Tool Card Component (List View)
const ToolCardList: React.FC<{ tool: Tool }> = ({ tool }) => {
  return (
    <div className="p-4 bg-walrus-dark-900 border border-white/5 rounded-xl hover:border-white/20 transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-walrus-dark-800 rounded-xl flex items-center justify-center text-walrus-cyan flex-shrink-0">
          {tool.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-bold">{tool.name}</h4>
            {tool.verified && (
              <CheckCircle size={14} className="text-blue-400" />
            )}
            <span className="text-xs text-gray-500">v{tool.version}</span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-1">{tool.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Download size={12} />
              {tool.downloads}
            </span>
            <span className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              {tool.rating}
            </span>
            <span>{tool.author}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {tool.installed ? (
            <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-bold text-sm flex items-center gap-2">
              <CheckCircle size={16} />
              Installed
            </button>
          ) : (
            <button className="px-4 py-2 bg-walrus-cyan hover:bg-walrus-cyan-light text-black rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
              <Download size={16} />
              Install
            </button>
          )}
          <a
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-walrus-dark-800 hover:bg-walrus-dark-700 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePanel;
