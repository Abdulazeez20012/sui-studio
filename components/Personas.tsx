import React from 'react';
import Section from './ui/Section';
import { motion } from 'framer-motion';
import {
  Zap, Code2, Users, ShieldCheck,
  Activity, Check
} from 'lucide-react';
import { StaggerContainer, ScaleReveal, FadeUp, FoldInOut } from '../src/lib/animations';

interface DashboardCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  metric: string;
  metricLabel: string;
  children: React.ReactNode;
  delay: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title, subtitle, icon, metric, metricLabel, children, delay
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ scale: 1.01, borderColor: 'rgba(60,185,255,0.3)' }}
    className="bg-[#12171D] border border-white/5 rounded-xl p-6 flex flex-col h-full shadow-lg hover:shadow-[0_0_30px_-10px_rgba(60,185,255,0.1)] transition-all duration-300 group relative overflow-hidden"
  >
    {/* Hover Glow Gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:bg-sui-cyan/10 group-hover:text-sui-cyan transition-colors duration-300 text-slate-400">
          {icon}
        </div>
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">{title}</h3>
          <p className="text-slate-500 text-xs uppercase tracking-wider font-medium">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono text-2xl font-bold text-white group-hover:text-sui-cyan transition-colors duration-300">{metric}</div>
        <div className="text-slate-500 text-xs">{metricLabel}</div>
      </div>
    </div>

    <div className="flex-1 bg-[#0B0F14] border border-white/5 rounded-lg p-4 relative overflow-hidden group-hover:border-white/10 transition-colors">
      {/* Grid background for chart area */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3CB9FF 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
      <div className="relative z-10 h-full flex flex-col justify-center">
        {children}
      </div>
    </div>
  </motion.div>
);

const Personas: React.FC = () => {
  return (
    <Section id="stages" className="bg-[#0B0F14] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sui-cyan/5 to-transparent pointer-events-none blur-3xl" />

      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Built for Every Stage
          </h2>
          <p className="text-slate-400 max-w-xl text-lg">
            From first contract to global scale. A platform that adapts to your growth metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 relative z-10 max-w-6xl mx-auto">
        {/* Card 1: Explorer */}
        <DashboardCard
          title="Explorer"
          subtitle="Rapid Onboarding"
          icon={<Zap className="w-5 h-5" />}
          metric="< 5m"
          metricLabel="Time to First Contract"
          delay={0}
        >
          <div className="h-32 w-full relative mt-2">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />

            {/* Onboarding Velocity Graph */}
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3CB9FF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3CB9FF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0,120 Q60,100 100,80 T200,40 T350,10"
                fill="none"
                stroke="#3CB9FF"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <motion.path
                d="M0,120 Q60,100 100,80 T200,40 T350,10 V120 H0Z"
                fill="url(#cyanGradient)"
                opacity="0"
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              />
            </svg>

            {/* Data Point Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute top-2 right-0 bg-sui-cyan/10 border border-sui-cyan/30 px-2 py-1 rounded text-[10px] text-sui-cyan font-mono"
            >
              Deployed
            </motion.div>
          </div>
        </DashboardCard>

        {/* Card 2: Builder */}
        <DashboardCard
          title="Builder"
          subtitle="Advanced Tooling"
          icon={<Code2 className="w-5 h-5" />}
          metric="-40%"
          metricLabel="Gas Costs Optimized"
          delay={0.1}
        >
          <div className="space-y-3 font-mono text-xs w-full">
            <div className="flex items-center justify-between text-slate-500 mb-2 pb-2 border-b border-white/5">
              <span>Function Cost Analysis</span>
              <Activity className="w-3 h-3" />
            </div>
            {['init_pool', 'swap_exact', 'add_liquidity'].map((fn, i) => (
              <div key={fn} className="relative">
                <div className="flex justify-between mb-1 text-slate-300 z-10 relative">
                  <span>{fn}</span>
                  <span>{120 - i * 30} μSUI</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${80 - i * 20}%` }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                    className={`h-full rounded-full ${i === 0 ? 'bg-sui-cyan' : 'bg-slate-600'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Card 3: Team */}
        <DashboardCard
          title="Team"
          subtitle="Collaborative Sync"
          icon={<Users className="w-5 h-5" />}
          metric="Real-time"
          metricLabel="State Synchronization"
          delay={0.2}
        >
          <div className="space-y-2 w-full">
            {[
              { u: 'Alex', a: 'merged PR #42', t: '2m ago', c: 'bg-indigo-500' },
              { u: 'Sarah', a: 'deployed to testnet', t: '15m ago', c: 'bg-emerald-500' },
              { u: 'Mike', a: 'updated Move.toml', t: '1h ago', c: 'bg-orange-500' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 p-2 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className={`w-6 h-6 rounded-full ${item.c} flex items-center justify-center text-[10px] text-white font-bold shadow-lg`}>
                  {item.u[0]}
                </div>
                <div className="text-xs text-slate-400 flex-1 truncate">
                  <span className="text-white font-medium">{item.u}</span> {item.a}
                </div>
                <span className="text-[10px] text-slate-600 whitespace-nowrap">{item.t}</span>
              </motion.div>
            ))}
          </div>
        </DashboardCard>

        {/* Card 4: Enterprise */}
        <DashboardCard
          title="Enterprise"
          subtitle="Security & Compliance"
          icon={<ShieldCheck className="w-5 h-5" />}
          metric="100%"
          metricLabel="Audit Coverage"
          delay={0.3}
        >
          <div className="grid grid-cols-2 gap-3 w-full">
            {['SOC2 Ready', 'SSO Enabled', 'Audit Logs', 'RBAC'].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-2 p-2 rounded bg-sui-cyan/5 border border-sui-cyan/20 text-sui-cyan text-xs font-medium"
              >
                <Check className="w-3 h-3" />
                {item}
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </Section>
  );
};

export default Personas;