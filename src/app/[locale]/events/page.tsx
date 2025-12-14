import {Locale} from 'next-intl';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {client} from '@/sanity/lib/client';
import {ALL_EVENTS_QUERY} from '@/sanity/lib/queries';
import {Event} from '@/data/events';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventsPageClient from './events-client';

export const revalidate = 60; // Revalidate every 60 seconds

type Props = {
  params: Promise<{locale: Locale}>;
};

export default async function EventsPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'EventsPage'});

  // Fetch all events from Sanity
  const allEvents = await client.fetch<Event[]>(ALL_EVENTS_QUERY);

  return (
    <main className="min-h-screen bg-[#C61E1E] text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* Client component for search, sort, and grid display */}
        <EventsPageClient events={allEvents} />
      </div>

      <Footer />
    </main>
  );
}
