import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Eye, Shield, Clock, Compass, HelpCircle } from 'lucide-react';

const services = [
  {
    title: 'High Visibility',
    desc: 'Positioned across key roads and high-traffic locations to maximize reach and recall.',
    color: '#FF4FD8',
    icon: Eye,
  },
  {
    title: 'Premium Presence',
    desc: 'Large-format LED displays designed to elevate how brands are seen in public spaces.',
    color: '#D946EF',
    icon: Shield,
  },
  {
    title: 'High Recall',
    desc: 'Outdoor advertising creates stronger long-term brand memory through repeated exposure.',
    color: '#FF4FD8',
    icon: Compass,
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number; key?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative group rounded-3xl p-8 bg-zinc-950/45 border border-zinc-900 hover:border-brand-pink/20 transition-all duration-500 overflow-hidden flex flex-col justify-between h-full min-h-[290px]"
    >
      <div className="relative z-10">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-zinc-850 bg-neutral-900/60"
          style={{ color: service.color }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-[21px] font-bold font-montserrat text-white mb-4 group-hover:text-brand-pink transition-colors duration-300">
          {service.title}
        </h3>

        <p className="text-white/75 text-[18px] leading-relaxed text-left font-medium font-montserrat">
          {service.desc}
        </p>
      </div>

      <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
    </motion.div>
  );
}

export default function Services() {
  const titleRef = useRef<HTMLDivElement>(null);
  const inView = useInView(titleRef, { once: true, margin: '-100px' });

  return (
    <section id="why-outdoor" className="pt-12 pb-12 relative overflow-hidden bg-grid bg-transparent">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,77,216,0.04) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/5 border border-pink-500/10 rounded-full text-[14px] text-brand-pink font-medium mb-6"
          >
            Why Outdoor
            <HelpCircle className="w-4 h-4 text-brand-pink" />
          </motion.div>
          <div className="clip-text overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-white text-center leading-tight mb-4"
            >
              Because Attention <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">Can’t Be Skipped.</span>
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
