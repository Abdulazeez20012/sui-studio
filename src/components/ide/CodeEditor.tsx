import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useIDEStore } from '../../store/ideStore';
import WelcomeScreen from './WelcomeScreen';

const CodeEditor: React.FC = () => {
  const { tabs, activeTab, updateTabContent, files } = useIDEStore();
  const editorRef = useRef<any>(null);

  const currentTab = tabs.find(t => t.id === activeTab);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeTab && value !== undefined) {
      updateTabContent(activeTab, value);
    }
  };

  if (!currentTab && files.length === 0) {
    return <WelcomeScreen />;
  }

  if (!currentTab) {
    return (
      <div className="flex items-center justify-center h-full bg-dark-bg text-slate-400">
        <div className="text-center">
          <p className="text-lg mb-2">No file open</p>
          <p className="text-sm">Open a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-dark-bg relative">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.02) 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}></div>
      
      <Editor
        height="100%"
        language={currentTab.language}
        value={currentTab.content}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          fontLigatures: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          bracketPairColorization: { enabled: true },
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor;
