'use client';

import {useState, useMemo, useEffect, useCallback} from 'react';
import {useTranslations} from 'next-intl';
import {Map, LayoutGrid} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {DormCard, DormCardSkeleton} from '@/components/dorm/DormCard';
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
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Harita yükleniyor...</div>
      </div>
    )
  }
);

export function DormSearchPage({dorms}: {dorms: Dorm[]}) {
  const t = useTranslations('dormSearch');

  const [filters, setFilters] = useState<DormFilters>({
    searchQuery: '',
    maxPrice: null,
    features: [],
    sortBy: 'name'
  });

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedDorm, setSelectedDorm] = useState<Dorm | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12); // Start with 12 cards

  // Analytics-aware filter change handler
  const handleFiltersChange = useCallback((newFilters: DormFilters) => {
    setFilters(newFilters);

    // Track filter changes (debounced to avoid too many events)
    Analytics.trackDormSearch({
      action: 'filter',
      search_query: newFilters.searchQuery || undefined,
      filters_applied: {
        max_price: newFilters.maxPrice || undefined,
        features:
          newFilters.features.length > 0 ? newFilters.features : undefined,
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
          `${dorm.name} ${dorm.address} ${dorm.organization} ${dorm.description}`.toLowerCase();
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

      // Features filter
      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every((feature) =>
          dorm.features.some((dormFeature) =>
            dormFeature.toLowerCase().includes(feature.toLowerCase())
          )
        );
        if (!hasAllFeatures) {
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

  const handleViewOnMap = useCallback((dorm: Dorm) => {
    setSelectedDorm(dorm);
    setViewMode('map');

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

  return (
    <main className="bg-[#C61E1E] min-h-screen text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('title')}</h1>
        {/* Suggest Dorm Button */}
        <div className="text-center">
          <p className="text-gray-200 mb-4 text-lg">
            {t('suggestDorm.description')}
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const subject = encodeURIComponent(
                'Yurt Önerisi - Turkish Club Munich'
              );
              const body = encodeURIComponent(
                "Merhaba,\n\nMünih'te bulunan Turkish Club'ın yurt arama sayfası için bir yurt önerisi göndermek istiyorum.\n\nYurt Bilgileri:\n- Yurt Adı: \n- Adres: \n- Website: \n- Kira Aralığı: \n- Özellikler: \n- Başvuru Yöntemi: \n- Açıklama: \n\nTeşekkürler!"
              );
              window.location.href = `mailto:contact@turkishclub-munich.com?subject=${subject}&body=${body}`;
            }}
            className="bg-white text-[#C61E1E] hover:bg-gray-100 border-white hover:border-gray-100"
          >
            {t('suggestDorm.button')}
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="mb-8">
            <DormSearchAndFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              resultsCount={filteredAndSortedDorms.length}
              totalCount={dorms.length}
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border shadow-sm">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setViewMode('grid');
                  Analytics.trackDormSearch({
                    action: 'view_mode_change',
                    view_mode: 'grid'
                  });
                }}
                className="flex items-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setViewMode('map');
                  Analytics.trackDormSearch({
                    action: 'view_mode_change',
                    view_mode: 'map'
                  });
                }}
                className="flex items-center gap-2"
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">{t('map.showMap')}</span>
              </Button>
            </div>

            {viewMode === 'map' && (
              <Button
                variant="outline"
                onClick={() => {
                  setViewMode('grid');
                  Analytics.trackDormSearch({
                    action: 'view_mode_change',
                    view_mode: 'grid'
                  });
                }}
                className="text-sm"
              >
                {t('map.showList')}
              </Button>
            )}
          </div>

          {/* Content Based on View Mode */}
          {viewMode === 'map' ? (
            <div className="h-[600px] bg-white rounded-lg shadow-sm border">
              <DormMapLeaflet
                dorms={filteredAndSortedDorms}
                selectedDorm={selectedDorm}
                onDormSelect={handleMapDormSelect}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAndSortedDorms.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
                  <div className="text-gray-500 mb-4">
                    <Map className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('results.noResults')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('results.adjustFilters')}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        searchQuery: '',
                        maxPrice: null,
                        features: [],
                        sortBy: 'name'
                      })
                    }
                  >
                    {t('filters.clearAll')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleDorms.map((dorm: Dorm) => (
                      <div key={dorm.id} id={`dorm-${dorm.id}`}>
                        <DormCard dorm={dorm} onViewOnMap={handleViewOnMap} />
                      </div>
                    ))}

                    {/* Loading skeletons */}
                    {isLoading &&
                      Array.from({length: 6}).map((_, index) => (
                        <div key={`skeleton-${index}`}>
                          <DormCardSkeleton />
                        </div>
                      ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="flex justify-center pt-6">
                      <Button
                        onClick={loadMore}
                        disabled={isLoading}
                        variant="outline"
                        size="lg"
                        className="bg-white text-gray-900 hover:bg-gray-50"
                      >
                        {isLoading
                          ? 'Loading...'
                          : `Load More (${filteredAndSortedDorms.length - visibleCount} remaining)`}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
