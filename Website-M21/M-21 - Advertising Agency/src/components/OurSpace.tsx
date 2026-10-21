import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

export default function OurSpace() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section id="our-space" ref={sectionRef} className="pt-32 pb-16 relative overflow-hidden">
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[550px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #00D1C1 0%, transparent 70%)' }}
        />
      </motion.div>
 
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={titleInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass-brand rounded-full text-sm text-brand-primary font-medium mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Who We Are
          </motion.div>
 
          <div className="max-w-5xl mx-auto">
            <div className="clip-text">
              <motion.h2
                initial={{ y: '100%' }}
                animate={titleInView ? { y: 0 } : {}}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 pb-2"
              >
                Modern Marketing
              </motion.h2>
            </div>
            <div className="clip-text">
              <motion.h2
                initial={{ y: '100%' }}
                animate={titleInView ? { y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-8 pb-3"
              >
                Backed By Experience
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/70 text-[18px] max-w-5xl mx-auto leading-relaxed text-center"
            >
              <p>
                <strong className="font-bold text-white">Media 21</strong> was built for brands that want more than just content. We combine strategy, creative production, social media, public relations, performance marketing, and branding to create communication that feels relevant, premium, and built for today’s audience. Over the years, we’ve worked across industries including luxury real estate, hospitality, automotive, FMCG, fintech, and retail, helping brands grow with consistency and clarity. No unnecessary complexity.
              </p>
              <p className="font-bold text-white mt-4">
                No marketing for the sake of it.
              </p>
              <p className="font-bold text-white mt-1">
                Just work designed to move brands forward.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
