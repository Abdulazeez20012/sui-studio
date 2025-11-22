
import React, { useEffect, useRef, useState } from 'react';
import Section from './ui/Section';
import { motion } from 'framer-motion';
import { 
  Zap, Droplets, Waves, Box, Hexagon, Anchor, 
  Cloud, Shield, MapPin, Cpu, Globe, Activity, 
  Database, Share2, Radio
} from 'lucide-react';

// Specific Project List requested
const NODES = [
  { name: 'Surge', icon: <Waves size={18} />, color: '#3CB9FF', type: 'DeFi' },
  { name: 'Turbot', icon: <Activity size={18} />, color: '#F59E0B', type: 'DEX' },
  { name: 'Nafun', icon: <MapPin size={18} />, color: '#10B981', type: 'Social' },
  { name: 'Wakara', icon: <Shield size={18} />, color: '#8B5CF6', type: 'Infra' },
  { name: 'SAWNG', icon: <Radio size={18} />, color: '#EC4899', type: 'Media' },
  { name: 'PUG', icon: <span className="text-[10px] font-bold">PUG</span>, color: '#F43F5E', type: 'Meme' },
  { name: 'Ferra', icon: <Hexagon size={18} />, color: '#6366F1', type: 'DeFi' },
  { name: 'Dulceaan', icon: <Box size={18} />, color: '#F97316', type: 'NFT' },
  { name: 'ALK', icon: <span className="text-[10px] font-bold">ALK</span>, color: '#A855F7', type: 'Token' },
  { name: 'Albeni', icon: <Globe size={18} />, color: '#3B82F6', type: 'DAO' },
  { name: 'IKA', icon: <span className="text-[10px] font-bold">IKA</span>, color: '#EF4444', type: 'Game' },
  { name: 'Magros', icon: <Database size={18} />, color: '#14B8A6', type: 'Storage' },
  { name: 'Berlin', icon: <MapPin size={18} />, color: '#FFFFFF', type: 'Node' },
  { name: 'Infector', icon: <Cpu size={18} />, color: '#84CC16', type: 'Sec' },
  { name: 'Powata', icon: <Zap size={18} />, color: '#EAB308', type: 'Util' },
];

const EcosystemOrbit: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [projectNodes, setProjectNodes] = useState<any[]>([]);
  const rotationRef = useRef({ x: 0.2, y: 0 }); // Initial tilt
  const requestRef = useRef<number>(0);

  // Configuration
  const RADIUS = 300;
  const PERSPECTIVE = 800;

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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      if (!isHovered) {
        rotationRef.current.y += 0.002; // Rotate Y
      }
      
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);
      
      // Rotation Matrix Values
      const rx = rotationRef.current.x;
      const ry = rotationRef.current.y;
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);

      // --- 1. Draw Wireframe Globe (Latitude & Longitude Lines) ---
      ctx.strokeStyle = 'rgba(60, 185, 255, 0.1)';
      ctx.lineWidth = 1;

      const draw3DCircle = (radius: number, axis: 'x' | 'y' | 'z', steps: number = 60) => {
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          let x = 0, y = 0, z = 0;

          // Define circle points in 3D
          if (axis === 'y') { // Horizontal rings (Latitude)
            x = radius * Math.cos(theta);
            z = radius * Math.sin(theta);
            y = 0; // Need to offset y for multiple rings
          } else if (axis === 'x') { // Vertical rings (Longitude)
             x = radius * Math.cos(theta);
             y = radius * Math.sin(theta);
             z = 0;
          }

          // Apply Rotation
          let x1 = x * cosY - z * sinY;
          let z1 = z * cosY + x * sinY;
          let y1 = y * cosX - z1 * sinX;
          let z2 = z1 * cosX + y * sinX;

          // Project
          const scale = PERSPECTIVE / (PERSPECTIVE + z2);
          const x2d = cx + x1 * scale;
          const y2d = cy + y1 * scale;

          if (i === 0) ctx.moveTo(x2d, y2d);
          else ctx.lineTo(x2d, y2d);
        }
        ctx.closePath();
        ctx.stroke();
      };

      // Draw Latitudes
      [0, 0.5, 0.8, -0.5, -0.8].forEach(scale => {
          // We simulate latitude by drawing circles at different Y heights with scaled radii
          // Simplified: Just draw a few key wireframe rings
          // Actually, drawing rotated circles is complex. Let's draw points and connect them or just simple great circles.
          // Better: Draw 3 Longitude Great Circles
          // And 1 Equator
      });

      // Draw 3 meridian circles rotated differently to form a sphere shape
      // We will simply draw 3 circles on X/Y/Z planes rotated by the global rotation
      const sphereSteps = 3;
      for(let i=0; i<sphereSteps; i++) {
         // Hacky way to draw wireframe lines: just pre-calculate points on sphere and rotate them
      }

      // Custom Globe Drawing Logic
      // Draw Latitude Lines
      for (let lat = -60; lat <= 60; lat += 30) {
         const latRad = lat * Math.PI / 180;
         const r = RADIUS * Math.cos(latRad);
         const yBase = RADIUS * Math.sin(latRad);
         
         ctx.beginPath();
         for(let lng = 0; lng <= 360; lng += 5) {
             const lngRad = lng * Math.PI / 180;
             let x = r * Math.cos(lngRad);
             let z = r * Math.sin(lngRad);
             let y = yBase;

             // Rotate
             let x1 = x * cosY - z * sinY;
             let z1 = z * cosY + x * sinY;
             let y1 = y * cosX - z1 * sinX;
             let z2 = z1 * cosX + y * sinX;

             const scale = PERSPECTIVE / (PERSPECTIVE + z2);
             const x2d = cx + x1 * scale;
             const y2d = cy + y1 * scale;
             
             // Fading for back of globe
             ctx.globalAlpha = z2 < 0 ? 0.05 : 0.15; 
             
             if(lng === 0) ctx.moveTo(x2d, y2d);
             else ctx.lineTo(x2d, y2d);
         }
         ctx.stroke();
      }
      
      // Draw Longitude Lines
      for (let lng = 0; lng < 360; lng += 45) {
         const lngRad = lng * Math.PI / 180;
         ctx.beginPath();
         for(let lat = -90; lat <= 90; lat += 5) {
             const latRad = lat * Math.PI / 180;
             let x = RADIUS * Math.cos(latRad) * Math.cos(lngRad);
             let z = RADIUS * Math.cos(latRad) * Math.sin(lngRad);
             let y = RADIUS * Math.sin(latRad);

             // Rotate
             let x1 = x * cosY - z * sinY;
             let z1 = z * cosY + x * sinY;
             let y1 = y * cosX - z1 * sinX;
             let z2 = z1 * cosX + y * sinX;

             const scale = PERSPECTIVE / (PERSPECTIVE + z2);
             const x2d = cx + x1 * scale;
             const y2d = cy + y1 * scale;

             ctx.globalAlpha = z2 < 0 ? 0.05 : 0.15;

             if(lat === -90) ctx.moveTo(x2d, y2d);
             else ctx.lineTo(x2d, y2d);
         }
         ctx.stroke();
      }
      ctx.globalAlpha = 1; // Reset alpha

      // --- 2. Update React Node Positions ---
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
          opacity: (z2 + RADIUS) / (2 * RADIUS), // Simple depth cue
          zIndex: Math.floor(scale * 100)
        };
      }));

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isHovered]);

  return (
    <Section className="py-32 overflow-hidden relative" id="ecosystem-orbit">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-sui-cyan/5 to-transparent opacity-20 pointer-events-none rounded-full blur-3xl" />

      <div className="text-center mb-16 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading font-bold text-3xl md:text-4xl mb-4 text-white"
        >
          Global <span className="text-sui-cyan">Ecosystem</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 max-w-2xl mx-auto"
        >
          Join a rapidly expanding universe of DeFi, Gaming, and Infrastructure projects built on Sui.
        </motion.p>
      </div>

      {/* 3D Scene Container */}
      <div 
        ref={containerRef}
        className="relative h-[600px] w-full flex items-center justify-center perspective-1000"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Canvas for Wireframe Globe */}
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={800}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
        />

        {/* Central SUI Hub */}
        <div className="absolute z-20 w-28 h-28 rounded-full bg-[#0E1217] border border-sui-cyan flex items-center justify-center shadow-[0_0_60px_-10px_rgba(60,185,255,0.4)] animate-float">
          {/* Orbital Rings */}
          <div className="absolute inset-[-10px] border border-sui-cyan/20 rounded-full animate-spin-slow" />
          <div className="absolute inset-[-20px] border border-sui-cyan/10 rounded-full animate-spin-reverse-slower" />
          
          <div className="flex flex-col items-center justify-center z-10">
             <Droplets className="w-10 h-10 text-sui-cyan fill-sui-cyan/20" />
             <span className="text-xs font-bold tracking-[0.2em] text-white mt-2">SUI</span>
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
                opacity: Math.max(0.2, node.opacity),
                zIndex: node.zIndex,
              }}
            >
              {/* Connection Line to Center (Optional - can be noisy) */}
              {/* <div className="absolute top-1/2 left-1/2 w-px h-[300px] bg-gradient-to-b from-sui-cyan/10 to-transparent origin-top -translate-y-full -z-10 opacity-20" style={{ transform: `rotate(${Math.atan2(node.y, node.x)}rad)`}} /> */}

              <div className="relative">
                 {/* Icon Circle */}
                 <div 
                   className="w-10 h-10 rounded-full bg-[#161b22] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-sui-cyan group-hover:shadow-[0_0_20px_rgba(60,185,255,0.6)] group-hover:scale-110 transition-all duration-300 backdrop-blur-md"
                 >
                    <div style={{ color: node.color }}>{node.icon}</div>
                 </div>

                 {/* Label Tooltip */}
                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                    <div className="px-3 py-1.5 bg-sui-dark/90 border border-white/10 rounded-lg text-center whitespace-nowrap backdrop-blur-md shadow-xl">
                       <div className="text-xs font-bold text-white">{node.name}</div>
                       <div className="text-[10px] text-sui-cyan">{node.type}</div>
                    </div>
                 </div>
                 
                 {/* Simple Label for Distance Visibility */}
                 <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[10px] font-medium text-slate-400 whitespace-nowrap transition-opacity duration-300 ${node.zIndex < 50 ? 'opacity-0' : 'opacity-100'} group-hover:opacity-0`}>
                    {node.name}
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
