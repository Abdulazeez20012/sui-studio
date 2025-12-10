import React, { useState } from 'react';
import { Send, Bot, Sparkles, Zap, Code, BookOpen, ArrowRight } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';

const NexiHome: React.FC = () => {
    const [input, setInput] = useState('');
    const { addTab, setActiveTab } = useIDEStore();

    // Mock function to simulate starting a chat or action
    const { setRightPanelType, toggleRightPanel, rightPanelOpen } = useIDEStore();

    const handleAction = (action: string) => {
        if (action === 'Generate Move Module' || action === 'Generate API') {
            document.dispatchEvent(new CustomEvent('ide:newProject'));
        } else if (action === 'Debug Code' || action === 'Debug Transaction') {
            setRightPanelType('nexi');
            if (!rightPanelOpen) toggleRightPanel();
            // Ideally we'd pass a context or initial message to Nexi here
        } else if (action === 'Explain Docs' || action === 'Sui Documentation') {
            setRightPanelType('docs'); // Assuming docs panel exists or fallback to Nexi
            if (!rightPanelOpen) toggleRightPanel();
        } else {
            // Treat as chat input
            setRightPanelType('nexi');
            if (!rightPanelOpen) toggleRightPanel();
            // In a perfect world we pass the 'action' string as the initial chat prompt
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input.trim()) {
            handleAction(input);
        }
    };

    return (
        <div className="flex-1 h-full bg-walrus-dark-950 flex flex-col items-center justify-center relative overflow-hidden p-6">
            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-walrus-cyan/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-walrus-purple/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Content */}
            <div className="z-10 w-full max-w-3xl flex flex-col items-center text-center space-y-10">

                {/* Logo / Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-walrus-cyan to-walrus-purple rounded-2xl flex items-center justify-center shadow-neon mb-4 animate-fade-in">
                    <Bot size={40} className="text-black" />
                </div>

                {/* Hero Text */}
                <div className="space-y-4 animate-fade-in delay-100">
                    <h1 className="text-5xl font-bold text-white tracking-tight">
                        Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-walrus-cyan to-walrus-purple">Sui</span>.
                        <br />
                        Designed to assist.
                    </h1>
                    <p className="text-lg text-gray-400 max-w-xl mx-auto">
                        Your intelligent companion for building scalable decentralized applications.
                        Start chatting or choose a quick action.
                    </p>
                    
                    {/* Quick Start for Desktop */}
                    {typeof window !== 'undefined' && (window as any).electron?.isElectron && (
                        <div className="mt-6 p-4 bg-walrus-cyan/5 border border-walrus-cyan/20 rounded-xl max-w-md mx-auto">
                            <p className="text-sm text-walrus-cyan font-bold mb-2">🚀 Quick Start</p>
                            <p className="text-xs text-gray-400">
                                Click <span className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">Open</span> in the header to load your Sui Move project
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full animate-fade-in delay-200">
                    <button
                        onClick={() => handleAction('Generate API')}
                        className="group p-4 bg-walrus-dark-900/50 hover:bg-walrus-dark-800 border border-white/5 hover:border-walrus-cyan/30 rounded-xl transition-all text-left flex flex-col gap-3 backdrop-blur-sm"
                    >
                        <div className="w-8 h-8 rounded-lg bg-walrus-cyan/10 flex items-center justify-center text-walrus-cyan group-hover:scale-110 transition-transform">
                            <Zap size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-200 group-hover:text-walrus-cyan transition-colors">Generate Move Module</h3>
                            <p className="text-xs text-gray-500 mt-1">Create a new smart contract from scratch</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleAction('Debug Code')}
                        className="group p-4 bg-walrus-dark-900/50 hover:bg-walrus-dark-800 border border-white/5 hover:border-walrus-purple/30 rounded-xl transition-all text-left flex flex-col gap-3 backdrop-blur-sm"
                    >
                        <div className="w-8 h-8 rounded-lg bg-walrus-purple/10 flex items-center justify-center text-walrus-purple group-hover:scale-110 transition-transform">
                            <Code size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-200 group-hover:text-walrus-purple transition-colors">Debug Transaction</h3>
                            <p className="text-xs text-gray-500 mt-1">Analyze failure reasons and fix errors</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleAction('Explain Docs')}
                        className="group p-4 bg-walrus-dark-900/50 hover:bg-walrus-dark-800 border border-white/5 hover:border-pink-500/30 rounded-xl transition-all text-left flex flex-col gap-3 backdrop-blur-sm"
                    >
                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                            <BookOpen size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-200 group-hover:text-pink-500 transition-colors">Sui Documentation</h3>
                            <p className="text-xs text-gray-500 mt-1">Search concepts and examples</p>
                        </div>
                    </button>
                </div>

                {/* Input Bar */}
                <div className="w-full max-w-2xl relative animate-fade-in delay-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-walrus-cyan/20 to-walrus-purple/20 rounded-2xl blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="bg-walrus-dark-900 rounded-2xl border border-white/10 hover:border-walrus-cyan/50 transition-all shadow-premium flex items-center p-2 pl-4 cursor-text" onClick={() => document.getElementById('nexi-home-input')?.focus()}>
                        <Sparkles className="text-walrus-cyan mr-3" size={20} />
                        <input
                            id="nexi-home-input"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask Nexi anything..."
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-lg py-2"
                            autoFocus
                        />
                        <button
                            onClick={() => handleAction(input)}
                            className={`p-2 rounded-xl transition-all ${input.trim() ? 'bg-walrus-cyan text-black hover:bg-walrus-cyan/90' : 'bg-white/5 text-gray-500 cursor-default'}`}
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500 font-medium">
                        <button className="flex items-center gap-1 hover:text-white transition-colors"><div className="w-1.5 h-1.5 rounded-full bg-walrus-cyan"></div> Tools</button>
                        <button className="flex items-center gap-1 hover:text-white transition-colors"><div className="w-1.5 h-1.5 rounded-full bg-walrus-purple"></div> Search</button>
                        <p className="opacity-50">Nexi v1.3</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NexiHome;
