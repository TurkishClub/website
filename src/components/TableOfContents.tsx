'use client';

import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {ShareButton} from '@/components/ShareButton';
interface TocItem {
  id: string;
  title: string;
  level: number;
}

export function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Add a small delay to ensure content is fully rendered
    const timer = setTimeout(() => {
      // Generate TOC from h2 elements only
      const headings = document.querySelectorAll('h2');
      const tocItems: TocItem[] = [];
      const seenIds = new Set<string>();
      const seenTitles = new Set<string>();

      headings.forEach((heading, index) => {
        const text =
          heading.textContent || heading.innerText || `Section ${index + 1}`;
        const trimmedText = text.trim();

        // Only process headings that have IDs and haven't been seen before
        if (
          heading.id &&
          !seenIds.has(heading.id) &&
          !seenTitles.has(trimmedText)
        ) {
          seenIds.add(heading.id);
          seenTitles.add(trimmedText);

          tocItems.push({
            id: heading.id,
            title: trimmedText,
            level: 2
          });
        }
      });

      setToc(tocItems);

      // Intersection Observer for active section
      const observerOptions = {
        rootMargin: '-80px 0px -80px 0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      }, observerOptions);

      headings.forEach((heading) => observer.observe(heading));

      return () => observer.disconnect();
    }, 200); // Increased delay to ensure content is ready

    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  if (toc.length === 0) return null;

  return (
    <div className="hidden xl:block w-full">
      <div className="border-t border-ink-950/30 pt-5">
        <div>
          <h3 className="mb-3 text-sm font-medium text-ink-500">
            İçindekiler
          </h3>
          <nav className="space-y-0.5">
            {toc.map((item) => (
              <Button
                variant="ghost"
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block h-auto w-full whitespace-normal rounded-none border-l-2 px-3 py-1.5 text-left text-sm font-normal transition-colors hover:bg-transparent ${
                  activeId === item.id
                    ? 'border-cardinal-700 text-cardinal-700'
                    : 'border-transparent text-ink-700 hover:text-ink-950'
                }`}
              >
                <span className="block">{item.title}</span>
              </Button>
            ))}
          </nav>
        </div>
        <div className="mt-6 flex justify-start text-ink-950">
          <ShareButton variant="outline" />
        </div>
      </div>
    </div>
  );
}
