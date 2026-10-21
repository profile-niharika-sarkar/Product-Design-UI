import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import RollingNumber from './RollingNumber';

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 3,
}));

function AnimatedWord({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="clip-text inline-block overflow-hidden">
      <motion.span
        className="inline-block"
        initial={{ y: '110%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[85vh] lg:min-h-screen flex flex-col items-center justify-start overflow-hidden pt-36 pb-28 md:pb-36 bg-transparent"
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,77,216,0.18) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-20 -right-20 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.1) 0%, transparent 70%)' }}
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: 'radial-gradient(circle, rgba(255,77,216,0.9) 0%, transparent 70%)',
            }}
            animate={{
              y: [0, -60, -120],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 text-center"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/5 border border-pink-500/10 rounded-full text-[14px] text-brand-pink font-medium mb-8 mt-2"
        >
          <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse" />
          Welcome to Media 21 
        </motion.div>

        {/* Main headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-[96px] font-black leading-[1.05] tracking-[-0.03em] mb-10 text-white select-none whitespace-normal"
        >
          <span className="inline-block mr-4 text-white">Visibility</span>
          <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent inline-block">
            At Scale
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/75 text-[21px] max-w-4xl mx-auto mb-8 leading-relaxed text-center font-medium"
        >
          Premium LED billboard solutions designed to place brands where attention already exists.{" "}
          <strong className="font-extrabold text-white">Media 21 Outdoor</strong> delivers visibility that people notice and remember.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.0 }}
          className="grid grid-cols-3 gap-6 sm:gap-12 max-w-2xl mx-auto pt-2 pb-12 select-none"
        >
          {[
            { value: '7', label: 'Screens', color: 'bg-gradient-to-r from-brand-pink to-brand-magenta bg-clip-text text-transparent' },
            { value: '50+', label: 'Categories', color: 'bg-gradient-to-r from-brand-magenta to-brand-purple bg-clip-text text-transparent' },
            { value: '1M+', label: 'Daily Views', color: 'bg-gradient-to-r from-brand-purple to-pink-500 bg-clip-text text-transparent' },
          ].map((stat) => (
            <div key={stat.label} className="text-center flex flex-col items-center">
              <div className="text-3xl md:text-6xl font-black leading-none">
                <RollingNumber value={stat.value} className={stat.color} />
              </div>
              <div className="text-white/45 text-xs md:text-sm mt-3 tracking-wider uppercase font-semibold font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
