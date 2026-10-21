import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function BrandVisibility() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  // Generate simple random particles for the background effect matching the brand theme
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * -10,
  }));

  return (
    <section ref={ref} className="pt-0 pb-0 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="glass border border-white/6 rounded-[40px] p-8 md:p-16 text-center relative overflow-hidden group">
          {/* Subtle animated border effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 via-transparent to-brand-secondary/5 opacity-30 group-hover:opacity-100 transition-opacity duration-1000" />
          
          {/* Animated custom particles inside the container */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-brand-primary"
                style={{
                  width: p.size,
                  height: p.size,
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  filter: 'blur(1px)',
                  boxShadow: '0 0 10px rgba(0,209,193,0.8)',
                }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, Math.random() * 30 - 15, 0],
                  opacity: [0.1, 0.6, 0.1],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: p.delay,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-4xl mx-auto py-4">
            <div className="clip-text mb-6">
              <motion.h2
                initial={{ y: '100%', opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                You’ve Seen The Direction. <br /> <span className="text-gradient">Now Let’s Build The Brand.</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/70 text-[18px] max-w-3xl mx-auto text-center leading-relaxed"
            >
              Whether you’re launching something new, refreshing your communication, or scaling your visibility, <strong className="font-bold text-white">Media 21</strong> is ready to help move your brand forward.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
