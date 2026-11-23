import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const SOCIALS = [
  { href: 'https://www.instagram.com/turkishclub.munich/', label: 'Instagram' },
  { href: 'https://lu.ma/user/turkishclub', label: 'Luma' },
  { href: 'https://github.com/TurkishClub', label: 'GitHub' }
];

/** Two-tone footer: maroon block with the wordmark and links, ink strip with socials. */
export default function Footer() {
  const t = useTranslations('Navbar');
  const tf = useTranslations('HomePage.footer');
  const year = new Date().getFullYear();

  const involved = [
    { href: '/events', label: t('pastEvents') },
    { href: '/team', label: t('team') },
    { href: '/application', label: t('application') },
    { href: '/blog', label: t('blog') },
    { href: '/#contact', label: t('contact') }
  ];
  const tools = [
    { href: '/yurt-arama', label: t('dormSearch') },
    { href: '/ders-yeri-arama', label: t('studyPlaceSearch') }
  ];

  const linkClass = 'group inline-flex items-center gap-1.5 text-base hover:underline underline-offset-4';

  return (
    <footer className="text-white">
      <div className="bg-maroon-950">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-4 py-14 md:grid-cols-12 md:gap-6 md:px-6 md:py-16">
          <div className="md:col-span-6">
            <p className="text-[1.6rem] font-medium leading-[0.92] tracking-[-0.04em]">
              Turkish
              <br />
              Club
              <br />
              <span className="text-white/60">München</span>
            </p>
            <p className="mt-8 max-w-sm font-serif text-2xl leading-snug">{tf('tagline')}</p>
            <p className="mt-4 text-sm text-white/70">{tf('city')}</p>
          </div>
          <div className="md:col-span-3">
            <p className="label-caps mb-4 text-white/60">{tf('involved')}</p>
            <ul className="flex flex-col gap-2.5">
              {involved.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="label-caps mb-4 text-white/60">{t('tools')}</p>
            <ul className="flex flex-col gap-2.5">
              {tools.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-ink-950">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label={tf('touch')}>
            {SOCIALS.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {s.label} <span aria-hidden>→</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-white/60">
            © {year} Turkish Club München. {tf('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
