import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Plus, Trash2, X } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';
import { apiService } from '../../services/apiService';
import { useElectronTerminal } from '../../hooks/useElectronTerminal';
import { useElectronFileSystem } from '../../hooks/useElectronFileSystem';

const Terminal: React.FC = () => {
  const { terminals, activeTerminal, setActiveTerminal, addTerminalOutput, addTerminal, clearTerminal } = useIDEStore();
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Electron terminal integration
  const { isElectron, executeCommand: executeElectronCommand, currentDirectory } = useElectronTerminal();
  const { currentFolder } = useElectronFileSystem();
  
  const currentTerminal = terminals.find(t => t.id === activeTerminal);
  const workingDirectory = currentFolder || currentDirectory || currentTerminal?.cwd || '';

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [currentTerminal?.output]);

  // Listen for real-time terminal output (Electron only)
  useEffect(() => {
    if (!isElectron || !window.electron) return;

    const handleOutput = (data: string) => {
      if (activeTerminal) {
        const lines = data.split('\n');
        lines.forEach(line => {
          if (line.trim()) {
            addTerminalOutput(activeTerminal, line);
          }
        });
      }
    };

    window.electron.onTerminalOutput(handleOutput);
  }, [isElectron, activeTerminal, addTerminalOutput]);

  const executeCommand = async (command: string) => {
    if (!activeTerminal) return;

    setIsExecuting(true);
    addTerminalOutput(activeTerminal, `$ ${command}`);

    try {
      // Handle built-in commands
      if (command === 'clear') {
        clearTerminal(activeTerminal);
        setIsExecuting(false);
        return;
      }

      if (command === 'help') {
        addTerminalOutput(activeTerminal, 'Available commands:');
        addTerminalOutput(activeTerminal, '  sui move build    - Build Move package');
        addTerminalOutput(activeTerminal, '  sui move test     - Run Move tests');
        addTerminalOutput(activeTerminal, '  sui client        - Sui client commands');
        addTerminalOutput(activeTerminal, '  npm/yarn          - Node.js commands');
        addTerminalOutput(activeTerminal, '  git               - Git commands');
        addTerminalOutput(activeTerminal, '  clear             - Clear terminal');
        addTerminalOutput(activeTerminal, '  help              - Show this help');
        setIsExecuting(false);
        return;
      }

      // Execute command
      let result;
      
      if (isElectron) {
        // Desktop: Execute real command via Electron
        result = await executeElectronCommand(command, workingDirectory);
      } else {
        // Web: Execute via backend
        result = await apiService.executeTerminalCommand({
          terminalId: activeTerminal,
          command,
          cwd: workingDirectory
        });
      }

      if (result.success) {
        // Add output line by line
        if (result.output) {
          const lines = result.output.split('\n');
          lines.forEach(line => {
            addTerminalOutput(activeTerminal, line);
          });
        }
      } else {
        addTerminalOutput(activeTerminal, `Error: ${result.error || 'Command failed'}`);
      }
    } catch (error: any) {
      addTerminalOutput(activeTerminal, `Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeTerminal || isExecuting) return;

    // Add to history
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);

    executeCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Arrow up - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
    // Arrow down - next command
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
    // Ctrl+C - clear input
    else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setInput('');
    }
    // Ctrl+L - clear terminal
    else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      if (activeTerminal) {
        clearTerminal(activeTerminal);
      }
    }
  };

  const handleNewTerminal = () => {
    const newTerminal = {
      id: `terminal-${Date.now()}`,
      name: `Terminal ${terminals.length + 1}`,
      output: []
    };
    addTerminal(newTerminal);
  };

  const handleCloseTerminal = (terminalId: string) => {
    if (terminals.length > 1) {
      // Close terminal logic would go here
      // For now, just switch to another terminal
      const otherTerminal = terminals.find(t => t.id !== terminalId);
      if (otherTerminal) {
        setActiveTerminal(otherTerminal.id);
      }
    }
  };

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col font-mono text-sm">
      {/* Terminal Tabs */}
      <div className="flex items-center bg-[#252526] border-b border-[#3e3e42] px-2">
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {terminals.map(terminal => (
            <div
              key={terminal.id}
              onClick={() => setActiveTerminal(terminal.id)}
              className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors ${
                terminal.id === activeTerminal
                  ? 'bg-[#1e1e1e] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TerminalIcon size={14} />
              <span className="text-xs">{terminal.name}</span>
              {terminals.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTerminal(terminal.id);
                  }}
                  className="hover:bg-white/10 rounded p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleNewTerminal}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="New Terminal"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => activeTerminal && clearTerminal(activeTerminal)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Clear Terminal"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-3 text-[13px] leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {currentTerminal?.output.length === 0 ? (
          <div className="text-gray-500 select-none">
            <p>Terminal {currentTerminal.name}</p>
            <p className="text-xs mt-1">Type 'help' for available commands</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {currentTerminal?.output.map((line, index) => (
              <div
                key={index}
                className={`${
                  line.startsWith('$') 
                    ? 'text-green-400 font-semibold' 
                    : line.toLowerCase().includes('error') || line.toLowerCase().includes('failed')
                    ? 'text-red-400'
                    : line.toLowerCase().includes('warning')
                    ? 'text-yellow-400'
                    : line.toLowerCase().includes('success') || line.toLowerCase().includes('building')
                    ? 'text-green-400'
                    : 'text-gray-300'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Command Input */}
      <form onSubmit={handleSubmit} className="border-t border-[#3e3e42] bg-[#1e1e1e] p-3">
        {workingDirectory && (
          <div className="text-[11px] text-gray-500 mb-1">
            {workingDirectory}
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-green-400 select-none">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isExecuting}
            placeholder={isExecuting ? "Executing..." : "Type a command..."}
            className="flex-1 bg-transparent text-gray-200 outline-none placeholder-gray-600 caret-green-400"
            autoFocus
            spellCheck={false}
          />
          {isExecuting && (
            <div className="flex items-center gap-2 text-xs text-yellow-400">
              <div className="animate-spin h-3 w-3 border-2 border-yellow-400 border-t-transparent rounded-full" />
              Running
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Terminal;
