"use client";

import * as React from "react";
import { HighlightCard } from "@/components/HighlightCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEMANTIC_COLORS } from "@/config/colors";

interface Highlight {
  _id: string;
  title: string;
  type: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  link?: string;
}

interface HighlightsProps {
  highlights?: Highlight[];
}

export default function Highlights({ highlights = [] }: HighlightsProps) {
  // Fallback to sample data if no highlights provided
  const displayHighlights = highlights.length > 0 ? highlights : [
    {
      _id: '1',
      imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop",
      imageAlt: "Istanbul Skyline",
      title: "Istanbul",
      description: "Explore the vibrant culture and rich history of Turkey's largest city, where East meets West.",
      type: "Cultural",
      link: undefined,
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Calculate how many cards to show based on screen size
  const getCardsToShow = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1280) return 5; // xl
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

  const maxIndex = Math.max(0, displayHighlights.length - cardsToShow);

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

  return (
    <section className={cn("w-full", SEMANTIC_COLORS.background.white, SEMANTIC_COLORS.text.secondary)}>
      <div className="mx-auto px-12">
        {/* Header */}
        <div className="text-left">
          <h2 className={cn("text-4xl md:text-5xl font-bold mb-4", SEMANTIC_COLORS.text.secondary)}>
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
              {displayHighlights.map((highlight) => (
                <div
                  key={highlight._id}
                  className="flex-shrink-0"
                  style={{
                    width: `calc(${100 / cardsToShow}% - ${(cardsToShow - 1) * 24 / cardsToShow}px)`,
                    minHeight: "500px",
                  }}
                >
                  <HighlightCard
                    imageUrl={highlight.imageUrl}
                    imageAlt={highlight.imageAlt}
                    title={highlight.title}
                    overview={highlight.description}
                    contentType={highlight.type}
                    url={highlight.link}
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
