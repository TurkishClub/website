import {ReactNode} from 'react';
import {draftMode} from 'next/headers';
import {VisualEditing} from 'next-sanity';
import {DisableDraftMode} from '@/components/DisableDraftMode';
import { PostHogProvider } from '@/components/PostHogProvider'
import SocialClickTracker from '@/components/SocialClickTracker';

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
      <body>
        <PostHogProvider>
          <SocialClickTracker />
          {children}
          {isEnabled && (
            <>
              <VisualEditing />
              <DisableDraftMode />
            </>
          )}
        </PostHogProvider>
      </body>
    </html>
  );
}
