/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import OurClients from './components/OurClients';
import Services from './components/Services';
import WhyM21 from './components/WhyM21';
import WhyChooseUs from './components/WhyChooseUs';
import WhyUs from './components/Why Us';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ThemeParticlesBackground from './components/ThemeParticlesBackground';

export default function App() {
  return (
    <div className="relative min-h-screen bg-transparent text-zinc-100 selection:bg-pink-500/30 selection:text-white">
      {/* Dynamic Theme Gradient Background & Flowing Particles */}
      <ThemeParticlesBackground />

      {/* Premium custom mouse interaction tracking */}
      <CustomCursor />
      
      {/* High-quality background grid pattern */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-[0.12] z-0" />

      
      {/* Content layers */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Hero />
          <WhyM21 />
          <OurClients />
          <Services />
          <WhyChooseUs />
          <WhyUs />
          <Contact />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
