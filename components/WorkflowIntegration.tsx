import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Lightbulb, TestTube, ArrowRight, Sparkles } from 'lucide-react';

const WorkflowIntegration: React.FC = () => {
  const [activePhase, setActivePhase] = useState<string>('discover');

  const phases = [
    {
      id: 'discover',
      title: 'Discover',
      icon: <Search className="w-5 h-5" />,
      color: '#4DA8FF',
      items: ['Define project goals & user needs', 'Structured questionnaires & templates', 'Auto-generated dependency checklist']
    },
    {
      id: 'explore',
      title: 'Explore',
      icon: <Lightbulb className="w-5 h-5" />,
      color: '#6FB6FF',
      items: ['Rapid prototyping in Web IDE', 'Sample modules (DeFi, NFT, Gaming)', 'Real-time gas analysis']
    },
    {
      id: 'test',
      title: 'Test',
      icon: <TestTube className="w-5 h-5" />,
      color: '#00D4FF',
      items: ['One-click deployment', 'Automated gas profiler', 'CI/CD integration']
    }
  ];

  const templates = [
    { id: 'defi', name: 'DeFi', description: 'AMM pools, lending protocols, yield farming' },
    { id: 'nft', name: 'NFT', description: 'Collections, marketplaces, royalty systems' },
    { id: 'gaming', name: 'Gaming', description: 'Inventory, achievements, in-game economies' }
  ];

  const currentPhase = phases.find(p => p.id === activePhase) || phases[0];

  return (
    <section className="relative py-20 px-6 overflow-hidden bg-white dark:bg-[#0B0F14] transition-colors duration-300">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sui-cyan/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sui-cyan/10 border border-sui-cyan/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-sui-cyan" />
            <span className="text-sui-cyan text-sm font-semibold">GUIDED WORKFLOW</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
            <span className="text-white">Cyclical Development </span>
            <span className="bg-gradient-to-r from-[#4DA8FF] via-[#6FB6FF] to-[#00D4FF] bg-clip-text text-transparent">Workflow</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-sans">
            A guided transition process that takes you from idea to production with <span className="text-sui-cyan font-semibold">Discover → Explore → Test</span>
          </p>
        </motion.div>

        {/* Phase Navigation */}
        <div className="flex justify-center items-center gap-3 mb-12">
          {phases.map((phase, index) => (
            <React.Fragment key={phase.id}>
              <motion.button
                onClick={() => setActivePhase(phase.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 border ${
                  activePhase === phase.id
                    ? 'bg-[#12171D] border-sui-cyan/50 shadow-[0_0_20px_rgba(77,168,255,0.2)]'
                    : 'bg-[#0B0F14] border-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2">
                  <div style={{ color: activePhase === phase.id ? phase.color : '#94a3b8' }}>
                    {phase.icon}
                  </div>
                  <span className={activePhase === phase.id ? 'text-white' : 'text-slate-400'}>
                    {phase.title}
                  </span>
                </div>
              </motion.button>

              {index < phases.length - 1 && (
                <ArrowRight className="w-5 h-5 text-slate-600" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#12171D]/80 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-3 rounded-lg border"
                style={{ 
                  backgroundColor: currentPhase.color + '10',
                  borderColor: currentPhase.color + '30',
                  color: currentPhase.color 
                }}
              >
                {currentPhase.icon}
              </div>
              <h3 className="text-2xl font-bold font-heading">
                <span className="text-white">{currentPhase.title} </span>
                <span className="text-slate-500">Phase</span>
              </h3>
            </div>

            <ul className="grid md:grid-cols-3 gap-4">
              {currentPhase.items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-[#0B0F14]/50 rounded-lg border border-white/5"
                >
                  <div 
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: currentPhase.color }}
                  />
                  <span className="text-slate-300 text-sm font-sans">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        {/* Template Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#12171D]/80 backdrop-blur-sm border border-white/10 rounded-xl p-8"
        >
          <h3 className="text-xl font-bold mb-6 text-center font-heading">
            <span className="text-white">Choose Your </span>
            <span className="text-sui-cyan">Template</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-5 rounded-lg border border-white/10 bg-[#0B0F14]/50 hover:border-sui-cyan/30 hover:bg-[#0B0F14] transition-all duration-300 cursor-pointer group"
              >
                <h4 className="text-lg font-bold mb-2 text-white group-hover:text-sui-cyan transition-colors font-heading">
                  {template.name}
                </h4>
                <p className="text-sm text-slate-400 font-sans">{template.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-[#4DA8FF] to-[#00D4FF] text-black font-bold rounded-lg hover:shadow-[0_0_30px_rgba(77,168,255,0.4)] transition-all duration-300 hover:scale-105">
            Start Your Workflow Journey
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkflowIntegration;
