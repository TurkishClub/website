'use client';

import {useTranslations} from 'next-intl';
import {Event} from '@/data/events';
import {Clock, MapPin} from 'lucide-react';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';

interface EventCardProps {
  event: Event;
}

export default function EventCard({event}: EventCardProps) {
  const t = useTranslations('EventsPage');

  // Format the date and time
  const eventDate = new Date(event.time);
  const now = new Date();
  const isPast = eventDate < now;

  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Get day and month for the date badge
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('en-US', {month: 'short'});

  return (
    <Card className="group hover:shadow-2xl hover:shadow-black/20 transition-all duration-300  backdrop-blur-md text-white border border-white/20 overflow-hidden flex flex-col">
      <CardHeader className="p-0 relative">

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge
            className={`${
              isPast
                ? 'bg-gray-600/90 hover:bg-gray-700/90 backdrop-blur-sm'
                : 'bg-green-500/90 hover:bg-green-600/90 backdrop-blur-sm'
            } text-white border-0 shadow-lg`}
          >
            {isPast ? t('past') : t('upcoming')}
          </Badge>
        </div>

        {/* Date Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white/20 backdrop-blur-md text-white rounded-lg shadow-lg p-3 text-center min-w-[60px] border border-white/30">
            <div className="text-2xl font-bold leading-none">{day}</div>
            <div className="text-xs uppercase mt-1 font-semibold">{month}</div>
          </div>
        </div>

        {/* Embedded Event Preview */}
        <div className="w-full h-[400px] bg-white/5 backdrop-blur-sm">
          <iframe
            src={event.embedUrl}
            title={event.name}
            className="w-full h-full"
            frameBorder="0"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </CardHeader>

      <CardContent className="p-5 flex flex-col gap-4 bg-white/5 backdrop-blur-sm">
        {/* Event Name */}
        <h3 className="text-xl font-bold text-white line-clamp-2">
          {event.name}
        </h3>

        <div className="space-y-3">
          {/* Time */}
          <div className="flex items-start gap-2 text-white/90 text-sm">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-white" />
            <div className="flex flex-col">
              <span className="font-medium">{formattedDate}</span>
              <span className="text-white/70">{formattedTime}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-white/90 text-sm">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-white" />
            <span className="line-clamp-2">{event.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
