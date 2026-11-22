import { useTranslations } from 'next-intl';
import RotatingWord from './RotatingWord';
import { Pill } from './Pill';

/**
 * Poster hero: a three-line serif statement on maroon whose middle word cycles
 * (e.g. "A piece of / home / in Munich."), with two calls to action underneath.
 */
export default function Hero() {
  const t = useTranslations('HomePage.hero');
  const words = useTranslations('HomeLists').raw('heroWords') as string[];
  const before = t('before');
  const after = t('after');

  return (
    <section className="bg-maroon-950 text-white">
      <div className="mx-auto flex min-h-[70svh] max-w-[90rem] flex-col justify-end gap-12 px-4 pb-12 pt-16 md:gap-14 md:px-6 md:pb-14 md:pt-20">
        <h1 className="font-serif text-[clamp(3.25rem,8.5vw,8.75rem)] font-normal leading-[0.96] tracking-[-0.03em]">
          <span className="sr-only">
            {before} {words.join(', ')} {after}
          </span>
          <span aria-hidden>
            <span className="block">{before}</span>
            <span className="block italic">
              <RotatingWord words={words} />
            </span>
            <span className="block">{after}</span>
          </span>
        </h1>

        <div className="flex flex-wrap gap-3">
          <Pill href="#upcoming-event" variant="light" arrow="↓">
            {t('ctaEvent')}
          </Pill>
          <Pill href="https://www.instagram.com/turkishclub.munich/" external variant="onDark" arrow="↗">
            Instagram
          </Pill>
        </div>
      </div>
    </section>
  );
}
