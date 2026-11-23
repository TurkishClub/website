import type { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApplicationForm from '@/components/application/ApplicationForm';
import { Label, Pill } from '@/components/home/Pill';

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
        <div className="mx-auto grid max-w-[90rem] gap-12 px-4 py-20 md:grid-cols-12 md:gap-6 md:px-6 md:py-28">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-10">
              <Label className="text-ink-700">{t('form.label')}</Label>
              <h2 className="mt-6 font-serif text-[clamp(2.5rem,5vw,4.75rem)] font-normal leading-[1] tracking-[-0.02em] text-cardinal-700">
                {t('form.title')}
              </h2>
              <p className="mt-6 text-sm text-ink-500">{t('form.intro')}</p>

              <div className="mt-12 hidden border-t border-ink-950/30 pt-6 md:block">
                <Label className="text-ink-700">{t('aside.label')}</Label>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-ink-700">{t('aside.text')}</p>
                <div className="mt-6">
                  <Pill href="/#contact" variant="outline">
                    {t('aside.cta')}
                  </Pill>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 md:pl-8 lg:pl-14">
            <ApplicationForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
