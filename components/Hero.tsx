
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ChevronRight, Play, Command, CheckCircle2, Copy, Terminal, Star } from 'lucide-react';
import Button from './ui/Button';
import Section from './ui/Section';

const Hero: React.FC = () => {
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

  // IDE Animation State
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileSuccess, setCompileSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsCompiling(true);
      setTimeout(() => {
        setIsCompiling(false);
        setCompileSuccess(true);
        setTimeout(() => setCompileSuccess(false), 2000);
      }, 1500);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Section className="pt-32 pb-20 min-h-[110vh] flex items-center justify-center overflow-hidden relative perspective-[2000px]" id="hero">
      {/* Abstract Background Layer */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden bg-[#0B0F14]">
        {/* Slush-style Gradient Orbs */}
        <motion.div 
          style={{ y: y1, opacity }} 
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-[conic-gradient(from_0deg_at_50%_50%,_#3CB9FF_0deg,_#6366F1_120deg,_#A855F7_240deg,_#3CB9FF_360deg)] opacity-20 blur-[120px] rounded-full mix-blend-screen animate-spin-slower" 
        />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-sui-cyan/10 rounded-full blur-[100px] animate-pulse-slow" />
        
        {/* Grid Overlay with Radial Mask */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
        <div className="absolute inset-0 grid-bg opacity-40" style={{ maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)' }} />
      </div>

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
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-sui-cyan/30 transition-all duration-300 shadow-[0_0_20px_-10px_rgba(60,185,255,0.2)]">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-[#0B0F14]" />
               ))}
            </div>
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
              Trusted by <span className="text-white font-bold">1,000+</span> developers
              <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
            </span>
          </div>
        </motion.div>

        {/* Main Headlines */}
        <motion.h1 
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-heading font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight text-white mb-6 leading-[1.1] max-w-5xl"
        >
          The Unified Development <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sui-cyan to-sui-indigo">
            Platform for Sui
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed font-light"
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
          <Button size="lg" variant="primary" className="group min-w-[180px] shadow-[0_0_30px_-5px_rgba(60,185,255,0.3)]">
            Start Building Free
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="group min-w-[160px] border-white/10 hover:bg-white/5">
            <Play className="w-4 h-4 mr-2 fill-current" />
            View Demo
          </Button>
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
          {/* Glow Behind Mockup */}
          <div className="absolute inset-0 bg-gradient-to-t from-sui-cyan/20 via-sui-indigo/10 to-transparent blur-3xl -z-10 transform translate-y-10 opacity-60" />

          <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0e1217]/80 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
            {/* Window Header */}
            <div className="h-10 bg-[#161b22]/90 flex items-center justify-between px-4 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-black/20 border border-white/5 text-xs text-slate-400 font-mono">
                <Terminal className="w-3 h-3" />
                <span>defi_protocol::amm</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${isCompiling ? 'text-yellow-400' : compileSuccess ? 'text-green-400' : 'text-slate-500'}`}>
                  {isCompiling ? (
                     <>
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                        Compiling...
                     </>
                  ) : compileSuccess ? (
                     <>
                        <CheckCircle2 className="w-3 h-3" />
                        Ready
                     </>
                  ) : (
                     <>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        Idle
                     </>
                  )}
                </div>
                <Copy className="w-3.5 h-3.5 text-slate-600 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Code Content */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px]">
               <div className="p-6 md:p-8 bg-[#0B0F14]/50 font-mono text-sm leading-7 overflow-x-auto text-left">
                  <div className="flex"><span className="w-8 text-slate-700 select-none">1</span><span className="text-purple-400">module</span> <span className="text-white">defi::amm_pool</span> <span className="text-slate-500">{'{'}</span></div>
                  <div className="flex"><span className="w-8 text-slate-700 select-none">2</span><span className="text-purple-400 ml-4">use</span> <span className="text-sui-cyan">sui::object</span><span className="text-slate-500">::{'{'}</span><span className="text-yellow-200">UID</span><span className="text-slate-500">{'}'};</span></div>
                  <div className="flex"><span className="w-8 text-slate-700 select-none">3</span><span className="text-purple-400 ml-4">use</span> <span className="text-sui-cyan">sui::coin</span><span className="text-slate-500">::{'{'}</span><span className="text-yellow-200">Coin</span><span className="text-slate-500">{'}'};</span></div>
                  <div className="flex"><span className="w-8 text-slate-700 select-none">4</span></div>
                  <div className="flex"><span className="w-8 text-slate-700 select-none">5</span><span className="text-slate-500 ml-4">/// The liquidity pool struct tracking reserves</span></div>
                  <div className="flex"><span className="w-8 text-slate-700 select-none">6</span><span className="text-purple-400 ml-4">public struct</span> <span className="text-yellow-200">Pool</span><span className="text-slate-300">&lt;</span><span className="text-orange-300">phantom</span> <span className="text-white">A</span>, <span className="text-orange-300">phantom</span> <span className="text-white">B</span><span className="text-slate-300">&gt;</span> <span className="text-purple-400">has</span> <span className="text-white">key</span> <span className="text-slate-500">{'{'}</span></div>
                  <div className="flex"><span className="w-8 text-slate-700 select-none">7</span><span className="text-white ml-8">id</span><span className="text-slate-500">:</span> <span className="text-yellow-200">UID</span><span className="text-slate-500">,</span></div>
                  <div className="flex"><span className="w-8 text-slate-700 select-none">8</span><span className="text-white ml-8">reserve_a</span><span className="text-slate-500">:</span> <span className="text-yellow-200">Coin</span><span className="text-slate-300">&lt;</span><span className="text-white">A</span><span className="text-slate-300">&gt;</span><span className="text-slate-500">,</span></div>
                  <div className="flex"><span className="w-8 text-slate-700 select-none">9</span><span className="text-white ml-8">reserve_b</span><span className="text-slate-500">:</span> <span className="text-yellow-200">Coin</span><span className="text-slate-300">&lt;</span><span className="text-white">B</span><span className="text-slate-300">&gt;</span><span className="text-slate-500">,</span></div>
                  <div className="flex"><span className="w-8 text-slate-700 select-none">10</span><span className="text-slate-500 ml-4">{'}'}</span></div>
                  <div className="flex"><span className="w-8 text-slate-700 select-none">11</span></div>
                  <div className="flex relative">
                     <span className="w-8 text-slate-700 select-none">12</span>
                     <span className="text-purple-400 ml-4">fun</span> <span className="text-blue-400">init</span><span className="text-slate-300">(ctx: &</span><span className="text-purple-400">mut</span> <span className="text-yellow-200">TxContext</span><span className="text-slate-300">)</span> <span className="text-slate-500">{'{'}</span>
                     {/* Cursor */}
                     <motion.div 
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="absolute left-[280px] top-1 w-2 h-5 bg-sui-cyan"
                     />
                  </div>
               </div>

               {/* Context Panel (Desktop) */}
               <div className="hidden md:flex flex-col border-l border-white/5 bg-[#12171D]/50 p-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">Environment</div>
                  
                  <div className="space-y-3">
                     <div className="p-3 rounded bg-white/5 border border-white/5">
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                           <span>Gas Budget</span>
                           <span className="text-sui-cyan">0.01 SUI</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full w-[30%] bg-sui-cyan rounded-full" />
                        </div>
                     </div>

                     <div className="p-3 rounded bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                           <div className={`w-2 h-2 rounded-full ${compileSuccess ? 'bg-green-500' : 'bg-slate-500'}`} />
                           <span>Mainnet Fork</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 truncate">
                           block_892910...a2c
                        </div>
                     </div>

                     <div className="mt-auto pt-4">
                        <Button size="sm" className="w-full text-xs py-2 bg-sui-cyan/10 text-sui-cyan border border-sui-cyan/20 hover:bg-sui-cyan hover:text-black">
                           <Play className="w-3 h-3 mr-2" /> Deploy
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default Hero;
