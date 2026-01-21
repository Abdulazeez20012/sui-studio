import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useIDEStore } from '../../store/ideStore';
import { useSettingsStore } from '../../store/settingsStore';
import WelcomeScreen from './WelcomeScreen';
import Breadcrumbs from './Breadcrumbs';
import { registerMoveLanguage } from '../../utils/moveLanguage';
import { collaborationService } from '../../services/collaborationService';
import { useYjsCollaboration } from '../../hooks/useYjsCollaboration';
import { CollaborationIndicator } from './CollaborationIndicator';
import { useElectronFileSystem } from '../../hooks/useElectronFileSystem';
import './CodeEditor.css';

const CodeEditor: React.FC = () => {
  const { tabs, activeTab, updateTabContent, files, markTabAsSaved } = useIDEStore();
  const { fontSize, tabSize, wordWrap, minimap, lineNumbers } = useSettingsStore();
  const { writeFile, isElectron, currentFolder } = useElectronFileSystem();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [enableYjs, setEnableYjs] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const currentTab = tabs.find(t => t.id === activeTab);

  // Yjs collaboration (optional, can be toggled)
  const documentId = currentTab?.id || 'default';
  const yjs = useYjsCollaboration(enableYjs ? documentId : '');

  // Track remote cursors decorations and widgets
  const remoteCursorsRef = useRef<Map<string, { decorationIds: string[], widgetId: string | null }>>(new Map());

  // Save file function
  const handleSave = async () => {
    if (!currentTab) return;

    setSaveStatus('saving');

    try {
      if (isElectron && currentFolder && currentTab.path) {
        // Electron: Save to disk
        await writeFile(currentTab.path, currentTab.content);
        setSaveStatus('saved');

        // Mark tab as not dirty
        markTabAsSaved(activeTab!);

        // Show success message briefly
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        // Web: Save to localStorage as fallback
        const savedFiles = localStorage.getItem('ide_files') || '{}';
        const files = JSON.parse(savedFiles);
        files[currentTab.path || currentTab.name] = currentTab.content;
        localStorage.setItem('ide_files', JSON.stringify(files));

        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error: any) {
      console.error('Failed to save file:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Register Sui Move language
    registerMoveLanguage(monaco);

    // Add Ctrl+S / Cmd+S keyboard shortcut for saving
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    // --- Real-time Collaboration Logic ---
    const updateRemoteCursor = (userId: string, position: { line: number, column: number }, userName: string, color: string) => {
      const existing = remoteCursorsRef.current.get(userId);

      const newDecorations = [
        {
          range: new monaco.Range(position.line, position.column, position.line, position.column),
          options: {
            className: `remote-cursor remote-cursor-${userId}`,
            hoverMessage: { value: `User: ${userName}` }
          }
        }
      ];

      const decorationIds = editor.deltaDecorations(existing?.decorationIds || [], newDecorations);

      let widgetId = existing?.widgetId;

      if (!widgetId) {
        widgetId = `cursor.widget.${userId}`;
        const widget = {
          getId: () => widgetId!,
          getDomNode: () => {
            const domNode = document.createElement('div');
            domNode.className = 'remote-cursor-name';
            domNode.textContent = userName;
            domNode.style.backgroundColor = color;
            return domNode;
          },
          getPosition: () => ({
            position: { lineNumber: position.line, column: position.column },
            preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE, monaco.editor.ContentWidgetPositionPreference.BELOW]
          })
        };
        editor.addContentWidget(widget);
      } else {
        editor.layoutContentWidget({
          getId: () => widgetId!,
          getDomNode: () => { return null as any; },
          getPosition: () => ({
            position: { lineNumber: position.line, column: position.column },
            preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE, monaco.editor.ContentWidgetPositionPreference.BELOW]
          })
        });
      }

      if (!document.getElementById(`style-${userId}`)) {
        const style = document.createElement('style');
        style.id = `style-${userId}`;
        style.textContent = `.remote-cursor-${userId} { border-left: 2px solid ${color}; }`;
        document.head.appendChild(style);
      }

      remoteCursorsRef.current.set(userId, { decorationIds, widgetId });
    };

    const handleRemoteUserLeft = (msg: any) => {
      const { userId } = msg;
      const existing = remoteCursorsRef.current.get(userId);
      if (existing) {
        editor.deltaDecorations(existing.decorationIds, []);
        if (existing.widgetId) {
          editor.removeContentWidget({ getId: () => existing.widgetId! });
        }
        const style = document.getElementById(`style-${userId}`);
        if (style) style.remove();
        remoteCursorsRef.current.delete(userId);
      }
    };

    collaborationService.on('cursor', (msg: any) => {
      const color = msg.color || '#3CB9FF';
      const name = msg.userName || msg.userId;
      if (msg.position) {
        updateRemoteCursor(msg.userId, msg.position, name, color);
      }
    });

    collaborationService.on('user-left', handleRemoteUserLeft);

    editor.onDidChangeCursorPosition((e: any) => {
      collaborationService.sendCursor({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });

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

      // Update Yjs document if enabled
      if (enableYjs && yjs.connected) {
        yjs.updateContent(value);
      }
    }
  };

  // Sync Yjs changes back to editor
  useEffect(() => {
    if (enableYjs && yjs.text && currentTab && yjs.text !== currentTab.content) {
      updateTabContent(activeTab!, yjs.text);
    }
  }, [yjs.text, enableYjs]);

  // Apply settings to editor when they change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize,
        tabSize,
        wordWrap: wordWrap ? 'on' : 'off',
        minimap: { enabled: minimap },
        lineNumbers: lineNumbers ? 'on' : 'off',
      });
    }
  }, [fontSize, tabSize, wordWrap, minimap, lineNumbers]);

  if (!currentTab && files.length === 0) {
    // Return null or basic empty state - NexiHome will be shown by parent
    return null;
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
    <div className="h-full bg-walrus-dark-950/80 backdrop-blur-xl relative group rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex flex-col">
      {/* Subtle Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
        style={{ opacity: 0.03 }}
      >
        <img
          src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1765140543/Logo_-_Cloud-removebg-preview_obkvso.png"
          alt="Sui Logo"
          className="w-[800px] h-[800px] object-contain filter grayscale brightness-150 animate-pulse-slow"
        />
      </div>

      {/* Collaboration Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Save Status Indicator */}
        {saveStatus !== 'idle' && (
          <div className={`px-3 py-1 rounded text-xs font-medium transition-all ${saveStatus === 'saving' ? 'bg-yellow-500/20 text-yellow-400' :
            saveStatus === 'saved' ? 'bg-green-500/20 text-green-400' :
              'bg-red-500/20 text-red-400'
            }`}>
            {saveStatus === 'saving' ? '💾 Saving...' :
              saveStatus === 'saved' ? '✓ Saved' :
                '✗ Save Failed'}
          </div>
        )}

        {/* Collaboration Toggle */}
        <button
          onClick={() => setEnableYjs(!enableYjs)}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${enableYjs
            ? 'bg-sui-cyan text-black'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          title="Toggle real-time collaboration"
        >
          {enableYjs ? 'Collab ON' : 'Collab OFF'}
        </button>

        {/* Collaboration Indicator */}
        {enableYjs && (
          <CollaborationIndicator connected={yjs.connected} users={yjs.users} />
        )}
      </div>

      {/* Breadcrumbs */}
      {currentTab.path && (
        <div className="relative z-10">
          <Breadcrumbs filePath={currentTab.path} fileName={currentTab.name} />
        </div>
      )}

      <div className="relative z-10 flex-1">
        <Editor
          height="100%"
          language={currentTab.language === 'move' ? 'move' : currentTab.language}
          value={currentTab.content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="walrus-dark"
          options={{
            fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            fontLigatures: true,
            minimap: {
              enabled: minimap,
              scale: 1,
              showSlider: 'mouseover'
            },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize,
            insertSpaces: true,
            wordWrap: wordWrap ? 'on' : 'off',
            lineNumbers: lineNumbers ? 'on' : 'off',
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