import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Plus, ChevronDown, CheckCircle, Play, Send, Trash2 } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';
import { apiService } from '../../services/apiService';

const Terminal: React.FC = () => {
  const { terminals, activeTerminal, setActiveTerminal, addTerminalOutput, addTerminal, clearTerminal } = useIDEStore();
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentTerminal = terminals.find(t => t.id === activeTerminal);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [currentTerminal?.output]);

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
        addTerminalOutput(activeTerminal, '  sui move build    - Build the current Move package');
        addTerminalOutput(activeTerminal, '  sui move test     - Run Move tests');
        addTerminalOutput(activeTerminal, '  sui client        - Sui client commands');
        addTerminalOutput(activeTerminal, '  clear             - Clear terminal');
        addTerminalOutput(activeTerminal, '  help              - Show this help message');
        setIsExecuting(false);
        return;
      }

      // Execute command via backend
      const result = await apiService.executeCommand(command);

      if (result.success) {
        // Add output line by line
        const lines = result.output.split('\n');
        lines.forEach(line => {
          if (line.trim()) {
            addTerminalOutput(activeTerminal, line);
          }
        });
      } else {
        addTerminalOutput(activeTerminal, `Error: ${result.error}`);
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
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
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
  };

  const handleNewTerminal = () => {
    const newTerminal = {
      id: `terminal-${Date.now()}`,
      name: `Terminal ${terminals.length + 1}`,
      output: ['$ ']
    };
    addTerminal(newTerminal);
  };

  return (
    <div className="h-full bg-walrus-dark-900/50 flex flex-col font-mono relative group">
      {/* Tab Bar - Glass Style */}
      <div className="flex items-center justify-between px-4 py-0 border-b border-white/5 bg-black/20 shrink-0 select-none">
        <div className="flex items-center gap-1 pt-2">
          <button className="px-4 py-2 text-[10px] font-bold text-walrus-cyan border-t-2 border-walrus-cyan bg-walrus-cyan/5 rounded-t-lg tracking-widest transition-all shadow-[0_-10px_20px_-10px_rgba(60,185,255,0.1)]">
            TERMINAL
          </button>
          <button className="px-4 py-2 text-[10px] font-bold text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-t-lg transition-all tracking-widest border-t-2 border-transparent">
            OUTPUT
          </button>
          <button className="px-4 py-2 text-[10px] font-bold text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-t-lg transition-all tracking-widest border-t-2 border-transparent">
            PROBLEMS
          </button>
        </div>
        <div className="flex items-center gap-1 mb-1">
          <button
            onClick={handleNewTerminal}
            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="New Terminal"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => clearTerminal(activeTerminal!)}
            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="Clear Terminal"
          >
            <Trash2 size={14} />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-4 text-xs font-medium leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {currentTerminal?.output.length === 0 ? (
          <div className="text-gray-600 select-none flex flex-col items-center justify-center h-full opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <TerminalIcon size={32} strokeWidth={1.5} />
            </div>
            <p className="font-tech tracking-widest text-[10px] uppercase">Sui Studio Terminal v2.0</p>
            <p className="mt-2 text-[10px] text-gray-500">Interact with Move CLI directly from your browser</p>
          </div>
        ) : (
          <div className="space-y-1">
            {currentTerminal?.output.map((line, index) => (
              <div
                key={index}
                className={`${line.startsWith('$') ? 'text-walrus-cyan font-bold mt-4 mb-2 flex items-center gap-2' :
                  line.includes('Error') || line.includes('error') || line.includes('Failed') ? 'text-red-400 bg-red-500/5 -mx-4 px-4 py-0.5 border-l-2 border-red-500/50' :
                    line.includes('Success') || line.includes('BUILDING') ? 'text-emerald-400' :
                      line.includes('warning') ? 'text-yellow-400' :
                        'text-gray-400'
                  }`}
              >
                {line.startsWith('$') ? (
                  <>
                    <span className="text-walrus-purple opacity-70 w-3">➜</span>
                    {line.substring(2)}
                  </>
                ) : line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Command Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 bg-black/20 border-t border-white/5 flex items-center gap-3 shrink-0 backdrop-blur-sm">
        <span className="text-walrus-cyan font-bold select-none text-sm animate-pulse">➜</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isExecuting}
          placeholder={isExecuting ? "Executing..." : "Enter command..."}
          className="flex-1 bg-transparent text-gray-200 outline-none text-xs font-mono placeholder-gray-700 font-medium caret-walrus-cyan"
          autoFocus
          spellCheck={false}
        />
        {isExecuting && (
          <div className="flex items-center gap-2 px-2 py-1 bg-walrus-cyan/10 rounded text-[10px] font-bold text-walrus-cyan uppercase tracking-wider">
            <div className="animate-spin h-3 w-3 border-2 border-walrus-cyan border-t-transparent rounded-full" />
            Running
          </div>
        )}
      </form>
    </div>
  );
};

export default Terminal;
