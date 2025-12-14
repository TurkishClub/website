'use client';

import {useState, useMemo} from 'react';
import {useTranslations} from 'next-intl';
import {Event} from '@/data/events';
import EventCard from '@/components/EventCard';
import {Search, Calendar, SortAsc, SortDesc, CalendarX} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface EventsPageClientProps {
  events: Event[];
}

type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

export default function EventsPageClient({events}: EventsPageClientProps) {
  const t = useTranslations('EventsPage');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.time).getTime() - new Date(a.time).getTime();
        case 'oldest':
          return new Date(a.time).getTime() - new Date(b.time).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [events, searchQuery, sortBy]);

  return (
    <div className="w-full space-y-8">
      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none z-10" />
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Sort Select */}
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-full md:w-[240px] bg-white border-gray-300 text-gray-900 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <SelectValue placeholder={t('sortBy')} />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="newest">
              <div className="flex items-center gap-2">
                <SortDesc className="w-4 h-4" />
                {t('sort.newest')}
              </div>
            </SelectItem>
            <SelectItem value="oldest">
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4" />
                {t('sort.oldest')}
              </div>
            </SelectItem>
            <SelectItem value="name-asc">
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4" />
                {t('sort.nameAsc')}
              </div>
            </SelectItem>
            <SelectItem value="name-desc">
              <div className="flex items-center gap-2">
                <SortDesc className="w-4 h-4" />
                {t('sort.nameDesc')}
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-white/80 text-sm">
        {t('showingEvents', {count: filteredAndSortedEvents.length, total: events.length})}
      </div>

      {/* Events Grid */}
      {filteredAndSortedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <CalendarX className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {t('noEvents')}
          </h3>
          <p className="text-white/70">
            {searchQuery ? t('noEventsSearch') : t('noEventsDescription')}
          </p>
        </div>
      )}
    </div>
  );
}
