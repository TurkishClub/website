'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Analytics } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { Label } from './Pill';

/** Accessible accordion on stone, questions in serif between hairline rules. */
export default function Faq() {
  const t = useTranslations('FAQ');
  const tHome = useTranslations('HomePage.faq');
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();
  const questions = t.raw('questions') as Array<{ question: string; answer: string }>;

  const toggle = (index: number, question: string) => {
    const opening = open !== index;
    setOpen(opening ? index : null);
    if (opening) Analytics.trackEngagement({ action: 'faq_expand', faq_question: question });
  };

  return (
    <section className="bg-stone-100 text-ink-950">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-24 md:grid-cols-12 md:gap-6 md:px-6 md:py-32">
        <div className="md:col-span-4">
          <Label className="text-ink-700">{tHome('label')}</Label>
          <h2 className="mt-6 font-serif text-[clamp(2.25rem,4vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.015em]">
            {t('title')}
          </h2>
        </div>

        <ul className="border-t border-ink-950/30 md:col-span-8">
          {questions.map((item, index) => {
            const isOpen = open === index;
            return (
              <li key={item.question} className="border-b border-ink-950/30">
                <h3>
                  <button
                    type="button"
                    id={`${id}-q-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a-${index}`}
                    onClick={() => toggle(index, item.question)}
                    className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-xl font-normal leading-snug md:text-2xl">{item.question}</span>
                    <span
                      aria-hidden
                      className={cn(
                        'mt-1 font-display text-3xl font-light leading-none text-cardinal-700 transition-transform duration-200 ease-out-strong',
                        isOpen && 'rotate-45'
                      )}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${id}-a-${index}`}
                      role="region"
                      aria-labelledby={`${id}-q-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1, transition: { duration: 0.26, ease: [0.23, 1, 0.32, 1] } }}
                      exit={{ height: 0, opacity: 0, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 text-lg leading-relaxed text-ink-700">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
