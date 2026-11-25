import {useTranslations} from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {Pill} from '@/components/home/Pill';

const APPLY_URL = 'https://forms.gle/yKSR7oey5Ju8d75j6';

type Value = {title: string; description: string};
type Team = {title: string; description: string; tasks: string[]};

export default function TeamPageClient() {
  const t = useTranslations('team');
  const values = t.raw('values.items') as Value[];
  const teams = t.raw('teams.items') as Team[];

  return (
    <main className="min-h-screen bg-stone-100 text-ink-950">
      <div className="bg-maroon-950">
        <Navbar tone="dark" />
        <section className="text-white">
          <div className="mx-auto max-w-[90rem] px-4 pb-16 pt-14 md:px-6 md:pb-24 md:pt-20">
            <h1 className="font-serif text-[clamp(3rem,7.5vw,7rem)] font-normal leading-[0.96] tracking-[-0.03em]">
              {t('hero.title')}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">
              {t('hero.description')}
            </p>
            <Pill href={APPLY_URL} external variant="light" className="mt-10">
              {t('hero.cta')}
            </Pill>
          </div>
        </section>
      </div>

      <section>
        <div className="mx-auto max-w-[90rem] px-4 pb-8 pt-20 md:px-6 md:pt-28">
          <div className="grid gap-x-6 gap-y-4 md:grid-cols-12">
            <h2 className="font-serif text-[clamp(2.25rem,4.5vw,4rem)] font-normal leading-[1.05] tracking-[-0.015em] md:col-span-5">
              {t('values.title')}
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-ink-700 md:col-span-7 md:self-end">
              {t('values.intro')}
            </p>
          </div>
          <ul className="mt-12 md:mt-16">
            {values.map((item) => (
              <li
                key={item.title}
                className="grid items-baseline gap-x-6 gap-y-2 border-b border-ink-950/30 py-7 first:border-t md:grid-cols-12 md:py-9"
              >
                <span className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1] tracking-[-0.01em] md:col-span-5">
                  {item.title}
                </span>
                <span className="max-w-md text-lg leading-relaxed text-ink-700 md:col-span-7">
                  {item.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[90rem] px-4 py-20 md:px-6 md:py-28">
          <div className="grid gap-x-6 gap-y-4 md:grid-cols-12">
            <h2 className="font-serif text-[clamp(2.25rem,4.5vw,4rem)] font-normal leading-[1.05] tracking-[-0.015em] md:col-span-5">
              {t('teams.title')}
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-ink-700 md:col-span-7 md:self-end">
              {t('teams.intro')}
            </p>
          </div>
          <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
            {teams.map((team) => (
              <li key={team.title} className="flex flex-col justify-between gap-10 bg-stone-100 p-6 md:p-10">
                <div>
                  <h3 className="font-serif text-[clamp(2rem,3.2vw,3rem)] font-normal leading-[1.05] tracking-[-0.01em]">
                    {team.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-700">{team.description}</p>
                  <ul className="mt-6 border-t border-ink-950/15">
                    {team.tasks.map((task) => (
                      <li key={task} className="border-b border-ink-950/15 py-3 text-ink-950">
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start text-sm font-medium underline underline-offset-4 hover:text-cardinal-700"
                >
                  {t('teams.apply')}
                  <span className="sr-only">: {team.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cardinal-700 text-white">
        <div className="mx-auto max-w-[90rem] px-4 py-20 md:px-6 md:py-28">
          <p className="max-w-4xl font-serif text-[clamp(1.75rem,3.4vw,3.1rem)] font-normal leading-[1.18] tracking-[-0.01em]">
            {t('closing.text')}
          </p>
          <Pill href={APPLY_URL} external variant="light" className="mt-10">
            {t('closing.cta')}
          </Pill>
        </div>
      </section>

      <Footer />
    </main>
  );
}
