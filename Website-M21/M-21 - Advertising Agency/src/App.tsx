import { useEffect } from 'react';
import Lenis from 'lenis';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import NeoGradients from './components/NeoGradients';
import Hero from './components/Hero';
import OurSpace from './components/OurSpace';
import ClientSlider from './components/ClientSlider';
import OurClients from './components/OurClients';
import Services from './components/Services';
import WhyM21 from './components/WhyM21';
import BrandVisibility from './components/BrandVisibility';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative bg-brand-dark text-white font-montserrat min-h-screen overflow-x-hidden">
      <ParticleBackground />
      <NeoGradients />
      <CustomCursor />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <OurSpace />
        <ClientSlider />
        <OurClients />
        <Services />
        <WhyM21 />
        <BrandVisibility />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
