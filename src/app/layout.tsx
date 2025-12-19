import { ReactNode } from 'react';
import { PostHogProvider } from '@/components/PostHogProvider'
import SocialClickTracker from '@/components/SocialClickTracker';

type Props = {
  children: ReactNode;
};

// This is the root layout for the application.
// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default async function RootLayout({ children }: Props) {
  return (
    <html lang="tr">
      <body>
        <PostHogProvider>
          <SocialClickTracker />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
