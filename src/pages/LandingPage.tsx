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
import Stats from '../../components/Stats';
import Personas from '../../components/Personas';
import Roadmap from '../../components/Roadmap';
import Pricing from '../../components/Pricing';
import Footer from '../../components/Footer';
import MouseFollower from '../../components/ui/MouseFollower';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neo-bg dark:bg-[#0B0F14] text-neo-black dark:text-white overflow-x-hidden relative font-sans transition-colors duration-300">
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <FeaturesShowcase />
        <NewStats />
        <EcosystemOrbit />
        <Partners />
        <PlatformShowcase />
        <WalrusIntegration />
        <WorkflowIntegration />
        <Testimonials />
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
