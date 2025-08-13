/**
 * Centralized analytics utility for PostHog tracking
 * Provides type-safe event tracking and consistent data structure
 */

import posthog from 'posthog-js';

// Event types for type safety
export interface BaseAnalyticsEvent {
  timestamp: string;
  page_url: string;
  user_agent?: string;
  referrer?: string;
  locale?: string;
}

export interface PageViewEvent extends BaseAnalyticsEvent {
  page_title: string;
  page_type: 'home' | 'dorm_search' | 'blog_list' | 'blog_post' | 'team' | 'other';
  device_type?: 'mobile' | 'tablet' | 'desktop';
}

export interface DormSearchEvent extends BaseAnalyticsEvent {
  action: 'search' | 'filter' | 'sort' | 'view_mode_change' | 'dorm_view' | 'load_more' | 'external_click' | 'map_view';
  search_query?: string;
  filters_applied?: {
    max_price?: number;
    features?: string[];
    sort_by?: string;
  };
  result_count?: number;
  dorm_id?: string;
  dorm_name?: string;
  view_mode?: 'grid' | 'map';
}

export interface BlogEvent extends BaseAnalyticsEvent {
  action: 'view' | 'search' | 'read_progress' | 'complete_read' | 'sort' | 'pagination';
  blog_slug?: string;
  blog_title?: string;
  blog_category?: string;
  search_query?: string;
  reading_time_seconds?: number;
  read_percentage?: number;
  sort_method?: string;
  page_number?: number;
}

export interface TeamEvent extends BaseAnalyticsEvent {
  action: 'job_view' | 'job_expand' | 'filter' | 'load_more';
  job_id?: string;
  job_title?: string;
  job_department?: string;
  job_type?: string;
  filters_applied?: {
    department?: string;
    type?: string;
    location?: string;
  };
}

export interface NavigationEvent extends BaseAnalyticsEvent {
  action: 'navbar_click' | 'footer_click' | 'language_switch' | 'external_link' | 'floating_menu';
  link_text?: string;
  destination?: string;
  menu_section?: string;
  language_from?: string;
  language_to?: string;
}

export interface EngagementEvent extends BaseAnalyticsEvent {
  action: 'scroll_depth' | 'faq_expand' | 'session_duration' | 'page_exit';
  scroll_percentage?: number;
  faq_question?: string;
  session_duration_seconds?: number;
  exit_intent?: boolean;
}

// Analytics utility class
export class Analytics {
  private static isEnabled(): boolean {
    return typeof window !== 'undefined' && !!(window as any).posthog;
  }

  private static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private static getBaseEventData(): BaseAnalyticsEvent {
    if (typeof window === 'undefined') {
      return {
        timestamp: new Date().toISOString(),
        page_url: '',
      };
    }

    return {
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      referrer: document.referrer || undefined,
      locale: window.location.pathname.split('/')[1] || 'en',
    };
  }

  // Page View Tracking
  static trackPageView(data: Omit<PageViewEvent, keyof BaseAnalyticsEvent>) {
    if (!this.isEnabled()) return;

    const event: PageViewEvent = {
      ...this.getBaseEventData(),
      ...data,
      device_type: this.getDeviceType(),
    };

    posthog.capture('page_view', event);
  }

  // Dorm Search Analytics
  static trackDormSearch(data: Omit<DormSearchEvent, keyof BaseAnalyticsEvent>) {
    if (!this.isEnabled()) return;

    const event: DormSearchEvent = {
      ...this.getBaseEventData(),
      ...data,
    };

    posthog.capture('dorm_search', event);
  }

  // Blog Analytics
  static trackBlogEvent(data: Omit<BlogEvent, keyof BaseAnalyticsEvent>) {
    if (!this.isEnabled()) return;

    const event: BlogEvent = {
      ...this.getBaseEventData(),
      ...data,
    };

    posthog.capture('blog_interaction', event);
  }

  // Team Page Analytics
  static trackTeamEvent(data: Omit<TeamEvent, keyof BaseAnalyticsEvent>) {
    if (!this.isEnabled()) return;

    const event: TeamEvent = {
      ...this.getBaseEventData(),
      ...data,
    };

    posthog.capture('team_interaction', event);
  }

  // Navigation Analytics
  static trackNavigation(data: Omit<NavigationEvent, keyof BaseAnalyticsEvent>) {
    if (!this.isEnabled()) return;

    const event: NavigationEvent = {
      ...this.getBaseEventData(),
      ...data,
    };

    posthog.capture('navigation', event);
  }

  // Engagement Analytics
  static trackEngagement(data: Omit<EngagementEvent, keyof BaseAnalyticsEvent>) {
    if (!this.isEnabled()) return;

    const event: EngagementEvent = {
      ...this.getBaseEventData(),
      ...data,
    };

    posthog.capture('user_engagement', event);
  }

  // Reading Time Tracker
  static startReadingTimer(): () => number {
    const startTime = Date.now();
    
    return () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      return duration;
    };
  }

  // Scroll Depth Tracking
  static trackScrollDepth() {
    if (!this.isEnabled()) return;

    let maxScroll = 0;
    const thresholds = [25, 50, 75, 100];
    const tracked = new Set<number>();

    const handleScroll = () => {
      const scrolled = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      maxScroll = Math.max(maxScroll, scrolled);

      for (const threshold of thresholds) {
        if (maxScroll >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          this.trackEngagement({
            action: 'scroll_depth',
            scroll_percentage: threshold,
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Return cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }

  // Session Duration Tracking
  static trackSessionDuration() {
    if (!this.isEnabled()) return;

    const sessionStart = Date.now();

    const trackDuration = () => {
      const duration = Math.round((Date.now() - sessionStart) / 1000);
      this.trackEngagement({
        action: 'session_duration',
        session_duration_seconds: duration,
      });
    };

    // Track session duration on page unload
    window.addEventListener('beforeunload', trackDuration);
    
    // Also track every 30 seconds for long sessions
    const interval = setInterval(trackDuration, 30000);

    return () => {
      window.removeEventListener('beforeunload', trackDuration);
      clearInterval(interval);
    };
  }
}

// Convenience hooks for React components
export const useAnalytics = () => {
  return Analytics;
};
