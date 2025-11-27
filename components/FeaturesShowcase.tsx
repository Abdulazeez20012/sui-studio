import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Code, Maximize2, Zap, Shield, Users,
  Layers, Terminal, Rocket, FileCheck, Monitor, Mic, Sparkles
} from 'lucide-react';
import { StaggerContainer, ScaleReveal, FadeUp, FoldInOut } from '../src/lib/animations';

const FeaturesShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('development');

  const categories = {
    development: {
      label: 'Development',
      icon: Code,
      color: 'walrus-cyan',
      features: [
        {
          icon: <Code className="w-8 h-8" />,
          title: 'Move Language Support',
          description: 'Full syntax highlighting, auto-completion, and intelligent code analysis for Sui Move.',
        },
        {
          icon: <Terminal className="w-8 h-8" />,
          title: 'Integrated Terminal',
          description: 'Full-featured terminal with Sui CLI integration. Run commands without leaving the IDE.',
        },
        {
          icon: <FileCheck className="w-8 h-8" />,
          title: 'Advanced Error Reporting',
          description: 'Detailed compilation errors with context, file locations, and quick fixes.',
          badge: 'NEW',
        },
        {
          icon: <Rocket className="w-8 h-8" />,
          title: 'Gas Optimization',
          description: 'Real-time gas analysis and optimization suggestions to reduce transaction costs.',
        },
        {
          icon: <Layers className="w-8 h-8" />,
          title: 'Smart Templates',
          description: 'Pre-built templates for NFTs, DeFi, Gaming, and more. Start coding in seconds.',
        },
        {
          icon: <Maximize2 className="w-8 h-8" />,
          title: 'Resizable Panels',
          description: 'Fully customizable workspace. Drag to resize any panel and save your perfect layout.',
          badge: 'NEW',
        },
      ],
    },
    collaboration: {
      label: 'Collaboration',
      icon: Users,
      color: 'walrus-purple',
      features: [
        {
          icon: <Video className="w-8 h-8" />,
          title: 'Real-Time Video Collaboration',
          description: 'HD video calls with screen sharing. Pair program with your team using WebRTC technology.',
          badge: 'NEW',
        },
        {
          icon: <Users className="w-8 h-8" />,
          title: 'Live Collaboration',
          description: 'Real-time cursor tracking, code sharing, and collaborative editing with your team.',
        },
        {
          icon: <Monitor className="w-8 h-8" />,
          title: 'Screen Sharing',
          description: 'Share your screen during video calls for better collaboration and code reviews.',
        },
        {
          icon: <Mic className="w-8 h-8" />,
          title: 'Voice Communication',
          description: 'Crystal-clear voice chat with echo cancellation and noise suppression.',
        },
      ],
    },
    deployment: {
      label: 'Deployment',
      icon: Zap,
      color: 'walrus-pink',
      features: [
        {
          icon: <Zap className="w-8 h-8" />,
          title: 'One-Click Deployment',
          description: 'Deploy to Sui mainnet, testnet, or devnet with a single click. No CLI required.',
        },
        {
          icon: <Shield className="w-8 h-8" />,
          title: 'Built-in Wallet',
          description: 'Integrated Sui wallet for testing and deployment. Manage assets directly in the IDE.',
        },
      ],
    },
  };

  const CategoryIcon = categories[activeTab as keyof typeof categories].icon;

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-walrus-cyan/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="walrus-badge text-walrus-cyan">
              <Sparkles className="w-4 h-4" />
              POWERFUL FEATURES
            </span>
          </motion.div>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FoldInOut}
            className="text-5xl md:text-6xl font-bold mb-6 font-heading"
          >
            <span className="text-white">Everything you need to</span>{' '}
            <span className="bg-gradient-to-r from-[#4DA8FF] via-[#6FB6FF] to-[#00D4FF] bg-clip-text text-transparent">ship.</span>
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FadeUp}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            A complete suite of tools designed for the next generation of Move developers.
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {Object.entries(categories).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative px-8 py-4 font-semibold transition-all duration-300 flex items-center gap-3 rounded-lg ${activeTab === key
                  ? 'glass-card-hover border-white/20 shadow-glow'
                  : 'glass-card hover:border-white/15'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {category.label}
              </button>
            );
          })}
        </motion.div>

        {/* Features Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={StaggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {categories[activeTab as keyof typeof categories].features.map((feature, index) => (
              <motion.div
                key={index}
                variants={ScaleReveal}
                className="group relative p-8 glass-card-hover rounded-xl"
              >
                {/* Badge */}
                {feature.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-walrus-cyan/20 border border-walrus-cyan/30 text-walrus-cyan text-xs font-bold rounded-full">
                      {feature.badge}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="inline-flex p-4 glass-card mb-6 group-hover:scale-110 transition-transform duration-300 rounded-lg text-sui-cyan border border-sui-cyan/20 group-hover:border-sui-cyan/40 group-hover:shadow-[0_0_20px_rgba(77,168,255,0.3)]">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 font-heading bg-gradient-to-r from-white to-sui-cyan bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed font-sans">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
