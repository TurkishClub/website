'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

/**
 * Short fade-and-rise as content scrolls into view. With reduced motion the
 * movement is dropped and only a gentle opacity fade remains.
 */
export function Reveal({
  children,
  delay = 0,
  className
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      // Full transform strings stay off the main thread on framer-motion < 14.2
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(12px)' }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: reduce ? 0.3 : 0.5, delay, ease: EASE_OUT_STRONG }}
    >
      {children}
    </motion.div>
  );
}
