import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Who We Are', href: '#our-space' },
  { label: 'Services', href: '#agency-services' },
  { label: 'Our Approach', href: '#services' },
  { label: 'Our Experience', href: '#why-m21' },
  { label: 'Why Media 21', href: '#experience' },
];

const renderLabel = (label: string) => {
  if (label.includes('Media 21')) {
    const parts = label.split('Media 21');

    return (
      <>
        {parts[0]}
        <span className="font-bold text-white">Media 21</span>
        {parts[1]}
      </>
    );
  }

  return label;
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);

    const el = document.querySelector(href);

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-brand-dark/80 backdrop-blur-xl'
            : 'py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <motion.a
            href="https://m21world.com/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center cursor-pointer"
          >
            <img
              src="/Images/Media 21 logo.png"
              alt="Media 21"
              className="h-10 md:h-11 w-auto"
            />
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.href);
                }}
                className="text-white hover:text-white text-sm font-medium transition-colors duration-200 relative group"
                whileHover={{ y: -1 }}
              >
                {renderLabel(link.label)}

                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-brand-primary group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          {/* Contact Button */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNav('#contact')}
              className="px-5 py-2 rounded-full bg-brand-primary text-white text-sm font-semibold animate-pulse-glow"
            >
              Contact Us
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-brand-dark/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.href);
                }}
                className="text-3xl font-semibold text-white hover:text-white transition-colors"
              >
                {renderLabel(link.label)}
              </motion.a>
            ))}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.07 }}
              onClick={() => handleNav('#contact')}
              className="mt-4 px-8 py-3 rounded-full bg-brand-primary text-white font-semibold text-lg"
            >
              Contact Us
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}