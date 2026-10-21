import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  className = '',
  variant = 'dark',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Luminous colors matching brand palette: #39918d, #3f6d67, #f8c51c, #c57b4b
    const darkColors = [
      'rgba(57, 145, 141, 0.65)',  // Vibrant Teal #39918d
      'rgba(63, 109, 103, 0.65)',  // Forest Teal #3f6d67
      'rgba(248, 197, 28, 0.65)',  // Gold #f8c51c
      'rgba(197, 123, 75, 0.65)',  // Copper #c57b4b
      'rgba(255, 255, 255, 0.7)',  // Crisp White
    ];

    const lightColors = [
      'rgba(12, 41, 64, 0.4)',    // Deep Navy #0c2940
      'rgba(57, 145, 141, 0.5)',  // Deep Teal #39918d
      'rgba(197, 123, 75, 0.5)',  // Copper #c57b4b
      'rgba(180, 83, 9, 0.5)',    // Amber
    ];

    const colors = variant === 'dark' ? darkColors : lightColors;

    const particleCount = Math.min(Math.floor((width * height) / 14000), 60);
    const particles = Array.from({ length: Math.max(particleCount, 25) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35 - 0.05,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.015 + Math.random() * 0.02,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render flowing energy lines between proximal nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle =
              variant === 'dark'
                ? `rgba(56, 189, 248, ${0.18 * (1 - dist / 120)})`
                : `rgba(12, 41, 64, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = variant === 'dark' ? 0.7 : 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Render individual floating particles with soft ambient glow
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        p.pulse += p.pulseSpeed;
        const currentRadius = p.radius + Math.sin(p.pulse) * 0.5;

        // Wrap around boundaries smoothly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = variant === 'dark' ? 6 : 3;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [variant]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${
        variant === 'dark' ? 'opacity-25' : 'opacity-15'
      } ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
