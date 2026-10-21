import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';


export default function Services() {
  const titleRef = useRef<HTMLDivElement>(null);
  const inView = useInView(titleRef, { once: true, margin: '-100px' });

  return (
    <section id="services" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[550px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #00D1C1 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass-brand rounded-full text-sm text-brand-primary font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Our Approach
          </motion.div>
          <div className="clip-text">
            <motion.h2
              initial={{ y: '100%' }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Relevance <span className="text-gradient">Over Noise.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center w-full"
          >
            <p className="text-white/70 text-[18px] leading-relaxed mb-10 max-w-4xl mx-auto">
              We don’t chase trends blindly. We understand them, use them where relevant, and focus on what actually creates impact for the brand long-term.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left mb-0 max-w-6xl mx-auto">
              {[
                "Strong strategy",
                "Clear creative direction",
                "Consistent communication",
                "Fast execution",
                "Premium visual standards"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3 bg-brand-primary p-4 lg:p-4 rounded-xl hover:opacity-90 transition-all duration-300 shadow-[0_4px_15px_rgba(0,209,193,0.2)] hover:shadow-[0_4px_25px_rgba(0,209,193,0.45)] hover:-translate-y-1"
                >
                  <div className="w-2 h-2 rounded-full bg-white flex-shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  <span className="text-white font-semibold text-sm leading-tight">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Deleted modern marketing quote */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
