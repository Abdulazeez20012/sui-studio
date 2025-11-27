import React from 'react';
import { Video, Maximize2, FileCheck, Users, Zap, Shield } from 'lucide-react';

const NewStats: React.FC = () => {
  const stats = [
    {
      icon: <Video className="w-6 h-6" />,
      value: 'HD',
      label: 'Video Quality',
      description: '720p real-time collaboration',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Maximize2 className="w-6 h-6" />,
      value: '100%',
      label: 'Customizable',
      description: 'Resizable workspace panels',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      value: 'Real-time',
      label: 'Error Detection',
      description: 'Instant compilation feedback',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: '10+',
      label: 'Collaborators',
      description: 'Simultaneous developers',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      value: '<1s',
      label: 'Deploy Time',
      description: 'One-click deployment',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      value: 'P2P',
      label: 'Encrypted',
      description: 'Secure video calls',
      gradient: 'from-red-500 to-pink-500',
    },
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-sui-cyan/5 to-dark-bg" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-sui-cyan bg-clip-text text-transparent">
            Built for Performance
          </h2>
          <p className="text-slate-400 text-lg">
            Industry-leading features that set Sui Studio apart
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-dark-surface/50 backdrop-blur-sm border border-dark-border rounded-xl p-6 hover:border-sui-cyan/50 transition-all duration-300 hover:shadow-neon hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.gradient} mb-4 group-hover:scale-110 transition-transform`}>
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>

              {/* Value */}
              <div className="text-3xl font-black text-white mb-1 group-hover:text-sui-cyan transition-colors">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm font-semibold text-slate-300 mb-2">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-xs text-slate-500">
                {stat.description}
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-sui-cyan/0 to-sui-cyan/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewStats;
