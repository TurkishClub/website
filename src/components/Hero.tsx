'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

interface MediaItem {
    type: 'image';
    url: string;
    alt: string;
}

interface HeroProps {
    galleryImages?: MediaItem[];
}

export default function Hero({ galleryImages = [] }: HeroProps) {
    // Fallback to empty array if no gallery images provided
    const mediaItems = galleryImages.length > 0 ? galleryImages : [
        {
            type: 'image' as const,
            url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=1200&fit=crop',
            alt: 'Turkish culture'
        },
    ];
    const containerRef = useRef<HTMLDivElement>(null);
    const [autoScrollY, setAutoScrollY] = useState(0);
    const [autoScrollY2, setAutoScrollY2] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Transform scroll progress to scale
    const scale = useTransform(scrollYProgress, [0, 0.7], [1, 2]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1, 1]);
    const carouselOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const beraberOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [1, 1, 1]);
    const bgOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);

    // Auto-scroll animation
    useEffect(() => {
        let animationFrame: number;
        const startTime = Date.now();

        // Calculate total height of one set of items
        // Each item is 320px (h-80) + 16px gap = 336px
        // 6 items = 2016px
        const itemHeight = 336;
        const totalHeight = mediaItems.length * itemHeight;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            // Scroll speed: 30 pixels per second
            const scrollAmount = (elapsed / 1000) * 30;
            setAutoScrollY(scrollAmount % totalHeight); // Left carousel - scrolls down

            // Right carousel scrolls in opposite direction (up)
            // Start from totalHeight and subtract to create upward movement
            setAutoScrollY2(totalHeight - (scrollAmount % totalHeight));

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="relative bg-red-700 text-white">
            {/* Scrollable spacer to enable scroll animation */}
            <div className="h-[150vh]">
                {/* Sticky container for the animated content */}
                <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-between px-8 lg:px-16">
                    {/* White background that fades in */}
                    <motion.div
                        className="absolute inset-0 bg-white z-0"
                        style={{ opacity: bgOpacity }}
                    />

                    {/* Left Side - Turkish Club Text */}
                    <motion.div
                        className="flex flex-col items-start justify-start text-left relative z-10 flex-1"
                        style={{ opacity }}
                    >
                        {/* "Turkish Club" that scales up */}
                        <motion.div
                            style={{
                                scale,
                                opacity: beraberOpacity
                            }}
                            className="origin-left mb-6"
                        >
                            <h1 className="bg-white text-red-700 px-6 py-3 rounded-2xl font-bold inline-block md:text-8xl text-6xl tracking-tight">
                                Turkish
                                <span className='block'> Club</span>
                            </h1>
                        </motion.div>

                        {/* Description and CTA buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="max-w-xl"
                        >
                            <p className="text-white text-lg md:text-xl mb-6 leading-relaxed">
                                Join our vibrant community of Turkish students and friends.
                                Experience rich culture, make lasting connections, and create unforgettable memories together.
                            </p>

                        </motion.div>
                    </motion.div>

                    {/* Right Side - Photo Roll Carousels */}
                    <motion.div
                        className="relative gap-4 h-full items-center z-10 hidden lg:flex"
                        style={{ opacity: carouselOpacity }}
                    >
                        {/* Photo Roll - First Column */}
                        <motion.div
                            className="relative w-64 h-full overflow-hidden"
                        >
                            <motion.div
                                className="flex flex-col gap-4 py-8"
                                style={{ y: -autoScrollY }}
                            >
                                {/* Duplicate items for infinite scroll effect */}
                                {[...mediaItems, ...mediaItems].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (index % mediaItems.length) * 0.1 }}
                                    >
                                        {item.type === 'image' ? (
                                            <Image
                                                src={item.url}
                                                alt={item.alt}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 0px, 256px"
                                            />
                                        ) : (
                                            <video
                                                src={item.url}
                                                className="w-full h-full object-cover"
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                            />
                                        )}
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Photo Roll - Second Column */}
                        <motion.div
                            className="relative w-64 h-full overflow-hidden"
                        >
                            <motion.div
                                className="flex flex-col gap-4 py-8"
                                style={{ y: -autoScrollY2 }}
                            >
                                {/* Duplicate items for infinite scroll effect (reversed) */}
                                {[...mediaItems.slice().reverse(), ...mediaItems.slice().reverse()].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative w-full h-80 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (index % mediaItems.length) * 0.1 }}
                                    >
                                        {item.type === 'image' ? (
                                            <Image
                                                src={item.url}
                                                alt={item.alt}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 0px, 256px"
                                            />
                                        ) : (
                                            <video
                                                src={item.url}
                                                className="w-full h-full object-cover"
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                            />
                                        )}
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}   