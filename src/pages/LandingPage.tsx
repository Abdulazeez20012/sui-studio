import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import FeaturesShowcase from '../../components/FeaturesShowcase';
import NewStats from '../../components/NewStats';
import Partners from '../../components/Partners';
import EcosystemOrbit from '../../components/EcosystemOrbit';
import PlatformShowcase from '../../components/PlatformShowcase';
import WalrusIntegration from '../../components/WalrusIntegration';
import WorkflowIntegration from '../../components/WorkflowIntegration';
import Testimonials from '../../components/Testimonials';
import Personas from '../../components/Personas';
import Roadmap from '../../components/Roadmap';
import Pricing from '../../components/Pricing';
import Footer from '../../components/Footer';
import MouseFollower from '../../components/ui/MouseFollower';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden relative font-sans selection:bg-blue-500/30 selection:text-blue-200">

      {/* 4-Layer Background System */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Layer 1: Apple Black Base */}
        <div className="absolute inset-0 bg-[#000000]" />

        {/* Layer 2: Walrus Purple (Deep Atmospheric Glow - Top Right) */}
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#7C3AED]/20 rounded-full blur-[120px] mix-blend-screen opacity-60" />

        {/* Layer 3: Sui Blue (Vibrant Accent - Center Left) */}
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-[#00E0FF]/15 rounded-full blur-[100px] mix-blend-screen opacity-50" />

        {/* Layer 4: White (Subtle Top-Center Highlight) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-white/5 rounded-full blur-[80px] mix-blend-overlay" />

        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="space-y-24 pb-24">
          <Hero />
          <FeaturesShowcase />
          <NewStats />
          <EcosystemOrbit />
          <Partners />
          <PlatformShowcase />
          <WalrusIntegration />
          <WorkflowIntegration />
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
