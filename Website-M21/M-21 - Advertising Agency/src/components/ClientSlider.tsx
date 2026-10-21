import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

// Logo files located in public/Logos — displayed in the slider cards
const logos = [
  "Ahlibank.png",
  "Al Khamayil.png",
  "Al Zain logo.png",
  "A'saffa Logo.png",
  "Atyab logo.png",
  "bank Dhofar.png",
  "BM_logo.png",
  "Bosch-Logo.png",
  "CCED Logo.png",
  "COYA.png",
  "eatix_oman.png",
  "Eicher_Motors-Logo.wine.png",
  "Ellesmere logo.png",
  "ESO logo.png",
  "FDO-Logo.png",
  "friendi_logo.png",
];

const row1 = logos.slice(0, 8); // first row logos
const row2 = logos.slice(8, 16); // second row logos

// Replicate to create a seamless scrolling marquee
const repeatedRow1 = [...row1, ...row1, ...row1, ...row1];
const repeatedRow2 = [...row2, ...row2, ...row2, ...row2];

export default function OurClients() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="clients" ref={ref} className="pt-24 pb-12 overflow-hidden relative bg-transparent border-y border-zinc-900/40">
      {/* Background radial gradient glow for premium look */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-cyan/2 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern Dots Overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-700/10 border border-teal-500/10 rounded-full text-[14px] text-brand-cyan font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
            Trusted Partners
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-none whitespace-nowrap">
            Collaborations Across <span className="text-cyan-400">Sectors</span>
          </h2>

          <p className="text-white/75 text-[21px] max-w-4xl mx-auto mb-8 leading-relaxed font-medium font-montserrat">
            Delivering communication and creative strategy for premium brands that demand pristine standards and clear presence.
          </p>
        </motion.div>
      </div>

      {/* Slider Rows Container */}
      <div className="relative w-full overflow-hidden flex flex-col gap-6 py-4">
        {/* Shadow side gradients to blend marquee seamlessly */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-36 z-10 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-36 z-10 bg-gradient-to-l from-black/50 to-transparent" />

        {/* Row 1 - Left to Right scrolling */}
        <div className="relative overflow-hidden mb-1">
          <div className="flex gap-6 w-[200%] animate-[marquee_8s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
            {repeatedRow1.map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center w-[250px] h-[100px] rounded-xl bg-zinc-950/20 backdrop-blur-md border border-zinc-900/60 group hover:border-brand-cyan/30 hover:bg-zinc-900/10 transition-all duration-300 px-6 shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)]"
              >
                <img
                  src={`/Logos/${logo}`}
                  alt={logo}
                  className="max-w-[140px] max-h-[60px] object-contain opacity-90"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left scrolling */}
        <div className="relative overflow-hidden">
          <div className="flex gap-6 w-[200%] animate-[marqueeReverse_8s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
            {repeatedRow2.map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center w-[250px] h-[100px] rounded-xl bg-zinc-950/20 backdrop-blur-md border border-zinc-900/60 group hover:border-brand-cyan/30 hover:bg-zinc-900/10 transition-all duration-300 px-6 shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)]"
              >
                <img
                  src={`/Logos/${logo}`}
                  alt={logo}
                  className="max-w-[140px] max-h-[60px] object-contain opacity-90"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </section>
  );
}
