import React, { useState, useEffect } from 'react';
import { Star, Quote, MessageCircle, User, Lock, Palette, Zap as ZapIcon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StaggerContainer, FoldInOut, FadeUp } from '../src/lib/animations';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % 6); // 6 is length of testimonials
    }, 5000);
    return () => clearInterval(timer);
  }, []);
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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
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

        {/* Carousel Container */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full"
            >
              <div className="group relative glass-card p-8 md:p-12 rounded-2xl border border-white/5 bg-walrus-dark-800/40 backdrop-blur-xl">
                {/* Quote Icon */}
                <div className="absolute top-8 right-8 opacity-10">
                  <Quote className="w-16 h-16 text-walrus-cyan" />
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* Left: Avatar & Info */}
                  <div className="flex flex-col items-center md:items-start gap-4 shrink-0 text-center md:text-left">
                    <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center text-3xl border border-sui-cyan/30 text-sui-cyan shadow-[0_0_30px_-10px_rgba(0,224,255,0.3)]">
                      {testimonials[currentIndex].avatar}
                    </div>
                    <div>
                      <div className="font-bold text-xl text-sui-cyan font-heading">{testimonials[currentIndex].name}</div>
                      <div className="text-sm text-slate-400 font-sans">{testimonials[currentIndex].role}</div>

                      {/* Rating */}
                      <div className="flex gap-1 mt-2 justify-center md:justify-start">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-sui-cyan text-sui-cyan" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1">
                    <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-sans italic text-center md:text-left">
                      "{testimonials[currentIndex].content}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'w-8 bg-sui-cyan shadow-[0_0_10px_rgba(0,224,255,0.5)]'
                : 'bg-white/20 hover:bg-white/40'
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
