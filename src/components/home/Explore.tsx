import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Reveal } from '@/components/ui/reveal';
import { Label } from './Pill';

type EntryItem = { title: string; description: string; href: string };

/** Non-uniform stagger (seconds): even gaps feel mechanical. */
const STAGGER = [0, 0.05, 0.09, 0.12];

/** Directory of the four entry points as full-width rows between hairline rules. */
export default function Explore() {
  const t = useTranslations('HomePage.explore');
  const entries = useTranslations('HomeLists').raw('entry') as EntryItem[];

  return (
    <section className="bg-stone-100 text-ink-950">
      <div className="mx-auto max-w-[90rem] px-4 pb-8 pt-20 md:px-6 md:pt-28">
        <Label className="text-ink-700">{t('label')}</Label>
        <ul className="mt-8 border-t border-ink-950/30">
          {entries.map((item, i) => {
            const external = item.href.startsWith('http');
            const rowClass = 'group grid items-baseline gap-x-6 gap-y-2 py-7 md:grid-cols-12 md:py-9';
            const row = (
              <>
                <span className="label-caps text-ink-500 md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.015em] transition-colors duration-200 group-hover:text-cardinal-700 md:col-span-5">
                  {item.title}
                </span>
                <span className="max-w-md text-lg leading-relaxed text-ink-700 md:col-span-5">{item.description}</span>
                <span
                  aria-hidden
                  className="hidden justify-self-end font-display text-3xl font-light transition-[transform,color] duration-200 ease-out-strong group-hover:translate-x-1.5 group-hover:text-cardinal-700 md:col-span-1 md:block"
                >
                  {external ? '↗' : '→'}
                </span>
              </>
            );
            return (
              <li key={item.href} className="border-b border-ink-950/30">
                <Reveal delay={STAGGER[i] ?? 0.12 + (i - 3) * 0.03}>
                  {external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={rowClass}>
                      {row}
                    </a>
                  ) : (
                    <Link href={item.href} className={rowClass}>
                      {row}
                    </Link>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
