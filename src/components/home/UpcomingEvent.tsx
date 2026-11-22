import { getFormatter, getTranslations } from 'next-intl/server';
import { client } from '@/sanity/lib/client';
import { NEXT_EVENT_QUERY } from '@/sanity/lib/queries';
import { Label, Pill } from './Pill';
import Countdown from './Countdown';
import type { UpcomingEventData } from './types';

async function loadEvent(): Promise<UpcomingEventData | null> {
  // Preview an unpublished event locally without changing the Sanity dataset (see README).
  const preview = process.env.NODE_ENV === 'development' ? process.env.LOCAL_EVENT_PREVIEW_JSON : undefined;
  if (preview) return JSON.parse(preview);
  return client.fetch(NEXT_EVENT_QUERY);
}

/** Next published event: date line, serif title, countdown and the Luma registration embed. */
export default async function UpcomingEvent() {
  const event = await loadEvent();
  if (!event) return null;

  const t = await getTranslations('HomePage.event');
  const format = await getFormatter();
  const date = new Date(event.time);
  const day = format.dateTime(date, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Berlin' });
  const hour = format.dateTime(date, { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });

  return (
    <section id="upcoming-event" className="scroll-mt-6 bg-white text-ink-950">
      <div className="mx-auto max-w-[90rem] px-4 pb-24 md:px-6 md:pb-32">
        {/*
         * Details on the left, Luma on the right. The embed is capped at 760px, about the
         * width of Luma's own card, so it has no empty side margins. Luma lays out side
         * by side (~530px tall) from ~660px wide and stacks (~830px) below that; the
         * heights below match each layout.
         */}
        <div className="grid gap-10 border-t border-ink-950/30 pt-10 xl:grid-cols-[minmax(0,1fr)_760px] xl:gap-12">
          <div className="flex flex-col justify-between gap-10">
            <div className="flex flex-col gap-8">
              <Label className="text-ink-700">{t('label')}</Label>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-ink-700">
                  {day} <span className="px-1.5 text-ink-500">/</span> {hour}
                  {event.location && (
                    <>
                      <span className="px-1.5 text-ink-500">/</span>
                      {event.location}
                    </>
                  )}
                </p>
                <h2 className="font-serif text-[clamp(2.25rem,4.6vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.015em]">
                  {event.name}
                </h2>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="w-full max-w-md">
                <Countdown time={event.time} />
              </div>
              <div>
                <Pill href="https://lu.ma/user/turkishclub" external variant="outline" arrow="↗">
                  {t('calendar')}
                </Pill>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[760px] overflow-hidden rounded-[1.25rem]">
            <iframe
              src={event.embedUrl}
              title={event.name}
              allow="fullscreen; payment"
              loading="lazy"
              className="block h-[860px] w-full md:h-[560px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
