'use client';

import {useState, type ReactNode} from 'react';
import {useTranslations} from 'next-intl';
import {Search, Filter, X} from 'lucide-react';
import {pillClass} from '@/components/home/Pill';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

export interface DormFilters {
  searchQuery: string;
  maxPrice: number | null;
  sortBy: string;
}

interface DormSearchAndFiltersProps {
  filters: DormFilters;
  onFiltersChange: (filters: DormFilters) => void;
  resultsCount: number;
  totalCount: number;
  viewToggle?: ReactNode;
}

export function DormSearchAndFilters({
  filters,
  onFiltersChange,
  resultsCount,
  totalCount,
  viewToggle
}: DormSearchAndFiltersProps) {
  const t = useTranslations('dormSearch');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: value
    });
  };

  const handleMaxPriceChange = (value: string) => {
    onFiltersChange({
      ...filters,
      maxPrice: value ? parseInt(value) : null
    });
  };

  // Location filter removed

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchQuery: '',
      maxPrice: null,
      sortBy: 'name'
    });
  };

  const activeFiltersCount = [
    filters.maxPrice !== null
  ].filter(Boolean).length;

  const fieldInput =
    'h-auto rounded-none border-0 border-b border-ink-950/30 bg-transparent px-0 shadow-none focus-visible:border-cardinal-700 focus-visible:ring-0';

  return (
    <div className="flex flex-col gap-8">
      <div className="relative">
        <Search aria-hidden className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 text-ink-500" />
        <Input
          aria-label={t('search.placeholder')}
          placeholder={t('search.placeholder')}
          value={filters.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={`${fieldInput} py-4 pl-10 font-serif text-[clamp(1.4rem,2.4vw,2rem)] placeholder:text-ink-500/60 md:text-[clamp(1.4rem,2.4vw,2rem)]`}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <button type="button" className={`${pillClass('outline')} px-5 py-2 lg:hidden`}>
                <Filter className="h-4 w-4" />
                {t('filters.title')}
                {activeFiltersCount > 0 && (
                  <span className="ml-1 rounded-full bg-cardinal-700 px-2 text-xs text-white">{activeFiltersCount}</span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-stone-100">
              <SheetHeader>
                <SheetTitle className="font-serif text-2xl font-normal">{t('filters.title')}</SheetTitle>
                <SheetDescription className="sr-only">{t('filters.title')}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 px-4">
                <MobileFilters
                  filters={filters}
                  onMaxPriceChange={handleMaxPriceChange}
                  onClearAll={clearAllFilters}
                  t={t}
                />
              </div>
            </SheetContent>
          </Sheet>

          <label className="hidden items-center gap-3 lg:flex">
            <span className="text-sm text-ink-700">{t('filters.maxPrice')}</span>
            <Input
              type="number"
              placeholder="€500"
              value={filters.maxPrice || ''}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className={`${fieldInput} w-24 py-1.5 text-base`}
            />
          </label>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-stone-200 hover:text-ink-950"
            >
              <X className="h-4 w-4" />
              {t('filters.clearAll')}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="hidden text-sm text-ink-700 sm:block">{t('sort.label')}</span>
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="h-auto w-56 rounded-full border-ink-950/20 bg-transparent px-4 py-2.5 text-sm font-medium shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-0 bg-white p-1 shadow-[0_24px_60px_-20px_rgb(20_17_17/0.35)]">
              <SelectItem value="name">{t('sort.name')}</SelectItem>
              <SelectItem value="price_asc">{t('sort.price_asc')}</SelectItem>
              <SelectItem value="price_desc">{t('sort.price_desc')}</SelectItem>
              <SelectItem value="distance">{t('sort.distance')}</SelectItem>
            </SelectContent>
          </Select>
          {viewToggle}
        </div>
      </div>

      <p className="text-sm text-ink-500" aria-live="polite">
        {resultsCount === totalCount
          ? t('results.foundResults', {count: totalCount.toString()})
          : t('results.showing', {
              filtered: resultsCount.toString(),
              total: totalCount.toString()
            })}
      </p>
    </div>
  );
}

// Mobile Filters Component
function MobileFilters({
  filters,
  onMaxPriceChange,
  onClearAll,
  t
}: {
  filters: DormFilters;
  onMaxPriceChange: (value: string) => void;
  onClearAll: () => void;
  t: any;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm text-ink-700">
          {t('filters.maxPrice')}
        </label>
        <Input
          type="number"
          placeholder="€500"
          value={filters.maxPrice || ''}
          onChange={(e) => onMaxPriceChange(e.target.value)}
        />
      </div>

      <button type="button" onClick={onClearAll} className={pillClass('outline', 'w-full')}>
        {t('filters.clearAll')}
      </button>
    </div>
  );
}
