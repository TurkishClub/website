'use client';

import * as React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryImage {
    url: string;
    alt?: string;
}

interface EventGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: GalleryImage[];
    title: string;
    initialIndex?: number;
}

export function EventGalleryModal({
    isOpen,
    onClose,
    images,
    title,
    initialIndex = 0,
}: EventGalleryModalProps) {
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

    React.useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    const handlePrevious = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const currentImage = images[currentIndex];

    if (!currentImage) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 bg-black/95 border-none text-white focus:outline-none overflow-hidden flex flex-col items-center justify-center">
                <DialogTitle className="sr-only">
                    {title} Gallery
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Image {currentIndex + 1} of {images.length}
                </DialogDescription>

                <div className="absolute top-4 right-4 z-50">
                    <DialogClose asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </DialogClose>
                </div>

                <div className="relative w-full h-full flex items-center justify-center p-4">
                    {/* Main Image */}
                    <div className="relative w-full h-full max-h-[80vh]">
                        <Image
                            src={currentImage.url}
                            alt={currentImage.alt || `${title} - Image ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12 md:h-14 md:w-14 z-50 transition-all backdrop-blur-md border border-white/10"
                                onClick={handlePrevious}
                            >
                                <ChevronLeft className="h-8 w-8 text-white" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12 md:h-14 md:w-14 z-50 transition-all backdrop-blur-md border border-white/10"
                                onClick={handleNext}
                            >
                                <ChevronRight className="h-8 w-8 text-white" />
                            </Button>
                        </>
                    )}
                </div>

                {/* Thumbnail Logic or Counter could go here */}
                <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-400">
                    {currentIndex + 1} / {images.length}
                </div>

            </DialogContent>
        </Dialog>
    );
}
