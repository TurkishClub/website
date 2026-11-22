import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/reveal';
import { Pill } from './Pill';

/** Full-bleed cardinal band: a short statement and a call to action. */
export default function RedBand() {
  const t = useTranslations('HomePage.banner');

  return (
    <section className="bg-cardinal-700 text-white">
      <div className="mx-auto max-w-[90rem] px-4 pb-16 pt-40 md:px-6 md:pb-20 md:pt-64">
        <Reveal className="max-w-5xl">
          <p className="text-[clamp(1.6rem,3vw,2.75rem)] font-light leading-[1.25] tracking-[-0.015em]">
            {t('text')}
          </p>
          <Pill href="https://www.instagram.com/turkishclub.munich/" external variant="onRed" className="mt-10">
            {t('cta')}
          </Pill>
        </Reveal>
      </div>
    </section>
  );
}
