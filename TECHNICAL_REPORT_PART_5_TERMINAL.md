# Sui Studio IDE - Comprehensive Technical Report
## Part 5: Terminal System

---

## 5. INTEGRATED TERMINAL

### 5.1 Terminal Architecture

**Component Structure:**
```
Terminal.tsx (UI Component)
    ↓
useElectronTerminal.ts (Hook)
    ↓
Electron IPC (execute-command)
    ↓
Main Process (Child Process Spawn)
    ↓
System Shell (bash/cmd.exe)
```

### 5.2 Terminal Component (Terminal.tsx)

**Purpose:** Interactive command-line interface within the IDE

**Key Features:**
1. **Multiple Terminal Instances:**
   - Tab-based terminal management
   - Create unlimited terminals
   - Switch between terminals
   - Close individual terminals

2. **Command History:**
   - Up/Down arrow navigation
   - Persistent across sessions (localStorage)
   - Per-terminal history
   - Clear history option

3. **Output Rendering:**
   - ANSI color code support (planned)
   - Auto-scroll to bottom
   - Scrollback buffer
   - Copy output support

4. **Input Handling:**
   - Command input field
   - Enter to execute
   - Ctrl+C to cancel (planned)
   - Tab completion (planned)

**State Management:**
```typescript
const Terminal: React.FC = () => {
  const { terminals, activeTerminal, addTerminalOutput } = useIDEStore();
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentCommand, setCurrentCommand] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [terminal?.output]);
};
```

**Command Execution Flow:**
```typescript
const handleExecuteCommand = async () => {
  if (!currentCommand.trim()) return;
  
  // Add command to output
  addTerminalOutput(activeTerminal, `$ ${currentCommand}`);
  
  // Add to history
  setCommandHistory(prev => [...prev, currentCommand]);
  
  // Execute via Electron
  if (window.electron?.isElectron) {
    const result = await window.electron.executeCommand(
      currentCommand,
      currentFolder || undefined
    );
    
    // Display output
    if (result.output) {
      result.output.split('\n').forEach(line => {
        if (line.trim()) addTerminalOutput(activeTerminal, line);
      });
    }
    
    // Display errors
    if (!result.success && result.error) {
      addTerminalOutput(activeTerminal, `Error: ${result.error}`);
    }
  }
  
  // Clear input
  setCurrentCommand('');
  setHistoryIndex(-1);
};
```



### 5.3 Terminal Hook (useElectronTerminal.ts)

**Purpose:** Abstraction layer for terminal operations

**Features:**
1. **Command Execution:**
   - Platform-agnostic command execution
   - Working directory support
   - Real-time output streaming
   - Error handling

2. **Output Streaming:**
   - Listens for terminal-output IPC events
   - Appends to terminal buffer
   - Handles both stdout and stderr

3. **Terminal Management:**
   - Create new terminals
   - Switch active terminal
   - Clear terminal output
   - Close terminals

**Implementation:**
```typescript
export const useElectronTerminal = () => {
  const { addTerminalOutput, activeTerminal } = useIDEStore();
  const { currentFolder } = useElectronFileSystem();
  
  // Listen for real-time output
  useEffect(() => {
    if (!window.electron?.isElectron) return;
    
    const handleOutput = (output: string) => {
      if (activeTerminal) {
        addTerminalOutput(activeTerminal, output);
      }
    };
    
    window.electron.onTerminalOutput(handleOutput);
  }, [activeTerminal]);
  
  // Execute command
  const executeCommand = async (command: string) => {
    if (!window.electron?.isElectron) {
      throw new Error('Terminal only available in desktop mode');
    }
    
    return await window.electron.executeCommand(
      command,
      currentFolder || undefined
    );
  };
  
  return { executeCommand };
};
```

### 5.4 Terminal Features

**1. Command History Navigation:**
```typescript
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
      setCurrentCommand('');
    }
  }
};
```

**2. Common Commands:**
- `sui move build` - Build Move project
- `sui move test` - Run tests
- `sui client publish` - Publish package
- `git status` - Check Git status
- `ls` / `dir` - List files
- `cd <directory>` - Change directory
- `clear` - Clear terminal (client-side)

**3. Terminal Tabs:**
```typescript
<div className="flex items-center gap-2 border-b border-white/5">
  {terminals.map(term => (
    <button
      key={term.id}
      onClick={() => setActiveTerminal(term.id)}
      className={`px-4 py-2 ${
        term.id === activeTerminal
          ? 'bg-walrus-dark-900 border-b-2 border-cyan-400'
          : 'bg-transparent hover:bg-walrus-dark-900/50'
      }`}
    >
      {term.name}
      <button onClick={() => closeTerminal(term.id)}>×</button>
    </button>
  ))}
  <button onClick={createNewTerminal}>+</button>
</div>
```

**4. Output Formatting:**
- Monospace font (JetBrains Mono)
- Preserved whitespace
- Line wrapping
- Scrollable output
- Timestamp display (optional)

### 5.5 Terminal Integration with Build System

**Build Command Integration:**
```typescript
const handleBuild = async () => {
  if (!activeTerminal) return;
  
  // Show terminal if hidden
  if (!bottomPanelOpen) toggleBottomPanel();
  
  // Add command to terminal
  addTerminalOutput(activeTerminal, '$ sui move build');
  
  // Execute build
  const result = await executeCommand('sui move build');
  
  // Parse and display output
  if (result.success) {
    addTerminalOutput(activeTerminal, '✓ Build successful');
  } else {
    addTerminalOutput(activeTerminal, '✗ Build failed');
    // Parse errors and show in editor
  }
};
```

