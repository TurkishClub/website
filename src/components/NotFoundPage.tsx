import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {Pill} from '@/components/home/Pill';

type Suggestion = {title: string; description: string; href: string};

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');
  const links = t.raw('links') as Suggestion[];

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-stone-100 text-ink-950">
      <div className="bg-maroon-950">
        <Navbar tone="dark" />
        <section className="text-white">
          <div className="mx-auto max-w-[90rem] px-4 pb-16 pt-14 md:px-6 md:pb-24 md:pt-20">
            <p aria-hidden className="font-serif text-[clamp(6rem,20vw,16rem)] font-normal leading-[0.85] tracking-[-0.04em] text-white/15">
              404
            </p>
            <h1 className="mt-6 max-w-4xl font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1] tracking-[-0.025em]">
              {t('title')}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">{t('description')}</p>
            <Pill href="/" variant="light" className="mt-10">
              {t('home')}
            </Pill>
          </div>
        </section>
      </div>

      <section className="flex-1">
        <ul className="mx-auto max-w-[90rem] px-4 py-16 md:px-6 md:py-24">
          {links.map((item) => (
            <li key={item.href} className="border-b border-ink-950/30 first:border-t">
              <Link href={item.href} className="group grid items-baseline gap-x-6 gap-y-2 py-7 md:grid-cols-12 md:py-9">
                <span className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.015em] transition-colors duration-200 group-hover:text-cardinal-700 md:col-span-5">
                  {item.title}
                </span>
                <span className="max-w-md text-lg leading-relaxed text-ink-700 md:col-span-7">{item.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </main>
  );
}
