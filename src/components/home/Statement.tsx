import { useTranslations } from 'next-intl';
import { Pill } from './Pill';

/** Who runs the club, with a link to the team page. */
export default function Statement() {
  const t = useTranslations('HomePage.statement');

  return (
    <section className="bg-stone-100 text-ink-950">
      <div className="mx-auto max-w-[90rem] px-4 py-20 md:px-6 md:py-28">
        <p className="max-w-4xl font-serif text-[clamp(1.75rem,3.4vw,3.1rem)] font-normal leading-[1.18] tracking-[-0.01em]">
          {t('text')}
        </p>
        <Pill href="/team" className="mt-10">
          {t('cta')}
        </Pill>
      </div>
    </section>
  );
}
