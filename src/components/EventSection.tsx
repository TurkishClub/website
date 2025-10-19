'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import Image from 'next/image';

// Define event type
interface Event {
  id: string;
  title: string;
  date: string; // ISO format date string
  image?: string;
  lumaUrl?: string;
  locationLink?: string;
  locationName?: string;
}

// Events array - add your events here
const events: Event[] = [
  {
    id: '1',
    title: 'Turkish Club Onboarding',
    date: '2025-10-24T19:00:00+02:00',
    lumaUrl: 'https://luma.com/embed/event/evt-pRpOYXNIkZs70My/simple'
  },
  {
    id: '2',  
    title: 'TUM Student Club Fair',
    date: '2025-10-22T10:00:00+02:00', // ISO format
    image: 'https://www.tum.de/fileadmin/_processed_/3/3/csm_20250924_Bild_Webseite_Veranstaltung_TSCF_16_9_1920_1080_71ba3c6c1d.webp',
    locationLink: 'https://maps.app.goo.gl/rKt17F8Towfoh7Pc6',
    locationName: 'TUM Garching'
  }

];

export default function EventSection() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isMounted, setIsMounted] = useState(false);

  const currentEvent = events[currentEventIndex];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!currentEvent) return;

    const eventDate = new Date(currentEvent.date);

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [currentEvent]);

  const goToPrevious = () => {
    setCurrentEventIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentEventIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#C61E1E] py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Left side - Text */}
          <div className="flex flex-col gap-4 lg:gap-6 items-start flex-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight text-left">
              Bir Sonraki Etkinliğimize Göz Atın
            </h2>

            {/* Location link */}
            {currentEvent.locationLink && (
              <a
                href={currentEvent.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
              >
                <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-base lg:text-lg underline decoration-white/50 hover:decoration-white">
                  {currentEvent.locationName || 'Konumu Görüntüle'}
                </span>
              </a>
            )}

      
            {/* Countdown Timer */}
            {isMounted && (
              <div className="flex gap-4 mt-4">
                <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[70px]">
                  <span className="text-3xl lg:text-4xl font-bold text-white">{timeLeft.days}</span>
                  <span className="text-xs lg:text-sm text-white/80">Gün</span>
                </div>
                <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[70px]">
                  <span className="text-3xl lg:text-4xl font-bold text-white">{timeLeft.hours}</span>
                  <span className="text-xs lg:text-sm text-white/80">Saat</span>
                </div>
                <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[70px]">
                  <span className="text-3xl lg:text-4xl font-bold text-white">{timeLeft.minutes}</span>
                  <span className="text-xs lg:text-sm text-white/80">Dakika</span>
                </div>
                <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[70px]">
                  <span className="text-3xl lg:text-4xl font-bold text-white">{timeLeft.seconds}</span>
                  <span className="text-xs lg:text-sm text-white/80">Saniye</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Right side - Event iframe or image */}
          <div className="flex-1 w-full flex justify-center lg:justify-end items-center gap-4">
            {/* Left navigation button */}
            {events.length > 1 && (
              <button
                onClick={goToPrevious}
                className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm flex-shrink-0"
                aria-label="Previous event"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Media container */}
            <div className="w-full max-w-[600px] min-h-[750px] relative">
              {currentEvent.lumaUrl ? (
                <iframe
                  key={currentEvent.id}
                  src={currentEvent.lumaUrl}
                  className="w-full h-full absolute inset-0 rounded-lg"
                  allow="fullscreen; payment"
                  title={currentEvent.title}
                ></iframe>
              ) : currentEvent.image ? (
                <Image
                  key={currentEvent.id}
                  src={currentEvent.image}
                  alt={currentEvent.title}
                  fill
                  className="rounded-lg object-contain"
                />
              ) : null}
            </div>

            {/* Right navigation button */}
            {events.length > 1 && (
              <button
                onClick={goToNext}
                className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm flex-shrink-0"
                aria-label="Next event"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
