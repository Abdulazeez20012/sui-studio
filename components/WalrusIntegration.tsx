import React from 'react';
import { Upload, Zap, Shield, Globe } from 'lucide-react';

const WalrusIntegration: React.FC = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neon-purple/10 border border-neon-purple/30 rounded-full">
              <Zap size={16} className="text-neon-purple" />
              <span className="text-sm font-bold text-neon-purple uppercase tracking-wider font-tech">
                Powered by Walrus
              </span>
            </div>

            <h2 className="text-5xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              ONE-CLICK UPLOAD TO
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-sui-cyan mt-2">
                WALRUS STORAGE
              </span>
            </h2>

            <p className="text-lg text-slate-400 leading-relaxed font-medium" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Deploy your projects to decentralized storage instantly. Walrus provides secure, 
              fast, and reliable storage for your Sui applications with just one click.
            </p>

            {/* Features */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-neon-purple/10 rounded-lg flex items-center justify-center border border-neon-purple/30 flex-shrink-0">
                  <Upload size={20} className="text-neon-purple" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1 font-tech">Instant Upload</h3>
                  <p className="text-sm text-slate-400 font-tech">Deploy your entire project with a single click</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-sui-cyan/10 rounded-lg flex items-center justify-center border border-sui-cyan/30 flex-shrink-0">
                  <Shield size={20} className="text-sui-cyan" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1 font-tech">Decentralized & Secure</h3>
                  <p className="text-sm text-slate-400 font-tech">Your data is distributed and encrypted across the network</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-neon-green/10 rounded-lg flex items-center justify-center border border-neon-green/30 flex-shrink-0">
                  <Globe size={20} className="text-neon-green" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1 font-tech">Global CDN</h3>
                  <p className="text-sm text-slate-400 font-tech">Fast access from anywhere in the world</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-neon-purple to-sui-cyan text-black font-black uppercase tracking-wider rounded-lg overflow-hidden transition-all hover:shadow-neon-lg font-tech">
                <span className="relative z-10">Try Walrus Upload</span>
                <div className="absolute inset-0 bg-gradient-to-r from-sui-cyan to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>

          {/* Right Side - Walrus Logo with Animation */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-neon-purple/20 via-transparent to-transparent blur-3xl"></div>
            
            {/* Animated Border */}
            <div className="relative p-1 rounded-3xl bg-gradient-to-r from-neon-purple via-sui-cyan to-neon-pink animate-gradient-shift">
              <div className="bg-dark-surface rounded-3xl p-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 212, 255, 0.3) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>

                {/* Walrus Logo */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="relative group">
                    {/* Outer Glow Ring */}
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-sui-cyan rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
                    
                    {/* Logo Container */}
                    <div className="relative w-80 h-80 bg-gradient-to-br from-dark-bg to-dark-panel rounded-full flex items-center justify-center border-4 border-neon-purple/30 group-hover:border-neon-purple/60 transition-all shadow-2xl">
                      <img 
                        src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763911075/walrus_es4xqr.png"
                        alt="Walrus Storage"
                        className="w-64 h-64 object-contain transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Floating Particles */}
                    <div className="absolute -top-4 -right-4 w-3 h-3 bg-neon-purple rounded-full animate-ping"></div>
                    <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-sui-cyan rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute top-1/2 -right-6 w-2 h-2 bg-neon-pink rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="relative z-10 mt-8 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-dark-bg/50 rounded-lg border border-neon-purple/20">
                    <div className="text-2xl font-black text-neon-purple font-tech">99.9%</div>
                    <div className="text-xs text-slate-400 font-tech">Uptime</div>
                  </div>
                  <div className="p-3 bg-dark-bg/50 rounded-lg border border-sui-cyan/20">
                    <div className="text-2xl font-black text-sui-cyan font-tech">&lt;100ms</div>
                    <div className="text-xs text-slate-400 font-tech">Latency</div>
                  </div>
                  <div className="p-3 bg-dark-bg/50 rounded-lg border border-neon-green/20">
                    <div className="text-2xl font-black text-neon-green font-tech">∞</div>
                    <div className="text-xs text-slate-400 font-tech">Scale</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WalrusIntegration;
