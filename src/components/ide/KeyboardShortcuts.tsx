import React from 'react';
import { X, Command } from 'lucide-react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    { category: 'File Operations', items: [
      { keys: [`${modKey}`, 'S'], description: 'Save current file' },
      { keys: [`${modKey}`, 'Shift', 'S'], description: 'Save all files' },
      { keys: [`${modKey}`, 'W'], description: 'Close current tab' },
      { keys: [`${modKey}`, 'N'], description: 'New file' },
    ]},
    { category: 'View', items: [
      { keys: [`${modKey}`, 'B'], description: 'Toggle sidebar' },
      { keys: [`${modKey}`, 'J'], description: 'Toggle terminal' },
      { keys: [`${modKey}`, 'Tab'], description: 'Next tab' },
    ]},
    { category: 'Build & Deploy', items: [
      { keys: [`${modKey}`, 'Shift', 'B'], description: 'Build project' },
      { keys: [`${modKey}`, 'Shift', 'T'], description: 'Run tests' },
      { keys: [`${modKey}`, 'Shift', 'D'], description: 'Deploy' },
    ]},
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-walrus-dark-900 border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-walrus-cyan/10 rounded-xl flex items-center justify-center">
              <Command size={20} className="text-walrus-cyan" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
              <p className="text-xs text-gray-400">Speed up your workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-6">
          {shortcuts.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <span className="text-sm text-gray-300">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <React.Fragment key={keyIdx}>
                          <kbd className="px-2 py-1 bg-walrus-dark-800 border border-white/20 rounded text-xs font-mono text-white shadow-sm">
                            {key}
                          </kbd>
                          {keyIdx < shortcut.keys.length - 1 && (
                            <span className="text-gray-600 text-xs">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5">
          <p className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-walrus-dark-800 border border-white/20 rounded text-xs font-mono">?</kbd> anytime to show this panel
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
