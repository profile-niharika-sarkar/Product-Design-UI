import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layout, Share2, Target, Cpu, Megaphone, Compass } from 'lucide-react';

const services = [
  {
    title: 'Branding & Identity',
    desc: 'Building brands that feel sharp, recognizable, and consistent across every touchpoint.',
    icon: Layout,
  },
  {
    title: 'Social Media & Content',
    desc: 'Content designed for modern platforms that captures attention and builds engagement.',
    icon: Share2,
  },
  {
    title: 'Performance Marketing',
    desc: 'Targeted campaigns focused on visibility, conversions, and measurable business growth.',
    icon: Target,
  },
  {
    title: 'Creative Production',
    desc: 'AI-led visuals, premium video edits, motion graphics, and scalable creative systems.',
    icon: Cpu,
  },
  {
    title: 'Public Relations',
    desc: 'Building visibility, credibility, and meaningful conversations around brands.',
    icon: Megaphone,
  },
  {
    title: 'Strategy & Consulting',
    desc: 'Clear thinking on positioning, communication, audience behavior, and growth direction.',
    icon: Compass,
  },
];

export default function AgencyServices() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="agency-services" ref={ref} className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[550px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-brand rounded-full text-sm text-brand-primary font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Services
          </div>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Everything Your Brand <span className="text-gradient">Needs To Grow</span>
          </motion.h2>
          <motion.p
            className="text-white/70 text-[18px] max-w-3xl mx-auto leading-relaxed"
          >
            From strategy and creative to campaigns and production, we build marketing systems that work together under one direction.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-[32px] border border-white/8 hover:border-brand-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient transition-all duration-300">
                {service.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
