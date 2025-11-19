import {Locale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import ContactForm from '@/components/ContactForm';
import EventSection from '@/components/EventSection';
import Highlights from '@/components/Highlights';
import Hero from '@/components/Hero';
type Props = {
  params: Promise<{locale: Locale}>;
};

export default async function IndexPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-red-700 min-h-screen text-white">
      <Navbar />
      <Hero />
      <Highlights />
      <EventSection />
      <FAQ />
      <ContactForm />
      <Footer />
    </main>
  );
}
