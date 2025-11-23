import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useIDEStore } from '../../store/ideStore';
import WelcomeScreen from './WelcomeScreen';

const CodeEditor: React.FC = () => {
  const { tabs, activeTab, updateTabContent, files } = useIDEStore();
  const editorRef = useRef<any>(null);

  const currentTab = tabs.find(t => t.id === activeTab);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Define custom black theme
    monaco.editor.defineTheme('sui-black', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#D4D4D4',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#00D4FF',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorCursor.foreground': '#00D4FF',
        'editor.lineHighlightBackground': '#0A0A0A',
        'editorWhitespace.foreground': '#404040',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
      }
    });
    
    // Apply the theme
    monaco.editor.setTheme('sui-black');
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
    <div className="h-full bg-black relative">
      {/* Sui Logo Watermark */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        style={{
          opacity: 0.03,
        }}
      >
        <img 
          src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763580906/sui-sui-logo_gmux9g.png"
          alt="Sui Logo"
          className="w-96 h-96 object-contain"
          style={{
            filter: 'grayscale(100%) brightness(1.5)',
          }}
        />
      </div>
      
      <div className="relative z-10 h-full">
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
    </div>
  );
};

export default CodeEditor;
