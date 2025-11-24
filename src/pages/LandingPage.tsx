import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import Partners from '../../components/Partners';
import EcosystemOrbit from '../../components/EcosystemOrbit';
import PlatformShowcase from '../../components/PlatformShowcase';
import WalrusIntegration from '../../components/WalrusIntegration';
import WorkflowIntegration from '../../components/WorkflowIntegration';
import Stats from '../../components/Stats';
import Personas from '../../components/Personas';
import Roadmap from '../../components/Roadmap';
import Pricing from '../../components/Pricing';
import Footer from '../../components/Footer';
import MouseFollower from '../../components/ui/MouseFollower';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white selection:bg-sui-cyan/30 overflow-x-hidden relative">
      <MouseFollower />
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        <EcosystemOrbit />
        <Partners />
        <PlatformShowcase />
        <WalrusIntegration />
        <WorkflowIntegration />
        <Stats />
        <Personas />
        <Roadmap />
        <Pricing />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
