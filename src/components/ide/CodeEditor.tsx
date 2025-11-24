import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useIDEStore } from '../../store/ideStore';
import WelcomeScreen from './WelcomeScreen';
import { registerMoveLanguage } from '../../utils/moveLanguage';

const CodeEditor: React.FC = () => {
  const { tabs, activeTab, updateTabContent, files } = useIDEStore();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const currentTab = tabs.find(t => t.id === activeTab);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Register Sui Move language
    registerMoveLanguage(monaco);
    
    // Define custom black theme with Move-specific colors
    monaco.editor.defineTheme('sui-black', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword.move', foreground: '4DA9FF', fontStyle: 'bold' },
        { token: 'keyword.control.move', foreground: 'B026FF', fontStyle: 'bold' },
        { token: 'keyword.visibility.move', foreground: '00FF94', fontStyle: 'bold' },
        { token: 'type.move', foreground: '4EC9B0' },
        { token: 'function.move', foreground: 'DCDCAA' },
        { token: 'variable.move', foreground: '9CDCFE' },
        { token: 'string.move', foreground: 'CE9178' },
        { token: 'number.move', foreground: 'B5CEA8' },
        { token: 'comment.move', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'operator.move', foreground: 'D4D4D4' },
        { token: 'delimiter.move', foreground: 'D4D4D4' },
      ],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#D4D4D4',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#4DA9FF',
        'editor.selectionBackground': '#4DA9FF33',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorCursor.foreground': '#4DA9FF',
        'editor.lineHighlightBackground': '#0A0A0A',
        'editorWhitespace.foreground': '#404040',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
        'editorBracketMatch.background': '#4DA9FF22',
        'editorBracketMatch.border': '#4DA9FF',
      }
    });
    
    // Apply the theme
    monaco.editor.setTheme('sui-black');

    // Configure editor features
    editor.updateOptions({
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false
      },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnCommitCharacter: true,
      acceptSuggestionOnEnter: 'on',
      wordBasedSuggestions: true,
    });
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
          <p className="text-lg mb-2 font-tech">No file open</p>
          <p className="text-sm font-tech">Open a file from the explorer to start editing</p>
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
          language={currentTab.language === 'move' ? 'move' : currentTab.language}
          value={currentTab.content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="sui-black"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            fontLigatures: true,
            minimap: { 
              enabled: true,
              scale: 1,
              showSlider: 'mouseover'
            },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            // IntelliSense features
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: 'on',
            wordBasedSuggestions: 'currentDocument',
            parameterHints: { enabled: true },
            hover: { enabled: true },
            // Formatting
            formatOnPaste: true,
            formatOnType: true,
            // Other features
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'mouseover',
            matchBrackets: 'always',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoIndent: 'full',
            colorDecorators: true,
            contextmenu: true,
            find: {
              addExtraSpaceOnTop: true,
              autoFindInSelection: 'never',
              seedSearchStringFromSelection: 'always'
            }
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
