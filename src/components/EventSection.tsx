import { client } from '@/sanity/lib/client';
import { NEXT_EVENT_QUERY } from '@/sanity/lib/queries';
import EventCountdown from './EventCountdown';

interface Event {
  _id: string;
  name: string;
  embedUrl: string;
  time: string;
  location: string;
}

export default async function EventSection() {
  const event: Event | null = await client.fetch(NEXT_EVENT_QUERY);

  // If no upcoming event, don't render the section
  if (!event) {
    return null;
  }

  return (
    <EventCountdown 
      eventTime={event.time}
      eventName={event.name}
      embedUrl={event.embedUrl}
    />
  );
}
