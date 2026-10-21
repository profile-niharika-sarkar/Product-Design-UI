import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

function AnimatedCounter({ value }: { value: string }) {
  const numericMatch = value.match(/\d+/);
  const suffix = value.replace(/\d+/g, '');
  const numericTarget = numericMatch ? parseInt(numericMatch[0], 10) : 0;
  
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const startTimeStamp = performance.now();
    const rollDuration = 2200; // Time in ms to count up
    const holdDuration = 1800; // Time in ms to stay at target
    const totalCycle = rollDuration + holdDuration;

    const animate = (timestamp: number) => {
      const elapsed = (timestamp - startTimeStamp) % totalCycle;

      if (elapsed < rollDuration) {
        const progress = elapsed / rollDuration;
        // Ease-out cubic for a premium decelerating rolling slot-machine feel
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(numericTarget * easedProgress);
        setCount(currentCount);
      } else {
        setCount(numericTarget);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [numericTarget]);

  return (
    <span className="inline-block tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

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
    <span className="clip-text inline-block">
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
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[85vh] flex flex-col items-center justify-start overflow-hidden pt-[140px] pb-4"
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,209,193,0.25) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-20 -right-20 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,169,157,0.2) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)' }}
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
              background: 'radial-gradient(circle, rgba(0,209,193,0.9) 0%, transparent 70%)',
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
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-xs md:text-[13px] text-brand-primary font-medium mb-6 mt-0 tracking-wide"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
          Welcome to Media 21 
        </motion.div>

        {/* Main headline */}
        <h1 className="text-[28px] sm:text-[40px] md:text-[56px] lg:text-[72px] xl:text-[80px] font-extrabold leading-[1.12] tracking-tight mb-6">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <AnimatedWord text="Built" delay={0.4} />
            <AnimatedWord text="For" delay={0.5} />
            <AnimatedWord text="Brands" delay={0.6} />
            <AnimatedWord text="That" delay={0.7} />
            <AnimatedWord text="Want" delay={0.8} />
            <AnimatedWord text="To" delay={0.9} />
            <span className="clip-text inline-block">
              <motion.span
                className="inline-block text-gradient-animate"
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
              >
                Stand
              </motion.span>
            </span>
            <span className="clip-text inline-block">
              <motion.span
                className="inline-block text-gradient-animate"
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                Out
              </motion.span>
            </span>
          </div>
        </h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/70 text-[16px] md:text-[18px] lg:text-[20px] max-w-4xl mx-auto mb-8 leading-relaxed text-center font-normal"
        >
          <strong className="font-bold text-white">Media 21</strong> is a full-service marketing agency built on experience and shaped by how marketing works today. 
          We create strategy, content, campaigns, and communication that help brands stay relevant and grow with purpose.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-12 grid grid-cols-3 gap-8 max-w-xl mx-auto"
        >
          {[
            { value: '40+', label: 'Clients' },
            { value: '11', label: 'Years' },
            { value: '25+', label: 'Categories' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gradient leading-none tracking-tight">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-white/50 text-xs md:text-sm mt-2 font-medium tracking-wide uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
