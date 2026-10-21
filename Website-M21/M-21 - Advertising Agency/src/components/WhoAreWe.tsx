import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const team = [
  {
    name: 'Alexandra Reid',
    role: 'Creative Director',
    img: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Marcus Chen',
    role: 'Strategy Lead',
    img: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Sofia Martinez',
    role: 'Digital Director',
    img: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'James Okafor',
    role: 'Tech Lead',
    img: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const values = [
  { label: 'Innovation First', desc: 'We push boundaries and explore new possibilities.' },
  { label: 'Client-Centric', desc: 'Your success is our primary measure of achievement.' },
  { label: 'Data-Driven', desc: 'Every decision backed by insights and analytics.' },
  { label: 'Transparent', desc: 'Honest communication and clear reporting, always.' },
];

export default function WhoAreWe() {
  const titleRef = useRef<HTMLDivElement>(null);
  const inView = useInView(titleRef, { once: true, margin: '-100px' });

  return (
    <section id="who-are-we" className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 glass-brand rounded-full text-sm text-brand-primary font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Who Are We
          </motion.div>
          <div className="clip-text">
            <motion.h2
              initial={{ y: '100%' }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl font-bold text-white"
            >
              The Minds Behind <span className="text-gradient">M21</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-white/70 mt-4 text-[21px] max-w-xl leading-relaxed text-left"
          >
            A diverse team of strategists, creators, and technologists united by a single mission:
            to make your brand extraordinary.
          </motion.p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4]"
              data-cursor="hover"
            >
              <motion.img
                src={member.img}
                alt={member.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-400" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: 'linear-gradient(to top, rgba(0,209,193,0.3), transparent 60%)' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-white font-bold text-sm">{member.name}</div>
                <div className="text-brand-primary text-xs">{member.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.08 }}
              className="glass-brand rounded-xl p-5 border border-brand-primary/10"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white text-xs font-bold mb-4">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h4 className="text-white font-bold text-sm mb-2">{v.label}</h4>
              <p className="text-white/70 text-sm md:text-base leading-relaxed text-left">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
