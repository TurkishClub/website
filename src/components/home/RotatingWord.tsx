'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EASE_IN_OUT_STRONG = [0.77, 0, 0.175, 1] as const;
/** Stop after two loops so the motion doesn't run forever. */
const LOOPS = 2;

/** Cycles through words, then settles on the first. Hidden from screen readers; the h1 has the full text. */
export default function RotatingWord({ words, interval = 2600 }: { words: string[]; interval?: number }) {
  const [step, setStep] = useState(0);
  const [tabVisible, setTabVisible] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);
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
      <AnimatePresence initial={false}>
        <motion.span key={`${words[index]}-${step}`} className="col-start-1 row-start-1" {...motionProps}>
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
