import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    step: '01',
    title: 'Discovery',
    desc: 'We begin with deep listening — understanding your business goals, challenges, and aspirations.',
    color: '#00D1C1',
  },
  {
    step: '02',
    title: 'Strategy',
    desc: 'Crafting a tailored roadmap that aligns creative direction with measurable business outcomes.',
    color: '#06B6D4',
  },
  {
    step: '03',
    title: 'Creation',
    desc: 'Bringing strategy to life through exceptional design, content, and digital experiences.',
    color: '#00A99D',
  },
  {
    step: '04',
    title: 'Launch',
    desc: 'Precision deployment across all channels, ensuring flawless execution and maximum impact.',
    color: '#00D1C1',
  },
  {
    step: '05',
    title: 'Optimize',
    desc: 'Continuous improvement through data analysis, A/B testing, and performance refinement.',
    color: '#06B6D4',
  },
  {
    step: '06',
    title: 'Scale',
    desc: 'Amplifying what works to drive exponential growth and sustainable long-term success.',
    color: '#00A99D',
  },
];

export default function OurProcess() {
  const titleRef = useRef<HTMLDivElement>(null);
  const inView = useInView(titleRef, { once: true, margin: '-100px' });

  return (
    <section id="process" className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,169,157,0.07) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 glass-brand rounded-full text-sm text-brand-primary font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Our Process
          </motion.div>
          <div className="clip-text">
            <motion.h2
              initial={{ y: '100%' }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl font-bold text-white"
            >
              Crafted for <span className="text-gradient">Results</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-white/70 mt-4 text-[21px] max-w-lg mb-8 leading-relaxed text-left"
          >
            A proven six-step framework that takes your brand from concept to market dominance.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,209,193,0.2) 20%, rgba(0,209,193,0.4) 50%, rgba(0,209,193,0.2) 80%, transparent)' }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative p-7 glass rounded-2xl border border-white/6 hover:border-brand-primary/25 transition-all duration-500 overflow-hidden"
                data-cursor="hover"
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${s.color}10, transparent 60%)` }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="text-4xl font-bold opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                      style={{ color: s.color }}
                    >
                      {s.step}
                    </span>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: s.color, boxShadow: `0 0 10px ${s.color}60` }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient transition-all duration-300">
                    {s.title}
                  </h3>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed text-left">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
