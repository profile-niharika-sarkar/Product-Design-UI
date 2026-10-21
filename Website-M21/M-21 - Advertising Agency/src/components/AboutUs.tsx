import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

export default function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const inView = useInView(titleRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imgParallax = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const textParallax = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  return (
    <section id="about" ref={sectionRef} className="py-12 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1/2 opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at left, rgba(0,209,193,0.08), transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: images */}
          <div className="relative">
            <motion.div style={{ y: imgParallax }} className="relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
                <img
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="M21 Team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent" />
              </div>

              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -right-6 glass-brand rounded-2xl p-5 border border-brand-primary/20 max-w-[200px]"
              >
                <div className="text-3xl font-bold text-gradient mb-1">11</div>
                <div className="text-white/60 text-sm">Years of excellence in digital innovation</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -top-6 -left-6 glass rounded-2xl p-4 border border-white/10"
              >
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-brand-primary text-xs">★</span>
                  ))}
                </div>
                <div className="text-white text-xs font-semibold">Award-Winning</div>
                <div className="text-white/40 text-xs">Creative Agency</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: text */}
          <motion.div ref={titleRef} style={{ y: textParallax }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="inline-flex items-center gap-2 px-4 py-2 glass-brand rounded-full text-sm text-brand-primary font-medium mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              Who We Are
            </motion.div>

            <div className="clip-text">
              <motion.h2
                initial={{ y: '100%' }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-6xl font-bold text-white leading-tight"
              >
                We Are
              </motion.h2>
            </div>
            <div className="clip-text">
              <motion.h2
                initial={{ y: '100%' }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-6xl font-bold text-gradient mb-8"
              >
                Media 21
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-white/70 leading-relaxed text-[21px] mb-6 text-left"
            >
              Media 21 is a full-service digital agency born from a passion for innovation.
              We exist to bridge the gap between creative excellence and business growth — combining
              deep strategic thinking with outstanding creative execution.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-white/70 leading-relaxed text-[21px] mb-10 text-left"
            >
              Founded on the belief that every brand has an extraordinary story to tell, we've
              spent years perfecting the art of digital storytelling — crafting experiences that
              captivate audiences and drive measurable results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-4 mb-10"
            >
              {[
                { value: '200+', label: 'Projects Delivered' },
                { value: '50+', label: 'Team Members' },
                { value: '15+', label: 'Industries Served' },
                { value: '3x', label: 'Avg. Client Growth' },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4 border border-white/5">
                  <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-white/40 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(0,209,193,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const el = document.querySelector('#contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-full bg-brand-primary text-white font-semibold"
            >
              Work With Us
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
