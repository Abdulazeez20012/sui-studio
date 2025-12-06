import React from 'react';
import { Upload, Zap, Shield, Globe, ArrowRight, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeUp, FoldInOut, StaggerContainer, ScaleReveal } from '../src/lib/animations';

const WalrusIntegration: React.FC = () => {
  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: 'Instant Upload',
      description: 'Deploy to decentralized storage with one click',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'High performance reads and writes for any app',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Always Secure',
      description: 'Data encryption and access control built-in',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global CDN',
      description: 'Fast access from anywhere in the world',
    },
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background Effects */}


      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FadeUp}
              className="walrus-badge text-walrus-purple"
            >
              <Zap size={16} />
              Powered by Walrus
            </motion.div>

            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FoldInOut}
              className="text-5xl font-bold text-content"
            >
              ONE-CLICK UPLOAD TO
              <span className="block gradient-text mt-2">
                WALRUS STORAGE
              </span>
            </motion.h2>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FadeUp}
              className="text-lg text-content-muted leading-relaxed"
            >
              Deploy your projects to decentralized storage instantly. Walrus provides secure,
              fast, and reliable storage for your Sui applications with just one click.
            </motion.p>

            {/* Features Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={StaggerContainer}
              className="grid grid-cols-2 gap-4 pt-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={ScaleReveal}
                  className="flex items-start gap-3"
                >
                  <div className="p-2 glass-card rounded-lg text-walrus-cyan flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-content font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-content-muted">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={FadeUp}
              className="pt-6"
            >
              <a
                href="https://docs.walrus.site"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 walrus-button-primary"
              >
                Learn More About Walrus
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* Right Side - Visual/Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="glass-card-hover p-8 rounded-2xl">
              {/* Walrus Logo */}
              <div className="aspect-square rounded-xl bg-gradient-to-br from-walrus-cyan/20 via-walrus-purple/20 to-walrus-pink/20 flex items-center justify-center mb-6 p-8">
                <img
                  src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763911075/walrus_es4xqr.png"
                  alt="Walrus Storage"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-lg">
                  <div className="text-2xl font-bold text-content mb-1">5s</div>
                  <div className="text-sm text-content-muted">Avg. Upload Time</div>
                </div>
                <div className="glass-card p-4 rounded-lg">
                  <div className="text-2xl font-bold text-content mb-1">99.9%</div>
                  <div className="text-sm text-content-muted">Uptime</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WalrusIntegration;
