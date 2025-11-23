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
    <div className="h-full bg-[#252b3b] flex flex-col">
      {/* Tab Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50 bg-[#2d3748]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <button className="px-4 py-1.5 text-sm font-medium text-white bg-[#252b3b] rounded-t border-b-2 border-cyan-400">
              TESTS
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/30 rounded-t">
              CONSOLE
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewTerminal}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/30 rounded"
            title="New Terminal"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Test Results Area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent p-4 font-mono text-sm"
      >
        {/* Test Cases */}
        <div className="space-y-3">
          <div className="bg-[#2d3748] rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Test 1</h3>
              <button className="text-slate-400 hover:text-white">
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <div className="text-slate-400">
                <span className="text-blue-400">Input:</span> a: [2, 4, 7]
              </div>
              <div className="text-slate-400">
                <span className="text-blue-400">Expected Output:</span> 4
              </div>
            </div>
          </div>

          <div className="bg-[#2d3748] rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Test 2</h3>
              <button className="text-slate-400 hover:text-white">
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
            <div key={index} className="text-slate-300">
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t border-slate-700/50 px-4 py-2 bg-[#2d3748] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle size={16} />
            <span className="text-sm font-semibold">300/300</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors">
            <Play size={14} />
            <span>RUN TEST</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors">
            <Send size={14} />
            <span>SUBMIT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
