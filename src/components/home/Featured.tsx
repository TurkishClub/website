'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Highlight } from './types';

/** Past highlights in a horizontal scroller. */
export default function Featured({ highlights }: { highlights: Highlight[] }) {
  const t = useTranslations('HomePage.featured');
  const trackRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: highlights.length < 2 });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  if (highlights.length === 0) return null;

  const step = (direction: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector('li');
    if (!el || !card) return;
    el.scrollBy({ left: direction * (card.getBoundingClientRect().width + 16), behavior: reduce ? 'auto' : 'smooth' });
  };

  const arrow =
    'absolute top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-ink-950 text-white transition-[opacity,background-color,transform] duration-160 ease-out-strong hover:bg-cardinal-700 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-0 md:flex';

  return (
    <section className="bg-white text-ink-950">
      <div className="mx-auto flex max-w-[90rem] items-baseline justify-between px-4 pb-8 pt-24 md:px-6 md:pt-32">
        <h2 className="text-lg font-normal">{t('label')}</h2>
        <a href="https://lu.ma/user/turkishclub" target="_blank" rel="noopener noreferrer" className="text-sm font-medium underline-offset-4 hover:underline">
          {t('all')}
        </a>
      </div>

      <div className="relative mx-auto max-w-[90rem] pb-24 md:pb-32">
        <button type="button" className={cn(arrow, 'left-3')} onClick={() => step(-1)} disabled={edges.start} aria-label={t('previous')}>
          <ArrowLeft className="h-6 w-6" />
        </button>
        <button type="button" className={cn(arrow, 'right-3')} onClick={() => step(1)} disabled={edges.end} aria-label={t('next')}>
          <ArrowRight className="h-6 w-6" />
        </button>

        <ul
          ref={trackRef}
          onScroll={update}
          className="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 [scrollbar-width:none] md:scroll-px-6 md:px-6 [&::-webkit-scrollbar]:hidden"
        >
          {highlights.map((item) => {
            const body = (
              <div className="flex h-full min-h-[22rem] flex-col justify-between gap-10 bg-stone-100 p-6 md:min-h-[26rem] md:p-10">
                  <div className="flex flex-col gap-5">
                    {item.type && <span className="text-sm font-medium text-cardinal-700">{item.type}</span>}
                    <h3 className="font-serif text-[clamp(2rem,3.4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.01em]">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="max-w-xl text-lg leading-relaxed text-ink-700">{item.description}</p>
                    )}
                  </div>
                  {item.link && (
                    <span className="self-start text-sm font-medium underline underline-offset-4">
                      {t('open')}
                    </span>
                  )}
              </div>
            );
            return (
              <li key={item._id} className="w-[85%] shrink-0 snap-start md:w-[48%] lg:w-[38%]">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                    {body}
                  </a>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
