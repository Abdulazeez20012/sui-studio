import React, { useState, useEffect } from 'react';
import { Search, X, FileText, ChevronRight, ChevronDown, Replace, CaseSensitive, Regex } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';
import { useElectronFileSystem } from '../../hooks/useElectronFileSystem';

interface SearchResult {
  file: string;
  line: number;
  column: number;
  content: string;
  match: string;
}

interface FileResults {
  filePath: string;
  results: SearchResult[];
  expanded: boolean;
}

const SearchPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [fileResults, setFileResults] = useState<FileResults[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  
  const { files, addTab, setActiveTab, tabs } = useIDEStore();
  const { readFile, isElectron } = useElectronFileSystem();

  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setFileResults([]);
      setTotalMatches(0);
    }
  }, [searchQuery, caseSensitive, useRegex, files]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const results: FileResults[] = [];
    let totalCount = 0;

    try {
      // Search through all files
      await searchInFiles(files, results);
      
      setFileResults(results);
      setTotalMatches(totalCount);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const searchInFiles = async (nodes: any[], results: FileResults[], parentPath = '') => {
    for (const node of nodes) {
      if (node.type === 'file') {
        const fileResults = await searchInFile(node);
        if (fileResults.length > 0) {
          results.push({
            filePath: node.path,
            results: fileResults,
            expanded: true,
          });
        }
      } else if (node.type === 'folder' && node.children) {
        await searchInFiles(node.children, results, node.path);
      }
    }
  };

  const searchInFile = async (fileNode: any): Promise<SearchResult[]> => {
    const results: SearchResult[] = [];
    
    try {
      // Get file content
      let content = fileNode.content || '';
      
      // If in Electron and no content, try to read from disk
      if (isElectron && !content && fileNode.path) {
        const fileContent = await readFile(fileNode.path);
        content = fileContent || '';
      }

      if (!content) return results;

      const lines = content.split('\n');
      
      // Create search pattern
      let searchPattern: RegExp;
      try {
        if (useRegex) {
          searchPattern = new RegExp(searchQuery, caseSensitive ? 'g' : 'gi');
        } else {
          const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          searchPattern = new RegExp(escapedQuery, caseSensitive ? 'g' : 'gi');
        }
      } catch (e) {
        // Invalid regex, use literal search
        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        searchPattern = new RegExp(escapedQuery, caseSensitive ? 'g' : 'gi');
      }

      // Search each line
      lines.forEach((line, index) => {
        const matches = line.matchAll(searchPattern);
        for (const match of matches) {
          results.push({
            file: fileNode.name,
            line: index + 1,
            column: match.index || 0,
            content: line.trim(),
            match: match[0],
          });
        }
      });
    } catch (error) {
      console.error(`Error searching file ${fileNode.name}:`, error);
    }

    return results;
  };

  const handleResultClick = async (filePath: string, lineNumber: number) => {
    // Find the file node
    const findFile = (nodes: any[]): any => {
      for (const node of nodes) {
        if (node.type === 'file' && node.path === filePath) {
          return node;
        }
        if (node.type === 'folder' && node.children) {
          const found = findFile(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const fileNode = findFile(files);
    if (!fileNode) return;

    // Check if file is already open
    const existingTab = tabs.find(t => t.path === filePath);
    if (existingTab) {
      setActiveTab(existingTab.id);
    } else {
      // Load file content
      let content = fileNode.content || '';
      if (isElectron && !content) {
        const fileContent = await readFile(filePath);
        content = fileContent || '';
      }

      // Open file in new tab
      const newTab = {
        id: `tab-${Date.now()}`,
        name: fileNode.name,
        path: filePath,
        content,
        language: fileNode.language || 'move',
        isDirty: false,
      };
      addTab(newTab);
    }

    // TODO: Scroll to line number in editor
  };

  const toggleFileExpanded = (index: number) => {
    setFileResults(prev => prev.map((fr, i) => 
      i === index ? { ...fr, expanded: !fr.expanded } : fr
    ));
  };

  const handleReplaceAll = () => {
    if (!replaceQuery && replaceQuery !== '') return;
    // TODO: Implement replace all functionality
    alert('Replace all functionality coming soon!');
  };

  return (
    <div className="h-full bg-walrus-dark-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Search
        </h3>
        
        {/* Search Input */}
        <div className="space-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in files..."
              className="w-full pl-9 pr-8 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-walrus-cyan/50 font-mono"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2.5 text-gray-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Replace Input */}
          <div className="relative">
            <Replace size={14} className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder="Replace with..."
              className="w-full pl-9 pr-20 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-walrus-cyan/50 font-mono"
            />
            {replaceQuery && (
              <button
                onClick={handleReplaceAll}
                className="absolute right-2 top-1.5 px-2 py-1 bg-walrus-cyan/20 text-walrus-cyan text-[10px] font-bold rounded hover:bg-walrus-cyan/30 transition-colors"
              >
                Replace All
              </button>
            )}
          </div>

          {/* Options */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCaseSensitive(!caseSensitive)}
              className={`p-1.5 rounded transition-colors ${
                caseSensitive 
                  ? 'bg-walrus-cyan/20 text-walrus-cyan' 
                  : 'bg-white/5 text-gray-500 hover:text-white'
              }`}
              title="Case Sensitive"
            >
              <CaseSensitive size={14} />
            </button>
            <button
              onClick={() => setUseRegex(!useRegex)}
              className={`p-1.5 rounded transition-colors ${
                useRegex 
                  ? 'bg-walrus-cyan/20 text-walrus-cyan' 
                  : 'bg-white/5 text-gray-500 hover:text-white'
              }`}
              title="Use Regular Expression"
            >
              <Regex size={14} />
            </button>
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="mt-3 text-xs text-gray-500">
            {isSearching ? (
              <span>Searching...</span>
            ) : (
              <span>
                {totalMatches} {totalMatches === 1 ? 'result' : 'results'} in {fileResults.length} {fileResults.length === 1 ? 'file' : 'files'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {fileResults.length === 0 && searchQuery && !isSearching ? (
          <div className="text-center py-12 px-4">
            <Search size={40} className="text-gray-600 mx-auto mb-3 opacity-50" />
            <p className="text-sm text-gray-500">No results found</p>
            <p className="text-xs text-gray-600 mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="p-2">
            {fileResults.map((fileResult, fileIndex) => (
              <div key={fileIndex} className="mb-2">
                {/* File Header */}
                <button
                  onClick={() => toggleFileExpanded(fileIndex)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-lg transition-colors text-left group"
                >
                  {fileResult.expanded ? (
                    <ChevronDown size={14} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={14} className="text-gray-500" />
                  )}
                  <FileText size={14} className="text-walrus-cyan" />
                  <span className="text-sm font-mono text-gray-300 group-hover:text-white flex-1">
                    {fileResult.filePath}
                  </span>
                  <span className="text-xs text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">
                    {fileResult.results.length}
                  </span>
                </button>

                {/* Results */}
                {fileResult.expanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {fileResult.results.map((result, resultIndex) => (
                      <button
                        key={resultIndex}
                        onClick={() => handleResultClick(fileResult.filePath, result.line)}
                        className="w-full text-left px-2 py-1.5 hover:bg-white/5 rounded transition-colors group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-600 font-mono">
                            {result.line}:{result.column}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-gray-400 group-hover:text-gray-300 truncate">
                          {result.content}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
