'use client';

import {useEffect} from 'react';
import {Analytics} from '@/lib/analytics';

interface TeamAnalyticsClientProps {
  children: React.ReactNode;
  totalPositions: number;
}

export default function TeamAnalyticsClient({
  children,
  totalPositions
}: TeamAnalyticsClientProps) {
  useEffect(() => {
    // Track page view
    Analytics.trackPageView({
      page_title: 'Turkish Club - Team & Jobs',
      page_type: 'team'
    });

    // Track team page interaction
    Analytics.trackTeamEvent({
      action: 'job_view'
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
  }, [totalPositions]);

  return <>{children}</>;
}
