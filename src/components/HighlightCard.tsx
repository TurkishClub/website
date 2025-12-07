import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Define the props for the TravelCard component
interface HighlightCard extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  imageAlt: string;
  title: string;
  overview: string;
  contentType: string;
  url?: string; // Optional URL for the discover button
}

const HighlightCard = React.forwardRef<HTMLDivElement, HighlightCard>(
  (
    {
      className,
      imageUrl,
      imageAlt,
      title,
      overview,
      contentType,
      url,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative w-full max-w-sm overflow-hidden rounded-xl bg-card shadow-lg",
          "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2",
          className
        )}
        {...props}
      >
        {/* Background Image with Zoom Effect on Hover */}
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="absolute inset-0 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 20vw"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Content Container */}
        <div className="relative flex h-full flex-col justify-end p-6 text-card-foreground">
          {/* Bottom Section: Details (slides up on hover) */}
          <div className="space-y-4 transition-transform duration-500 ease-in-out group-hover:-translate-y-16">
            <div>
              <h3 className="text-3xl font-bold text-white">{title}</h3>
            </div>
            <div>
              <p className="text-sm text-white/70 leading-relaxed">
                {overview}
              </p>
            </div>
          </div>

          {/* Bottom Section: Price and Button (revealed on hover) */}
          <div className="absolute -bottom-20 left-0 w-full p-6 opacity-0 transition-all duration-500 ease-in-out group-hover:bottom-0 group-hover:opacity-100">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold text-white">{contentType}</span>
              </div>
              {url ? (
                <Link href={url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-white text-black hover:bg-white/90">
                    Discover <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button size="sm" className="bg-white text-black hover:bg-white/90" disabled>
                  Discover <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
HighlightCard.displayName = "HighlightCard";

export { HighlightCard };