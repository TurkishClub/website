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
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">
            İçindekiler
          </h3>
          <nav className="space-y-0.5">
            {toc.map((item) => (
              <Button
                variant="ghost"
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block text-left w-full text-sm py-2 px-3 rounded transition-colors hover:scale-105 ${
                  activeId === item.id
                    ? 'text-[#C61E1E] bg-red-50 font-medium border-l-2 border-[#C61E1E]'
                    : 'text-gray-600 hover:text-[#C61E1E] hover:bg-gray-100'
                }`}
              >
                {item.title}
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex justify-start mt-4 text-black">
          <ShareButton variant="outline" />
        </div>
      </div>
    </div>
  );
}
