import { motion } from 'framer-motion';

export default function NeoGradients() {
  const patches = [
    // 1. Top Section (Hero Area)
    {
      style: { top: '0%', right: '-10%' },
      color: 'bg-[#00D1C1]',
      opacity: 'opacity-[0.14]',
      size: 'w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] md:w-[1100px] md:h-[1100px]',
      blur: 'blur-[120px] md:blur-[180px]',
      anim: { x: [0, 50, -30, 0], y: [0, -40, 35, 0], scale: [1, 1.1, 0.95, 1] },
      duration: 16
    },
    {
      style: { top: '7%', left: '-15%' },
      color: 'bg-[#06B6D4]',
      opacity: 'opacity-[0.12]',
      size: 'w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] md:w-[1000px] md:h-[1000px]',
      blur: 'blur-[130px] md:blur-[190px]',
      anim: { x: [0, -45, 50, 0], y: [0, 60, -40, 0], scale: [1, 1.15, 0.9, 1] },
      duration: 20
    },
    // 2. Services / Who Are We Section
    {
      style: { top: '18%', right: '-15%' },
      color: 'bg-[#00A99D]',
      opacity: 'opacity-[0.11]',
      size: 'w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] md:w-[1050px] md:h-[1050px]',
      blur: 'blur-[120px] md:blur-[180px]',
      anim: { x: [0, 60, -50, 0], y: [0, -35, 55, 0], scale: [1, 1.08, 0.92, 1] },
      duration: 18
    },
    {
      style: { top: '28%', left: '-10%' },
      color: 'bg-[#00D1C1]',
      opacity: 'opacity-[0.12]',
      size: 'w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] md:w-[1000px] md:h-[1000px]',
      blur: 'blur-[110px] md:blur-[170px]',
      anim: { x: [0, 40, -40, 0], y: [0, 45, -30, 0], scale: [1, 1.12, 0.94, 1] },
      duration: 22
    },
    // 3. Why Media 21 Section
    {
      style: { top: '40%', right: '-12%' },
      color: 'bg-[#06B6D4]',
      opacity: 'opacity-[0.13]',
      size: 'w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] md:w-[1100px] md:h-[1100px]',
      blur: 'blur-[125px] md:blur-[185px]',
      anim: { x: [0, -50, 40, 0], y: [0, -55, 35, 0], scale: [1, 1.06, 0.95, 1] },
      duration: 21
    },
    {
      style: { top: '51%', left: '-15%' },
      color: 'bg-[#00D1C1]',
      opacity: 'opacity-[0.12]',
      size: 'w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] md:w-[1000px] md:h-[1000px]',
      blur: 'blur-[115px] md:blur-[175px]',
      anim: { x: [0, 35, -50, 0], y: [0, 50, -45, 0], scale: [1, 1.1, 0.92, 1] },
      duration: 24
    },
    // 4. Case Studies / Experience Section
    {
      style: { top: '63%', right: '-15%' },
      color: 'bg-[#00A99D]',
      opacity: 'opacity-[0.11]',
      size: 'w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] md:w-[1050px] md:h-[1050px]',
      blur: 'blur-[120px] md:blur-[180px]',
      anim: { x: [0, 55, -35, 0], y: [0, -40, 50, 0], scale: [1, 1.07, 0.96, 1] },
      duration: 19
    },
    {
      style: { top: '74%', left: '-10%' },
      color: 'bg-[#06B6D4]',
      opacity: 'opacity-[0.13]',
      size: 'w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] md:w-[1000px] md:h-[1000px]',
      blur: 'blur-[120px] md:blur-[175px]',
      anim: { x: [0, -40, 45, 0], y: [0, 55, -35, 0], scale: [1, 1.13, 0.91, 1] },
      duration: 23
    },
    // 5. Blogs & Contact Section
    {
      style: { top: '85%', right: '-10%' },
      color: 'bg-[#00D1C1]',
      opacity: 'opacity-[0.14]',
      size: 'w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] md:w-[1100px] md:h-[1100px]',
      blur: 'blur-[130px] md:blur-[190px]',
      anim: { x: [0, 45, -30, 0], y: [0, -45, 40, 0], scale: [1, 1.09, 0.93, 1] },
      duration: 17
    },
    {
      style: { top: '94%', left: '-15%' },
      color: 'bg-[#06B6D4]',
      opacity: 'opacity-[0.13]',
      size: 'w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] md:w-[1050px] md:h-[1050px]',
      blur: 'blur-[120px] md:blur-[180px]',
      anim: { x: [0, -55, 35, 0], y: [0, 60, -30, 0], scale: [1, 1.12, 0.95, 1] },
      duration: 21
    }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {patches.map((patch, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${patch.color} ${patch.opacity} ${patch.size} ${patch.blur}`}
          style={patch.style}
          animate={patch.anim}
          transition={{
            duration: patch.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
