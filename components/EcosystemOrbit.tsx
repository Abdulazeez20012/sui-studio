
import React, { useEffect, useRef, useState } from 'react';
import Section from './ui/Section';
import { motion } from 'framer-motion';

// Real Web3 Brands & Logos
const NODES = [
  { name: 'Sui', logo: 'https://assets.coingecko.com/coins/images/26375/standard/sui_asset.jpeg', type: 'L1' },
  { name: 'Ethereum', logo: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png', type: 'L1' },
  { name: 'Solana', logo: 'https://assets.coingecko.com/coins/images/4128/standard/solana.png', type: 'L1' },
  { name: 'USDC', logo: 'https://assets.coingecko.com/coins/images/6319/standard/usdc.png', type: 'Stablecoin' },
  { name: 'Tether', logo: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png', type: 'Stablecoin' },
  { name: 'Cetus', logo: 'https://assets.coingecko.com/coins/images/30169/standard/cetus.png', type: 'DEX' },
  { name: 'Turbos', logo: 'https://assets.coingecko.com/coins/images/30473/standard/turbos.png', type: 'DEX' },
  { name: 'Scallop', logo: 'https://assets.coingecko.com/coins/images/30474/standard/scallop.png', type: 'Lending' },
  { name: 'Navi', logo: 'https://assets.coingecko.com/coins/images/34346/standard/navi.png', type: 'Lending' },
  { name: 'Aftermath', logo: 'https://pbs.twimg.com/profile_images/1649134956763480064/W-r5q7m__400x400.jpg', type: 'DeFi' }, // Fallback if not on CG
  { name: 'Typus', logo: 'https://pbs.twimg.com/profile_images/1656834372983160833/2W0s0d0O_400x400.jpg', type: 'DeFi' },
  { name: 'Kriya', logo: 'https://assets.coingecko.com/coins/images/29678/standard/kriya.png', type: 'DEX' },
  { name: 'Bucket', logo: 'https://pbs.twimg.com/profile_images/1666060098907144193/6X6z6Z6__400x400.jpg', type: 'Protocol' },
  { name: 'Bluefin', logo: 'https://pbs.twimg.com/profile_images/1709972322587394048/8X8z8Z8__400x400.jpg', type: 'Exchange' },
  { name: 'Pyth', logo: 'https://assets.coingecko.com/coins/images/31924/standard/pyth.png', type: 'Oracle' },
];

const EcosystemOrbit: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [projectNodes, setProjectNodes] = useState<any[]>([]);
  const rotationRef = useRef({ x: 0.2, y: 0 });
  const requestRef = useRef<number>(0);

  // Configuration
  const RADIUS = 320; // Slightly larger
  const PERSPECTIVE = 1000;

  // Initialize Nodes with Spherical Coordinates (Fibonacci Sphere)
  useEffect(() => {
    const newNodes = NODES.map((node, i) => {
      const phi = Math.acos(-1 + (2 * i) / NODES.length);
      const theta = Math.sqrt(NODES.length * Math.PI) * phi;

      return {
        ...node,
        baseX: RADIUS * Math.cos(theta) * Math.sin(phi),
        baseY: RADIUS * Math.sin(theta) * Math.sin(phi),
        baseZ: RADIUS * Math.cos(phi),
        x: 0, y: 0, z: 0, scale: 1, opacity: 1, zIndex: 1
      };
    });
    setProjectNodes(newNodes);
  }, []);

  // Animation Loop
  useEffect(() => {
    const animate = () => {
      if (!isHovered) {
        rotationRef.current.y += 0.0015; // Smooth continuous rotation
        rotationRef.current.x = Math.sin(Date.now() * 0.0005) * 0.1 + 0.2; // Gentle wobble
      }

      // Rotation Matrix Values
      const rx = rotationRef.current.x;
      const ry = rotationRef.current.y;
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);

      // Update React Node Positions
      setProjectNodes(prevNodes => prevNodes.map(node => {
        // Rotate
        let x1 = node.baseX * cosY - node.baseZ * sinY;
        let z1 = node.baseZ * cosY + node.baseX * sinY;
        let y1 = node.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.baseY * sinX;

        // Project
        const scale = PERSPECTIVE / (PERSPECTIVE + z2);

        return {
          ...node,
          x: x1 * scale,
          y: y1 * scale,
          z: z2,
          scale: scale,
          opacity: (z2 + RADIUS) / (2 * RADIUS),
          zIndex: Math.floor(scale * 100)
        };
      }));

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isHovered]);

  return (
    <Section className="py-32 overflow-hidden relative bg-[#0B0F14]" id="ecosystem-orbit">
      {/* Background Elements - Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sui-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-20 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading font-black text-4xl md:text-6xl mb-6 text-white tracking-tight"
        >
          Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-sui-cyan to-blue-600">Ecosystem</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 font-medium max-w-2xl mx-auto text-xl"
        >
          Join the fastest growing network of DeFi, Gaming, and Infrastructure.
        </motion.p>
      </div>

      {/* 3D Scene Container */}
      <div
        ref={containerRef}
        className="relative h-[600px] w-full flex items-center justify-center perspective-1000"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Orbital Rings - Pure CSS for cleanliness */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />

        {/* Central SUI Hub */}
        <div className="absolute z-20 w-32 h-32 rounded-full bg-[#0B0F14] border-2 border-sui-cyan/30 flex items-center justify-center shadow-[0_0_50px_rgba(60,185,255,0.2)]">
          <div className="absolute inset-0 bg-sui-cyan/10 rounded-full animate-pulse" />
          <div className="flex flex-col items-center justify-center z-10">
            <img
              src="https://assets.coingecko.com/coins/images/26375/standard/sui_asset.jpeg"
              alt="Sui Logo"
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Project Nodes */}
        <div className="relative w-0 h-0 preserve-3d">
          {projectNodes.map((node, idx) => (
            <div
              key={idx}
              className="absolute top-0 left-0 flex flex-col items-center justify-center cursor-pointer group will-change-transform"
              style={{
                transform: `translate3d(${node.x}px, ${node.y}px, 0) scale(${node.scale})`,
                opacity: Math.max(0.3, node.opacity),
                zIndex: node.zIndex,
              }}
            >
              <div className="relative transition-transform duration-300 group-hover:scale-125">
                {/* Icon Circle */}
                <div
                  className="w-14 h-14 rounded-full bg-[#1A1F26] border border-white/10 flex items-center justify-center shadow-lg overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img
                    src={node.logo}
                    alt={node.name}
                    className="w-full h-full object-cover p-2"
                    onError={(e) => {
                      // Fallback if image fails
                      (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/1A1F26/FFF?text=' + node.name[0];
                    }}
                  />
                </div>

                {/* Label Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 translate-y-2 group-hover:translate-y-0">
                  <div className="px-4 py-2 bg-[#1A1F26]/90 backdrop-blur-md border border-white/10 rounded-xl text-center whitespace-nowrap shadow-xl">
                    <div className="text-sm font-bold text-white">{node.name}</div>
                    <div className="text-[10px] text-sui-cyan font-bold uppercase tracking-wider">{node.type}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default EcosystemOrbit;
