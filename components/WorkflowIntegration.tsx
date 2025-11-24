import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Lightbulb, TestTube, CheckCircle, ArrowRight, Zap, GitBranch, Gauge, Cloud, Users, BarChart3, Rocket } from 'lucide-react';

interface Phase {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  features: string[];
  details: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

const WorkflowIntegration: React.FC = () => {
  const [activePhase, setActivePhase] = useState<string>('discover');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('defi');

  const phases: Phase[] = [
    {
      id: 'discover',
      title: 'Discover',
      icon: <Search className="w-6 h-6" />,
      color: '#4DA2FF',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      features: [
        'Define project goals & user needs',
        'Structured questionnaires & templates',
        'Auto-generated dependency checklist',
        'Ecosystem fit analysis'
      ],
      details: [
        {
          title: 'Project Definition',
          description: 'Interactive questionnaires guide you through defining goals, target users, and ecosystem positioning',
          icon: <CheckCircle className="w-5 h-5" />
        },
        {
          title: 'Smart Templates',
          description: 'Pre-configured templates for DeFi, NFT, and gaming dApps with best practices built-in',
          icon: <Lightbulb className="w-5 h-5" />
        },
        {
          title: 'Environment Setup',
          description: 'Automated checklist for dependencies, SDK versions, and development environment configuration',
          icon: <Zap className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'explore',
      title: 'Explore',
      icon: <Lightbulb className="w-6 h-6" />,
      color: '#6366F1',
      gradient: 'from-indigo-500/20 to-purple-500/20',
      features: [
        'Rapid prototyping in Web IDE',
        'Sample modules (defi::amm_pool)',
        'Branching experiments with gas analysis',
        'Real-time collaborative sync'
      ],
      details: [
        {
          title: 'Rapid Prototyping',
          description: 'Build and iterate quickly with sample modules like defi::amm_pool, nft::collection, and game::inventory',
          icon: <GitBranch className="w-5 h-5" />
        },
        {
          title: 'Gas Cost Analysis',
          description: 'Real-time gas profiling shows cost implications of different implementation approaches',
          icon: <Gauge className="w-5 h-5" />
        },
        {
          title: 'Walrus Storage',
          description: 'Integrated decentralized storage for large assets and off-chain data with automatic optimization',
          icon: <Cloud className="w-5 h-5" />
        },
        {
          title: 'Team Collaboration',
          description: 'Share prototypes in real-time, review code together, and sync changes across your team',
          icon: <Users className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'test',
      title: 'Test',
      icon: <TestTube className="w-6 h-6" />,
      color: '#10B981',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      features: [
        'One-click Testnet/Mainnet deployment',
        'Automated gas profiler & CI/CD audits',
        'Performance metrics dashboard',
        'Optimization suggestions'
      ],
      details: [
        {
          title: 'Automated Deployment',
          description: 'Deploy to Sui Testnet or Mainnet with one click, including automated verification and monitoring',
          icon: <Rocket className="w-5 h-5" />
        },
        {
          title: 'Gas Profiler',
          description: 'Comprehensive analysis of swap_exact, add_liquidity, and other critical functions with optimization tips',
          icon: <Gauge className="w-5 h-5" />
        },
        {
          title: 'CI/CD Integration',
          description: 'Automated audit checks, security scans, and performance benchmarks in your deployment pipeline',
          icon: <CheckCircle className="w-5 h-5" />
        },
        {
          title: 'Feedback Dashboard',
          description: 'Visual metrics showing gas usage, transaction success rates, and actionable optimization recommendations',
          icon: <BarChart3 className="w-5 h-5" />
        }
      ]
    }
  ];

  const templates = [
    { id: 'defi', name: 'DeFi', description: 'AMM pools, lending protocols, yield farming' },
    { id: 'nft', name: 'NFT', description: 'Collections, marketplaces, royalty systems' },
    { id: 'gaming', name: 'Gaming', description: 'Inventory, achievements, in-game economies' }
  ];

  const currentPhase = phases.find(p => p.id === activePhase) || phases[0];

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14] via-[#0F1419] to-[#0B0F14]" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sui-cyan/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-sui-cyan via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Cyclical Development Workflow
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A guided transition process that takes you from idea to production with Discover → Explore → Test
          </p>
        </motion.div>

        {/* Phase Navigation */}
        <div className="flex justify-center items-center gap-4 mb-16 flex-wrap">
          {phases.map((phase, index) => (
            <React.Fragment key={phase.id}>
              <motion.button
                onClick={() => setActivePhase(phase.id)}
                className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activePhase === phase.id
                    ? 'bg-gradient-to-r ' + phase.gradient + ' border-2 scale-105'
                    : 'bg-white/5 border-2 border-white/10 hover:border-white/20'
                }`}
                style={{
                  borderColor: activePhase === phase.id ? phase.color : undefined
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-3">
                  <div style={{ color: phase.color }}>
                    {phase.icon}
                  </div>
                  <span>{phase.title}</span>
                </div>
              </motion.button>
              
              {index < phases.length - 1 && (
                <ArrowRight className="w-6 h-6 text-gray-600 hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            {/* Left: Features Overview */}
            <div className={`bg-gradient-to-br ${currentPhase.gradient} backdrop-blur-xl border border-white/10 rounded-2xl p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: currentPhase.color + '20', color: currentPhase.color }}
                >
                  {currentPhase.icon}
                </div>
                <h3 className="text-2xl font-bold">{currentPhase.title} Phase</h3>
              </div>
              
              <ul className="space-y-4">
                {currentPhase.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: currentPhase.color }} />
                    <span className="text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right: Detailed Features */}
            <div className="space-y-4">
              {currentPhase.details.map((detail, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: currentPhase.color + '20', color: currentPhase.color }}
                    >
                      {detail.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{detail.title}</h4>
                      <p className="text-sm text-gray-400">{detail.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Template Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Choose Your Template</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <motion.button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedTemplate === template.id
                    ? 'bg-sui-cyan/10 border-sui-cyan scale-105'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h4 className="text-xl font-bold mb-2">{template.name}</h4>
                <p className="text-sm text-gray-400">{template.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-sui-cyan to-indigo-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-sui-cyan/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Workflow Journey
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkflowIntegration;
