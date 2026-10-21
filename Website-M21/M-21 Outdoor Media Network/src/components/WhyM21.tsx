import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const locations = [
  {
    title: 'Hatat House\n- Wadi Adai',
    desc: 'Muscat’s largest digital screen located at the gateway to Ruwi, Amerat & Hamriyah with uninterrupted visibility across four major routes.',
    specs: [
      { label: 'Size', value: '23.05m × 10.50m' },
      { label: 'Traffic Flow', value: 'Ruwi, Amerat & Hamriyah commuters' },
      { label: 'Estimated Views', value: '1M+ monthly impressions' },
    ],
  },
  {
    title: 'Hormuz Grand Gold\nLED - Seeb',
    desc: 'Positioned at the busy Bank Muscat HO intersection targeting professionals and affluent commuters heading toward Muscat Hills and Muaskar Al Murtafaa.',
    specs: [
      { label: 'Size', value: '13.50m × 11.50m' },
      { label: 'Traffic Flow', value: 'Seeb highway commuters' },
      { label: 'Estimated Views', value: '750K+ monthly impressions' },
    ],
  },
  {
    title: 'Lulu Zakher Mall\n- Al Khuwair',
    desc: 'A premium landscape LED located within one of Al Khuwair’s busiest commercial districts with extended dwell time and high audience recall.',
    specs: [
      { label: 'Size', value: '15.84m x 5.76m' },
      { label: 'Traffic Flow', value: 'MGM intersection & Al Khuwair' },
      { label: 'Estimated Views', value: '600K+ monthly impressions' },
    ],
  },
  {
    title: 'Lulu Amerat -\nNujum Complex',
    desc: 'Strategically placed at the active Nujum Complex roundabout capturing continuous vehicular and pedestrian movement throughout the day.',
    specs: [
      { label: 'Size', value: '9.6m × 5.7m' },
      { label: 'Traffic Flow', value: 'Amerat to Wadi Adai commuters' },
      { label: 'Estimated Views', value: '450K+ monthly impressions' },
    ],
  },
  {
    title: 'Lulu - Ansab',
    desc: 'Lulu\nAmerat\n5.7m x 9.6m.',
    specs: [],
  },
  {
    title: 'Coming Soon',
    desc: '',
    specs: [],
  },
];

export default function WhyM21() {
  const titleRef = useRef<HTMLDivElement>(null);
  const inView = useInView(titleRef, { once: true, margin: '-100px' });

  return (
    <section id="led-network" className="pt-32 pb-24 relative overflow-hidden bg-transparent">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #FF4FD8, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-16 flex flex-col items-center">
          {/* Capsule matching styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/5 border border-pink-500/10 rounded-full text-[14px] text-brand-pink font-medium mb-6 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
            LED Network
          </motion.div>

          <div className="max-w-4xl mx-auto text-center relative w-full">
            <div className="clip-text overflow-hidden">
              <motion.h2
                initial={{ y: '100%', opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-white mb-8 tracking-[-0.03em] leading-[1.10]"
              >
                Strategically Positioned <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent inline-block">Across Muscat.</span>
              </motion.h2>
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/75 text-[21px] max-w-3xl mx-auto leading-relaxed text-center font-medium font-montserrat mt-6"
            >
              Our growing outdoor media network is designed around visibility, traffic movement, 
              and premium audience exposure.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((loc, i) => {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group w-full h-[380px] perspective-1000 cursor-pointer"
              >
                {/* Inner Flip Container */}
                <div className="relative w-full h-full duration-700 preserve-3d group-hover:rotate-y-180 transition-transform">
                  
                  {/* FRONT SIDE (Styled Premium Dark Card) */}
                     <div className="absolute inset-0 w-full h-full backface-hidden rounded-[24px] overflow-hidden bg-transparent border border-zinc-800/50 group-hover:border-brand-pink/30 transition-all duration-500 flex flex-col justify-between p-8">
                    {/* Subtle aesthetic radial glow inside the card */}
                    <div className="absolute inset-0 bg-transparent pointer-events-none z-10" 
                      style={{ background: 'radial-gradient(circle at 80% 20%, rgba(255,77,216,0.04) 0%, transparent 60%)' }} />
                    <div className="absolute inset-0 bg-grid bg-transparent opacity-[0.02] pointer-events-none z-10" />
                    
                    {/* Top minimalist accent */}
                    <div className="flex justify-between items-start">
                      <div className="w-8 h-[1px] bg-zinc-850" />
                    </div>

                    {/* Front image for card 1 (cover entire card) */}
                    {(i === 0 || i === 1 || i === 2 || i === 3 || i === 4) && (
                      <img
                        src={
                          i === 0
                            ? "/Images/SM image post hatat full.png"
                            : i === 1
                            ? "/Images/Hormuz Screen.png"
                            : i === 2
                            ? "/Images/Zakher Lulu.jpg.jpeg"
                            : i === 3
                            ? "/Images/Amerat_Lulu.jpg.jpeg"
                            : "/Images/ChatGPT Image Jun 2, 2026, 04_39_44 PM.png"
                        }
                        alt={
                          i === 0
                            ? "Hatat House"
                            : i === 1
                            ? "Hormuz Grand Gold"
                            : i === 2
                            ? "Lulu Zakher Mall"
                            : i === 3
                            ? "Lulu Amerat"
                            : "Lulu Ansab"
                        }
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />
                    )}
                    
                    {/* Title & Accent bar */}
                    {loc.title && (
                      <div className="space-y-4 text-left relative z-20">
                        {(i === 0 || i === 1 || i === 2 || i === 3 || i === 4) ? (
                          <h4 className="inline-block bg-black/80 px-3 py-2 rounded-md text-white text-[22px] sm:text-[24px] font-black font-montserrat tracking-tight leading-tight whitespace-pre-line">
                            {loc.title}
                          </h4>
                        ) : (
                          <h4 className="text-white text-[22px] sm:text-[24px] font-black font-montserrat tracking-tight leading-tight whitespace-pre-line">
                            {loc.title}
                          </h4>
                        )}
                        <div className="w-12 h-1 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* BACK SIDE (Write-up and specs only - NO header title) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[24px] overflow-hidden bg-[#0D0B12] border border-brand-pink/20 flex flex-col p-8 justify-between">
                    <div className="absolute inset-0 bg-transparent opacity-[0.03] pointer-events-none" 
                         style={{ background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.08), transparent 70%)' }} />
                    <div className="absolute inset-0 bg-grid bg-transparent opacity-[0.015] pointer-events-none" />
                    
                    {/* Description Write-up Content */}
                    {loc.desc ? (
                      <div className="relative z-10">
                        <p className="text-white/85 text-[15px] sm:text-[16px] leading-relaxed text-left font-medium font-montserrat whitespace-pre-line">
                          {loc.desc}
                        </p>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <span className="text-zinc-600 font-medium font-montserrat text-sm tracking-widest uppercase">
                          Coming Soon
                        </span>
                      </div>
                    )}

                    {/* Specs / metrics footer */}
                    {loc.specs && loc.specs.length > 0 && (
                      <div className="relative z-10 pt-4 border-t border-zinc-900 w-full flex flex-col gap-3">
                        {loc.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex flex-col gap-0.5 text-xs text-left">
                            <span className="text-brand-pink/80 font-bold tracking-wider font-mono text-[9px] uppercase">
                              {spec.label}
                            </span>
                            <span className="text-white/90 font-medium leading-tight font-montserrat text-[13px]">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
