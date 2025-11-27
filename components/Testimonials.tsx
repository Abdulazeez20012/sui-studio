import React from 'react';
import { Star, Quote, MessageCircle, User, Lock, Palette, Zap as ZapIcon, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { StaggerContainer, FoldInOut, ScaleReveal, FadeUp } from '../src/lib/animations';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Lead Developer at DeFi Protocol',
      avatar: <User className="w-6 h-6" />,
      content: 'The real-time video collaboration feature is a game-changer. We can now pair program on smart contracts with our remote team seamlessly.',
      rating: 5,
    },
    {
      name: 'Sarah Martinez',
      role: 'Blockchain Architect',
      avatar: <User className="w-6 h-6" />,
      content: 'Resizable panels and customizable workspace make Sui Studio feel like a professional IDE. The attention to detail is impressive.',
      rating: 5,
    },
    {
      name: 'David Kim',
      role: 'Smart Contract Auditor',
      avatar: <Lock className="w-6 h-6" />,
      content: 'The detailed error reporting with context and file locations saves me hours of debugging. Best Move IDE I\'ve used.',
      rating: 5,
    },
    {
      name: 'Emma Thompson',
      role: 'NFT Project Founder',
      avatar: <Palette className="w-6 h-6" />,
      content: 'Deployed my first NFT collection in under 10 minutes. The templates and one-click deployment are incredible!',
      rating: 5,
    },
    {
      name: 'Michael Rodriguez',
      role: 'Full-Stack Web3 Dev',
      avatar: <ZapIcon className="w-6 h-6" />,
      content: 'Screen sharing during code reviews is so smooth. The HD quality and low latency make it feel like we\'re in the same room.',
      rating: 5,
    },
    {
      name: 'Lisa Wang',
      role: 'DAO Contributor',
      avatar: <Globe className="w-6 h-6" />,
      content: 'Finally, an IDE that understands Web3 development. The integrated wallet and gas analyzer are must-have features.',
      rating: 5,
    },
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-10 dark:opacity-20" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-100/50 dark:bg-walrus-purple/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FadeUp}
            className="inline-block mb-4"
          >
            <span className="walrus-badge text-walrus-purple">
              <MessageCircle className="w-4 h-4" />
              Loved by Developers
            </span>
          </motion.div>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={FoldInOut}
            className="text-5xl md:text-6xl font-bold mb-6 font-heading"
          >
            <span className="text-white">What</span>{' '}
            <span className="bg-gradient-to-r from-[#4DA8FF] via-[#6FB6FF] to-[#00D4FF] bg-clip-text text-transparent">developers</span>{' '}
            <span className="text-white">are saying</span>
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={StaggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={ScaleReveal}
              className="group relative glass-card-hover p-8 rounded-xl"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Quote className="w-12 h-12 text-walrus-cyan" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-sui-cyan text-sui-cyan" />
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-300 leading-relaxed mb-6 relative z-10 font-sans">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-2xl border border-sui-cyan/30 text-sui-cyan">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-sui-cyan font-heading">{testimonial.name}</div>
                  <div className="text-sm text-slate-400 font-sans">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
