import React from 'react';
import { 
  Video, Code, Maximize2, Zap, Shield, Users, 
  Layers, Terminal, Rocket, FileCheck, Monitor, Mic 
} from 'lucide-react';

const FeaturesShowcase: React.FC = () => {
  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: 'Real-Time Video Collaboration',
      description: 'HD video calls with screen sharing. Pair program with your team using WebRTC technology.',
      gradient: 'from-purple-500 to-pink-500',
      badge: 'NEW',
    },
    {
      icon: <Maximize2 className="w-8 h-8" />,
      title: 'Resizable Panels',
      description: 'Fully customizable workspace. Drag to resize any panel and save your perfect layout.',
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'NEW',
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: 'Advanced Error Reporting',
      description: 'Detailed compilation errors with context, file locations, and quick fixes.',
      gradient: 'from-green-500 to-emerald-500',
      badge: 'NEW',
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Move Language Support',
      description: 'Full syntax highlighting, auto-completion, and intelligent code analysis for Sui Move.',
      gradient: 'from-sui-cyan to-blue-500',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'One-Click Deployment',
      description: 'Deploy to Sui mainnet, testnet, or devnet with a single click. No CLI required.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Built-in Wallet',
      description: 'Integrated Sui wallet for testing and deployment. Manage assets directly in the IDE.',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Live Collaboration',
      description: 'Real-time cursor tracking, code sharing, and collaborative editing with your team.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: 'Smart Templates',
      description: 'Pre-built templates for NFTs, DeFi, Gaming, and more. Start coding in seconds.',
      gradient: 'from-teal-500 to-green-500',
    },
    {
      icon: <Terminal className="w-8 h-8" />,
      title: 'Integrated Terminal',
      description: 'Full-featured terminal with Sui CLI integration. Run commands without leaving the IDE.',
      gradient: 'from-gray-500 to-slate-500',
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Gas Optimization',
      description: 'Real-time gas analysis and optimization suggestions to reduce transaction costs.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: 'Screen Sharing',
      description: 'Share your screen during video calls for better collaboration and code reviews.',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: 'Voice Communication',
      description: 'Crystal-clear voice chat with echo cancellation and noise suppression.',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sui-cyan/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sui-cyan/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-sui-cyan/10 border border-sui-cyan/30 rounded-full text-sui-cyan text-sm font-semibold">
              ✨ Powerful Features
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-sui-cyan to-white bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            A complete development environment designed specifically for Sui blockchain development
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-dark-surface/50 backdrop-blur-sm border border-dark-border rounded-2xl p-8 hover:border-sui-cyan/50 transition-all duration-300 hover:shadow-neon-lg hover:-translate-y-1"
            >
              {/* Badge */}
              {feature.badge && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-gradient-to-r from-sui-cyan to-blue-500 text-black text-xs font-bold rounded-full">
                    {feature.badge}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sui-cyan transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-sui-cyan/0 to-sui-cyan/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/ide"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-neon text-black font-bold rounded-xl hover:shadow-neon-lg transition-all duration-300 hover:scale-105"
          >
            <span>Start Building Now</span>
            <Rocket className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
