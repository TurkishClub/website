import {ReactNode} from 'react';
import {draftMode} from 'next/headers';
import {VisualEditing} from 'next-sanity';
import {DisableDraftMode} from '@/components/DisableDraftMode';
import Script from 'next/script'

type Props = {
  children: ReactNode;
};

// This is the root layout for the application.
// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default async function RootLayout({children}: Props) {
  const {isEnabled} = await draftMode();
  return (
    <html lang="tr">
      <head>
        {/* PostHog web snippet (EU cluster) */}
        <Script id="posthog-snippet" strategy="afterInteractive">
          {`
          !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){
            function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),
            t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}
            var u=e;"undefined"!=typeof a?u=e[a]=[]:a="posthog",u.people=u.people||[],
            u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),
            t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},
            o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags onSurveysLoaded onSessionId debug".split(" ");
            for(n=0;n<o.length;n++)g(u,o[n]);
            e._i.push([i,s,a])},e.__SV=1.2,
            p=t.createElement("script"),p.type="text/javascript",p.async=!0,p.crossOrigin="anonymous",
            p.src="https://eu.i.posthog.com/static/array.js",
            r=t.getElementsByTagName("script")[0],r.parentNode.insertBefore(p,r))
          }(document,window.posthog||[]);
          posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {
            api_host: 'https://eu.i.posthog.com',
            autocapture: true,
            capture_pageview: true,
            person_profiles: 'identified_only'
          });
          `}
        </Script>
      </head>
      <body>
        {children}
        {isEnabled && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  );
}
