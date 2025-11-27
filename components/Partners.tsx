
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
    <section className="w-full bg-neo-bg border-b-3 border-neo-black py-24 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-heading font-black text-3xl md:text-5xl text-neo-black mb-6 tracking-tighter uppercase">
            Trusted by teams shipping on <span className="text-neo-primary bg-neo-black px-2 text-white transform -rotate-1 inline-block">mainnet</span>
          </h2>
          <p className="text-neo-black text-lg max-w-2xl mx-auto leading-relaxed font-medium">
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
            <div key={i} className="flex flex-col items-center justify-center p-6 bg-neo-white border-3 border-neo-black shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-200 group">
              <div className="p-3 bg-neo-secondary border-2 border-neo-black text-neo-black mb-3 shadow-neo-sm">
                {m.icon}
              </div>
              <div className="text-2xl font-black text-neo-black font-mono mb-1">{m.value}</div>
              <div className="text-xs text-neo-black uppercase tracking-wider font-bold">{m.label}</div>
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
          <div className="bg-neo-white border-3 border-neo-black p-2 flex flex-col sm:flex-row gap-2 shadow-neo-lg">
            <input
              type="text"
              placeholder="github.com/org/sui-project"
              className="flex-1 bg-neo-bg border-2 border-neo-black text-neo-black placeholder:text-gray-500 focus:outline-none focus:shadow-neo px-4 py-3 font-mono text-sm min-w-0 font-bold"
            />
            <button className="px-6 py-3 bg-neo-primary text-neo-black font-black border-2 border-neo-black hover:shadow-neo hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap">
              Get Visibility Snapshot
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-neo-black font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-neo-black" />
              Free analysis
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-neo-black" />
              No access tokens needed
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Partners;
