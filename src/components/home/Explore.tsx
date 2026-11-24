import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type EntryItem = { title: string; description: string; href: string };

/** The main things the club offers, as one simple list. */
export default function Explore() {
  const entries = useTranslations('HomeLists').raw('entry') as EntryItem[];

  return (
    <section className="bg-stone-100 text-ink-950">
      <ul className="mx-auto max-w-[90rem] px-4 pb-8 pt-16 md:px-6 md:pt-24">
        {entries.map((item) => {
          const external = item.href.startsWith('http');
          const className = 'group grid items-baseline gap-x-6 gap-y-2 py-7 md:grid-cols-12 md:py-9';
          const row = (
            <>
              <span className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.015em] transition-colors duration-200 group-hover:text-cardinal-700 md:col-span-5">
                {item.title}
              </span>
              <span className="max-w-md text-lg leading-relaxed text-ink-700 md:col-span-7">{item.description}</span>
            </>
          );
          return (
            <li key={item.href} className="border-b border-ink-950/30 first:border-t">
              {external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                  {row}
                </a>
              ) : (
                <Link href={item.href} className={className}>
                  {row}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
