import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';

const posts = [
  {
    tag: 'Strategy',
    title: 'The Future of Brand-Building in the Age of AI',
    excerpt: 'How artificial intelligence is reshaping the way brands connect with audiences and what smart marketers are doing about it.',
    img: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: 'May 12, 2025',
    readTime: '5 min read',
    featured: true,
  },
  {
    tag: 'Design',
    title: 'Micro-Interactions That Drive Massive Engagement',
    excerpt: 'Small details, big impact: how thoughtful micro-interactions transform user experience.',
    img: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: 'Apr 28, 2025',
    readTime: '4 min read',
    featured: false,
  },
  {
    tag: 'Growth',
    title: 'Data-Driven Storytelling: Where Analytics Meets Creativity',
    excerpt: 'Bridging the gap between numbers and narrative to craft campaigns that resonate.',
    img: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: 'Apr 15, 2025',
    readTime: '6 min read',
    featured: false,
  },
  {
    tag: 'Social',
    title: 'Winning on Social Media in 2025: The New Playbook',
    excerpt: 'Platform algorithms have changed. Here\'s how top brands are adapting their social strategy.',
    img: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: 'Mar 30, 2025',
    readTime: '7 min read',
    featured: false,
  },
];

const tagColors: Record<string, string> = {
  Strategy: '#00D1C1',
  Design: '#06B6D4',
  Growth: '#00A99D',
  Social: '#00D1C1',
};

export default function Blogs() {
  const titleRef = useRef<HTMLDivElement>(null);
  const inView = useInView(titleRef, { once: true, margin: '-100px' });
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <section id="blogs" className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(0,209,193,0.05), transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="inline-flex items-center gap-2 px-4 py-2 glass-brand rounded-full text-sm text-brand-primary font-medium mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
              Blogs
            </motion.div>
            <div className="clip-text">
              <motion.h2
                initial={{ y: '100%' }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-6xl font-bold text-white"
              >
                Insights & <span className="text-gradient">Ideas</span>
              </motion.h2>
            </div>
          </div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-brand-primary text-sm font-medium glass-brand border border-brand-primary/20 px-5 py-2.5 rounded-full hover:border-brand-primary/50 transition-all duration-300 self-start"
          >
            View All Posts <ArrowUpRight size={14} />
          </motion.button>
        </div>

        {/* Editorial grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured post */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative rounded-3xl overflow-hidden aspect-[4/5] lg:row-span-2 cursor-none"
            data-cursor="hover"
          >
            <motion.img
              src={featured.img}
              alt={featured.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/30 to-transparent" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(to top, rgba(0,209,193,0.2), transparent 50%)' }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 text-white"
                style={{ background: `${tagColors[featured.tag]}60`, border: `1px solid ${tagColors[featured.tag]}40` }}
              >
                {featured.tag}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">
                {featured.title}
              </h3>
              <p className="text-white/70 text-[21px] leading-relaxed text-left mb-5">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-white/40 text-xs">
                <span>{featured.date}</span>
                <span className="flex items-center gap-1"><Clock size={12} />{featured.readTime}</span>
              </div>
            </div>
          </motion.div>

          {/* Side posts */}
          {rest.map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden aspect-video cursor-none"
              data-cursor="hover"
            >
              <motion.img
                src={post.img}
                alt={post.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(to top, ${tagColors[post.tag]}25, transparent 50%)` }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 text-white"
                  style={{ background: `${tagColors[post.tag]}50`, border: `1px solid ${tagColors[post.tag]}30` }}
                >
                  {post.tag}
                </span>
                <h3 className="text-base font-bold text-white mb-2 leading-snug">{post.title}</h3>
                <div className="flex items-center gap-3 text-white/40 text-xs">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{post.readTime}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
