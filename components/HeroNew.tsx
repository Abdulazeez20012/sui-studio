import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Video, Code, Users, ArrowRight, Play, Download, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../src/store/authStore';
import AuthModal from '../src/components/auth/AuthModal';

const HeroNew: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/ide');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate('/ide');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-[#0B0F14] dark:via-[#0f1419] dark:to-[#0B0F14] transition-colors duration-300">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sui-cyan/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(77,162,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(77,162,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sui-cyan/10 border border-sui-cyan/30 rounded-full mb-8"
            >
              <span className="w-2 h-2 bg-sui-cyan rounded-full animate-pulse" />
              <span className="text-sui-cyan text-sm font-semibold">Now with Real-Time Video Collaboration</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight font-display">
              <span className="text-gray-900 dark:text-white">Build the</span>
              <br />
              <span className="bg-gradient-to-r from-[#4DA8FF] via-[#6FB6FF] to-[#00D4FF] bg-clip-text text-transparent animate-pulse-slow">
                Future of Web3
              </span>
              <br />
              <span className="text-sui-cyan">Together</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl font-sans">
              The first Web3 IDE with built-in video collaboration, real-time code sharing, and everything you need to build on Sui—all in your browser.
            </p>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sui-cyan/10 rounded-lg flex items-center justify-center border border-sui-cyan/30">
                  <Video className="w-5 h-5 text-sui-cyan" />
                </div>
                <span className="text-white font-medium">HD Video Calls</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6FB6FF]/10 rounded-lg flex items-center justify-center border border-[#6FB6FF]/30">
                  <Code className="w-5 h-5 text-[#6FB6FF]" />
                </div>
                <span className="text-white font-medium">Real-Time Coding</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4DA8FF]/10 rounded-lg flex items-center justify-center border border-[#4DA8FF]/30">
                  <Users className="w-5 h-5 text-[#4DA8FF]" />
                </div>
                <span className="text-white font-medium">Team Collaboration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00D4FF]/10 rounded-lg flex items-center justify-center border border-[#00D4FF]/30">
                  <Rocket className="w-5 h-5 text-[#00D4FF]" />
                </div>
                <span className="text-white font-medium">One-Click Deploy</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGetStarted}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-sui-cyan to-blue-500 text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(77,162,255,0.5)] transition-all duration-300 hover:scale-105"
              >
                <span className="text-lg">Start Building Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>


              {/* Download Button with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  onBlur={() => setTimeout(() => setShowDownloadMenu(false), 200)}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <Download className="w-5 h-5" />
                  <span className="text-lg">Download</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDownloadMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showDownloadMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-dark-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 animate-fade-in">
                    <a
                      href="https://github.com/Abdulazeez20012/sui-studio/releases/download/v1.0.0/Sui-Studio-Linux-1.0.0.AppImage"
                      download
                      className="flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-all duration-200 border-b border-white/5"
                      onClick={() => setShowDownloadMenu(false)}
                    >
                      <div className="w-10 h-10 bg-sui-cyan/10 rounded-lg flex items-center justify-center border border-sui-cyan/30">
                        <svg className="w-5 h-5 text-sui-cyan" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white font-semibold">Download for Linux</div>
                        <div className="text-xs text-gray-400">AppImage • v1.0.0</div>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-sui-cyan" />
                    </a>

                    <a
                      href="https://github.com/Abdulazeez20012/sui-studio/releases/download/v1.0.0/Sui-Studio-1.0.0-Windows-Portable.zip"
                      download
                      className="flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-all duration-200"
                      onClick={() => setShowDownloadMenu(false)}
                    >
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white font-semibold">Download for Windows</div>
                        <div className="text-xs text-gray-400">Portable ZIP • v1.0.0</div>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Signals */}
            <div className="mt-10 flex items-center gap-6 text-sm text-sui-cyan">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-sui-cyan" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">No installation required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-sui-cyan" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-sui-cyan" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Deploy in seconds</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* IDE Preview with Video Call */}
            <div className="relative bg-dark-surface border border-sui-cyan/30 rounded-2xl overflow-hidden shadow-2xl">
              {/* Window Controls */}
              <div className="flex items-center gap-2 px-4 py-3 bg-dark-bg border-b border-dark-border">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center text-xs text-slate-400 font-mono">
                  Sui Studio - Building together
                </div>
              </div>

              {/* IDE Content */}
              <div className="p-6 bg-dark-bg">
                {/* Code Editor Preview */}
                <div className="bg-black/50 rounded-lg p-4 mb-4 font-mono text-sm">
                  <div className="text-purple-400">module</div>
                  <div className="text-blue-400 ml-4">nft::collection</div>
                  <div className="text-slate-500 ml-4">{'{'}</div>
                  <div className="text-green-400 ml-8">// Building NFT collection...</div>
                  <div className="text-slate-500 ml-4">{'}'}</div>
                </div>

                {/* Video Call Preview */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative bg-gradient-to-br from-sui-cyan/20 to-blue-500/20 rounded-lg aspect-video flex items-center justify-center border border-sui-cyan/30">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-sui-cyan/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl">👨‍💻</span>
                      </div>
                      <div className="text-xs text-white font-semibold">You</div>
                    </div>
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <div className="w-6 h-6 bg-black/70 rounded flex items-center justify-center">
                        <Video className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg aspect-video flex items-center justify-center border border-purple-500/30">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl">👩‍💻</span>
                      </div>
                      <div className="text-xs text-white font-semibold">Teammate</div>
                    </div>
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <div className="w-6 h-6 bg-black/70 rounded flex items-center justify-center">
                        <Video className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-dark-bg border-t border-dark-border text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-slate-400">Connected</span>
                  </div>
                  <div className="text-slate-500">2 developers online</div>
                </div>
                <div className="text-sui-cyan">Sui Testnet</div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-gradient-to-br from-sui-cyan to-blue-500 rounded-2xl p-4 shadow-2xl"
            >
              <div className="text-black font-bold text-sm">✓ Build Success</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 shadow-2xl"
            >
              <div className="text-white font-bold text-sm">🎥 Video Active</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </section>
  );
};

export default HeroNew;
