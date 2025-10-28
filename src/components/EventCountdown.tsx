'use client';

import { useEffect, useState } from 'react';

interface EventCountdownProps {
  eventTime: string;
  eventName: string;
  embedUrl: string;
}

export default function EventCountdown({ eventTime, eventName, embedUrl }: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const eventDate = new Date(eventTime);

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
  }, [eventTime]);

  return (
    <section className="bg-[#C61E1E] py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Left side - Text */}
          <div className="flex flex-col gap-4 lg:gap-6 items-start flex-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight text-left">
              Bir Sonraki Etkinliğimize Göz Atın
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-white/90 text-left">
              Topluluğumuzla bir araya gelin ve unutulmaz anlar yaşayın
            </p>

            {/* Countdown Timer */}
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
          </div>
          
          {/* Right side - Event iframe */}
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <iframe
              src={embedUrl}
              className="w-full max-w-[600px] min-h-[750px] rounded-lg"
              allow="fullscreen; payment"
              title={eventName}
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
