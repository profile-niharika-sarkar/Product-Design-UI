import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // High-performance pointer position tracking with useMotionValue + useSpring
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Delay/Spring configuration for the smooth lag/inertia follower effect
  const springConfig = { damping: 40, stiffness: 450, mass: 0.5 };
  const cursorRingX = useSpring(cursorX, springConfig);
  const cursorRingY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide native cursor completely if touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Track when user hovers over buttons, links, clickable items
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('.cursor-pointer') ||
          target.getAttribute('role') === 'button')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer follow glow ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-brand-pink/60 pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: cursorRingX,
          y: cursorRingY,
          translateX: '-50%',
          translateY: '-50%',
          boxShadow: isHovered 
            ? '0 0 20px rgba(255, 77, 216, 0.4)' 
            : '0 0 10px rgba(255, 77, 216, 0.15)',
        }}
        animate={{
          scale: isClicking ? 0.75 : isHovered ? 1.6 : 1,
          backgroundColor: isHovered ? 'rgba(255, 77, 216, 0.1)' : 'rgba(255, 77, 216, 0.0)',
          borderColor: isHovered ? '#D946EF' : '#FF4FD8',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      
      {/* Inner precise dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-brand-pink pointer-events-none z-[10000] mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.5 : isHovered ? 1.2 : 1,
          backgroundColor: isHovered ? '#9333EA' : '#FF4FD8',
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      />
    </>
  );
}
