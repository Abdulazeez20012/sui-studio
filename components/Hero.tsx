import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ChevronRight, Play, Command, CheckCircle2, Copy, Terminal, Star, Download, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';

import { useAuthStore } from '../src/store/authStore';
import AuthModal from '../src/components/auth/AuthModal';
import { StaggerContainer, FoldInOut, ScaleReveal, FadeUp } from '../src/lib/animations';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax & Fade effects
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Mouse interactive 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      x.set(mouseX / width - 0.5);
      y.set(mouseY / height - 0.5);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleStartBuilding = () => {
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
    <section className="pt-32 pb-32 min-h-[110vh] flex items-center justify-center overflow-hidden relative perspective-[2000px] w-full" id="hero">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 flex flex-col items-center text-center max-w-6xl mx-auto px-4"
      >
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 group cursor-pointer"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-surface border border-border backdrop-blur-md hover:bg-surface/80 hover:border-brand/30 transition-all duration-300 shadow-[0_0_20px_-10px_rgba(60,185,255,0.2)]">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 border border-panel" />
              ))}
            </div>
            <span className="text-xs font-medium text-content-muted flex items-center gap-1">
              Trusted by <span className="text-content font-bold">1,000+</span> developers
              <ChevronRight className="w-3 h-3 text-content-muted group-hover:text-content transition-colors" />
            </span>
          </div>
        </motion.div>

        {/* Main Headlines */}
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="font-sans font-medium text-5xl md:text-8xl lg:text-9xl tracking-tighter text-content mb-8 leading-[0.95] max-w-6xl mx-auto"
        >
          The Unified <br className="hidden md:block" />
          <span className="text-content drop-shadow-2xl">
            Development Platform
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-content-muted mb-10 max-w-2xl leading-relaxed font-light"
        >
          From first exploration to enterprise deployment. Experience the power of a hybrid environment that adapts to your workflow.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <button
            className="group min-w-[200px] px-8 py-4 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-semibold text-lg hover:bg-slate-800 dark:hover:bg-gray-100 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 flex items-center justify-center gap-2"
            onClick={handleStartBuilding}
          >
            {isAuthenticated ? 'Open IDE' : 'Start Building'}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          {/* Download Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              onBlur={() => setTimeout(() => setShowDownloadMenu(false), 200)}
              className="group min-w-[180px] px-8 py-4 rounded-full bg-surface/80 border border-border text-content font-medium text-lg hover:bg-surface transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDownloadMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDownloadMenu && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-surface/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in min-w-[300px]">
                <a
                  href="https://github.com/Abdulazeez20012/sui-studio/releases/download/v1.0.0/Sui-Studio-Linux-1.0.0.AppImage"
                  download
                  className="flex items-center gap-3 px-6 py-4 hover:bg-white/5 dark:hover:bg-white/5 transition-all duration-200 border-b border-border group"
                  onClick={() => setShowDownloadMenu(false)}
                >
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
                    <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-content font-semibold text-sm">Download for Linux</div>
                    <div className="text-xs text-content-muted">AppImage • v1.0.0</div>
                  </div>
                  <Download className="w-4 h-4 text-content-muted group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                </a>

                <a
                  href="https://github.com/Abdulazeez20012/sui-studio/releases/download/v1.0.0/Sui-Studio-1.0.0-Windows-Portable.zip"
                  download
                  className="flex items-center gap-3 px-6 py-4 hover:bg-white/5 dark:hover:bg-white/5 transition-all duration-200 group"
                  onClick={() => setShowDownloadMenu(false)}
                >
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30 flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-content font-semibold text-sm">Download for Windows</div>
                    <div className="text-xs text-content-muted">Portable ZIP • v1.0.0</div>
                  </div>
                  <Download className="w-4 h-4 text-content-muted group-hover:text-blue-400 transition-colors flex-shrink-0" />
                </a>
              </div>
            )}
          </div>
        </motion.div>

        {/* Floating IDE Mockup */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            perspective: 1000,
            transformStyle: "preserve-3d"
          }}
          initial={{ opacity: 0, scale: 0.9, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, type: "spring", bounce: 0.2 }}
          className="relative w-full max-w-5xl z-20"
        >
          {/* Glow Behind Mockup - Intensified */}
          <div className="absolute inset-0 bg-gradient-to-t from-sui-cyan/30 via-sui-indigo/20 to-transparent blur-3xl -z-10 transform translate-y-10 opacity-70" />

          <InteractiveIDEMock />

        </motion.div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </section>
  );
};

// Interactive Sub-Component to keep Hero clean
const InteractiveIDEMock = () => {
  const [code, setCode] = useState('');
  const [deployState, setDeployState] = useState<'idle' | 'signing' | 'deploying' | 'success'>('idle');
  const [gas, setGas] = useState(0.01);

  const fullCode = `module defi::amm_pool {
  use sui::object::{UID};
  use sui::coin::{Coin};

  /// The liquidity pool struct tracking reserves
  public struct Pool<phantom A, phantom B> has key {
    id: UID,
    reserve_a: Coin<A>,
    reserve_b: Coin<B>,
  }

  fun init(ctx: &mut TxContext) {
    // Initialize AMM Pool
  }
}`;

  // Typing Effect
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setCode(fullCode.slice(0, i));
      i++;
      if (i > fullCode.length) clearInterval(timer);
    }, 30); // Speed of typing
    return () => clearInterval(timer);
  }, []);

  const handleDeploy = () => {
    if (deployState !== 'idle') return;
    setDeployState('signing');
    setTimeout(() => setDeployState('deploying'), 1500);
    setTimeout(() => setDeployState('success'), 4500);
    setTimeout(() => setDeployState('idle'), 8000);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0B0F14]/90 backdrop-blur-xl shadow-2xl shadow-black/50 ring-1 ring-white/5 font-mono text-sm leading-6 text-left">
      {/* Window Header */}
      <div className="h-10 bg-[#151a21] flex items-center justify-between px-4 border-b border-white/5 select-none">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10 hover:brightness-110 transition-all cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10 hover:brightness-110 transition-all cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10 hover:brightness-110 transition-all cursor-pointer" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-black/40 border border-white/5 text-xs text-slate-400 font-mono shadow-inner">
          <Terminal className="w-3 h-3 text-sui-cyan" />
          <span>defi_protocol::amm</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${deployState === 'success' ? 'text-green-400' :
            deployState === 'idle' ? 'text-slate-500' : 'text-sui-cyan'
            }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${deployState === 'success' ? 'bg-green-500' :
              deployState === 'idle' ? 'bg-slate-600' : 'bg-sui-cyan animate-pulse'
              }`} />
            {deployState === 'idle' ? 'Idle' :
              deployState === 'signing' ? 'Signing...' :
                deployState === 'deploying' ? 'Deploying...' : 'Live'}
          </div>
        </div>
      </div>

      {/* Code Content & Panel */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] h-[340px]">
        {/* Editor Area */}
        <div className="p-6 bg-[#0B0F14]/80 overflow-auto custom-scrollbar relative">
          <pre className="font-mono text-sm leading-6">
            <code dangerouslySetInnerHTML={{
              __html: code
                .replace(/module|use|public|struct|has|fun/g, '<span class="text-purple-400">$&</span>')
                .replace(/sui::object|sui::coin|UID|Coin|TxContext|Pool/g, '<span class="text-yellow-200">$&</span>')
                .replace(/phantom|u64|address/g, '<span class="text-orange-300">$&</span>')
                .replace(/\/\/.*/g, '<span class="text-slate-500">$&</span>')
                .replace(/init/g, '<span class="text-blue-400">$&</span>')
            }} />
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2.5 h-4 bg-sui-cyan ml-1 align-middle"
            />
          </pre>
        </div>

        {/* Right Panel - Environment */}
        <div className="hidden md:flex flex-col border-l border-white/5 bg-[#12171D]/90 p-5 backdrop-blur-md">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Star className="w-3 h-3 text-sui-cyan" />
            Environment
          </div>

          <div className="space-y-4">
            {/* Gas Slider */}
            <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3 group hover:border-white/10 transition-colors">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Gas Budget</span>
                <span className="text-sui-cyan font-mono">{gas} SUI</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.1"
                step="0.001"
                value={gas}
                onChange={(e) => setGas(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sui-cyan"
              />
            </div>

            {/* Network Status */}
            <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-2 group hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
                </div>
                <span>Mainnet Fork</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate bg-black/40 p-1.5 rounded border border-white/5">
                {deployState === 'success' ? 'tx_928...3f1 (Confirmed)' : 'block_892910...a2c'}
              </div>
            </div>

            {/* Deploy Button */}
            <div className="mt-auto pt-6">
              <button
                onClick={handleDeploy}
                disabled={deployState !== 'idle'}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${deployState === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                  deployState !== 'idle' ? 'bg-sui-cyan/10 text-sui-cyan border border-sui-cyan/30 cursor-wait' :
                    'bg-sui-cyan text-black hover:bg-sui-blue transform hover:-translate-y-1 shadow-lg shadow-sui-cyan/20'
                  }`}
              >
                {deployState === 'idle' && <><Play className="w-3 h-3 fill-current" /> Deploy Module</>}
                {deployState === 'signing' && <span className="animate-pulse">Signing...</span>}
                {deployState === 'deploying' && <span className="animate-pulse">Deploying...</span>}
                {deployState === 'success' && <><CheckCircle2 className="w-3 h-3" /> Deployed</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
