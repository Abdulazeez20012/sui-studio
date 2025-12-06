import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import FeaturesShowcase from '../../components/FeaturesShowcase';
import NewStats from '../../components/NewStats';
import Partners from '../../components/Partners';

import PlatformShowcase from '../../components/PlatformShowcase';
import WalrusIntegration from '../../components/WalrusIntegration';

import Testimonials from '../../components/Testimonials';
import Personas from '../../components/Personas';
import Roadmap from '../../components/Roadmap';
import Pricing from '../../components/Pricing';
import Footer from '../../components/Footer';
import MouseFollower from '../../components/ui/MouseFollower';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface text-content overflow-x-hidden relative font-sans selection:bg-brand/30 selection:text-brand transition-colors duration-300">

      {/* 4-Layer Background System */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-surface transition-colors duration-300">

        {/* === DARK MODE BACKGROUND (Keeping the premium gradient effects) === */}
        <div className="hidden dark:block absolute inset-0">
          {/* Layer 1: Base (Handled by bg-surface but reinforced here for gradient composition) */}
          <div className="absolute inset-0 bg-transparent" />

          {/* Layer 2: Walrus Purple (Deep Atmospheric Glow - Top Right) */}
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#7C3AED]/20 rounded-full blur-[120px] mix-blend-screen opacity-60" />

          {/* Layer 3: Sui Blue (Vibrant Accent - Center Left) */}
          <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-[#00E0FF]/15 rounded-full blur-[100px] mix-blend-screen opacity-50" />

          {/* Layer 4: White (Subtle Top-Center Highlight) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-white/5 rounded-full blur-[80px] mix-blend-overlay" />

          {/* Noise Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        </div>

        {/* === LIGHT MODE BACKGROUND (Keeping the clean aesthetic) === */}
        <div className="block dark:hidden absolute inset-0">
          {/* Layer 1: Base (Handled by bg-surface) */}
          <div className="absolute inset-0 bg-transparent" />

          {/* Layer 2: Soft Blue Glow (Top Right) */}
          <div className="absolute top-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60" />

          {/* Layer 3: Soft Purple Glow (Bottom Left) */}
          <div className="absolute bottom-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60" />

          {/* Layer 4: Subtle Warmth (Center) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-100/30 rounded-full blur-[100px] mix-blend-multiply opacity-40" />

          {/* Subtle Noise for Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015]" />
        </div>

      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="space-y-24 pb-24">
          <Hero />
          <FeaturesShowcase />
          <NewStats />

          <Partners />
          <PlatformShowcase />
          <WalrusIntegration />

          <Testimonials />
          <Personas />
          <Roadmap />
          <Pricing />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
