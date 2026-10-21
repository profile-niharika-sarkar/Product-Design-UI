import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      targetAlpha: number;
      color: string;
      speedModifier: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Directional drift (mostly moving slightly left-to-right & up-to-down)
        this.vx = (Math.random() * 0.4 + 0.1) * (Math.random() < 0.5 ? 1 : -1);
        this.vy = (Math.random() * 0.4 + 0.1) * (Math.random() < 0.5 ? 1 : -1);
        this.size = Math.random() * 2.5 + 0.5;
        this.alpha = 0; // Fade in initially
        this.targetAlpha = Math.random() * 0.4 + 0.1;
        
        // Brand themes: Soft cyan, teal or glowing white
        const rand = Math.random();
        if (rand < 0.6) {
          this.color = '0, 209, 193'; // #00D1C1
        } else if (rand < 0.9) {
          this.color = '6, 182, 212'; // #06B6D4
        } else {
          this.color = '0, 169, 157'; // #00A99D
        }
        
        this.speedModifier = Math.random() * 0.5 + 0.5;
      }

      update() {
        this.x += this.vx * this.speedModifier;
        this.y += this.vy * this.speedModifier;

        // Soft fade in & out behaviors
        if (this.alpha < this.targetAlpha) {
          this.alpha += 0.005;
        }

        // Boundary wrap with alpha resetting
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.alpha = 0;
          this.targetAlpha = Math.random() * 0.4 + 0.1;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        // Soft glowing shadows for key particles
        if (this.size > 2) {
          context.shadowBlur = 8;
          context.shadowColor = `rgba(${this.color}, ${this.alpha * 0.8})`;
        } else {
          context.shadowBlur = 0;
        }
        context.fill();
      }
    }

    const maxParticles = Math.min(80, Math.floor((width * height) / 18000));
    const particles: Particle[] = [];

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
      ctx!.clearRect(0, 0, width, height);
      
      // Draw a subtle background ambient gradient too pathing with scroll height
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx!);
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // Re-initialize particles to fit the new size
      particles.length = 0;
      const newMaxParticles = Math.min(80, Math.floor((width * height) / 18000));
      for (let i = 0; i < newMaxParticles; i++) {
        particles.push(new Particle());
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
