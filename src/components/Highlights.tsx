"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample highlights data
const highlights = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop",
    imageAlt: "Istanbul Skyline",
    title: "Istanbul",
    overview: "Explore the vibrant culture and rich history of Turkey's largest city, where East meets West.",
    contentType: "Cultural",
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1605880461008-97d3cc1e8ffe?w=800&h=600&fit=crop",
    imageAlt: "Cappadocia Hot Air Balloons",
    title: "Cappadocia",
    overview: "Experience breathtaking hot air balloon rides and explore ancient cave dwellings in this magical landscape.",
    contentType: "Natural",
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&h=600&fit=crop",
    imageAlt: "Antalya Beach",
    title: "Antalya",
    overview: "Relax on pristine beaches and discover ancient ruins along the stunning Turkish Riviera.",
    contentType: "Natural",
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop",
    imageAlt: "Pamukkale Terraces",
    title: "Pamukkale",
    overview: "Visit the stunning white calcium terraces and ancient thermal pools in this natural wonder.",
    contentType: "Natural",
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&h=600&fit=crop",
    imageAlt: "Ephesus Ruins",
    title: "Ephesus",
    overview: "Walk through one of the best-preserved ancient cities and experience history come alive.",
    contentType: "Cultural",
  },
];

export default function Highlights() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Calculate how many cards to show based on screen size
  const getCardsToShow = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1280) return 4; // xl
    if (window.innerWidth >= 768) return 2; // md
    return 1; // mobile
  };

  const [cardsToShow, setCardsToShow] = React.useState(getCardsToShow());

  React.useEffect(() => {
    const handleResize = () => {
      setCardsToShow(getCardsToShow());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, highlights.length - cardsToShow);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleBookNow = (title: string) => {
    console.log(`Booking ${title}`);
    // Add your booking logic here
  };

  return (
    <section className="w-full bg-[#C61E1E]">
      <div className="mx-auto px-12">
        {/* Header */}
        <div className="mb-12 text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Highlights
          </h2>
        </div>

        {/* Cards Container with Navigation */}
        <div className="relative">
          {/* Left Arrow */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10",
              "h-12 w-12 rounded-full shadow-lg bg-background/95 backdrop-blur-sm",
              "hover:bg-accent hover:scale-110 transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
            aria-label="Previous highlights"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Cards */}
          <div className="overflow-hidden px-2">
            <div
              className="flex gap-6 transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
              }}
            >
              {highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="flex-shrink-0"
                  style={{
                    width: `calc(${100 / cardsToShow}% - ${(cardsToShow - 1) * 24 / cardsToShow}px)`,
                    minHeight: "500px",
                  }}
                >
                  <Card
                    imageUrl={highlight.imageUrl}
                    imageAlt={highlight.imageAlt}
                    title={highlight.title}
                    overview={highlight.overview}
                    contentType={highlight.contentType}
                    onBookNow={() => handleBookNow(highlight.title)}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10",
              "h-12 w-12 rounded-full shadow-lg bg-background/95 backdrop-blur-sm",
              "hover:bg-accent hover:scale-110 transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
            aria-label="Next highlights"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 300);
                }
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentIndex === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
