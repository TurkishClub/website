import { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import Explore from '@/components/home/Explore';
import Statement from '@/components/home/Statement';
import RedBand from '@/components/home/RedBand';
import Featured from '@/components/home/Featured';
import UpcomingEvent from '@/components/home/UpcomingEvent';
import Faq from '@/components/home/Faq';
import JoinPanel from '@/components/home/JoinPanel';
import type { Highlight } from '@/components/home/types';
import { client } from '@/sanity/lib/client';
import { HIGHLIGHT_CARDS_QUERY } from '@/sanity/lib/queries';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function IndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Highlights are used as text only: the home page does not depend on Sanity images.
  const highlightCards = await client.fetch(HIGHLIGHT_CARDS_QUERY);
  const highlights: Highlight[] = (highlightCards ?? [])
    .filter((card: any) => card.title)
    .map((card: any) => ({
      _id: card._id,
      title: card.title,
      type: card.type || undefined,
      description: card.description || undefined,
      link: card.link || undefined
    }));

  return (
    <main className="min-h-screen bg-stone-100">
      <Navbar tone="dark" />
      <Hero />
      <Explore />
      <Statement />
      <RedBand />
      <Featured highlights={highlights} />
      <UpcomingEvent />
      <Faq />
      <JoinPanel />
      <Footer />
    </main>
  );
}
