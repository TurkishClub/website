'use client';

import {useEffect} from 'react';
import {Analytics} from '@/lib/analytics';

interface HomePageClientProps {
  children: React.ReactNode;
}

export default function HomePageClient({children}: HomePageClientProps) {
  useEffect(() => {
    // Track page view
    Analytics.trackPageView({
      page_title: 'Turkish Club - Home',
      page_type: 'home'
    });

    // Set up scroll depth tracking
    const cleanupScroll = Analytics.trackScrollDepth();

    // Set up session duration tracking
    const cleanupSession = Analytics.trackSessionDuration();

    // Cleanup function
    return () => {
      if (cleanupScroll) cleanupScroll();
      if (cleanupSession) cleanupSession();
    };
  }, []);

  return <>{children}</>;
}
