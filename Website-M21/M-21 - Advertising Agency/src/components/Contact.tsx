import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  const titleRef = useRef<HTMLDivElement>(null);
  const inView = useInView(titleRef, { once: true, margin: '-100px' });
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', company: '', message: '' });
  };

  return (
    <section id="contact" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] opacity-10"
          style={{ background: 'radial-gradient(circle, #00D1C1 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 glass-brand rounded-full text-sm text-brand-primary font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Contact Us
          </motion.div>
          <div className="clip-text">
            <motion.h2
              initial={{ y: '100%' }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl font-bold text-white pb-3"
            >
              Let's Build Something <span className="text-gradient">Great</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-white/70 mt-4 text-[18px] max-w-3xl mx-auto leading-relaxed text-center"
          >
            Ready to transform your brand? We'd love to hear about your project requirement.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {[
              { icon: Mail, label: 'Email', value: 'sales@media21world.com' },
              { icon: Phone, label: 'Phone', value: '+968 9122 9053' },
              { icon: MapPin, label: 'Location', value: '603-604, Majan I tower, Ghala' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 glass rounded-2xl p-5 border border-white/6">
                <div className="w-11 h-11 rounded-xl glass-brand border border-brand-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-brand-primary" />
                </div>
                <div>
                  <div className="text-white/40 text-xs mb-0.5">{label}</div>
                  <div className="text-white font-medium text-sm">{value}</div>
                </div>
              </div>
            ))}

            {/* Social proof */}
            <div className="glass-brand rounded-2xl p-6 border border-brand-primary/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-brand-primary text-xs font-medium mb-3 uppercase tracking-wider">Response Time</div>
                <div className="text-3xl font-bold text-white mb-1">{'< 24hrs'}</div>
                <div className="text-white/40 text-xs">We respond to all inquiries within one business day.</div>
              </div>
              <a
                href="https://maps.google.com/?q=603-604,+Majan+I+tower,+Ghala"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black font-bold text-[11px] tracking-widest px-5 py-3 hover:bg-[#00D1C1] hover:text-white transition-all duration-300 uppercase rounded-sm shadow-md text-center self-start sm:self-center shrink-0"
              >
                VIEW ON GOOGLE MAP
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 border border-white/8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at top right, rgba(0,209,193,0.1), transparent 60%)' }}
              />
              <div className="relative z-10 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { key: 'name', label: 'Full Name', placeholder: 'Your name', type: 'text' },
                    { key: 'email', label: 'Email Address', placeholder: 'you@company.com', type: 'email' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-white/50 text-xs font-medium mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        required
                        className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-brand-primary/50 focus:bg-white/6 transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-medium mb-2">Company (optional)</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Your company"
                    className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-brand-primary/50 focus:bg-white/6 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-medium mb-2">Tell Us About Your Project Requirement.</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your goals, challenges, and what success looks like for you..."
                    required
                    rows={5}
                    className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-brand-primary/50 focus:bg-white/6 transition-all duration-300 resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,209,193,0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-brand-primary text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                >
                  {sent ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-xs">✓</span>
                      Message Sent!
                    </span>
                  ) : (
                    <>
                      Send Message <Send size={16} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
