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

    // Define custom premium dark theme
    monaco.editor.defineTheme('walrus-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword.move', foreground: '00E0FF', fontStyle: 'bold' }, // Cyan
        { token: 'keyword.control.move', foreground: '7C3AED', fontStyle: 'bold' }, // Purple
        { token: 'keyword.visibility.move', foreground: 'F472B6', fontStyle: 'bold' }, // Pink
        { token: 'type.move', foreground: '3B82F6' }, // Blue
        { token: 'function.move', foreground: 'E2E8F0' }, // Light Gray
        { token: 'variable.move', foreground: '94A3B8' }, // Slate
        { token: 'string.move', foreground: 'A7F3D0' }, // Soft Green
        { token: 'number.move', foreground: 'FCD34D' }, // Amber
        { token: 'comment.move', foreground: '475569', fontStyle: 'italic' }, // Dark Slate
        { token: 'operator.move', foreground: '64748B' },
        { token: 'delimiter.move', foreground: '64748B' },
      ],
      colors: {
        'editor.background': '#050505', // walrus-dark-950
        'editor.foreground': '#E2E8F0',
        'editorLineNumber.foreground': '#334155',
        'editorLineNumber.activeForeground': '#00E0FF',
        'editor.selectionBackground': '#00E0FF20',
        'editor.inactiveSelectionBackground': '#1E293B',
        'editorCursor.foreground': '#00E0FF',
        'editor.lineHighlightBackground': '#121212', // walrus-dark-800
        'editorWhitespace.foreground': '#1E293B',
        'editorIndentGuide.background': '#1E293B',
        'editorIndentGuide.activeBackground': '#334155',
        'editorBracketMatch.background': '#00E0FF20',
        'editorBracketMatch.border': '#00E0FF',
      }
    });

    // Apply the theme
    monaco.editor.setTheme('walrus-dark');

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
      <div className="flex items-center justify-center h-full bg-walrus-dark-950 text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2 font-tech">No file open</p>
          <p className="text-sm font-tech opacity-60">Open a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-walrus-dark-950 relative group">
      {/* Subtle Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
        style={{ opacity: 0.02 }}
      >
        <img
          src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763580906/sui-sui-logo_gmux9g.png"
          alt="Sui Logo"
          className="w-[800px] h-[800px] object-contain filter grayscale brightness-150"
        />
      </div>

      <div className="relative z-10 h-full">
        <Editor
          height="100%"
          language={currentTab.language === 'move' ? 'move' : currentTab.language}
          value={currentTab.content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="walrus-dark"
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
            padding: { top: 20, bottom: 20 },
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
