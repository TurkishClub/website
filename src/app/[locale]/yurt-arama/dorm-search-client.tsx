'use client';

import {useEffect} from 'react';
import {Analytics} from '@/lib/analytics';

interface DormSearchClientProps {
  children: React.ReactNode;
}

export default function DormSearchClient({children}: DormSearchClientProps) {
  useEffect(() => {
    // Track page view
    Analytics.trackPageView({
      page_title: 'Turkish Club - Dorm Search',
      page_type: 'dorm_search'
    });

    // Set up scroll depth tracking
    const cleanupScroll = Analytics.trackScrollDepth();

    // Set up session duration tracking
    const cleanupSession = Analytics.trackSessionDuration();

    // Track page entry
    Analytics.trackDormSearch({
      action: 'search',
      search_query: '',
      result_count: 0
    });

    // Cleanup function
    return () => {
      if (cleanupScroll) cleanupScroll();
      if (cleanupSession) cleanupSession();
    };
  }, []);

  return <>{children}</>;
}
