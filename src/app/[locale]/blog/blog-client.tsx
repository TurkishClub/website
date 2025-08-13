'use client';

import {useEffect} from 'react';
import {Analytics} from '@/lib/analytics';

interface BlogPageClientProps {
  children: React.ReactNode;
  searchQuery: string;
  currentPage: number;
  totalPosts: number;
}

export default function BlogPageClient({
  children,
  searchQuery,
  currentPage
}: BlogPageClientProps) {
  useEffect(() => {
    // Track page view
    Analytics.trackPageView({
      page_title: 'Turkish Club - Blog',
      page_type: 'blog_list'
    });

    // Track blog interaction for page load
    Analytics.trackBlogEvent({
      action: 'view',
      search_query: searchQuery || undefined,
      page_number: currentPage
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
  }, [searchQuery, currentPage]);

  return <>{children}</>;
}
