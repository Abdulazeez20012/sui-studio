# Sui Studio IDE - Comprehensive Technical Report
## Part 4: Code Editor Implementation

---

## 4. CODE EDITOR SYSTEM

### 4.1 Dual Editor Strategy

**Primary: Monaco Editor (CodeEditor.tsx)**
- Full-featured VS Code editor engine
- Advanced syntax highlighting
- IntelliSense and autocomplete
- Multi-cursor editing
- Find and replace
- Code folding
- Minimap
- Custom themes

**Fallback: SimpleEditor (SimpleEditor.tsx)**
- Lightweight textarea-based editor
- Basic syntax highlighting
- Line numbers
- Tab key handling
- Keyboard shortcuts
- Minimal dependencies
- Guaranteed to work

**Fallback Trigger:**
- Monaco initialization failure
- Browser compatibility issues
- Performance constraints
- User preference

### 4.2 Monaco Editor Integration

**Architecture:**
```typescript
import Editor from '@monaco-editor/react';

const CodeEditor: React.FC = () => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [monacoError, setMonacoError] = useState(false);
  
  const handleEditorDidMount = (editor: any, monaco: any) => {
    try {
      editorRef.current = editor;
      monacoRef.current = monaco;
      registerMoveLanguage(monaco);
      setupEditorFeatures(editor, monaco);
    } catch (error) {
      setMonacoError(true);
    }
  };
  
  if (monacoError) {
    return <SimpleEditor />;  // Graceful fallback
  }
  
  return <Editor onMount={handleEditorDidMount} />;
};
```

**Move Language Registration:**
```typescript
function registerMoveLanguage(monaco: any) {
  // Register language
  monaco.languages.register({ id: 'move' });
  
  // Define syntax highlighting
  monaco.languages.setMonarchTokensProvider('move', {
    keywords: [
      'module', 'struct', 'fun', 'public', 'entry',
      'let', 'mut', 'return', 'if', 'else', 'while',
      'loop', 'break', 'continue', 'use', 'as',
      'has', 'copy', 'drop', 'store', 'key'
    ],
    typeKeywords: ['u8', 'u64', 'u128', 'bool', 'address', 'vector'],
    operators: ['=', '>', '<', '!', '==', '<=', '>=', '!=', '+', '-', '*', '/'],
    // ... token rules
  });
  
  // Configure autocomplete
  monaco.languages.registerCompletionItemProvider('move', {
    provideCompletionItems: (model, position) => {
      // Return Move-specific suggestions
    }
  });
}
```



### 4.3 Custom Theme: "Walrus Dark"

**Design Philosophy:**
- Dark theme optimized for long coding sessions
- High contrast for readability
- Cyan/purple accent colors matching brand
- Reduced eye strain

**Theme Configuration:**
```typescript
monaco.editor.defineTheme('walrus-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '00D9FF', fontStyle: 'bold' },
    { token: 'type', foreground: 'A855F7' },
    { token: 'string', foreground: '4ADE80' },
    { token: 'number', foreground: 'F59E0B' },
    { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
    { token: 'function', foreground: '60A5FA' },
    { token: 'variable', foreground: 'E5E7EB' },
  ],
  colors: {
    'editor.background': '#0B0F14',
    'editor.foreground': '#E5E7EB',
    'editor.lineHighlightBackground': '#1F2937',
    'editor.selectionBackground': '#374151',
    'editorCursor.foreground': '#00D9FF',
    'editorLineNumber.foreground': '#6B7280',
    'editorLineNumber.activeForeground': '#00D9FF',
  }
});
```

### 4.4 Editor Features

**1. Tab Management:**
- Multiple file tabs
- Dirty state indicators (unsaved changes)
- Close buttons with confirmation
- Tab switching via Ctrl+Tab
- Drag to reorder (planned)

**2. Content Synchronization:**
- Real-time content updates to store
- Debounced save operations
- Dirty flag management
- Auto-save support

**3. Keyboard Shortcuts:**
- Ctrl+S: Save current file
- Ctrl+Shift+S: Save all files
- Ctrl+W: Close tab
- Ctrl+F: Find
- Ctrl+H: Replace
- Ctrl+/: Toggle comment

**4. Editor Options:**
```typescript
options={{
  fontSize: fontSize,
  tabSize: tabSize,
  wordWrap: wordWrap ? 'on' : 'off',
  minimap: { enabled: minimap },
  lineNumbers: lineNumbers ? 'on' : 'off',
  automaticLayout: true,
  scrollBeyondLastLine: false,
  renderWhitespace: 'selection',
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: true,
  smoothScrolling: true,
  fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
  fontLigatures: true,
  formatOnPaste: true,
  formatOnType: true,
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  wordBasedSuggestions: true,
}}
```

### 4.5 SimpleEditor Implementation

**When Used:**
- Monaco fails to initialize
- Low-end devices
- Browser compatibility issues
- User preference for simplicity

**Features:**
- Line numbers column
- Syntax-aware (basic)
- Tab key handling (4 spaces)
- Keyboard shortcuts
- File info overlay
- Dirty state indicator

**Tab Handling:**
```typescript
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    
    // Insert 4 spaces
    const newValue = value.substring(0, start) + '    ' + value.substring(end);
    updateTabContent(activeTab, newValue);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 4;
    }, 0);
  }
};
```

**Line Numbers:**
```typescript
useEffect(() => {
  if (currentTab?.content) {
    const lines = currentTab.content.split('\n');
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1));
  }
}, [currentTab?.content]);
```

