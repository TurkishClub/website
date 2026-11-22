'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Analytics } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import LocaleSwitcher from './LocaleSwitcher';

const INSTAGRAM_URL = 'https://www.instagram.com/turkishclub.munich/';
const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;
const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

type NavItem = { href: string; label: string; desc?: string; external?: boolean };
type NavGroup = { id: string; label: string; items: NavItem[] };

function NavLink({
  item,
  className,
  onClick,
  children
}: {
  item: NavItem;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

/** Stacked typographic wordmark. */
export function Wordmark({ className, accent = 'text-cardinal-700' }: { className?: string; accent?: string }) {
  return (
    <span className={cn('block text-[1.45rem] font-medium leading-[0.92] tracking-[-0.04em]', className)}>
      Turkish
      <br />
      Club
      <br />
      <span className={accent}>München</span>
    </span>
  );
}

type NavbarProps = {
  /** `dark` sits on the maroon home hero; `light` (stone) is used on every other page. */
  tone?: 'light' | 'dark';
};

export default function Navbar({ tone = 'light' }: NavbarProps) {
  const dark = tone === 'dark';
  const reduceMotion = useReducedMotion();
  const t = useTranslations('Navbar');
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  const groups: NavGroup[] = [
    {
      id: 'platforms',
      label: t('platforms'),
      items: [
        { href: INSTAGRAM_URL, label: t('instagram'), desc: t('instagramDesc'), external: true },
        { href: 'https://github.com/TurkishClub', label: t('github'), desc: t('githubDesc'), external: true },
        { href: 'https://lu.ma/user/turkishclub', label: t('eventCalendar'), desc: t('eventCalendarDesc'), external: true }
      ]
    },
    {
      id: 'tools',
      label: t('tools'),
      items: [
        { href: '/yurt-arama', label: t('dormSearch'), desc: t('dormSearchDesc') },
        { href: '/ders-yeri-arama', label: t('studyPlaceSearch'), desc: t('studyPlaceSearchDesc') }
      ]
    },
    {
      id: 'pages',
      label: t('pages'),
      items: [
        { href: '/blog', label: t('blog'), desc: t('blogDesc') },
        { href: '/team', label: t('team'), desc: t('teamDesc') },
        { href: '/events', label: t('pastEvents'), desc: t('pastEventsDesc') },
        { href: '/#contact', label: t('contact'), desc: t('contactDesc') }
      ]
    }
  ];

  const track = (item: NavItem, section: string) =>
    Analytics.trackNavigation({
      action: 'navbar_click',
      link_text: item.label,
      destination: item.href,
      menu_section: section
    });

  useEffect(() => {
    if (!openGroup) return;
    const onPointer = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenGroup(null);
    };
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpenGroup(null);
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [openGroup]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className={cn('relative z-40 w-full', dark ? 'bg-maroon-950 text-white' : 'bg-stone-100 text-ink-950')}>
      <div className="mx-auto flex max-w-[90rem] items-start justify-between gap-6 px-4 py-6 md:px-6 md:py-7">
        <Link href="/" aria-label="Turkish Club München" className="rounded-sm">
          <Wordmark accent={dark ? 'text-white/55' : 'text-cardinal-700'} />
        </Link>

        <nav ref={navRef} aria-label="Main" className="hidden items-center gap-1 pt-1 lg:flex">
          {groups.map((group) => {
            const open = openGroup === group.id;
            return (
              <div key={group.id} className="relative">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`nav-${group.id}`}
                  onClick={() => setOpenGroup(open ? null : group.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-lg transition-[background-color,color,transform] duration-160 ease-out-strong active:scale-[0.97]',
                    open
                      ? dark
                        ? 'bg-white text-maroon-950'
                        : 'bg-ink-950 text-white'
                      : dark
                        ? 'hover:bg-white/10'
                        : 'hover:bg-stone-200'
                  )}
                >
                  {group.label}
                  <span aria-hidden className={cn('text-xs transition-transform duration-200 ease-out-strong', open && 'rotate-180')}>
                    ▾
                  </span>
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.ul
                      id={`nav-${group.id}`}
                      initial={{ opacity: 0, transform: 'translateY(-4px) scale(0.97)' }}
                      animate={{
                        opacity: 1,
                        transform: 'translateY(0px) scale(1)',
                        transition: { duration: 0.18, ease: EASE_OUT_STRONG }
                      }}
                      exit={{
                        opacity: 0,
                        transform: 'translateY(-4px) scale(0.97)',
                        transition: { duration: 0.12, ease: EASE_OUT_STRONG }
                      }}
                      className="absolute right-0 top-full z-50 mt-3 w-80 origin-top-right rounded-2xl bg-white p-2 text-ink-950 shadow-[0_24px_60px_-20px_rgb(20_17_17/0.35)]"
                    >
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <NavLink
                            item={item}
                            onClick={() => {
                              track(item, group.id);
                              setOpenGroup(null);
                            }}
                            className="group block rounded-xl px-4 py-3 transition-colors hover:bg-stone-100"
                          >
                            <span className="flex items-center justify-between text-base font-medium">
                              {item.label}
                              <span aria-hidden className="text-ink-500 transition-transform duration-200 ease-out-strong group-hover:translate-x-0.5">
                                {item.external ? '↗' : '→'}
                              </span>
                            </span>
                            {item.desc && <span className="mt-0.5 block text-sm leading-snug text-ink-500">{item.desc}</span>}
                          </NavLink>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <LocaleSwitcher
            triggerClassName={cn(
              'rounded-full text-lg font-normal',
              dark ? 'text-white hover:bg-white/10 hover:text-white' : 'text-ink-950 hover:bg-stone-200 hover:text-ink-950'
            )}
            itemClassName="bg-white text-ink-950 hover:bg-stone-100 shadow-none"
            contentClassName="rounded-2xl bg-white p-2 shadow-[0_24px_60px_-20px_rgb(20_17_17/0.35)]"
          />
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label={t('openMenu')}
          aria-expanded={mobileOpen}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-full lg:hidden',
            dark ? 'hover:bg-white/10' : 'hover:bg-stone-200'
          )}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            // Full-screen sheet: drawer curve, a hint of direction, faster exit.
            // Reduced motion keeps only the fade.
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-8px)' }}
            animate={{
              opacity: 1,
              transform: 'translateY(0px)',
              transition: { duration: reduceMotion ? 0.2 : 0.3, ease: EASE_DRAWER }
            }}
            exit={{
              opacity: 0,
              ...(reduceMotion ? {} : { transform: 'translateY(-8px)' }),
              transition: { duration: 0.2, ease: EASE_OUT_STRONG }
            }}
            className="fixed inset-0 z-50 flex flex-col bg-stone-100 lg:hidden"
          >
            <div className="flex items-start justify-between px-4 py-6">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <Wordmark />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label={t('closeMenu')}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-stone-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-10">
              <nav aria-label="Mobile" className="flex flex-col gap-10 pt-4">
                {groups.map((group) => (
                  <div key={group.id}>
                    <p className="label-caps mb-2 text-ink-500">{group.label}</p>
                    <ul className="border-t border-ink-950/20">
                      {group.items.map((item) => (
                        <li key={item.href} className="border-b border-ink-950/20">
                          <NavLink
                            item={item}
                            onClick={() => {
                              track(item, 'mobile_menu');
                              setMobileOpen(false);
                            }}
                            className="flex items-center justify-between py-4 font-serif text-[1.75rem] leading-tight"
                          >
                            {item.label}
                            <span aria-hidden className="font-display text-xl font-light">
                              {item.external ? '↗' : '→'}
                            </span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
              <div className="mt-10">
                <p className="label-caps mb-2 text-ink-500">{t('language')}</p>
                <LocaleSwitcher
                  triggerClassName="rounded-full border border-ink-950/25 text-ink-950 hover:bg-stone-200 hover:text-ink-950"
                  contentClassName="bottom-full top-auto mb-2 mt-0 left-0 right-auto origin-bottom-left rounded-2xl bg-white p-2 shadow-lg"
                  itemClassName="bg-white text-ink-950 hover:bg-stone-100 shadow-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
