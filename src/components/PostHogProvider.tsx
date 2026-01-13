'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize PostHog if the API key is available
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

    if (posthogKey) {
      try {
        posthog.init(posthogKey, {
          api_host: '/ingest',
          ui_host: 'https://eu.posthog.com',
          person_profiles: 'identified_only',
          capture_pageview: false, // We'll handle pageviews manually
          capture_pageleave: true,
          disable_session_recording: true, // Disable for better performance
          autocapture: false, // Disable automatic event capture
          cross_subdomain_cookie: false,
          secure_cookie: false, // For localhost development
          loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('PostHog Provider loaded successfully');
              console.log('PostHog distinct_id:', posthog.get_distinct_id());
              posthog.debug();
            }

            // Test if PostHog can reach the server after it's fully loaded
            setTimeout(() => {
              const distinctId = posthog.get_distinct_id();
              console.log('Testing PostHog with distinct_id:', distinctId);
              posthog.capture('posthog_test_connection', {
                source: 'posthog_provider',
                timestamp: new Date().toISOString(),
                distinct_id: distinctId
              });
            }, 1000);
          }
        });
      } catch (error) {
        console.warn('PostHog initialization failed:', error);
      }
    } else {
      console.warn('PostHog key not found. Analytics will be disabled.');
    }
  }, []);

  // Always render children, even if PostHog fails to initialize
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!posthogKey) {
    // Return children without PostHog provider if key is missing
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
