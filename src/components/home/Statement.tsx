import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/reveal';
import { Label, Pill } from './Pill';

/** Large serif statement between hairline rules, with a link to the team page. */
export default function Statement() {
  const t = useTranslations('HomePage.statement');

  return (
    <section className="bg-stone-100 text-ink-950">
      <div className="mx-auto max-w-[90rem] px-4 py-24 md:px-6 md:py-36">
        <Reveal>
          <div className="grid gap-8 border-y border-ink-950/30 py-12 md:grid-cols-12 md:gap-6 md:py-16">
            <Label className="text-ink-700 md:col-span-3">{t('label')}</Label>
            <blockquote className="font-serif text-[clamp(1.75rem,3.4vw,3.1rem)] font-normal leading-[1.18] tracking-[-0.01em] text-cardinal-700 md:col-span-9">
              <span aria-hidden className="-ml-[0.4em]">“</span>
              {t('text')}
              <span aria-hidden>”</span>
            </blockquote>
          </div>
          <div className="mt-10">
            <Pill href="/team">{t('cta')}</Pill>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
