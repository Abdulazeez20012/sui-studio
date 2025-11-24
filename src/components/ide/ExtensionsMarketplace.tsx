import React, { useState } from 'react';
import { Search, Download, Star, TrendingUp, Package, ExternalLink, Filter, X, Check } from 'lucide-react';

interface Extension {
  id: string;
  name: string;
  publisher: string;
  description: string;
  version: string;
  downloads: number;
  rating: number;
  category: string;
  icon: string;
  marketplaceUrl: string;
  featured?: boolean;
}

const ExtensionsMarketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'recent'>('downloads');
  const [installedExtensions, setInstalledExtensions] = useState<Set<string>>(new Set(['core-analyzer', 'move-syntax']));

  const extensions: Extension[] = [
    {
      id: 'core-analyzer',
      name: 'Core Analyzer',
      publisher: 'Sui Studio Team',
      description: 'Advanced Sui Move code analysis, debugging, and optimization tools',
      version: '2.1.0',
      downloads: 15420,
      rating: 4.8,
      category: 'Analysis',
      icon: '🔍',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=sui-studio.core-analyzer',
      featured: true,
    },
    {
      id: 'move-syntax',
      name: 'Move Language Support',
      publisher: 'Move Foundation',
      description: 'Syntax highlighting, IntelliSense, and code completion for Move',
      version: '1.5.2',
      downloads: 28350,
      rating: 4.9,
      category: 'Language',
      icon: '📝',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=move-foundation.move-syntax',
      featured: true,
    },
    {
      id: 'sui-debugger',
      name: 'Sui Debugger',
      publisher: 'Mysten Labs',
      description: 'Interactive debugger for Sui Move smart contracts',
      version: '1.8.0',
      downloads: 12890,
      rating: 4.7,
      category: 'Debugging',
      icon: '🐛',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=mysten.sui-debugger',
      featured: true,
    },
    {
      id: 'move-formatter',
      name: 'Move Formatter',
      publisher: 'Code Style',
      description: 'Automatic code formatting and style enforcement for Move',
      version: '1.2.1',
      downloads: 9240,
      rating: 4.6,
      category: 'Formatting',
      icon: '✨',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=codestyle.move-formatter',
    },
    {
      id: 'sui-snippets',
      name: 'Sui Snippets',
      publisher: 'DevTools',
      description: 'Code snippets for common Sui Move patterns and templates',
      version: '2.0.0',
      downloads: 18750,
      rating: 4.8,
      category: 'Snippets',
      icon: '⚡',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=devtools.sui-snippets',
    },
    {
      id: 'move-linter',
      name: 'Move Linter',
      publisher: 'Quality Tools',
      description: 'Real-time linting and error detection for Move code',
      version: '1.4.3',
      downloads: 11200,
      rating: 4.5,
      category: 'Linting',
      icon: '🔧',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=quality.move-linter',
    },
    {
      id: 'sui-test-runner',
      name: 'Sui Test Runner',
      publisher: 'Testing Pro',
      description: 'Run and debug Sui Move tests directly in VS Code',
      version: '1.6.0',
      downloads: 8930,
      rating: 4.7,
      category: 'Testing',
      icon: '🧪',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=testing.sui-test-runner',
    },
    {
      id: 'move-docs',
      name: 'Move Documentation',
      publisher: 'Docs Team',
      description: 'Inline documentation and hover information for Move APIs',
      version: '1.3.0',
      downloads: 7650,
      rating: 4.4,
      category: 'Documentation',
      icon: '📚',
      marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=docs.move-docs',
    },
  ];

  const categories = ['all', 'Analysis', 'Language', 'Debugging', 'Formatting', 'Snippets', 'Linting', 'Testing', 'Documentation'];

  const filteredExtensions = extensions
    .filter(ext => {
      const matchesSearch = ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ext.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ext.publisher.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || ext.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // 'recent' would need timestamp
    });

  const featuredExtensions = extensions.filter(ext => ext.featured);

  return (
    <div className="h-full bg-dark-surface flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-sui-cyan/20 bg-dark-header">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-sui-cyan" />
            <h3 className="text-lg font-black text-white uppercase tracking-wider font-tech">
              Extensions Marketplace
            </h3>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border transition-all ${
              showFilters
                ? 'bg-sui-cyan/10 border-sui-cyan/50 text-sui-cyan'
                : 'border-sui-cyan/20 text-slate-400 hover:text-sui-cyan hover:border-sui-cyan/40'
            }`}
          >
            <Filter size={16} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Sui Move extensions..."
            className="w-full pl-10 pr-10 py-2 bg-dark-panel border border-sui-cyan/20 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sui-cyan/50 focus:shadow-neon transition-all font-tech"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Filters & Sort */}
        {showFilters && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-tech uppercase">Sort By</span>
              <div className="flex gap-2">
                {(['downloads', 'rating', 'recent'] as const).map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all font-tech ${
                      sortBy === sort
                        ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50'
                        : 'bg-dark-panel text-slate-500 border border-sui-cyan/10 hover:text-sui-cyan hover:border-sui-cyan/30'
                    }`}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all font-tech ${
                    selectedCategory === category
                      ? 'bg-sui-cyan/20 text-sui-cyan border border-sui-cyan/50'
                      : 'bg-dark-panel text-slate-400 border border-sui-cyan/10 hover:text-sui-cyan hover:border-sui-cyan/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sui-cyan/30 scrollbar-track-transparent">
        {/* Featured Extensions */}
        {!searchQuery && selectedCategory === 'all' && (
          <div className="p-4 border-b border-sui-cyan/10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-neon-purple" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-tech">
                Featured
              </h4>
            </div>
            <div className="grid gap-3">
              {featuredExtensions.map((ext) => (
                <ExtensionCard key={ext.id} extension={ext} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Extensions */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-tech">
              {filteredExtensions.length} Extensions
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-tech">
              <span>{installedExtensions.size} Installed</span>
            </div>
          </div>
          <div className="grid gap-3">
            {filteredExtensions.map((ext) => (
              <ExtensionCard 
                key={ext.id} 
                extension={ext} 
                isInstalled={installedExtensions.has(ext.id)}
                onInstall={() => setInstalledExtensions(prev => new Set([...prev, ext.id]))}
                onUninstall={() => setInstalledExtensions(prev => {
                  const next = new Set(prev);
                  next.delete(ext.id);
                  return next;
                })}
              />
            ))}
          </div>

          {filteredExtensions.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-tech">No extensions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ExtensionCardProps {
  extension: Extension;
  featured?: boolean;
  isInstalled?: boolean;
  onInstall?: () => void;
  onUninstall?: () => void;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({ extension, featured, isInstalled, onInstall, onUninstall }) => {
  return (
    <div className={`p-4 rounded-lg border transition-all hover:shadow-neon group ${
      featured
        ? 'bg-gradient-to-r from-neon-purple/5 to-sui-cyan/5 border-neon-purple/30 hover:border-neon-purple/60'
        : 'bg-dark-panel border-sui-cyan/20 hover:border-sui-cyan/50'
    }`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl border flex-shrink-0 ${
          featured
            ? 'bg-neon-purple/10 border-neon-purple/30'
            : 'bg-sui-cyan/10 border-sui-cyan/30'
        }`}>
          {extension.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <h5 className="text-white font-bold truncate font-tech">{extension.name}</h5>
              <p className="text-xs text-slate-500 font-tech">{extension.publisher}</p>
            </div>
            {featured && (
              <span className="px-2 py-0.5 bg-neon-purple/20 text-neon-purple text-xs font-bold rounded border border-neon-purple/30 font-tech">
                FEATURED
              </span>
            )}
          </div>

          <p className="text-sm text-slate-400 mb-3 line-clamp-2 font-tech">
            {extension.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-3 text-xs text-slate-500 font-tech">
            <div className="flex items-center gap-1">
              <Download size={12} />
              <span>{(extension.downloads / 1000).toFixed(1)}K</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-500" fill="currentColor" />
              <span>{extension.rating}</span>
            </div>
            <div className="px-2 py-0.5 bg-dark-bg rounded text-xs font-tech">
              v{extension.version}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isInstalled ? (
              <button
                onClick={onUninstall}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all font-tech bg-dark-bg border border-neon-green/50 text-neon-green hover:bg-neon-green/10"
              >
                <Check size={14} />
                <span>Installed</span>
              </button>
            ) : (
              <button
                onClick={onInstall}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all font-tech ${
                  featured
                    ? 'bg-neon-purple hover:bg-neon-purple/90 text-white shadow-purple-glow hover:shadow-[0_0_30px_rgba(176,38,255,0.5)]'
                    : 'bg-sui-cyan hover:bg-sui-cyan/90 text-black shadow-neon hover:shadow-neon-lg'
                }`}
              >
                <Download size={14} />
                <span>Install</span>
              </button>
            )}
            <a
              href={extension.marketplaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-sui-cyan/30 rounded-lg text-slate-400 hover:text-sui-cyan hover:border-sui-cyan/60 transition-all"
              title="View in marketplace"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionsMarketplace;
