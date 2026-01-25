'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Images, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

import { EventGalleryModal } from './EventGalleryModal';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface Event {
    _id: string;
    name: string;
    description?: {
        tr?: string;
        en?: string;
        de?: string;
    };
    location: string;
}

interface EventCardProps {
    event: Event;
    locale: string;
    dateString: string;
    // Pre-generated strings for the main card display
    mainImage?: {
        blurredUrl: string;
        fullUrl: string;
        alt: string;
    };
    // Pre-generated strings for the gallery
    galleryImages: Array<{
        url: string;
        alt: string;
    }>;
}

export default function EventCard({ event, locale, dateString, mainImage, galleryImages }: EventCardProps) {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const hasMultipleImages = galleryImages.length > 1;

    // Determine the currently displayed image
    // If it's the first one (index 0) and we have a mainImage prop, use that (it might have blur data)
    // Otherwise use the URL from the gallery array.
    const currentImageUrl = currentImageIndex === 0 && mainImage
        ? mainImage.fullUrl
        : galleryImages[currentImageIndex]?.url;

    // Fallback if something is wrong with indices (shouldn't happen given logic below)
    const displayUrl = currentImageUrl || mainImage?.fullUrl || "";
    const displayAlt = (currentImageIndex === 0 && mainImage ? mainImage.alt : galleryImages[currentImageIndex]?.alt) || event.name;
    const blurredUrl = currentImageIndex === 0 && mainImage ? mainImage.blurredUrl : undefined;

    const handleCardClick = () => {
        if (galleryImages.length > 0) {
            setIsGalleryOpen(true);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <Card
                className={cn(
                    "h-full hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group border-0 shadow-md",
                    galleryImages.length > 0 ? "cursor-pointer" : ""
                )}
                onClick={handleCardClick}
            >
                <div className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {/* Blurred background for aesthetic fill - only available for main image usually, 
                        but we can try to use it if current index is 0 */}
                    {blurredUrl && (
                        <Image
                            src={blurredUrl}
                            alt=""
                            fill
                            className="object-cover opacity-50 scale-110 blur-xl"
                            aria-hidden="true"
                        />
                    )}

                    {/* Main displayed image */}
                    {displayUrl && (
                        <Image
                            src={displayUrl}
                            alt={displayAlt}
                            fill
                            className="object-contain z-10 transition-transform duration-500 group-hover:scale-105"
                        />
                    )}

                    {/* Navigation Arrows for Card */}
                    {hasMultipleImages && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 h-8 w-8 rounded-full bg-black/20 text-white opacity-0 transition-all hover:bg-black/40 group-hover:opacity-100 backdrop-blur-sm"
                                onClick={handlePrev}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 h-8 w-8 rounded-full bg-black/20 text-white opacity-0 transition-all hover:bg-black/40 group-hover:opacity-100 backdrop-blur-sm"
                                onClick={handleNext}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </>
                    )}

                    {hasMultipleImages && (
                        <div className="absolute bottom-3 right-3 z-20">
                            <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                                <Images className="w-3 h-3" />
                                <span>{galleryImages.length}</span>
                            </div>
                        </div>
                    )}
                </div>

                <CardHeader>
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{event.name}</CardTitle>
                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{dateString}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 whitespace-pre-wrap">
                        {event.description?.[locale as keyof typeof event.description] ||
                            event.description?.en ||
                            ''}
                    </p>
                </CardContent>
            </Card>

            <EventGalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                images={galleryImages}
                title={event.name}
                initialIndex={currentImageIndex}
            />
        </>
    );
}
