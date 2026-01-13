'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Instagram,
  GithubIcon,
  MessageCircle,
  Search,
  BookOpen,
  NotebookPen,
  Users,
  ChevronDown,
  Calendar,
  Menu,
  X,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@/lib/analytics';
import LocaleSwitcher from './LocaleSwitcher';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation tracking helper
  const trackNavClick = (
    linkText: string,
    destination: string,
    section?: string
  ) => {
    Analytics.trackNavigation({
      action: 'navbar_click',
      link_text: linkText,
      destination,
      menu_section: section
    });
  };
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleDropdownToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const dropdownRef = dropdownRefs.current[openDropdown];
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <header className="flex transition-colors duration-300 h-20 w-full shrink-0 items-center justify-between px-4 md:px-6">
      {/* Logo - Left Side */}
      <Link href="/" className="flex items-center" prefetch={false}>
        <div className="font-bold text-xl ">Turkish Club</div>
      </Link>

      {/* Right Side - Mobile Button + Navigation Menu + Locale Switcher */}
      <div className="flex items-center gap-6 gap-y-16">
        {/* Mobile Menu Button - Right Side */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
        {/* Navigation Menu */}
        <nav className="hidden lg:flex gap-12 items-center">
          {/* Platformlar */}
          <div
            className="relative"
            ref={(el) => {
              dropdownRefs.current['platforms'] = el;
            }}
          >
            <Button
              variant="ghost"
              onClick={() => handleDropdownToggle('platforms')}
              className="bg-transparent  hover:bg-white/10 rounded-md px-4 py-2 flex items-center gap-1"
            >
              {t('platforms')}
              <motion.div
                animate={{ rotate: openDropdown === 'platforms' ? 180 : 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </Button>
            <AnimatePresence>
              {openDropdown === 'platforms' && (
                <motion.div
                  initial={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute top-full right-0 mt-2 z-50"
                >
                  <div className="flex flex-col items-center gap-2">
                    {[
                      {
                        href: 'https://www.instagram.com/turkishclub.munich/',
                        label: t('instagram'),
                        desc: t('instagramDesc'),
                        icon: <Instagram className="h-4 w-4 text-pink-500" />,
                        target: '_blank' as const
                      },
                      {
                        href: 'https://github.com/TurkishClub',
                        label: t('github'),
                        desc: t('githubDesc'),
                        icon: <GithubIcon className="h-4 w-4 text-gray-800" />,
                        target: '_blank' as const
                      },
                      // {
                      //   href: 'link_placeholder',
                      //   label: t('whatsapp'),
                      //   desc: t('whatsappDesc'),
                      //   icon: (
                      //     <MessageCircle className="h-4 w-4 text-green-500" />
                      //   ),
                      //   target: '_blank' as const
                      // },
                      {
                        href: 'https://lu.ma/user/turkishclub',
                        label: 'Etkinlikler',
                        desc: 'Etkinliklerimizin takvimi',
                        icon: <Calendar className="h-4 w-4 text-pink-500" />,
                        target: '_blank' as const
                      }
                    ].map((opt, index) => (
                      <motion.div
                        key={opt.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Link
                          href={opt.href}
                          target={opt.target}
                          rel={opt.target ? 'noopener noreferrer' : undefined}
                        >
                          <Button className="flex items-center justify-start gap-3 w-64 h-auto text-black bg-white hover:bg-gray-50 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none rounded-xl py-4 px-5">
                            {opt.icon}
                            <span className="flex flex-col text-left">
                              <span className="font-medium text-sm">
                                {opt.label}
                              </span>
                              {opt.desc && (
                                <span className="text-xs text-gray-500 leading-relaxed">
                                  {opt.desc}
                                </span>
                              )}
                            </span>
                          </Button>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Araçlar */}
          <div
            className="relative"
            ref={(el) => {
              dropdownRefs.current['tools'] = el;
            }}
          >
            <Button
              variant="ghost"
              onClick={() => handleDropdownToggle('tools')}
              className="bg-transparent hover:bg-white/10 rounded-md px-4 py-2 flex items-center gap-1"
            >
              {t('tools')}
              <motion.div
                animate={{ rotate: openDropdown === 'tools' ? 180 : 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </Button>
            <AnimatePresence>
              {openDropdown === 'tools' && (
                <motion.div
                  initial={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute top-full right-0 mt-2 z-50"
                >
                  <div className="flex flex-col items-center gap-2">
                    {[
                      {
                        href: '/yurt-arama',
                        label: t('dormSearch'),
                        desc: t('dormSearchDesc'),
                        icon: <Search className="h-4 w-4 text-blue-500" />
                      },
                      {
                        href: '/ders-yeri-arama',
                        label: t('studyPlaceSearch'),
                        desc: t('studyPlaceSearchDesc'),
                        icon: <NotebookPen className="h-4 w-4 text-green-500" />
                      }
                    ].map((opt, index) => (
                      <motion.div
                        key={opt.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Link href={opt.href}>
                          <Button className="flex items-center justify-start gap-3 w-64 h-auto text-black bg-white hover:bg-gray-50 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none rounded-xl py-4 px-5 text-left whitespace-normal break-words">
                            {opt.icon}
                            <span className="flex flex-col text-left">
                              <span className="font-medium text-sm">
                                {opt.label}
                              </span>
                              {opt.desc && (
                                <span className="text-xs text-gray-500 leading-relaxed">
                                  {opt.desc}
                                </span>
                              )}
                            </span>
                          </Button>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sayfalar */}
          <div
            className="relative"
            ref={(el) => {
              dropdownRefs.current['pages'] = el;
            }}
          >
            <Button
              variant="ghost"
              onClick={() => handleDropdownToggle('pages')}
              className="bg-transparent  hover:bg-white/10 rounded-md px-4 py-2 flex items-center gap-1"
            >
              {t('pages')}
              <motion.div
                animate={{ rotate: openDropdown === 'pages' ? 180 : 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </Button>
            <AnimatePresence>
              {openDropdown === 'pages' && (
                <motion.div
                  initial={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute top-full right-0 mt-2 z-50"
                >
                  <div className="flex flex-col items-center gap-2">
                    {[
                      {
                        href: '/blog',
                        label: t('blog'),
                        desc: t('blogDesc'),
                        icon: <BookOpen className="h-4 w-4 text-orange-500" />
                      },
                      {
                        href: '/team',
                        label: t('team'),
                        desc: t('teamDesc'),
                        icon: <Users className="h-4 w-4 text-purple-500" />
                      }
                    ].map((opt, index) => (
                      <motion.div
                        key={opt.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Link href={opt.href}>
                          <Button className="flex items-center justify-start gap-3 w-64 h-auto text-black bg-white hover:bg-gray-50 shadow-[0_0_20px_rgba(0,0,0,0.2)] border-none rounded-xl py-4 px-5">
                            {opt.icon}
                            <span className="flex flex-col text-left">
                              <span className="font-medium text-sm">
                                {opt.label}
                              </span>
                              {opt.desc && (
                                <span className="text-xs text-gray-500 leading-relaxed">
                                  {opt.desc}
                                </span>
                              )}
                            </span>
                          </Button>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <LocaleSwitcher />
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-white dark:bg-gray-900 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex h-20 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                <Link
                  href="/"
                  className="flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="font-bold text-xl text-gray-900 dark:text-white">
                    Turkish Club
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Mobile Navigation Content */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <nav className="space-y-8">
                  {/* Platformlar Section */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      {t('platforms')}
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href="https://www.instagram.com/turkishclub.munich/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 py-3 px-3 text-base text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Instagram className="h-5 w-5 text-pink-500" />
                        {t('instagram')}
                      </Link>
                      <Link
                        href="https://github.com/TurkishClub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 py-3 px-3 text-base text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <GithubIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        {t('github')}
                      </Link>
                      {/* <Link
                        href="link_placeholder"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 py-3 px-3 text-base text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <MessageCircle className="h-5 w-5 text-green-500" />
                        {t('whatsapp')}
                      </Link> */}
                      <Link
                        href="https://lu.ma/user/turkishclub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 py-3 px-3 text-base text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Calendar className="h-5 w-5 text-pink-500" />
                        Etkinlikler
                      </Link>
                    </div>
                  </div>

                  {/* Araçlar Section */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      {t('tools')}
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href="/yurt-arama"
                        className="flex items-center gap-3 py-3 px-3 text-base text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => {
                          trackNavClick(
                            t('dormSearch'),
                            '/yurt-arama',
                            'mobile_menu'
                          );
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Search className="h-5 w-5 text-blue-500" />
                        {t('dormSearch')}
                      </Link>
                      <Link
                        href="/ders-yeri-arama"
                        className="flex items-center gap-3 py-3 px-3 text-base text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => {
                          trackNavClick(
                            t('studyPlaceSearch'),
                            '/ders-yeri-arama',
                            'mobile_menu'
                          );
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <BookOpen className="h-5 w-5 text-green-500" />
                        {t('studyPlaceSearch')}
                      </Link>
                    </div>
                  </div>

                  {/* Sayfalar Section */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      {t('pages')}
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href="/blog"
                        className="flex items-center gap-3 py-3 px-3 text-base text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => {
                          trackNavClick(t('blog'), '/blog', 'mobile_menu');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <BookOpen className="h-5 w-5 text-orange-500" />
                        {t('blog')}
                      </Link>
                      <Link
                        href="/team"
                        className="flex items-center gap-3 py-3 px-3 text-base text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => {
                          trackNavClick(t('team'), '/team', 'mobile_menu');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Users className="h-5 w-5 text-purple-500" />
                        {t('team')}
                      </Link>
                      <Link
                        href="/contact"
                        className="flex items-center gap-3 py-3 px-3 text-base text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => {
                          trackNavClick(t('contact'), '/contact', 'mobile_menu');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Mail className="h-5 w-5 text-purple-500" />
                        {t('contact')}
                      </Link>
                    </div>
                  </div>
                </nav>

                {/* Mobile Locale Switcher */}

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Language
                  </h3>
                  <div className="px-3">
                    <LocaleSwitcher
                      triggerClassName="text-gray-900 dark:text-white"
                      contentClassName="bg-white text-gray-900 border border-gray-200 shadow-md rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
