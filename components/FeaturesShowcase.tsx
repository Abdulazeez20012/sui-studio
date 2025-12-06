import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Code, Maximize2, Zap, Shield, Users,
  Layers, Terminal, Rocket, FileCheck, Monitor, Mic
} from 'lucide-react';
import { StaggerContainer, ScaleReveal, FadeUp } from '../src/lib/animations';

const FeaturesShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('development');

  const categories = {
    development: {
      label: 'Development',
      features: [
        {
          icon: Code,
          title: 'Move Language Support',
          description: 'Full syntax highlighting, auto-completion, and intelligent code analysis for Sui Move.',
        },
        {
          icon: Terminal,
          title: 'Integrated Terminal',
          description: 'Full-featured terminal with Sui CLI integration. Run commands without leaving the IDE.',
        },
        {
          icon: FileCheck,
          title: 'Advanced Diagnostic',
          description: 'Detailed compilation errors with context, file locations, and quick fixes.',
          badge: 'New',
        },
        {
          icon: Rocket,
          title: 'Gas Optimization',
          description: 'Real-time gas analysis and optimization suggestions to reduce transaction costs.',
        },
      ],
    },
    collaboration: {
      label: 'Collaboration',
      features: [
        {
          icon: Video,
          title: 'HD Video Calls',
          description: 'Crystal clear video calls with screen sharing. Pair program with your team using WebRTC.',
          badge: 'Beta',
        },
        {
          icon: Users,
          title: 'Live Cursors',
          description: 'Real-time cursor tracking, code sharing, and collaborative editing with your team.',
        },
        {
          icon: Monitor,
          title: 'Screen Sharing',
          description: 'Share your screen during video calls for better collaboration and code reviews.',
        },
        {
          icon: Mic,
          title: 'Voice Chat',
          description: 'Low-latency voice communication with echo cancellation and noise suppression.',
        },
      ],
    },
    deployment: {
      label: 'Deployment',
      features: [
        {
          icon: Zap,
          title: 'One-Click Deploy',
          description: 'Deploy to Sui mainnet, testnet, or devnet with a single click. No CLI required.',
        },
        {
          icon: Shield,
          title: 'Smart Wallet',
          description: 'Integrated Sui wallet for testing and deployment. Manage assets directly in the IDE.',
        },
      ],
    },
  };

  return (
    <section className="py-32 px-4 relative overflow-hidden bg-transparent">
      {/* Subtle Background */}


      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FadeUp}
            className="text-5xl md:text-7xl font-medium mb-6 tracking-tighter text-content"
          >
            Everything you need. <br />
            <span className="text-content-muted">Nothing you don't.</span>
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FadeUp}
            className="text-xl text-content-muted max-w-2xl mx-auto font-light"
          >
            A complete suite of tools designed for the next generation of Move developers.
          </motion.p>
        </div>

        {/* Apple-style Segmented Control */}
        <div className="flex justify-center mb-20">
          <div className="p-1 bg-white/5 rounded-full border border-white/5 inline-flex backdrop-blur-md">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === key ? 'text-black' : 'text-slate-500 hover:text-white'
                  }`}
              >
                {activeTab === key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={StaggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {categories[activeTab as keyof typeof categories].features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={ScaleReveal}
                  className="group relative p-8 rounded-3xl bg-panel border border-border hover:border-border transition-colors duration-500 overflow-hidden shadow-lg dark:shadow-none"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon */}
                  <div className="mb-6 w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-content-muted group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Badge */}
                  {feature.badge && (
                    <div className="absolute top-8 right-8 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                      {feature.badge}
                    </div>
                  )}

                  <h3 className="text-xl font-medium text-content mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-content-muted leading-relaxed font-light">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
