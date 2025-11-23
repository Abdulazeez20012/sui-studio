import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Plus } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';

const Terminal: React.FC = () => {
  const { terminals, activeTerminal, setActiveTerminal, addTerminalOutput, addTerminal } = useIDEStore();
  const [input, setInput] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);

  const currentTerminal = terminals.find(t => t.id === activeTerminal);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [currentTerminal?.output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeTerminal) return;

    addTerminalOutput(activeTerminal, `$ ${input}`);
    
    // Simulate command execution
    setTimeout(() => {
      if (input === 'clear') {
        // Clear terminal logic would go here
      } else {
        addTerminalOutput(activeTerminal, `Command executed: ${input}`);
      }
      addTerminalOutput(activeTerminal, '$ ');
    }, 100);

    setInput('');
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
      <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} className="text-slate-400" />
          <div className="flex gap-1">
            {terminals.map((terminal) => (
              <button
                key={terminal.id}
                onClick={() => setActiveTerminal(terminal.id)}
                className={`px-3 py-1 text-sm rounded ${
                  activeTerminal === terminal.id
                    ? 'bg-dark-bg text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {terminal.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewTerminal}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded"
            title="New Terminal"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto scrollbar-thin p-4 font-mono text-sm relative"
      >
        {/* Sui Logo Watermark */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            opacity: 0.03,
            zIndex: 0,
          }}
        >
          <img 
            src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763580906/sui-sui-logo_gmux9g.png"
            alt="Sui Logo"
            className="w-64 h-64 object-contain"
            style={{
              filter: 'grayscale(100%) brightness(2)',
            }}
          />
        </div>

        {/* Terminal Output */}
        <div className="relative z-10">
          {currentTerminal?.output.map((line, index) => (
            <div key={index} className="text-slate-300">
              {line}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-dark-border p-2">
        <div className="flex items-center gap-2 px-2">
          <span className="text-sui-cyan font-mono">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white font-mono"
            placeholder="Type a command..."
            autoFocus
          />
        </div>
      </form>
    </div>
  );
};

export default Terminal;
