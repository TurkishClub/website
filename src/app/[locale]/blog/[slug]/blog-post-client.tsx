'use client';

import {useEffect, useRef} from 'react';
import {Analytics} from '@/lib/analytics';

interface BlogPost {
  title: string;
  slug: {
    current: string;
  };
  categories?: Array<{
    title: string;
    slug: string;
  }>;
}

interface BlogPostClientProps {
  children: React.ReactNode;
  post: BlogPost;
  readTime: number;
}

export default function BlogPostClient({
  children,
  post,
  readTime
}: BlogPostClientProps) {
  const readingTimerRef = useRef<(() => number) | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Track page view
    Analytics.trackPageView({
      page_title: `Turkish Club - ${post.title}`,
      page_type: 'blog_post'
    });

    // Track blog post view
    Analytics.trackBlogEvent({
      action: 'view',
      blog_slug: post.slug.current,
      blog_title: post.title,
      blog_category: post.categories?.[0]?.title,
      reading_time_seconds: readTime * 60 // Convert minutes to seconds
    });

    // Start reading timer
    readingTimerRef.current = Analytics.startReadingTimer();

    // Set up scroll depth tracking
    const cleanupScroll = Analytics.trackScrollDepth();

    // Set up session duration tracking
    const cleanupSession = Analytics.trackSessionDuration();

    // Track reading progress every 30 seconds
    progressIntervalRef.current = setInterval(() => {
      if (readingTimerRef.current) {
        const timeSpent = readingTimerRef.current();
        const readPercentage = Math.min(
          (timeSpent / (readTime * 60)) * 100,
          100
        );

        Analytics.trackBlogEvent({
          action: 'read_progress',
          blog_slug: post.slug.current,
          blog_title: post.title,
          reading_time_seconds: timeSpent,
          read_percentage: Math.round(readPercentage)
        });

        // Track completion if user has read for estimated time
        if (readPercentage >= 90) {
          Analytics.trackBlogEvent({
            action: 'complete_read',
            blog_slug: post.slug.current,
            blog_title: post.title,
            reading_time_seconds: timeSpent,
            read_percentage: 100
          });

          // Clear interval after completion
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        }
      }
    }, 30000); // Every 30 seconds

    // Cleanup function
    return () => {
      if (cleanupScroll) cleanupScroll();
      if (cleanupSession) cleanupSession();

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      // Track final reading time when leaving
      if (readingTimerRef.current) {
        const finalTime = readingTimerRef.current();
        const finalPercentage = Math.min(
          (finalTime / (readTime * 60)) * 100,
          100
        );

        Analytics.trackBlogEvent({
          action: 'read_progress',
          blog_slug: post.slug.current,
          blog_title: post.title,
          reading_time_seconds: finalTime,
          read_percentage: Math.round(finalPercentage)
        });
      }
    };
  }, [post, readTime]);

  return <>{children}</>;
}
