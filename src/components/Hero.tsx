

import React, { useState } from 'react';
import { ArrowRight, Play, Download, ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

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

                    {/* Download Button with Dropdown */}
                    <div className="relative w-full sm:w-auto">
                        <button
                            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                            onBlur={() => setTimeout(() => setShowDownloadMenu(false), 200)}
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            <Download className="w-4 h-4" />
                            Download
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDownloadMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {showDownloadMenu && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 animate-fade-in min-w-[280px]">
                                <a
                                    href="https://github.com/Abdulazeez20012/sui-studio/releases/download/v1.0.0/Sui-Studio-Linux-1.0.0.AppImage"
                                    download
                                    className="flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-all duration-200 border-b border-white/5 group"
                                    onClick={() => setShowDownloadMenu(false)}
                                >
                                    <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
                                        <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="text-white font-semibold text-sm">Download for Linux</div>
                                        <div className="text-xs text-gray-400">AppImage • v1.0.0</div>
                                    </div>
                                    <Download className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                                </a>

                                <a
                                    href="https://github.com/Abdulazeez20012/sui-studio/releases/download/v1.0.0/Sui-Studio-1.0.0-Windows-Portable.zip"
                                    download
                                    className="flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-all duration-200 group"
                                    onClick={() => setShowDownloadMenu(false)}
                                >
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30 flex-shrink-0">
                                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="text-white font-semibold text-sm">Download for Windows</div>
                                        <div className="text-xs text-gray-400">Portable ZIP • v1.0.0</div>
                                    </div>
                                    <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                                </a>
                            </div>
                        )}
                    </div>
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
