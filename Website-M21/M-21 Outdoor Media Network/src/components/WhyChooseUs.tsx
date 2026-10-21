import { motion } from 'motion/react';
import { Image } from 'lucide-react';

export default function WhyChooseUs() {
  return (
    <div id="why-choose-us" className="relative bg-transparent">
      {/* SECTION 1: Decorative 16:9 Horizontal Box with Purple Backlit Glow */}
      <div className="py-16 relative overflow-hidden flex justify-center items-center px-6">
        {/* Deep Purple Radial Backlight Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-purple/20 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-5xl aspect-video rounded-[24px] bg-[#030105]/60 border border-brand-purple/20 shadow-[0_0_50px_rgba(168,85,247,0.12)] flex flex-col items-center justify-center z-10 overflow-hidden group"
        >
          {/* Background image fill */}
          <img src="/Images/ChatGPT Image Jun 4, 2026, 11_03_43 AM.jpg.jpeg" alt="Display" className="absolute inset-0 w-full h-full object-cover z-0" />
          
          {/* Decorative Corner Brackets */}
          <div className="absolute top-5 left-5 w-4 h-4 border-t border-l border-brand-purple/30 rounded-tl-[4px] z-10" />
          <div className="absolute top-5 right-5 w-4 h-4 border-t border-r border-brand-purple/30 rounded-tr-[4px] z-10" />
          <div className="absolute bottom-5 left-5 w-4 h-4 border-b border-l border-brand-purple/30 rounded-bl-[4px] z-10" />
          <div className="absolute bottom-5 right-5 w-4 h-4 border-b border-r border-brand-purple/30 rounded-br-[4px] z-10" />

          {/* Center Indicator */}
          <div className="flex flex-col items-center gap-3 relative z-20 text-zinc-500 group-hover:text-brand-purple transition-colors duration-500" />
        </motion.div>
      </div>
    </div>
  );
}
