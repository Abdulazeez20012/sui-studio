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
    <section className="py-20 px-6 relative overflow-hidden bg-neo-bg">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-neo-black uppercase tracking-tighter font-display">
            Built for Performance
          </h2>
          <p className="text-neo-black text-lg font-medium font-sans">
            Industry-leading features that set Sui Studio apart
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-neo-white border-3 border-neo-black rounded-none p-6 hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-200"
            >
              {/* Icon */}
              <div className={`inline-flex p-3 bg-neo-bg border-2 border-neo-black mb-4 group-hover:scale-110 transition-transform shadow-neo-sm`}>
                <div className="text-neo-black">
                  {stat.icon}
                </div>
              </div>

              {/* Value */}
              <div className="text-3xl font-black text-neo-black mb-1 font-display">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm font-bold text-neo-black mb-2 uppercase font-heading">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-xs text-neo-black font-medium font-sans">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewStats;
