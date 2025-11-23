import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Plus, ChevronDown, CheckCircle, Play, Send } from 'lucide-react';
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

      {/* Test Results Area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sui-cyan/30 scrollbar-track-transparent p-4 font-mono text-sm"
      >
        {/* Test Cases */}
        <div className="space-y-3">
          <div className="bg-dark-panel rounded-lg p-4 border border-sui-cyan/20 hover:border-sui-cyan/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold font-tech">Test 1</h3>
              <button className="text-slate-500 hover:text-sui-cyan transition-colors">
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <div className="text-slate-400">
                <span className="text-sui-cyan font-semibold">Input:</span> a: [2, 4, 7]
              </div>
              <div className="text-slate-400">
                <span className="text-neon-green font-semibold">Expected Output:</span> 4
              </div>
            </div>
          </div>

          <div className="bg-dark-panel rounded-lg p-4 border border-sui-cyan/20 hover:border-sui-cyan/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold font-tech">Test 2</h3>
              <button className="text-slate-500 hover:text-sui-cyan transition-colors">
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="text-sm text-slate-400">
              Test case details...
            </div>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="mt-4 space-y-1">
          {currentTerminal?.output.map((line, index) => (
            <div key={index} className="text-slate-400">
              {line}
            </div>
          ))}
        </div>
      </div>

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
