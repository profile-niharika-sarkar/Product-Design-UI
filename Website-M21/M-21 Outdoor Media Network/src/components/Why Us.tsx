import { motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';

export default function WhyChooseUs() {
  return (
    <div id="why-choose-us" className="relative bg-transparent">
      {/* SECTION 1: Designed For Maximum Impact */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-brand-pink/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            {/* Elegant Capsule Badge - Match "Why Outdoor" Style exactly */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/5 border border-pink-500/10 rounded-full text-[14px] text-brand-pink font-medium mb-6 select-none"
            >
              Why Choose Us
              <HelpCircle className="w-4 h-4 text-brand-pink" />
            </motion.div>

            {/* Header Title - Font Size Match with LED Network Title exactly */}
            <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center justify-center">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display text-white mb-8 tracking-[-0.03em] leading-tight md:whitespace-nowrap"
              >
                Designed For <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent inline">Maximum Impact.</span>
              </motion.h2>
            </div>
          </div>

          {/* Modern Highly Interactive Animated Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-6xl mx-auto items-stretch mt-12">
            {/* L&R alignment: Left Column contains the text blocks in premium aesthetic wrappers */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Copywriting Block 1 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-8 sm:p-10 rounded-[24px] bg-[#0E0D13]/90 border border-zinc-900/85 hover:border-brand-pink/20 transition-all duration-500 overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-pink to-brand-purple opacity-70 group-hover:opacity-100 transition-opacity" />
                <p className="text-white/75 text-[18px] leading-relaxed text-left font-medium font-montserrat">
                  Outdoor advertising is no longer just about placement. It's about visibility, timing, creative presentation, and repeated audience exposure.
                </p>
              </motion.div>

              {/* Copywriting Block 2 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative p-8 sm:p-10 rounded-[24px] bg-[#0E0D13]/90 border border-zinc-900/85 hover:border-brand-pink/20 transition-all duration-500 overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-purple to-brand-pink opacity-70 group-hover:opacity-100 transition-opacity" />
                <p className="text-white/75 text-[18px] leading-relaxed text-left font-medium font-montserrat">
                  At <strong className="font-extrabold text-white">Media 21 Outdoor</strong>, we focus on delivering premium LED media placements that help brands stay visible in a fast-moving environment while maintaining a modern and elevated brand presence.
                </p>
              </motion.div>
            </div>

            {/* Right Column contains the proportionate blank image card */}
            <div className="lg:col-span-6 flex w-full">
              <motion.div
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full min-h-[350px] lg:min-h-0 rounded-[24px] bg-[#0E0D13]/90 border border-zinc-900/85 overflow-hidden shadow-2xl group select-none"
              >
                <img
                  src="/Images/WhatsApp Image 2026-06-04 at 1.28.31 PM.jpeg"
                  alt="Promotional display"
                  className="absolute inset-0 w-full h-full object-cover brightness-125 contrast-125 saturate-125"
                />
                {/* Subtle overlay glow ring on hover */}
                <div
                  className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-25 pointer-events-none transition-all duration-700"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255, 77, 216, 0.15) 0%, transparent 80%)' }}
                />
                
                {/* Clean border matching hover logic of left card block */}
                <div className="absolute inset-0 rounded-[24px] border border-transparent group-hover:border-brand-pink/20 transition-colors pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
