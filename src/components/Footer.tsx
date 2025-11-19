import * as React from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';

export default function Footer() {
  const t = useTranslations('Navbar');

  return (
    <footer className="bg-white text-black transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Platformlar Section */}
          <div>
            <h3 className="mb-4 text-xl font-semibold text-red-700">{t('platforms')}</h3>
            <nav className="space-y-3 text-base">
              <Link
                href="https://www.instagram.com/turkishclub.munich/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2  hover:underline transition-colors"
              >
                {t('instagram')}
              </Link>
              <Link
                href="https://github.com/TurkishClub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline transition-colors"
              >
                {t('github')}
              </Link>
              <Link
                href="https://chat.whatsapp.com/LHzs06mN7iCG2cXlZHpZs9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2  hover:underline transition-colors"
              >
                {t('whatsapp')}
              </Link>
              <Link
                href="https://lu.ma/user/turkishclub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2  hover:underline transition-colors"
              >
                Etkinlikler
              </Link>
            </nav>
          </div>

          {/* Araçlar Section */}
          <div>
            <h3 className="mb-4 text-xl font-semibold text-red-700">{t('tools')}</h3>
            <nav className="space-y-3 text-base">
              <Link
                href="/yurt-arama"
                className="flex items-center gap-2 hover:underline transition-colors"
              >
                {t('dormSearch')}
              </Link>
              <Link
                href="/ders-yeri-arama"
                className="flex items-center gap-2 hover:underline transition-colors"
              >
                {t('studyPlaceSearch')}
              </Link>
            </nav>
          </div>

          {/* Sayfalar Section */}
          <div>
            <h3 className="mb-4 text-xl font-semibold text-red-700">{t('pages')}</h3>
            <nav className="space-y-3 text-base">
              <Link
                href="/blog"
                className="flex items-center gap-2 hover:underline transition-colors"
              >
                {t('blog')}
              </Link>
              <Link
                href="/team"
                className="flex items-center gap-2 hover:underline transition-colors"
              >
                {t('team')}
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-8 text-center md:flex-row">
          <p className="text-base">© 2025 Turkish Club</p>
        </div>
      </div>
    </footer>
  );
}
