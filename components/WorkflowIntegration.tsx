import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Lightbulb, TestTube, ArrowRight, Sparkles } from 'lucide-react';

const WorkflowIntegration: React.FC = () => {
  const [activePhase, setActivePhase] = useState<string>('discover');

  const phases = [
    {
      id: 'discover',
      title: 'Discover',
      icon: <Search className="w-4 h-4" />,
      items: ['Define project goals & user needs', 'Structured questionnaires & templates', 'Auto-generated dependency checklist']
    },
    {
      id: 'explore',
      title: 'Explore',
      icon: <Lightbulb className="w-4 h-4" />,
      items: ['Rapid prototyping in Web IDE', 'Sample modules (DeFi, NFT, Gaming)', 'Real-time gas analysis']
    },
    {
      id: 'test',
      title: 'Test',
      icon: <TestTube className="w-4 h-4" />,
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
    <section className="relative py-24 px-6 overflow-hidden bg-[#000000]">
      {/* Background Ambience */}
      <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full mb-6">
            <Sparkles className="w-3 h-3 text-[#3B82F6]" />
            <span className="text-[#3B82F6] text-xs font-bold tracking-wider">GUIDED WORKFLOW</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-medium text-white mb-4 tracking-tight">
            Cyclical Development <span className="text-[#3B82F6]">Workflow</span>
          </h2>

          <p className="text-slate-400 text-lg">
            A guided transition process that takes you from idea to production with
            <br />
            <span className="text-[#3B82F6] font-medium mt-2 inline-block">
              Discover → Explore → Test
            </span>
          </p>
        </div>

        {/* Phase Navigation Pills */}
        <div className="flex justify-center items-center gap-4 mb-16">
          {phases.map((phase, index) => (
            <React.Fragment key={phase.id}>
              <button
                onClick={() => setActivePhase(phase.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all duration-300
                  ${activePhase === phase.id
                    ? 'bg-[#161b22] border-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                    : 'bg-[#0B0F14] border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                  }
                `}
              >
                <div className={`${activePhase === phase.id ? 'text-[#3B82F6]' : 'text-slate-600'}`}>
                  {phase.icon}
                </div>
                <span className="font-medium text-sm">{phase.title}</span>
              </button>

              {index < phases.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-700" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Active Phase Content Panel */}
        <div className="bg-[#0B0F14] border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[#3B82F6]/10 rounded-lg text-[#3B82F6] border border-[#3B82F6]/20">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {currentPhase.title} <span className="text-slate-500">Phase</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {currentPhase.items.map((item, idx) => (
              <div key={idx} className="bg-[#161b22] border border-white/5 p-4 rounded-lg flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                <span className="text-sm text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Template Selection Panel */}
        <div className="bg-[#0B0F14] border border-white/10 rounded-2xl p-8 mb-16">
          <h3 className="text-center text-lg font-bold text-white mb-8">
            Choose Your <span className="text-[#3B82F6]">Template</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group p-6 rounded-xl border border-white/5 bg-[#161b22]/50 hover:bg-[#161b22] hover:border-[#3B82F6]/30 transition-all cursor-pointer"
              >
                <h4 className="font-bold text-white mb-2 group-hover:text-[#3B82F6] transition-colors">{template.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="px-10 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all transform hover:scale-105">
            Start Your Workflow Journey
          </button>
        </div>

      </div>
    </section>
  );
};

export default WorkflowIntegration;
