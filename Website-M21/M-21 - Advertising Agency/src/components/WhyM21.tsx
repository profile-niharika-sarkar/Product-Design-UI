import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const industries = [
  {
    title: 'Luxury Real Estate',
    desc: 'Creating premium positioning and campaign narratives that appeal to high-net-worth investors and buyers.',
    image: '/Images/luxury-retail.png',
  },
  {
    title: 'Banking',
    desc: 'Elevating financial marketing to translate trust, security, and innovation into clear brand communication and consistent customer experiences.',
    image: '/Images/banking_1080.png',
  },
  {
    title: 'Automotive',
    desc: 'Driving premium campaign strategy, product launches, and content that moves buyers through interest to purchase.',
    image: '/Images/automotive_1080.png',
  },
  {
    title: 'FMCG & Retail',
    desc: 'Fast-paced creative solutions and strategic performance campaigns built for transaction-driven consumer markets.',
    image: '/Images/FMCG-and-retail.png',
  },
];

export default function WhyM21() {
  const titleRef = useRef<HTMLDivElement>(null);
  const inView = useInView(titleRef, { once: true, margin: '-100px' });

  return (
    <section id="why-m21" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[550px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #00D1C1 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass-brand rounded-full text-sm text-brand-primary font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Our Experience
          </motion.div>
          <div className="clip-text">
            <motion.h2
              initial={{ y: '100%' }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
            >
              Built Across <span className="text-gradient">Multiple Industries</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-white/70 mt-6 text-[18px] max-w-4xl mx-auto leading-relaxed text-center"
          >
            Our experience across categories allows us to adapt quickly, understand audiences better, 
            and create communication that fits both the brand and the market.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, i) => {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative aspect-[4/5] glass rounded-3xl border border-white/6 hover:border-brand-primary/30 transition-all duration-500 text-left overflow-hidden flex flex-col"
                data-cursor="hover"
              >
                {/* Icon Section - top half */}
                <div className="h-[50%] overflow-hidden bg-white/3 flex items-center justify-center border-b border-white/5 group-hover:bg-white/5 transition-colors duration-500 relative">
                  <img 
                    src={ind.image} 
                    alt={ind.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text Section - bottom half aligned to Bottom */}
                <div className="flex-1 p-6 flex flex-col justify-start bg-brand-dark/10">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gradient transition-all duration-300">
                    {ind.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed text-left line-clamp-4">
                    {ind.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
