import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlatformMode } from '../types';
import { WEB_FEATURES, DESKTOP_FEATURES } from '../constants';
import Section from './ui/Section';
import { Monitor, Globe, Code2, Check, ArrowRight, Clock, AlertTriangle, Layers, Cpu, Workflow, Server, Terminal, Activity, Play, Box } from 'lucide-react';
import { StaggerContainer, FoldInOut, ScaleReveal, FadeUp } from '../src/lib/animations';

const PlatformShowcase: React.FC = () => {
  const [mode, setMode] = useState<PlatformMode>(PlatformMode.WEB);

  const currentFeatures = mode === PlatformMode.WEB ? WEB_FEATURES : DESKTOP_FEATURES;

  return (
    <>
      {/* Problem Statement Band */}
      <section className="w-full bg-neo-white border-y-3 border-neo-black py-32 relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 bg-neo-primary border-2 border-neo-black text-xs font-bold text-neo-black mb-6 shadow-neo-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neo-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neo-black"></span>
              </span>
              THE CHALLENGE
            </motion.div>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FoldInOut}
              className="font-heading text-4xl md:text-5xl font-black text-neo-black mb-6 uppercase tracking-tighter"
            >
              Why current workflows <span className="text-neo-white bg-neo-black px-2 transform -rotate-1 inline-block">fail.</span>
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FadeUp}
              className="text-neo-black font-medium text-lg max-w-2xl mx-auto"
            >
              Building on Sui shouldn't feel like fighting your tools.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={StaggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Card 1: Setup Hell */}
            <motion.div
              variants={ScaleReveal}
              whileHover={{ y: -5 }}
              className="group relative p-8 bg-neo-bg border-3 border-neo-black shadow-neo hover:shadow-neo-lg transition-all duration-200"
            >

              <div className="mb-8 relative">
                <div className="w-16 h-16 bg-neo-white border-2 border-neo-black flex items-center justify-center shadow-neo-sm">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-2 rounded-full border-2 border-dashed border-neo-black opacity-20"
                    />
                    <Clock className="w-8 h-8 text-neo-black" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-neo-black mb-4 uppercase">The Setup Hell</h3>
              <p className="text-neo-black font-medium leading-relaxed">
                Beginners lose hours configuring local environments, installing binaries, and fighting dependencies before writing a single line of Move code.
              </p>
            </motion.div>

            {/* Card 2: Fragmented Tooling */}
            <motion.div
              variants={ScaleReveal}
              whileHover={{ y: -5 }}
              className="group relative p-8 bg-neo-bg border-3 border-neo-black shadow-neo hover:shadow-neo-lg transition-all duration-200"
            >

              <div className="mb-8 relative">
                <div className="w-16 h-16 bg-neo-white border-2 border-neo-black flex items-center justify-center shadow-neo-sm">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div
                      animate={{ x: [0, -8, 0], y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute"
                    >
                      <Cpu className="w-4 h-4 text-neo-black opacity-50" />
                    </motion.div>
                    <motion.div
                      animate={{ x: [0, 8, 0], y: [0, -2, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute"
                    >
                      <Layers className="w-5 h-5 text-neo-black" />
                    </motion.div>
                    <motion.div
                      animate={{ x: [0, 0, 0], y: [0, 8, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute"
                    >
                      <Workflow className="w-4 h-4 text-neo-black opacity-70" />
                    </motion.div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-neo-black mb-4 uppercase">Fragmented Tooling</h3>
              <p className="text-neo-black font-medium leading-relaxed">
                Professionals juggle separate CLI tools for debugging, gas analysis, and deployment, leading to constant context switching and friction.
              </p>
            </motion.div>

            {/* Card 3: Environment Drift */}
            <motion.div
              variants={ScaleReveal}
              whileHover={{ y: -5 }}
              className="group relative p-8 bg-neo-bg border-3 border-neo-black shadow-neo hover:shadow-neo-lg transition-all duration-200"
            >

              <div className="mb-8 relative">
                <div className="w-16 h-16 bg-neo-white border-2 border-neo-black flex items-center justify-center shadow-neo-sm">
                  <div className="relative">
                    <Server className="w-8 h-8 text-neo-black" />
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1"
                    >
                      <AlertTriangle className="w-4 h-4 text-neo-primary fill-neo-primary" />
                    </motion.div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-neo-black mb-4 uppercase">Environment Drift</h3>
              <p className="text-neo-black font-medium leading-relaxed">
                Teams struggle with inconsistent dependencies. "It works on my machine" becomes a production blocker when binaries go out of sync.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Platform Showcase Section */}
      <Section id="platform" className="bg-neo-bg py-32">
        <div className="text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FoldInOut}
            className="font-heading font-black text-4xl md:text-5xl mb-6 text-neo-black uppercase tracking-tighter"
          >
            One Platform. <span className="text-neo-primary bg-neo-black px-2 text-white">Dual Power.</span>
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FadeUp}
            className="text-neo-black font-medium max-w-xl mx-auto text-lg"
          >
            Seamlessly switch between instant cloud accessibility and robust local performance.
          </motion.p>
        </div>

        {/* Toggle Switch */}
        <div className="flex justify-center mb-20 sticky top-24 z-30">
          <div className="p-2 bg-neo-white border-3 border-neo-black inline-flex relative cursor-pointer shadow-neo">
            <motion.div
              layoutId="active-pill"
              className={`absolute inset-y-2 bg-neo-black border-2 border-neo-black`}
              initial={false}
              animate={{
                left: mode === PlatformMode.WEB ? '8px' : '50%',
                width: 'calc(50% - 8px)'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setMode(PlatformMode.WEB)}
              className={`relative z-10 px-8 py-3 text-sm font-black uppercase transition-colors duration-300 flex items-center gap-2.5 w-48 justify-center ${mode === PlatformMode.WEB ? 'text-white' : 'text-neo-black hover:text-neo-primary'
                }`}
            >
              <Globe className="w-4 h-4" /> Web Gateway
            </button>
            <button
              onClick={() => setMode(PlatformMode.DESKTOP)}
              className={`relative z-10 px-8 py-3 text-sm font-black uppercase transition-colors duration-300 flex items-center gap-2.5 w-48 justify-center ${mode === PlatformMode.DESKTOP ? 'text-white' : 'text-neo-black hover:text-neo-primary'
                }`}
            >
              <Monitor className="w-4 h-4" /> Desktop Pro
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center min-h-[600px]">
          {/* Text Content */}
          <div className="lg:col-span-5 space-y-10 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >

                <div className="inline-block mb-4 px-3 py-1 bg-neo-accent border-2 border-neo-black text-xs font-bold text-neo-black uppercase tracking-widest shadow-neo-sm">
                  {mode === PlatformMode.WEB ? 'Explorer Edition' : 'Professional Edition'}
                </div>
                <h3 className="text-4xl font-heading font-black text-neo-black mb-6 leading-tight uppercase">
                  {mode === PlatformMode.WEB ? (
                    <>Zero Friction.<br />Instant <span className="text-neo-primary bg-neo-black px-2 text-white">Deployment.</span></>
                  ) : (
                    <>Uncompromised<br /><span className="text-neo-primary bg-neo-black px-2 text-white">Local Power.</span></>
                  )}
                </h3>
                <p className="text-neo-black font-medium text-lg mb-10 leading-relaxed">
                  {mode === PlatformMode.WEB
                    ? "Launch a complete Move environment directly in your browser. No installations, no config files, just pure building. Perfect for tutorials, prototyping, and quick fixes."
                    : "Harness the full power of your hardware. Direct file system access, hardware acceleration, offline capabilities, and granular gas profiling for optimization."}
                </p>

                <div className="space-y-6">
                  {currentFeatures.map((feature, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 + 0.2 }}
                      key={feature.id}
                      className="group flex items-start gap-5 p-4 -mx-4 rounded-none hover:bg-neo-white border-2 border-transparent hover:border-neo-black hover:shadow-neo transition-all duration-200"
                    >
                      <div className="p-3 bg-neo-white border-2 border-neo-black text-neo-black group-hover:scale-110 group-hover:bg-neo-secondary transition-all duration-200 shadow-neo-sm">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-neo-black font-black text-lg flex items-center gap-2 uppercase">
                          {feature.title}
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                        </h4>
                        <p className="text-neo-black font-medium mt-1 leading-relaxed">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Visual Content */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 perspective-1000">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-radial from-sui-cyan/20 to-transparent blur-[80px] opacity-40 pointer-events-none" />

            <motion.div
              key={mode}
              initial={{ opacity: 0, rotateX: 10, y: 40 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: -10, y: -40 }}
              transition={{ duration: 0.6, type: "spring", damping: 20 }}
              className="relative border-3 border-neo-black bg-neo-white shadow-neo-lg overflow-hidden aspect-[16/10] group z-10"
            >
              {/* Glass Sheen - REMOVED */}

              {/* Window Header */}
              <div className="h-11 bg-neo-bg border-b-3 border-neo-black flex items-center px-5 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-inner" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-inner" />
                </div>

                {mode === PlatformMode.WEB ? (
                  <div className="flex-1 mx-8 bg-[#0B0F14] border border-white/5 rounded-md h-7 flex items-center justify-center text-xs text-slate-500 font-mono gap-2">
                    <Globe className="w-3 h-3" />
                    <span>ide.sui.io/project/defi-amm</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <Terminal className="w-3 h-3" />
                    <span>~/dev/sui-project — VIM</span>
                  </div>
                )}

                <div className="w-16 flex justify-end gap-2">
                  {mode === PlatformMode.WEB && <div className="w-6 h-6 rounded-full bg-white/5" />}
                </div>
              </div>

              {/* Window Content */}
              <div className="flex h-full bg-[#0B0F14] relative">
                {/* Sidebar (Desktop Only) */}
                {mode === PlatformMode.DESKTOP && (
                  <div className="w-16 border-r border-white/5 bg-[#161b22] flex flex-col items-center py-4 gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 hover:bg-sui-cyan/20 hover:text-sui-cyan text-slate-400 flex items-center justify-center transition-colors"><Code2 size={20} /></div>
                    <div className="w-10 h-10 rounded-lg bg-sui-cyan/20 text-sui-cyan flex items-center justify-center shadow-[0_0_15px_rgba(60,185,255,0.2)]"><Activity size={20} /></div>
                    <div className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 flex items-center justify-center"><Box size={20} /></div>
                  </div>
                )}

                <div className="flex-1 flex flex-col relative">
                  {/* Code / Content Area */}
                  <div className="flex-1 p-8 relative overflow-hidden">
                    {/* Line Numbers */}
                    <div className="absolute left-0 top-8 bottom-0 w-12 flex flex-col items-end pr-4 text-slate-700 font-mono text-sm leading-6 select-none">
                      {Array.from({ length: 12 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                    </div>

                    {/* Code Content */}
                    <div className="pl-12 font-mono text-sm leading-6 relative z-10">
                      <div className="flex"><span className="text-sui-indigo">module</span> <span className="text-white ml-2">defi::pool</span> <span className="text-slate-500">{'{'}</span></div>
                      <div className="flex"><span className="text-sui-indigo ml-4">use</span> <span className="text-sui-cyan ml-2">sui::object</span><span className="text-slate-500">;</span></div>
                      <div className="flex"><span className="text-sui-indigo ml-4">use</span> <span className="text-sui-cyan ml-2">sui::transfer</span><span className="text-slate-500">;</span></div>
                      <div className="h-6" />
                      <div className="flex"><span className="text-slate-500 ml-4">// Initialize liquidity pool</span></div>
                      <div className="flex"><span className="text-sui-indigo ml-4">public fun</span> <span className="text-[#F2C94C] ml-2">create_pool</span><span className="text-slate-300">(ctx: &</span><span className="text-sui-indigo">mut</span> <span className="text-[#F2C94C]">TxContext</span><span className="text-slate-300">)</span> <span className="text-slate-500">{'{'}</span></div>
                      <div className="flex"><span className="text-slate-300 ml-8">let pool = </span><span className="text-sui-cyan">Pool</span> <span className="text-slate-300">{'{'}</span></div>
                      <div className="flex"><span className="text-slate-300 ml-12">id: </span><span className="text-sui-cyan">object::new</span><span className="text-slate-300">(ctx),</span></div>
                      <div className="flex"><span className="text-slate-300 ml-12">reserves: </span><span className="text-[#98C379]">0</span><span className="text-slate-300">,</span></div>
                      <div className="flex"><span className="text-slate-300 ml-8">{'}'};</span></div>
                      <div className="flex"><span className="text-sui-cyan ml-8">transfer::share_object</span><span className="text-slate-300">(pool);</span></div>
                      <div className="flex"><span className="text-slate-500 ml-4">{'}'}</span></div>
                    </div>

                    {/* Animations Overlay */}
                    {mode === PlatformMode.WEB ? (
                      /* Web: Deploy Animation */
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="absolute bottom-8 right-8 bg-[#161b22] border border-sui-cyan/30 rounded-xl p-4 shadow-2xl flex items-center gap-4 w-72 backdrop-blur-md z-20"
                      >
                        <div className="w-10 h-10 rounded-full bg-sui-cyan flex items-center justify-center text-black shrink-0">
                          <Check strokeWidth={3} size={20} />
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm">Deployment Complete</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">Package ID: 0x8a...2f9</div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-sui-cyan/20">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5 }}
                            className="h-full bg-sui-cyan"
                          />
                        </div>
                      </motion.div>
                    ) : (
                      /* Desktop: Debugger Pane */
                      <motion.div
                        initial={{ x: 300 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                        className="absolute top-0 right-0 bottom-0 w-64 bg-[#161b22] border-l border-white/5 flex flex-col"
                      >
                        <div className="h-8 border-b border-white/5 flex items-center px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-[#1a2029]">
                          Gas Profiler
                        </div>
                        <div className="p-4 flex-1 overflow-hidden">
                          <div className="flex items-end justify-between h-32 mb-2 gap-1">
                            {[35, 70, 45, 90, 60, 40, 75, 50].map((h, i) => (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 1 + i * 0.1 }}
                                className="w-full bg-sui-cyan/20 rounded-t-sm relative group"
                              >
                                <div className="absolute bottom-0 left-0 right-0 bg-sui-cyan opacity-50 transition-all duration-500 group-hover:opacity-100" style={{ height: '40%' }} />
                              </motion.div>
                            ))}
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-6">
                            <span>0ms</span>
                            <span>50ms</span>
                          </div>

                          <div className="space-y-3">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Call Stack</div>
                            <div className="p-2 bg-black/20 rounded border border-white/5 text-xs font-mono text-sui-cyan">
                              <div className="opacity-50">0x2::coin::join</div>
                              <div>0x2::pool::create</div>
                              <div className="opacity-50">0x1::tx_context::new</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 border-t border-white/5 bg-sui-cyan/5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Total Gas:</span>
                            <span className="font-mono font-bold text-sui-cyan">892 MIST</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Bottom Status Bar */}
                  <div className="h-6 bg-[#161b22] border-t border-white/5 flex items-center justify-between px-3 text-[10px] text-slate-500 font-mono">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-sui-cyan">
                        <div className="w-1.5 h-1.5 rounded-full bg-sui-cyan animate-pulse" />
                        {mode === PlatformMode.WEB ? 'Mainnet Connected' : 'Localnet: 9000'}
                      </div>
                      <span>master*</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>UTF-8</span>
                      <span>Move</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section >
    </>
  );
};

export default PlatformShowcase;