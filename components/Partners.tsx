
import React from 'react';
import { motion } from 'framer-motion';
import { MarqueeContainer } from './ui/Marquee';
import { ArrowRight, CheckCircle2, Code, Zap, Globe, ShieldCheck } from 'lucide-react';

const PARTNERS = [
  "Mysten Labs", "Sui Foundation", "BlueMove", "Cetus", "Ethos", "Pyth", "Wormhole", "Bucket", "Turbos", "Scallop", "Navi", "Aftermath"
];

const METRICS = [
  { label: "Total Deployments", value: "50k+", icon: <Code className="w-4 h-4" /> },
  { label: "Active Projects", value: "2.5k", icon: <Zap className="w-4 h-4" /> },
  { label: "Global Teams", value: "120+", icon: <Globe className="w-4 h-4" /> },
  { label: "Audited Value", value: "$2B+", icon: <ShieldCheck className="w-4 h-4" /> },
];

const Partners: React.FC = () => {
  return (
    <section className="w-full bg-[#0B0F14] border-y border-white/5 py-24 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-sui-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-6 tracking-tight">
            Trusted by teams shipping on <span className="text-sui-cyan">mainnet</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            See how developers across the globe use Sui Studio to build, test, and deploy Move applications with confidence.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-20"
        >
          {METRICS.map((m, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#12171D]/50 border border-white/5 hover:border-sui-cyan/30 hover:bg-[#12171D] transition-all duration-300 group">
               <div className="p-3 rounded-xl bg-white/5 text-slate-400 group-hover:scale-110 group-hover:bg-sui-cyan/10 group-hover:text-sui-cyan transition-all duration-300 mb-3">
                 {m.icon}
               </div>
               <div className="text-2xl font-bold text-white font-mono mb-1 group-hover:text-sui-cyan transition-colors">{m.value}</div>
               <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">{m.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Logos Marquee */}
        <div className="mb-24">
          <MarqueeContainer>
            {PARTNERS.map((partner, idx) => (
              <li key={idx} className="flex items-center gap-3 group cursor-default opacity-40 hover:opacity-100 transition-opacity duration-300 px-4">
                <div className="w-3 h-3 rounded-full bg-current" />
                <span className="text-xl font-heading font-bold">{partner}</span>
              </li>
            ))}
          </MarqueeContainer>
        </div>

        {/* Conversion CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative max-w-lg mx-auto"
        >
          <div className="absolute inset-0 bg-sui-cyan/20 blur-2xl -z-10 rounded-full opacity-50" />
          <div className="bg-[#12171D] border border-white/10 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl shadow-black/50 ring-1 ring-white/5">
            <input 
              type="text" 
              placeholder="github.com/org/sui-project" 
              className="flex-1 bg-transparent border-none text-white placeholder:text-slate-600 focus:ring-0 px-4 py-3 font-mono text-sm min-w-0"
            />
            <button className="px-6 py-3 rounded-xl bg-sui-cyan text-[#0B0F14] font-bold text-sm hover:bg-[#2ba6eb] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-sui-cyan/20 hover:scale-[1.02] whitespace-nowrap">
              Get Visibility Snapshot
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Free analysis
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              No access tokens needed
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Partners;
