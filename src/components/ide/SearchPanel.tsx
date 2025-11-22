import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');

  return (
    <div className="h-full bg-dark-surface border-r border-dark-border flex flex-col">
      <div className="p-3 border-b border-dark-border">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Search
        </h3>
        <div className="space-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-2 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-8 py-2 bg-dark-bg border border-dark-border rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sui-cyan"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2.5 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder="Replace..."
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sui-cyan"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 p-3 overflow-y-auto scrollbar-thin">
        <p className="text-sm text-slate-500 text-center mt-8">
          No results found
        </p>
      </div>
    </div>
  );
};

export default SearchPanel;
