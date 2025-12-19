import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ReactNode} from 'react';
import {clsx} from 'clsx';
import {Inter, Playfair_Display} from 'next/font/google';
import {routing} from '@/i18n/routing';
import {PostHogProvider} from '@/components/PostHogProvider';
import './styles.css';

type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata(props: Omit<Props, 'children'>) {
  const {locale} = await props.params;
  const t = await getTranslations({locale: locale as "en" | "de" | "tr", namespace: 'LocaleLayout'});


  return {
    title: t('title'),
    icons: {
      icon: '/ico.png',
      shortcut: '/ico.png',
      apple: '/ico.png'
    }
  };
}

export default async function LocaleLayout({children, params}: Props) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  const validLocale = locale as 'en' | 'de' | 'tr';
  if (!hasLocale(routing.locales, validLocale)) {
    notFound();
  }

  // Enable static rendering

  setRequestLocale(locale as "en" | "de" | "tr");


  return (
    <html className="h-full" lang={validLocale}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://eu.i.posthog.com" />
        <link rel="preconnect" href="https://eu-assets.i.posthog.com" />
      </head>
      <body className={clsx(inter.className, playfair.variable, 'flex h-full flex-col')}>
        <PostHogProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
