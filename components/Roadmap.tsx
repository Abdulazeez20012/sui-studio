import React from 'react';
import Section from './ui/Section';
import { motion } from 'framer-motion';
import {
  Rocket, Code2, ShieldCheck,
  FileJson, Zap, LayoutTemplate,
  GitBranch, Users, Lock, CheckCircle2, ArrowRight
} from 'lucide-react';
import { StaggerContainer, FoldInOut, ScaleReveal, FadeUp } from '../src/lib/animations';

const Roadmap: React.FC = () => {
  const PHASES = [
    {
      id: 1,
      title: "Onboarding",
      subtitle: "Phase 1",
      description: "Frictionless entry.",
      icon: <Rocket className="w-5 h-5" />,
      features: ["Web Studio", "dApp Templates", "1-Click Deploy"],
      visual: (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/5">
            <LayoutTemplate className="w-4 h-4 text-sui-cyan" />
            <div className="h-1.5 w-16 bg-white/10 rounded-full" />
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/5 opacity-50">
            <FileJson className="w-4 h-4 text-slate-400" />
            <div className="h-1.5 w-12 bg-white/10 rounded-full" />
          </div>
          <div className="flex justify-end mt-2">
            <div className="px-2 py-1 bg-sui-cyan text-[10px] font-bold text-black rounded">Deploy</div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Growth",
      subtitle: "Phase 2",
      description: "Professional tooling.",
      icon: <Code2 className="w-5 h-5" />,
      features: ["Local IDE", "Gas Profiler", "Test Runner"],
      visual: (
        <div className="relative h-20 flex items-end gap-1 px-2 pb-2">
          {[40, 65, 30, 85, 50, 75].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: '20%' }}
              whileInView={{ height: `${h}%` }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex-1 rounded-t-sm ${i === 3 ? 'bg-sui-cyan' : 'bg-white/10'}`}
            />
          ))}
          <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-sui-cyan font-mono">
            <Zap className="w-3 h-3" /> -15% Gas
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Enterprise",
      subtitle: "Phase 3",
      description: "Scale & Security.",
      icon: <ShieldCheck className="w-5 h-5" />,
      features: ["SSO / RBAC", "Audit Pipelines", "SLA Support"],
      visual: (
        <div className="flex flex-col justify-center h-full gap-2">
          <div className="flex items-center justify-between text-[10px] text-slate-300 px-2">
            <div className="flex items-center gap-1"><Lock className="w-3 h-3" /> Audit</div>
            <CheckCircle2 className="w-3 h-3 text-sui-cyan" />
          </div>
          <div className="w-full h-px bg-white/10" />
          <div className="flex items-center justify-between text-[10px] text-slate-300 px-2">
            <div className="flex items-center gap-1"><Users className="w-3 h-3" /> Team</div>
            <CheckCircle2 className="w-3 h-3 text-sui-cyan" />
          </div>
          <div className="w-full h-px bg-white/10" />
          <div className="flex items-center justify-between text-[10px] text-slate-300 px-2">
            <div className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> CI/CD</div>
            <CheckCircle2 className="w-3 h-3 text-sui-cyan" />
          </div>
        </div>
      )
    }
  ];

  const Card: React.FC<{ phase: any }> = ({ phase }) => (
    <div className="flex items-center">
      <div className="w-[320px] h-[240px] bg-[#12171D] border border-white/5 rounded-xl p-6 flex flex-col relative group hover:border-sui-cyan/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(60,185,255,0.15)]">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-mono text-sui-cyan uppercase tracking-wider mb-1 block font-semibold">{phase.subtitle}</span>
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-sui-cyan bg-clip-text text-transparent">{phase.title}</h3>
          </div>
          <div className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-white transition-colors">
            {phase.icon}
          </div>
        </div>

        <div className="flex-1 bg-[#0B0F14] rounded-lg border border-white/5 mb-4 overflow-hidden relative">
          {phase.visual}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          {phase.features.slice(0, 2).join(" • ")}
        </div>
      </div>

      {/* Connector Line */}
      <div className="w-16 h-px bg-gradient-to-r from-white/10 via-sui-cyan/50 to-white/10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sui-cyan shadow-[0_0_10px_rgba(60,185,255,1)]" />
      </div>
    </div>
  );

  return (
    <Section id="roadmap" className="bg-[#0E1217] py-24 overflow-hidden">
      <div className="text-center mb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-sui-cyan mb-4"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sui-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sui-cyan"></span>
          </span>
          Live Roadmap
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="font-heading font-bold text-3xl md:text-4xl"
        >
          <span className="text-white">The </span>
          <span className="bg-gradient-to-r from-[#4DA8FF] via-[#6FB6FF] to-[#00D4FF] bg-clip-text text-transparent">Master Plan</span>
        </motion.h2>
        <p className="text-slate-400 mt-2">Continuous evolution for the <span className="text-sui-cyan font-semibold">Sui ecosystem</span>.</p>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full group">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0E1217] to-transparent z-10 pointer-events-none" />
        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0E1217] to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          {/* Track 1 */}
          <div className="flex items-center shrink-0 animate-scroll hover:[animation-play-state:paused]" style={{ animationDuration: '40s' }}>
            {PHASES.map((phase) => (
              <Card key={`a-${phase.id}`} phase={phase} />
            ))}
            {/* Loop Link */}
            <div className="w-16 h-px bg-gradient-to-r from-white/10 via-sui-cyan/50 to-white/10 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sui-cyan shadow-[0_0_10px_rgba(60,185,255,1)]" />
            </div>
          </div>

          {/* Track 2 (Duplicate for infinite loop) */}
          <div className="flex items-center shrink-0 animate-scroll hover:[animation-play-state:paused]" style={{ animationDuration: '40s' }} aria-hidden="true">
            {PHASES.map((phase) => (
              <Card key={`b-${phase.id}`} phase={phase} />
            ))}
            {/* Loop Link */}
            <div className="w-16 h-px bg-gradient-to-r from-white/10 via-sui-cyan/50 to-white/10 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sui-cyan shadow-[0_0_10px_rgba(60,185,255,1)]" />
            </div>
          </div>

          {/* Track 3 (Duplicate for wider screens) */}
          <div className="flex items-center shrink-0 animate-scroll hover:[animation-play-state:paused]" style={{ animationDuration: '40s' }} aria-hidden="true">
            {PHASES.map((phase) => (
              <Card key={`c-${phase.id}`} phase={phase} />
            ))}
            {/* Loop Link */}
            <div className="w-16 h-px bg-gradient-to-r from-white/10 via-sui-cyan/50 to-white/10 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sui-cyan shadow-[0_0_10px_rgba(60,185,255,1)]" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Roadmap;