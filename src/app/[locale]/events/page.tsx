import { client } from '@/sanity/lib/client';
import { PAST_EVENTS_QUERY } from '@/sanity/lib/queries';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { urlFor } from '@/sanity/lib/image';

import EventCard from '@/components/EventCard';

export const revalidate = 60; // ISR

interface Event {
    _id: string;
    name: string;
    embedUrl: string;
    time: string;
    location: string;
    description?: {
        tr?: string;
        en?: string;
        de?: string;
    };
    image?: {
        asset: {
            _id: string;
            url: string;
        };
        alt?: string;
    };
    images?: Array<{
        asset: {
            _id: string;
            url: string;
        };
        alt?: string;
    }>;
}

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function EventsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale as any);
    const t = await getTranslations('PastEvents' as any) as any;

    const events: Event[] = await client.fetch(PAST_EVENTS_QUERY);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('description')}</p>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">{t('noEvents')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => {
                            // Logic to prepare images for the client component
                            const rawGalleryImages = event.images?.length
                                ? event.images
                                : event.image
                                    ? [event.image]
                                    : [];

                            const mainRawImage = rawGalleryImages[0];

                            const mainImage = mainRawImage ? {
                                blurredUrl: urlFor(mainRawImage).width(400).blur(50).url(),
                                fullUrl: urlFor(mainRawImage).width(800).url(),
                                alt: mainRawImage.alt || event.name
                            } : undefined;

                            const galleryImages = rawGalleryImages.map(img => ({
                                url: urlFor(img).width(1200).url(),
                                alt: img.alt || event.name
                            }));

                            return (
                                <EventCard
                                    key={event._id}
                                    event={event}
                                    locale={locale}
                                    dateString={formatDate(event.time)}
                                    mainImage={mainImage}
                                    galleryImages={galleryImages}
                                />
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
