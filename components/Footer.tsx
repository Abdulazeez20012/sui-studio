
import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Github, Twitter, Disc, ArrowRight, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
   return (
      <footer className="relative bg-neo-white border-t-3 border-neo-black overflow-hidden">
         {/* Ambient Glow at bottom - REMOVED for Neo-Brutalism */}

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-12">

            {/* Analytics CTA Section */}
            <div className="flex flex-col items-center text-center mb-24">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-neo-accent border-2 border-neo-black text-xs font-bold text-neo-black mb-6 shadow-neo-sm"
               >
                  <Sparkles className="w-3 h-3" />
                  <span>FREE ECOSYSTEM AUDIT</span>
               </motion.div>

               <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="font-display font-black text-4xl md:text-6xl text-neo-black mb-6 tracking-tighter uppercase"
               >
                  Get your Sui <br /> <span className="text-neo-primary bg-neo-black px-2 text-white inline-block transform -rotate-1">development score.</span>
               </motion.h2>

               <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-neo-black font-medium mb-10 max-w-2xl text-lg leading-relaxed font-sans"
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
                  <input type="text"
                     placeholder="Enter project repository URL..."
                     className="flex-1 bg-neo-bg border-3 border-neo-black px-4 py-3 text-neo-black placeholder:text-gray-500 focus:outline-none focus:shadow-neo transition-all font-bold"
                  />
                  <button className="px-6 py-3 bg-neo-primary text-neo-black font-black border-3 border-neo-black shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap">
                     GET SCORE
                     <ArrowRight className="w-4 h-4" />
                  </button>
               </motion.div>
            </div>

            {/* Divider */}
            <div className="w-full h-1 bg-neo-black mb-16" />

            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
               {/* Brand Column */}
               <div className="md:col-span-4">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="relative">
                        <img
                           src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763580906/sui-sui-logo_gmux9g.png"
                           alt="Sui Logo"
                           className="w-8 h-8 object-contain"
                        />
                     </div>
                     <span className="font-display font-black text-xl text-neo-black uppercase">Sui Studio</span>
                  </div>
                  <p className="text-neo-black font-medium leading-relaxed mb-6 font-sans">
                     The complete development environment for the Sui ecosystem. Built for performance, designed for scale.
                  </p>
                  <div className="flex gap-4">
                     <a href="#" className="w-10 h-10 flex items-center justify-center bg-neo-white border-2 border-neo-black text-neo-black hover:bg-neo-accent hover:shadow-neo-sm transition-all">
                        <Twitter className="w-5 h-5" />
                     </a>
                     <a href="#" className="w-10 h-10 flex items-center justify-center bg-neo-white border-2 border-neo-black text-neo-black hover:bg-neo-accent hover:shadow-neo-sm transition-all">
                        <Github className="w-5 h-5" />
                     </a>
                     <a href="#" className="w-10 h-10 flex items-center justify-center bg-neo-white border-2 border-neo-black text-neo-black hover:bg-neo-accent hover:shadow-neo-sm transition-all">
                        <Disc className="w-5 h-5" />
                     </a>
                  </div>
               </div>

               {/* Links Columns */}
               <div className="md:col-span-2 md:col-start-6">
                  <h4 className="font-black text-neo-black mb-6 uppercase font-heading">Platform</h4>
                  <ul className="space-y-4 text-sm text-neo-black font-medium">
                     <li><a href="#" className="hover:text-neo-primary hover:underline decoration-2 transition-all">Web Studio</a></li>
                     <li><a href="#" className="hover:text-neo-primary hover:underline decoration-2 transition-all">Desktop App</a></li>
                     <li><a href="#" className="hover:text-neo-primary hover:underline decoration-2 transition-all">Templates</a></li>
                     <li><a href="#" className="hover:text-neo-primary hover:underline decoration-2 transition-all">Extensions</a></li>
                  </ul>
               </div>

               <div className="md:col-span-2">
                  <h4 className="font-black text-neo-black mb-6 uppercase font-heading">Resources</h4>
                  <ul className="space-y-4 text-sm text-neo-black font-medium">
                     <li><a href="#" className="hover:text-neo-primary hover:underline decoration-2 transition-all">Documentation</a></li>
                     <li><a href="#" className="hover:text-neo-primary hover:underline decoration-2 transition-all">Blog</a></li>
                     <li><a href="#" className="hover:text-neo-primary hover:underline decoration-2 transition-all">Tutorials</a></li>
                     <li><a href="#" className="hover:text-neo-primary hover:underline decoration-2 transition-all">Community</a></li>
                  </ul>
               </div>

               <div className="md:col-span-2">
                  <h4 className="font-black text-neo-black mb-6 uppercase font-heading">Company</h4>
                  <ul className="space-y-4 text-sm text-neo-black font-medium">
                     <li><a href="#" className="hover:text-neo-primary hover:underline decoration-2 transition-all">About</a></li>
                     <li><a href="#" className="hover:text-neo-primary hover:underline decoration-2 transition-all">Careers</a></li>
                     <li><a href="#" className="hover:text-neo-primary hover:underline decoration-2 transition-all">Contact</a></li>
                     <li><a href="#" className="hover:text-neo-primary hover:underline decoration-2 transition-all">Privacy Policy</a></li>
                  </ul>
               </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t-2 border-neo-black">
               <p className="text-xs text-neo-black font-bold mb-4 md:mb-0">
                  © 2025 Sui Studio Inc. All Rights Reserved.
               </p>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 border border-neo-black animate-pulse" />
                     <span className="text-xs text-neo-black font-mono font-bold">SYSTEMS OPERATIONAL</span>
                  </div>
               </div>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
