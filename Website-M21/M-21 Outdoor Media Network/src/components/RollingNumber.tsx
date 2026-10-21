import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

interface RollingNumberProps {
  value: string;
  className?: string;
}

export default function RollingNumber({ value, className = '' }: RollingNumberProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-50px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Keep track of animation status to ensure we lock the final value once inView triggers
  useEffect(() => {
    if (inView) {
      setHasAnimated(true);
    }
  }, [inView]);

  // Parse value string into individual character segments
  const chars = value.split('');

  // We assign a delay index to consecutive digits so the staggering looks clean
  let digitIndexCount = 0;

  return (
    <span
      ref={containerRef}
      className={`inline-flex items-center justify-center font-extrabold select-none ${className}`}
    >
      {chars.map((char, index) => {
        const isDigit = /^\d$/.test(char);

        if (!isDigit) {
          return (
            <span key={index} className="inline-block select-none transform transition-transform duration-300">
              {char}
            </span>
          );
        }

        const digit = parseInt(char, 10);
        const currentDigitIndex = digitIndexCount++;

        // Base digits array 0-9
        const baseDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        // Triple the list to create a realistic physical rotational spin of 20 elements before landing on the third cycle
        const repeatedDigits = [...baseDigits, ...baseDigits, ...baseDigits];
        const targetIndex = 20 + digit;

        return (
          <span
            key={index}
            className="relative inline-block overflow-hidden"
            style={{ height: '1.2em', lineHeight: '1.2em' }}
          >
            {/* Hidden placeholder for reserving size and alignment */}
            <span
              className="invisible select-none opacity-0"
              aria-hidden="true"
              style={{ display: 'block', height: '1.2em', lineHeight: '1.2em' }}
            >
              {char}
            </span>

            {/* Vertically scrolling digits list */}
            <motion.span
              className="absolute left-0 right-0 text-center flex flex-col justify-start"
              style={{ top: 0, height: `${repeatedDigits.length * 100}%` }}
              initial={{ y: '0%' }}
              animate={hasAnimated ? { y: `-${(targetIndex / repeatedDigits.length) * 100}%` } : { y: '0%' }}
              transition={{
                type: 'spring',
                stiffness: 45 - currentDigitIndex * 4, // staggered speed
                damping: 15,
                mass: 1.1 + currentDigitIndex * 0.1, // slightly heavier digits feel mechanical
                delay: currentDigitIndex * 0.12, // staggered delay
              }}
            >
              {repeatedDigits.map((n, i) => (
                <span
                  key={i}
                  className={`block text-center select-none ${className}`}
                  style={{ height: '1.2em', lineHeight: '1.2em' }}
                >
                  {n}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
