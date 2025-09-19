'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

function whichNetwork(href: string): 'instagram' | 'whatsapp' | 'github' | 'luma' | null {
  try {
    const u = new URL(href, location.origin);
    const h = u.hostname.replace(/^www\./i, '');

    if (h.includes('instagram.com') || h === 'l.instagram.com') return 'instagram';
    if (h.includes('wa.me') || h.includes('whatsapp.com')) return 'whatsapp';
    if (h.includes('github.com')) return 'github';
    if (h.includes('lu.ma')) return 'luma';

    return null;
  } catch {
    return null;
  }
}

export default function SocialClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest('a') as HTMLAnchorElement | null;
      if (!a?.href) return;

      const network = whichNetwork(a.href);
      if (!network) return;

      const sameTab = !a.target || a.target === '_self';

      if (sameTab) e.preventDefault();

      posthog.capture('social_click', {
        network,
        page: window.location.pathname,
        href: a.href,
        text: (a.textContent || '').trim().slice(0, 80),
      });

    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}