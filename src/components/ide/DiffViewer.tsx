import React, { useState, useEffect } from 'react';
import { FileText, X } from 'lucide-react';
import { gitService } from '../../services/gitService';

interface DiffViewerProps {
  file: string;
  onClose: () => void;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ file, onClose }) => {
  const [diff, setDiff] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiff();
  }, [file]);

  const loadDiff = async () => {
    setLoading(true);
    try {
      const diffText = await gitService.diff({ file });
      setDiff(diffText);
    } catch (error) {
      console.error('Failed to load diff:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseDiff = (diffText: string) => {
    const lines = diffText.split('\n');
    return lines.map((line, index) => {
      let type: 'add' | 'remove' | 'context' | 'header' = 'context';
      let className = 'text-gray-300';

      if (line.startsWith('+')) {
        type = 'add';
        className = 'bg-green-500/10 text-green-400';
      } else if (line.startsWith('-')) {
        type = 'remove';
        className = 'bg-red-500/10 text-red-400';
      } else if (line.startsWith('@@')) {
        type = 'header';
        className = 'bg-cyan-500/10 text-cyan-400 font-bold';
      } else if (line.startsWith('diff') || line.startsWith('index') || line.startsWith('---') || line.startsWith('+++')) {
        type = 'header';
        className = 'text-gray-500';
      }

      return { line, type, className, key: `${index}-${line}` };
    });
  };

  const parsedDiff = parseDiff(diff);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-walrus-dark-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="font-tech font-bold">Diff: {file}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diff Content */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading diff...</div>
          ) : diff ? (
            <div className="space-y-0">
              {parsedDiff.map(({ line, className, key }) => (
                <div key={key} className={`px-2 py-0.5 ${className}`}>
                  {line || ' '}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No changes</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiffViewer;
