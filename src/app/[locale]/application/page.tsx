import type { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApplicationForm from '@/components/application/ApplicationForm';
import { Label } from '@/components/home/Pill';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'application.meta' });
  return { title: t('title'), description: t('description') };
}

/** Membership application, styled like the home page. */
export default async function ApplicationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('application');

  return (
    <main className="min-h-screen bg-stone-100">
      <Navbar />

      <section id="apply" className="scroll-mt-6 bg-stone-100 text-ink-950">
        <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-16 sm:px-6 md:gap-12 md:py-24">
          <header>
            <Label className="text-ink-700">{t('form.label')}</Label>
            <h1 className="mt-4 font-serif text-[clamp(2.5rem,5vw,4.75rem)] font-normal leading-[1] tracking-[-0.02em] text-cardinal-700">
              {t('form.title')}
            </h1>
          </header>
          <ApplicationForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
