import { client } from '@/sanity/lib/client';
import { PAST_EVENTS_QUERY } from '@/sanity/lib/queries';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';

import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';

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
                        {events.map((event) => (
                            <Card key={event._id} className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group border-0 shadow-md">
                                {event.image && (
                                    <div className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        {/* Blurred background for aesthetic fill */}
                                        <Image
                                            src={urlFor(event.image).width(400).blur(50).url()}
                                            alt=""
                                            fill
                                            className="object-cover opacity-50 scale-110 blur-xl"
                                            aria-hidden="true"
                                        />
                                        {/* Main image - fully visible */}
                                        <Image
                                            src={urlFor(event.image).width(800).url()}
                                            alt={event.image.alt || event.name}
                                            fill
                                            className="object-contain z-10 transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-xl mb-2">{event.name}</CardTitle>
                                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(event.time)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 whitespace-pre-wrap">
                                        {event.description?.[locale as keyof typeof event.description] || event.description?.en || ''}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
