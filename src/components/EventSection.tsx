import { client } from '@/sanity/lib/client';
import { NEXT_EVENT_QUERY } from '@/sanity/lib/queries';
import dynamic from 'next/dynamic';

const EventCountdown = dynamic(() => import('./EventCountdown'));

interface Event {
  _id: string;
  name: string;
  embedUrl: string;
  time: string;
  location: string;
}

export default async function EventSection() {
  // Preview an unpublished event locally without changing the Sanity dataset.
  const previewEvent = process.env.NODE_ENV === 'development'
    ? process.env.LOCAL_EVENT_PREVIEW_JSON
    : undefined;
  const event: Event | null = previewEvent
    ? JSON.parse(previewEvent)
    : await client.fetch(NEXT_EVENT_QUERY);

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
