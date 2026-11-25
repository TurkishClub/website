'use client';

import {useSearchParams, usePathname, useRouter} from 'next/navigation';
import {useDebouncedCallback} from 'use-debounce';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {Search} from 'lucide-react';
import {Analytics} from '@/lib/analytics';

export function BlogSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    // Track search
    Analytics.trackBlogEvent({
      action: 'search',
      search_query: term || undefined
    });

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);

    // Track sort action
    Analytics.trackBlogEvent({
      action: 'sort',
      sort_method: value
    });

    replace(`${pathname}?${params.toString()}`);
  };

  const fieldInput =
    'h-auto rounded-none border-0 border-b border-ink-950/30 bg-transparent px-0 shadow-none focus-visible:border-cardinal-700 focus-visible:ring-0';

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="relative flex-1 md:max-w-3xl">
        <Search aria-hidden className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 text-ink-500" />
        <Input
          aria-label="Blog yazılarında ara"
          placeholder="Blog yazılarında ara..."
          className={`${fieldInput} py-4 pl-10 font-serif text-[clamp(1.4rem,2.4vw,2rem)] placeholder:text-ink-500/60 md:text-[clamp(1.4rem,2.4vw,2rem)]`}
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('query')?.toString()}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-ink-700">Sıralama</span>
        <Select value={searchParams.get('sort')?.toString() || 'newest'} onValueChange={handleSort}>
          <SelectTrigger className="h-auto w-48 rounded-full border-ink-950/20 bg-transparent px-4 py-2.5 text-sm font-medium shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-0 bg-white p-1 shadow-[0_24px_60px_-20px_rgb(20_17_17/0.35)]">
            <SelectItem value="newest">En yeni</SelectItem>
            <SelectItem value="oldest">En eski</SelectItem>
            <SelectItem value="alphabetical">A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
