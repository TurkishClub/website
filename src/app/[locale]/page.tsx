import {Locale} from 'next-intl';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import FloatingActionMenu from '@/components/ui/floating-action-menu';
import ContactForm from '@/components/ContactForm';
type Props = {
  params: Promise<{locale: Locale}>;
};

export default async function IndexPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'HomePage'});

  return (
    <main className="bg-[#C61E1E] min-h-screen text-white">
      <Navbar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24">
        <h1 className="md:text-6xl text-5xl font-bold mb-4">
          {t('hero.title')}
        </h1>
        <p className="md:text-2xl text-lg mb-8">{t('hero.subtitle')}</p>
        <FloatingActionMenu className="relative" />
      </section>
      <FAQ />
      <ContactForm />
      <Footer />
    </main>
  );
}
