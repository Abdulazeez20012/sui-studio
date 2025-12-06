
import React, { useState } from 'react';
import Section from './ui/Section';
import { motion } from 'framer-motion';

// Real Web3 Brands & Logos
const NODES = [
  // Inner Ring (Core DeFi)
  { name: 'Cetus', logo: 'https://assets.coingecko.com/coins/images/30169/standard/cetus.png', type: 'DEX', layer: 'inner', angle: 0 },
  { name: 'Navi', logo: 'https://assets.coingecko.com/coins/images/34346/standard/navi.png', type: 'Lending', layer: 'inner', angle: 120 },
  { name: 'Scallop', logo: 'https://assets.coingecko.com/coins/images/30474/standard/scallop.png', type: 'Lending', layer: 'inner', angle: 240 },

  // Middle Ring (L1s & Stablecoins)
  { name: 'USDC', logo: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png', type: 'Stablecoin', layer: 'middle', angle: 45 },
  { name: 'Solana', logo: 'https://assets.coingecko.com/coins/images/4128/standard/solana.png', type: 'L1', layer: 'middle', angle: 135 },
  { name: 'Ethereum', logo: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png', type: 'L1', layer: 'middle', angle: 225 },
  { name: 'Pyth', logo: 'https://assets.coingecko.com/coins/images/31924/standard/pyth.png', type: 'Oracle', layer: 'middle', angle: 315 },

  // Outer Ring (Infrastructure & Partners)
  { name: 'Typus', logo: 'https://pbs.twimg.com/profile_images/1656834372983160833/2W0s0d0O_400x400.jpg', type: 'DeFi', layer: 'outer', angle: 30 },
  { name: 'Bluefin', logo: 'https://pbs.twimg.com/profile_images/1709972322587394048/8X8z8Z8__400x400.jpg', type: 'Exchange', layer: 'outer', angle: 100 },
  { name: 'Bucket', logo: 'https://pbs.twimg.com/profile_images/1666060098907144193/6X6z6Z6__400x400.jpg', type: 'Protocol', layer: 'outer', angle: 170 },
  { name: 'Turbos', logo: 'https://assets.coingecko.com/coins/images/30473/standard/turbos.png', type: 'DEX', layer: 'outer', angle: 240 },
  { name: 'Aftermath', logo: 'https://pbs.twimg.com/profile_images/1649134956763480064/W-r5q7m__400x400.jpg', type: 'DeFi', layer: 'outer', angle: 310 },
];

const EcosystemOrbit: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Orbit Configuration
  const innerRadius = 160;
  const middleRadius = 260;
  const outerRadius = 360;

  return (
    <Section className="py-32 overflow-hidden relative bg-transparent" id="ecosystem-orbit">
      {/* Background Elements - Subtle Gradient */}


      <div className="text-center mb-24 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-sans font-medium text-5xl md:text-7xl mb-6 text-white tracking-tighter"
        >
          Global <span className="text-[#3B82F6]">Ecosystem</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 font-light max-w-2xl mx-auto text-xl"
        >
          Join the fastest growing network of DeFi, Gaming, and Infrastructure.
        </motion.p>
      </div>

      {/* Orbit Container */}
      <div
        className="relative h-[800px] w-full flex items-center justify-center overflow-visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        {/* Central Hub */}
        <div className="absolute z-20 w-32 h-32 rounded-full bg-[#000000] border border-white/10 flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.15)]">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse-slow" />
          <div className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-white to-slate-300 p-0.5 shadow-xl">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img
                src="https://assets.coingecko.com/coins/images/26375/standard/sui_asset.jpeg"
                alt="Sui"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Orbit Rings */}

        {/* Inner Ring */}
        <div className="absolute border border-white/5 rounded-full" style={{ width: innerRadius * 2, height: innerRadius * 2 }} />
        <div
          className={`absolute w-full h-full flex items-center justify-center animate-[spin_40s_linear_infinite] ${isHovered ? '[animation-play-state:paused]' : ''}`}
        >
          {NODES.filter(n => n.layer === 'inner').map((node, i) => (
            <OrbitNode key={i} node={node} radius={innerRadius} />
          ))}
        </div>

        {/* Middle Ring */}
        <div className="absolute border border-white/5 rounded-full" style={{ width: middleRadius * 2, height: middleRadius * 2 }} />
        <div
          className={`absolute w-full h-full flex items-center justify-center animate-[spin_60s_linear_infinite_reverse] ${isHovered ? '[animation-play-state:paused]' : ''}`}
        >
          {NODES.filter(n => n.layer === 'middle').map((node, i) => (
            <OrbitNode key={i} node={node} radius={middleRadius} reverse />
          ))}
        </div>

        {/* Outer Ring */}
        <div className="absolute border border-white/5 rounded-full" style={{ width: outerRadius * 2, height: outerRadius * 2 }} />
        <div
          className={`absolute w-full h-full flex items-center justify-center animate-[spin_80s_linear_infinite] ${isHovered ? '[animation-play-state:paused]' : ''}`}
        >
          {NODES.filter(n => n.layer === 'outer').map((node, i) => (
            <OrbitNode key={i} node={node} radius={outerRadius} />
          ))}
        </div>

      </div>
    </Section>
  );
};

const OrbitNode: React.FC<{ node: any, radius: number, reverse?: boolean }> = ({ node, radius, reverse }) => {
  return (
    <div
      className="absolute top-1/2 left-1/2 -ml-8 -mt-8 flex items-center justify-center group"
      style={{
        transform: `rotate(${node.angle}deg) translateX(${radius}px) rotate(${reverse ? node.angle : -node.angle}deg)`,
      }}
    >
      {/* Node Visual */}
      <div className="relative w-16 h-16 transition-all duration-300 group-hover:scale-110 cursor-pointer">
        <div className="absolute inset-0 bg-[#0B0F14] rounded-full border border-white/10 shadow-lg flex items-center justify-center group-hover:border-[#3B82F6]/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
          <img
            src={node.logo}
            alt={node.name}
            className="w-10 h-10 rounded-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${node.name}&background=random&color=fff`;
            }}
          />
        </div>

        {/* Floating Label */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 translate-y-2 group-hover:translate-y-0">
          <div className="px-3 py-1.5 bg-[#1A1F26]/90 backdrop-blur-md border border-white/10 rounded-lg text-center whitespace-nowrap shadow-xl">
            <div className="text-xs font-bold text-white">{node.name}</div>
            <div className="text-[10px] text-slate-400">{node.type}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EcosystemOrbit;
