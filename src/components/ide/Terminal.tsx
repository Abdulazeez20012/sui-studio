import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Plus, ChevronDown, CheckCircle, Play, Send } from 'lucide-react';
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
    <div className="h-full bg-dark-surface flex flex-col">
      {/* Tab Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-sui-cyan/20 bg-dark-header relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sui-cyan/30 to-transparent"></div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <button className="px-4 py-1.5 text-sm font-bold text-sui-cyan bg-dark-surface rounded-t border-b-2 border-sui-cyan shadow-neon font-tech tracking-wider">
              TESTS
            </button>
            <button className="px-4 py-1.5 text-sm font-bold text-slate-500 hover:text-sui-cyan hover:bg-sui-cyan/5 rounded-t transition-all font-tech tracking-wider">
              CONSOLE
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewTerminal}
            className="p-1.5 text-slate-500 hover:text-sui-cyan hover:bg-sui-cyan/10 rounded transition-all"
            title="New Terminal"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sui-cyan/30 scrollbar-track-transparent p-4 font-mono text-sm bg-[#0a0e13]"
        onClick={() => inputRef.current?.focus()}
      >
        {currentTerminal?.output.length === 0 ? (
          <div className="text-slate-500">
            <p>Sui Studio Terminal v1.0</p>
            <p className="mt-2">Type 'help' for available commands</p>
            <p className="mt-1">Type 'sui move build' to build your Move package</p>
            <p className="mt-1">Type 'sui move test' to run tests</p>
          </div>
        ) : (
          <div className="space-y-1">
            {currentTerminal?.output.map((line, index) => (
              <div 
                key={index} 
                className={`${
                  line.startsWith('$') ? 'text-sui-cyan font-bold' :
                  line.includes('Error') || line.includes('error') ? 'text-neon-pink' :
                  line.includes('Success') || line.includes('BUILDING') ? 'text-neon-green' :
                  'text-slate-300'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Command Input */}
      <form onSubmit={handleSubmit} className="border-t border-sui-cyan/20 px-4 py-3 bg-dark-header flex items-center gap-2">
        <span className="text-sui-cyan font-bold">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isExecuting}
          placeholder={isExecuting ? "Executing..." : "Enter command..."}
          className="flex-1 bg-transparent text-white outline-none font-mono text-sm disabled:opacity-50"
          autoFocus
        />
        {isExecuting && (
          <div className="animate-spin h-4 w-4 border-2 border-sui-cyan border-t-transparent rounded-full" />
        )}
      </form>

      {/* Bottom Status Bar */}
      <div className="border-t border-sui-cyan/20 px-4 py-3 bg-dark-header flex items-center justify-between relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sui-cyan/30 to-transparent"></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-neon-green">
            <CheckCircle size={16} className="animate-pulse" />
            <span className="text-sm font-bold">300/300</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-panel hover:bg-sui-cyan/10 border border-sui-cyan/30 hover:border-sui-cyan text-slate-300 hover:text-sui-cyan rounded-lg text-sm font-bold transition-all shadow-neon font-tech tracking-wider">
            <Play size={14} />
            <span>RUN TEST</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-neon hover:shadow-neon-lg text-black rounded-lg text-sm font-bold transition-all font-tech tracking-wider">
            <Send size={14} />
            <span>SUBMIT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
