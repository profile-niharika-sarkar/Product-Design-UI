import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  angle: number;
  speed: number;
  amplitude: number;
}

const THEME_COLORS = [
  '#FF4FD8', // Brand Pink
  '#D946EF', // Brand Magenta
  '#9333EA', // Brand Purple
  '#F472B6', // Light pink
];

export default function ThemeParticlesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Responsive Canvas Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
        initParticles();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const initParticles = () => {
      particles = [];
      // Dynamic particle density depending on viewport size
      const densityMultiplier = Math.min(Math.max((width * height) / 15000, 40), 120);
      
      for (let i = 0; i < densityMultiplier; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2.5 + 1,
          color: THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)],
          alpha: Math.random() * 0.5 + 0.1,
          decay: Math.random() * 0.003 + 0.001,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.2 + 0.1,
          amplitude: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const connectionDistance = 120;

      // Track & update each particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic flow movement (curved flowing tracks)
        p.angle += 0.004;
        p.x += Math.cos(p.angle) * p.speed + p.vx;
        p.y += Math.sin(p.angle) * p.speed + p.vy;

        // Interactive mouse force - gentle attraction/influence
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const force = (220 - dist) / 2200;
            p.x += dx * force;
            p.y += dy * force;
          }
        }

        // Wrap around screen boundaries seamlessly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw flowing particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect nearby particles for a digital grid network look (Oman's elite LED net theme)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Linear fading connection lines based on distance
            const alphaCoeff = 1.0 - dist / connectionDistance;
            ctx.strokeStyle = p.color; 
            ctx.shadowBlur = 0; // Disable shadow on lines for rendering performance
            ctx.globalAlpha = alphaCoeff * 0.08 * Math.min(p.alpha, p2.alpha);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(drawParticles);
    };

    // Tracking mouse movements for interactive attraction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    initParticles();
    drawParticles();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-theme-gradient"
      style={{ isolation: 'isolate' }}
    >
      {/* Absolute full-screen theme gradient backdrop */}
      <div 
        className="absolute inset-0 block w-full h-full bg-[#030206] mix-blend-normal"
        style={{
          background: `
            radial-gradient(circle at 10% 25%, rgba(255, 79, 216, 0.09) 0%, transparent 45%),
            radial-gradient(circle at 85% 75%, rgba(147, 51, 234, 0.08) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(217, 70, 239, 0.04) 0%, transparent 55%),
            linear-gradient(135deg, #040307 0%, #0A0A0A 50%, #020104 100%)
          `,
          backgroundAttachment: 'fixed'
        }}
      />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 block w-full h-full opacity-60 pointer-events-none"
      />
    </div>
  );
}
