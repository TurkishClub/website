import { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EventSection from '@/components/EventSection';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import { client } from '@/sanity/lib/client';
import { GALLERIES_QUERY, HIGHLIGHT_CARDS_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';

const FAQ = dynamic(() => import('@/components/FAQ'));
const ContactForm = dynamic(() => import('@/components/ContactForm'));
const Highlights = dynamic(() => import('@/components/Highlights'));
type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function IndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch gallery images and highlight cards from Sanity
  const [galleries, highlightCards] = await Promise.all([
    client.fetch(GALLERIES_QUERY),
    client.fetch(HIGHLIGHT_CARDS_QUERY),
  ]);

  const galleryImages = galleries
    .filter((gallery: any) => gallery.image?.asset)
    .map((gallery: any) => ({
      type: 'image' as const,
      url: urlFor(gallery.image).width(800).height(1200).url(),
      alt: gallery.title || gallery.image.alt || 'Gallery image',
    }));

  const highlights = highlightCards
    .filter((card: any) => card.image?.asset)
    .map((card: any) => ({
      _id: card._id,
      title: card.title,
      type: card.type,
      description: card.description,
      imageUrl: urlFor(card.image).width(800).height(600).url(),
      imageAlt: card.image.alt || card.title || 'Highlight image',
      link: card.link,
    }));

  return (
    <main className="bg-red-700 min-h-screen text-white">
      <Navbar />
      <Hero galleryImages={galleryImages} />
      <Highlights highlights={highlights} />
      <EventSection />
      <FAQ />
      <ContactForm />
      <Footer />
    </main>
  );
}
