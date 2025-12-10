import React, { useState } from 'react';
import { Clock, X, FileText } from 'lucide-react';
import { useRecentFiles } from '../../hooks/useRecentFiles';

interface RecentFilesProps {
  onFileSelect: (path: string, name: string) => void;
}

const RecentFiles: React.FC<RecentFilesProps> = ({ onFileSelect }) => {
  const { recentFiles, removeRecentFile, clearRecentFiles } = useRecentFiles();
  const [isOpen, setIsOpen] = useState(false);

  if (recentFiles.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/5 rounded transition-colors relative"
        title="Recent Files"
      >
        <Clock className="w-5 h-5" />
        {recentFiles.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"></span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-walrus-dark-800 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <h3 className="font-tech text-sm font-bold">Recent Files</h3>
              <button
                onClick={() => {
                  clearRecentFiles();
                  setIsOpen(false);
                }}
                className="text-xs text-gray-400 hover:text-cyan-400 transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* File List */}
            <div className="max-h-96 overflow-y-auto">
              {recentFiles.map((file) => (
                <div
                  key={file.path}
                  className="flex items-center gap-2 p-3 hover:bg-white/5 transition-colors group"
                >
                  <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  
                  <button
                    onClick={() => {
                      onFileSelect(file.path, file.name);
                      setIsOpen(false);
                    }}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="font-mono text-sm truncate">{file.name}</div>
                    <div className="text-xs text-gray-500 truncate">{file.path}</div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentFile(file.path);
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded transition-all"
                    title="Remove from recent"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-white/10 text-xs text-gray-500 text-center">
              {recentFiles.length} recent {recentFiles.length === 1 ? 'file' : 'files'}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentFiles;
