'use client';
import React, {useState} from 'react';
import {useTranslations} from 'next-intl';
import {motion, AnimatePresence} from 'framer-motion';
import {Analytics} from '@/lib/analytics';

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null); // No FAQ open by default
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  const t = useTranslations('FAQ');

  // Get the questions array from translations
  const questions = t.raw('questions') as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <div className="py-16 px-6 bg-white">
      <h2 className="text-5xl font-bold text-center mb-12 text-gray-900">{t('title')}</h2>

      <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {questions.map((item, index) => (
          <div
            key={index}
            className={
              index < questions.length - 1 ? 'border-b border-gray-200' : ''
            }
          >
            <div
              className="flex justify-between items-center p-6 text-gray-800 cursor-pointer hover:bg-gray-50"
              onClick={() => {
                toggleFAQ(index);

                // Track FAQ interaction
                Analytics.trackEngagement({
                  action: 'faq_expand',
                  faq_question: item.question
                });
              }}
            >
              <h3 className="text-xl font-medium">{item.question}</h3>
              <motion.span
                className="text-gray-400 text-2xl"
                animate={{rotate: openFAQ === index ? 45 : 0}}
                transition={{duration: 0.2, ease: 'easeOut'}}
              >
                +
              </motion.span>
            </div>
            <AnimatePresence>
              {openFAQ === index && (
                <motion.div
                  initial={{opacity: 0, height: 0, filter: 'blur(4px)'}}
                  animate={{opacity: 1, height: 'auto', filter: 'blur(0px)'}}
                  exit={{opacity: 0, height: 0, filter: 'blur(4px)'}}
                  transition={{
                    duration: 0.3,
                    ease: 'easeOut',
                    height: {duration: 0.25}
                  }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-gray-600">
                    <motion.p
                      initial={{opacity: 0, y: -10}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: -10}}
                      transition={{duration: 0.2, delay: 0.05}}
                    >
                      {item.answer}
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
