import React, { useState, useEffect } from 'react';
import { Package, Download, Upload, Search, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { packageService, SuiPackage } from '../../services/packageService';

export const PackageManager: React.FC = () => {
  const [packages, setPackages] = useState<SuiPackage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<SuiPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadPackages();
    loadCategories();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await packageService.getPackages();
      setPackages(data);
    } catch (error) {
      console.error('Failed to load packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await packageService.getCategories();
      setCategories(['all', ...cats]);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const installPackage = async (pkg: SuiPackage) => {
    try {
      setInstalling(pkg.name);
      const result = await packageService.installPackage(pkg.name);
      
      if (result.success) {
        setPackages(packages.map(p =>
          p.name === pkg.name ? { ...p, installed: true } : p
        ));
      } else {
        alert(`Failed to install ${pkg.name}: ${result.error}`);
      }
    } catch (error) {
      console.error('Install error:', error);
      alert(`Failed to install ${pkg.name}`);
    } finally {
      setInstalling(null);
    }
  };

  const uninstallPackage = async (pkg: SuiPackage) => {
    try {
      setInstalling(pkg.name);
      const result = await packageService.uninstallPackage(pkg.name);
      
      if (result.success) {
        setPackages(packages.map(p =>
          p.name === pkg.name ? { ...p, installed: false } : p
        ));
      } else {
        alert(`Failed to uninstall ${pkg.name}: ${result.error}`);
      }
    } catch (error) {
      console.error('Uninstall error:', error);
      alert(`Failed to uninstall ${pkg.name}`);
    } finally {
      setInstalling(null);
    }
  };

  const generateMoveToml = async () => {
    try {
      const installed = packages.filter(p => p.installed).map(p => p.name);
      const toml = await packageService.generateMoveToml('my_project', installed);
      navigator.clipboard.writeText(toml);
      alert('Move.toml copied to clipboard!');
    } catch (error) {
      console.error('Generate error:', error);
      alert('Failed to generate Move.toml');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="p-3 border-b border-gray-700">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <Package className="w-4 h-4" />
          Package Manager
        </h3>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-sui-blue"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-sui-blue text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-6 h-6 animate-spin text-sui-blue" />
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No packages found
          </div>
        ) : (
          filteredPackages.map(pkg => (
          <div
            key={pkg.name}
            className="p-4 border-b border-gray-800 hover:bg-gray-800 cursor-pointer"
            onClick={() => setSelectedPackage(pkg)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{pkg.name}</h4>
                  {pkg.verified && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-xs text-gray-400">v{pkg.version}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{pkg.description}</p>
                <p className="text-xs text-gray-500 mt-1">by {pkg.author}</p>
              </div>
              <div>
                {installing === pkg.name ? (
                  <Loader className="w-4 h-4 animate-spin text-sui-blue" />
                ) : pkg.installed ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      uninstallPackage(pkg);
                    }}
                    disabled={installing !== null}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm disabled:opacity-50"
                  >
                    Uninstall
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      installPackage(pkg);
                    }}
                    disabled={installing !== null}
                    className="px-3 py-1 bg-sui-blue hover:bg-blue-600 rounded text-sm disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 inline mr-1" />
                    Install
                  </button>
                )}
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={generateMoveToml}
          disabled={loading || installing !== null}
          className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Export Move.toml
        </button>
      </div>
    </div>
  );
};
