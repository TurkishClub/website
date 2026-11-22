'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function timeLeftUntil(iso: string): TimeLeft {
  const diff = Math.max(0, new Date(iso).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  };
}

/** Live countdown. Renders placeholders on the server to avoid a hydration mismatch. */
export default function Countdown({ time }: { time: string }) {
  const t = useTranslations('HomePage.event');
  const [left, setLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setLeft(timeLeftUntil(time));
    const timer = setInterval(() => setLeft(timeLeftUntil(time)), 1000);
    return () => clearInterval(timer);
  }, [time]);

  const units: Array<[keyof TimeLeft, string]> = [
    ['days', t('days')],
    ['hours', t('hours')],
    ['minutes', t('minutes')],
    ['seconds', t('seconds')]
  ];

  return (
    <dl className="grid grid-cols-4 border-t border-ink-950/20">
      {units.map(([key, label], i) => (
        <div key={key} className={i > 0 ? 'border-l border-ink-950/20 pl-4 pt-5' : 'pt-5'}>
          <dt className="label-caps text-ink-500">{label}</dt>
          <dd className="mt-2 font-display text-[clamp(2.25rem,4vw,3.5rem)] font-light tabular-nums leading-none tracking-[-0.03em]">
            {left ? String(left[key]).padStart(2, '0') : '00'}
          </dd>
        </div>
      ))}
    </dl>
  );
}
