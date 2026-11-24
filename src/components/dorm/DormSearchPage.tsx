'use client';

import {useState, useMemo, useEffect, useCallback, useRef} from 'react';
import {useTranslations} from 'next-intl';
import {Map, LayoutGrid} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Pill, pillClass} from '@/components/home/Pill';
import {DormCard, DormCardSkeleton} from '@/components/dorm/DormCard';
import {DormComparison} from '@/components/dorm/DormComparison';
import {CompareFloatingButton} from '@/components/ui/compare-floating-button';
import {
  DormSearchAndFilters,
  DormFilters
} from '@/components/dorm/DormSearchAndFilters';
import {Dorm} from '@/data/dorms';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import {Analytics} from '@/lib/analytics';

// Dynamic import for DormMapLeaflet to avoid SSR issues
const DormMapLeaflet = dynamic(
  () =>
    import('@/components/map/DormMapLeaflet').then((mod) => mod.DormMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] items-center justify-center bg-stone-200">
        <div className="text-ink-500">…</div>
      </div>
    )
  }
);

export function DormSearchPage({dorms}: {dorms: Dorm[]}) {
  const t = useTranslations('dormSearch');

  const [filters, setFilters] = useState<DormFilters>({
    searchQuery: '',
    maxPrice: null,
    sortBy: 'name'
  });

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedDorm, setSelectedDorm] = useState<Dorm | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12); // Start with 12 cards
  
  // Compare functionality state
  const [comparedDorms, setComparedDorms] = useState<Dorm[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Analytics-aware filter change handler
  const handleFiltersChange = useCallback((newFilters: DormFilters) => {
    setFilters(newFilters);

    // Track filter changes (debounced to avoid too many events)
    Analytics.trackDormSearch({
      action: 'filter',
      search_query: newFilters.searchQuery || undefined,
      filters_applied: {
        max_price: newFilters.maxPrice || undefined,
        sort_by: newFilters.sortBy
      }
    });
  }, []);

  // Filter and sort dorms
  const filteredAndSortedDorms = useMemo(() => {
    const filtered: Dorm[] = dorms.filter((dorm: Dorm) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText =
          `${dorm.name} ${dorm.address} ${dorm.description}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Price filter
      if (filters.maxPrice) {
        const rentToCheck =
          dorm.rent.type === 'range'
            ? dorm.rent.minPrice
            : dorm.rent.singlePrice;
        if (rentToCheck > filters.maxPrice) {
          return false;
        }
      }

      return true;
    });

    // Sort
    switch (filters.sortBy) {
      case 'price_asc':
        filtered.sort((a: Dorm, b: Dorm) => {
          const aRent =
            a.rent.type === 'range' ? a.rent.minPrice : a.rent.singlePrice;
          const bRent =
            b.rent.type === 'range' ? b.rent.minPrice : b.rent.singlePrice;
          return aRent - bRent;
        });
        break;
      case 'price_desc':
        filtered.sort((a: Dorm, b: Dorm) => {
          const aRent =
            a.rent.type === 'range' ? a.rent.minPrice : a.rent.singlePrice;
          const bRent =
            b.rent.type === 'range' ? b.rent.minPrice : b.rent.singlePrice;
          return bRent - aRent;
        });
        break;
      case 'distance':
        filtered.sort((a: Dorm, b: Dorm) => a.distanceToGFZ - b.distanceToGFZ);
        break;
      case 'name':
      default:
        filtered.sort((a: Dorm, b: Dorm) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [dorms, filters]);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleViewOnMap = useCallback((dorm: Dorm) => {
    setSelectedDorm(dorm);
    setViewMode('map');
    // The grid collapses when the map replaces it, so bring the map into view.
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({block: 'start'}));

    // Track view on map action
    Analytics.trackDormSearch({
      action: 'map_view',
      dorm_id: dorm.id,
      dorm_name: dorm.name,
      view_mode: 'map'
    });
  }, []);

  const handleMapDormSelect = (dorm: Dorm) => {
    setSelectedDorm(dorm);
  };

  // Compare functionality handlers
  const handleToggleCompare = useCallback((dorm: Dorm, selected: boolean) => {
    setComparedDorms(prev => {
      if (selected) {
        // Add to comparison if not already there and limit to 4 dorms
        if (prev.length < 4 && !prev.find(d => d.id === dorm.id)) {
          return [...prev, dorm];
        } else if (prev.length >= 4) {
          // Show a message or toast that maximum is reached
          console.log('Maksimum 4 yurt seçebilirsiniz');
          return prev;
        }
        return prev;
      } else {
        // Remove from comparison
        return prev.filter(d => d.id !== dorm.id);
      }
    });
  }, []);

  const handleOpenComparison = useCallback(() => {
    if (comparedDorms.length > 0) {
      setShowComparison(true);
    }
  }, [comparedDorms.length]);

  const handleCloseComparison = useCallback(() => {
    setShowComparison(false);
  }, []);

  const handleClearComparison = useCallback(() => {
    setComparedDorms([]);
    setShowComparison(false);
  }, []);

  const handleRemoveFromComparison = useCallback((dormId: string) => {
    setComparedDorms(prev => {
      const newCompared = prev.filter(d => d.id !== dormId);
      // If only 1 or 0 dorms left, close the comparison
      if (newCompared.length <= 1) {
        setShowComparison(false);
      }
      return newCompared;
    });
  }, []);

  const handleAddMoreToComparison = useCallback(() => {
    setShowComparison(false);
    // User can now select more dorms from the main page
  }, []);

  const loadMore = useCallback(() => {
    setIsLoading(true);

    // Track load more action
    Analytics.trackDormSearch({
      action: 'load_more',
      result_count: filteredAndSortedDorms.length
    });

    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + 12, filteredAndSortedDorms.length)
      );
      setIsLoading(false);
    }, 300);
  }, [filteredAndSortedDorms.length]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [filters]);

  // Get visible dorms for virtual scrolling effect
  const visibleDorms = filteredAndSortedDorms.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedDorms.length;

  const suggestHref = `mailto:contact@turkishclub-munich.com?subject=${encodeURIComponent(
    'Yurt Önerisi - Turkish Club Munich'
  )}&body=${encodeURIComponent(
    "Merhaba,\n\nMünih'te bulunan Turkish Club'ın yurt arama sayfası için bir yurt önerisi göndermek istiyorum.\n\nYurt Bilgileri:\n- Yurt Adı: \n- Adres: \n- Website: \n- Kira Aralığı: \n- Özellikler: \n- Başvuru Yöntemi: \n- Açıklama: \n\nTeşekkürler!"
  )}`;

  const setView = (mode: 'grid' | 'map') => {
    setViewMode(mode);
    Analytics.trackDormSearch({action: 'view_mode_change', view_mode: mode});
  };

  const viewButton = (active: boolean) =>
    cn(
      'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-[background-color,color,transform] duration-160 ease-out-strong active:scale-[0.97]',
      active ? 'bg-ink-950 text-white' : 'text-ink-700 hover:bg-stone-200'
    );

  return (
    <main className="min-h-screen bg-stone-100 text-ink-950">
      <div className="bg-maroon-950">
        <Navbar tone="dark" />
        <section className="text-white">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-10 px-4 pb-12 pt-14 md:px-6 md:pb-14 md:pt-20 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-serif text-[clamp(3rem,7.5vw,7rem)] font-normal leading-[0.96] tracking-[-0.03em]">
                {t('title')}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{t('description')}</p>
            </div>
            <div className="flex max-w-sm flex-col items-start gap-4 lg:items-end lg:text-right">
              <p className="text-white/70">{t('suggestDorm.description')}</p>
              <Pill href={suggestHref} variant="light" arrow="↗">
                {t('suggestDorm.button')}
              </Pill>
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-[90rem] px-4 pb-24 pt-12 md:px-6 md:pb-32 md:pt-16">
        <DormSearchAndFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          resultsCount={filteredAndSortedDorms.length}
          totalCount={dorms.length}
          viewToggle={
            <div className="flex items-center gap-1 rounded-full border border-ink-950/20 p-1">
              <button type="button" aria-pressed={viewMode === 'grid'} onClick={() => setView('grid')} className={viewButton(viewMode === 'grid')}>
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">{t('map.showList')}</span>
              </button>
              <button type="button" aria-pressed={viewMode === 'map'} onClick={() => setView('map')} className={viewButton(viewMode === 'map')}>
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">{t('map.showMap')}</span>
              </button>
            </div>
          }
        />

        <div ref={resultsRef} className="mt-8 scroll-mt-4 border-t border-ink-950/30 pt-8">
          {viewMode === 'map' ? (
            <div className="overflow-hidden border border-ink-950/15 bg-white">
              <DormMapLeaflet
                dorms={filteredAndSortedDorms}
                selectedDorm={selectedDorm}
                onDormSelect={handleMapDormSelect}
              />
            </div>
          ) : filteredAndSortedDorms.length === 0 ? (
            <div className="flex flex-col items-center bg-white px-6 py-20 text-center">
              <h2 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-tight">
                {t('results.noResults')}
              </h2>
              <p className="mt-3 text-lg text-ink-700">{t('results.adjustFilters')}</p>
              <button
                type="button"
                onClick={() => setFilters({searchQuery: '', maxPrice: null, sortBy: 'name'})}
                className={pillClass('outline', 'mt-8')}
              >
                {t('filters.clearAll')}
              </button>
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleDorms.map((dorm: Dorm) => (
                  <li key={dorm.id} id={`dorm-${dorm.id}`}>
                    <DormCard
                      dorm={dorm}
                      onViewOnMap={handleViewOnMap}
                      isSelected={comparedDorms.some((d) => d.id === dorm.id)}
                      onToggleCompare={handleToggleCompare}
                    />
                  </li>
                ))}
                {isLoading &&
                  Array.from({length: 3}).map((_, index) => (
                    <li key={`skeleton-${index}`}>
                      <DormCardSkeleton />
                    </li>
                  ))}
              </ul>

              {hasMore && (
                <div className="flex justify-center pt-12">
                  <button type="button" onClick={loadMore} disabled={isLoading} className={pillClass('outline')}>
                    {isLoading
                      ? t('results.loading')
                      : t('results.loadMore', {count: String(filteredAndSortedDorms.length - visibleCount)})}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CompareFloatingButton
        compareCount={comparedDorms.length}
        itemLabel="yurt"
        onOpenComparison={handleOpenComparison}
        onClearComparison={handleClearComparison}
      />

      {showComparison && comparedDorms.length > 0 && (
        <DormComparison
          comparedDorms={comparedDorms}
          onRemoveDorm={handleRemoveFromComparison}
          onClose={handleCloseComparison}
          onAddMore={handleAddMoreToComparison}
        />
      )}

      <Footer />
    </main>
  );
}
