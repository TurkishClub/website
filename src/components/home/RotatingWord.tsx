'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EASE_IN_OUT_STRONG = [0.77, 0, 0.175, 1] as const;
/** Full loops before the word settles, so auto-playing motion doesn't run indefinitely. */
const LOOPS = 2;

/**
 * Cycles through words in place, then settles back on the first word.
 * - Server render and first client render show the first word (no hydration mismatch).
 * - Pauses while off-screen or while the tab is hidden.
 * - Reduced motion: no movement, a slower opacity-only crossfade.
 * - Full transform strings keep the roll off the main thread on framer-motion < 14.2.
 * Decorative: the parent provides the full sentence to screen readers.
 */
export default function RotatingWord({ words, interval = 2600 }: { words: string[]; interval?: number }) {
  const [step, setStep] = useState(0);
  const [tabVisible, setTabVisible] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);
  // Rotate by default; pause only once an observer has reported the word off-screen.
  const [offscreen, setOffscreen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const totalSteps = words.length * LOOPS; // ends on index 0 again
  const done = step >= totalSteps;
  const index = step % words.length;

  useEffect(() => {
    const onVisibility = () => setTabVisible(document.visibilityState === 'visible');
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (done || words.length < 2 || offscreen || !tabVisible) return;
    const timer = setTimeout(() => setStep((s) => s + 1), reduce ? Math.max(interval, 4000) : interval);
    return () => clearTimeout(timer);
  }, [step, done, words.length, offscreen, tabVisible, reduce, interval]);

  const motionProps = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.4, ease: 'easeInOut' as const }
      }
    : {
        initial: { opacity: 0, transform: 'translateY(105%)', filter: 'blur(4px)' },
        animate: { opacity: 1, transform: 'translateY(0%)', filter: 'blur(0px)' },
        exit: { opacity: 0, transform: 'translateY(-105%)', filter: 'blur(4px)' },
        transition: { duration: 0.6, ease: EASE_IN_OUT_STRONG }
      };

  return (
    <span ref={ref} aria-hidden className="relative inline-grid overflow-hidden whitespace-nowrap pb-[0.12em] pr-[0.1em]">
      {/* Invisible copies reserve the height and width of the longest word */}
      {words.map((word) => (
        <span key={`size-${word}`} className="invisible col-start-1 row-start-1">
          {word}
        </span>
      ))}
      {/* Both words share one grid cell: the new one rolls up as the old one leaves */}
      <AnimatePresence initial={false}>
        <motion.span key={`${words[index]}-${step}`} className="col-start-1 row-start-1" {...motionProps}>
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
