
import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero: React.FC = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Content Container */}
            <div className="container mx-auto px-6 relative z-10 text-center">

                {/* Mainnet Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in-up">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Mainnet</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1] max-w-5xl mx-auto animate-fade-in-up delay-100">
                    The Unified <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CA2FF] to-[#00E0FF]">Development</span> <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#9F7AEA]">Platform for Sui</span>
                </h1>

                {/* Subtext */}
                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                    From first exploration to enterprise deployment. Experience the power of a hybrid environment that adapts to your workflow.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                    <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2 group">
                        Start building for free
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group">
                        <Play className="w-4 h-4 fill-white" />
                        View demo
                    </button>
                </div>

                {/* Optional: Floating Code Snippet / Visual based on design */}
                <div className="mt-20 relative mx-auto max-w-5xl glass-card rounded-xl border border-white/10 p-1 overflow-hidden animate-fade-in-up delay-500">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    <div className="bg-[#0A0A0A] rounded-lg p-4 md:p-8">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                                <span className="text-green-500">● Ready</span>
                                <span>defi_protocol::amm</span>
                            </div>
                        </div>
                        {/* Placeholder for code content - can be replaced with real image or code */}
                        <div className="space-y-2 font-mono text-sm text-left opacity-60">
                            <div className="flex gap-4"><span className="text-gray-600">1</span> <span className="text-purple-400">module</span> <span className="text-blue-400">defi::amm</span> <span>{'{'}</span></div>
                            <div className="flex gap-4"><span className="text-gray-600">2</span> <span className="pl-4 text-gray-400">// Unified development environment active</span></div>
                            <div className="flex gap-4"><span className="text-gray-600">3</span> <span className="pl-4 text-purple-400">public fun</span> <span className="text-yellow-400">swap</span>(coin_x: Coin&lt;X&gt;, coin_y: Coin&lt;Y&gt;) <span>{'{'}</span></div>
                            <div className="flex gap-4"><span className="text-gray-600">4</span> <span className="pl-8 text-gray-400">...</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
