'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Highlight } from './types';

/** Featured highlights as large typographic cards; one at a time with the next peeking in. */
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
  const total = String(highlights.length).padStart(2, '0');

  return (
    <section className="bg-white text-ink-950">
      <div className="mx-auto flex max-w-[90rem] items-baseline justify-between px-4 pb-8 pt-24 md:px-6 md:pt-32">
        <h2 className="text-lg font-normal">{t('label')}</h2>
        <a href="https://lu.ma/user/turkishclub" target="_blank" rel="noopener noreferrer" className="group text-sm font-medium">
          {t('all')}{' '}
          <span aria-hidden className="inline-block transition-transform duration-200 ease-out-strong group-hover:translate-x-0.5">
            ↗
          </span>
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
          {highlights.map((item, i) => {
            const body = (
              <div className="grid h-full overflow-hidden md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                {/* Typographic panel: index and category on cardinal */}
                <div className="flex min-h-[12rem] flex-col justify-between bg-cardinal-700 p-6 text-white md:min-h-[30rem] md:p-10">
                  <span className="label-caps text-white/80">{item.type ?? t('label')}</span>
                  <span className="font-display text-[clamp(5rem,11vw,10rem)] font-light leading-[0.85] tracking-[-0.05em]">
                    {String(i + 1).padStart(2, '0')}
                    <span className="text-white/40">/{total}</span>
                  </span>
                </div>
                <div className="flex flex-col justify-between gap-10 bg-stone-100 p-6 md:p-10">
                  <div className="flex flex-col gap-5">
                    <h3 className="font-serif text-[clamp(2rem,3.4vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.01em]">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="max-w-xl text-lg leading-relaxed text-ink-700">{item.description}</p>
                    )}
                  </div>
                  {item.link && (
                    <span className="label-caps self-start rounded-full bg-ink-950 px-4 py-2 text-white">
                      {t('open')} ↗
                    </span>
                  )}
                </div>
              </div>
            );
            return (
              <li key={item._id} className="w-[88%] shrink-0 snap-start md:w-[78%] lg:w-[72%]">
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
