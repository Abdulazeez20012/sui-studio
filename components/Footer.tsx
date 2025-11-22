
import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Github, Twitter, Disc, ArrowRight, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#0B0F14] border-t border-white/5 overflow-hidden">
       {/* Ambient Glow at bottom */}
       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sui-cyan/5 rounded-full blur-[120px] pointer-events-none" />

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-12">
          
          {/* Analytics CTA Section */}
          <div className="flex flex-col items-center text-center mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-sui-cyan mb-6"
            >
               <Sparkles className="w-3 h-3" />
               <span>Free Ecosystem Audit</span>
            </motion.div>
            
            <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="font-heading font-bold text-4xl md:text-6xl text-white mb-6 tracking-tight"
            >
               Get your Sui <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-sui-cyan to-sui-indigo">development score.</span>
            </motion.h2>
            
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="text-slate-400 mb-10 max-w-2xl text-lg leading-relaxed"
            >
               See how your Move project stacks up. Get actionable insights to improve your deployment success and gas efficiency.
            </motion.p>

            {/* Input Action */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="flex flex-col sm:flex-row gap-3 w-full max-w-md relative"
            >
               <input 
                 type="text" 
                 placeholder="Enter project repository URL..." 
                 className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-sui-cyan/50 focus:ring-1 focus:ring-sui-cyan/50 transition-all"
               />
               <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF8F3C] to-[#FF5F3C] text-white font-bold shadow-[0_0_20px_-5px_rgba(255,143,60,0.4)] hover:shadow-[0_0_30px_-5px_rgba(255,143,60,0.6)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap">
                  Get Score
                  <ArrowRight className="w-4 h-4" />
               </button>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16" />

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
             {/* Brand Column */}
             <div className="md:col-span-4">
               <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                     <Hexagon className="w-8 h-8 text-sui-cyan fill-sui-cyan/10" />
                     <div className="absolute inset-0 bg-sui-cyan/20 blur-lg" />
                  </div>
                  <span className="font-heading font-bold text-xl text-white">Sui Studio</span>
               </div>
               <p className="text-slate-500 leading-relaxed mb-6">
                 The complete development environment for the Sui ecosystem. Built for performance, designed for scale.
               </p>
               <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                     <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                     <Github className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                     <Disc className="w-5 h-5" />
                  </a>
               </div>
             </div>

             {/* Links Columns */}
             <div className="md:col-span-2 md:col-start-6">
                <h4 className="font-bold text-white mb-6">Platform</h4>
                <ul className="space-y-4 text-sm text-slate-400">
                   <li><a href="#" className="hover:text-sui-cyan transition-colors">Web Studio</a></li>
                   <li><a href="#" className="hover:text-sui-cyan transition-colors">Desktop App</a></li>
                   <li><a href="#" className="hover:text-sui-cyan transition-colors">Templates</a></li>
                   <li><a href="#" className="hover:text-sui-cyan transition-colors">Extensions</a></li>
                </ul>
             </div>

             <div className="md:col-span-2">
                <h4 className="font-bold text-white mb-6">Resources</h4>
                <ul className="space-y-4 text-sm text-slate-400">
                   <li><a href="#" className="hover:text-sui-cyan transition-colors">Documentation</a></li>
                   <li><a href="#" className="hover:text-sui-cyan transition-colors">Blog</a></li>
                   <li><a href="#" className="hover:text-sui-cyan transition-colors">Tutorials</a></li>
                   <li><a href="#" className="hover:text-sui-cyan transition-colors">Community</a></li>
                </ul>
             </div>

             <div className="md:col-span-2">
                <h4 className="font-bold text-white mb-6">Company</h4>
                <ul className="space-y-4 text-sm text-slate-400">
                   <li><a href="#" className="hover:text-sui-cyan transition-colors">About</a></li>
                   <li><a href="#" className="hover:text-sui-cyan transition-colors">Careers</a></li>
                   <li><a href="#" className="hover:text-sui-cyan transition-colors">Contact</a></li>
                   <li><a href="#" className="hover:text-sui-cyan transition-colors">Privacy Policy</a></li>
                </ul>
             </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
             <p className="text-xs text-slate-600 mb-4 md:mb-0">
                © 2025 Sui Studio Inc. All Rights Reserved.
             </p>
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-xs text-slate-500 font-mono">Systems Operational</span>
                </div>
             </div>
          </div>
       </div>
    </footer>
  );
};

export default Footer;
