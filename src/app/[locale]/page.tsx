import { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EventSection from '@/components/EventSection';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

const FAQ = dynamic(() => import('@/components/FAQ'));
const ContactForm = dynamic(() => import('@/components/ContactForm'));
const Highlights = dynamic(() => import('@/components/Highlights'));
type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function IndexPage({ params }: Props) {
  const { locale } = await params;
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
