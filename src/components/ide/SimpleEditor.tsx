import React, { useRef, useEffect, useState } from 'react';
import { useIDEStore } from '../../store/ideStore';

const SimpleEditor: React.FC = () => {
  const { tabs, activeTab, updateTabContent } = useIDEStore();
  const currentTab = tabs.find(t => t.id === activeTab);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeTab) {
      updateTabContent(activeTab, e.target.value);
    }
  };

  // Update line numbers when content changes
  useEffect(() => {
    if (currentTab?.content && typeof currentTab.content === 'string') {
      const lines = currentTab.content.split('\n');
      setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1));
    } else {
      setLineNumbers([1]);
    }
  }, [currentTab?.content]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          // Trigger save event
          document.dispatchEvent(new CustomEvent('ide:saveFile'));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      // Insert 4 spaces for tab
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      
      if (activeTab) {
        updateTabContent(activeTab, newValue);
      }
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  if (!currentTab) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-300">
        <div className="text-center">
          <p className="text-lg mb-2">No file open</p>
          <p className="text-sm text-gray-500">Open a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 text-gray-300 flex">
      {/* Line Numbers */}
      <div className="bg-gray-800 text-gray-500 text-right px-3 py-4 select-none border-r border-gray-700 min-w-[60px]">
        <div className="font-mono text-sm leading-6">
          {lineNumbers.map((num) => (
            <div key={num} className="h-6">
              {num}
            </div>
          ))}
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={typeof currentTab.content === 'string' ? currentTab.content : ''}
          onChange={handleEditorChange}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-gray-900 text-gray-300 font-mono text-sm leading-6 p-4 resize-none outline-none border-none"
          style={{
            fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            tabSize: 4,
          }}
          placeholder={currentTab.language === 'move' ? '// Start writing your Move code here...' : '// Start coding...'}
          spellCheck={false}
        />
        
        {/* File info overlay */}
        <div className="absolute top-2 right-2 bg-gray-800 px-2 py-1 rounded text-xs text-gray-400 opacity-75">
          {currentTab.language?.toUpperCase() || 'TEXT'} • {currentTab.name}
          {currentTab.isDirty && <span className="text-yellow-400 ml-1">●</span>}
        </div>
      </div>
    </div>
  );
};

export default SimpleEditor;