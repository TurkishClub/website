'use client';

import {useState, useMemo, useEffect, useCallback} from 'react';
import {Map, LayoutGrid} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {StudyPlaceCard, StudyPlaceCardSkeleton} from '@/components/study-place/StudyPlaceCard';
import {
  StudyPlaceSearchAndFilters,
  StudyPlaceFilters
} from '@/components/study-place/StudyPlaceSearchAndFilters';
import {StudyPlaceComparison} from '@/components/study-place/StudyPlaceComparison';
import {CompareFloatingButton} from '@/components/ui/compare-floating-button';
import {StudyPlace} from '@/data/studyPlaces';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import {Analytics} from '@/lib/analytics';

// Dynamic import for map to avoid SSR issues  
const StudyPlaceMapLeaflet = dynamic(
  () => import('@/components/map/StudyPlaceMapLeaflet').then((mod) => mod.StudyPlaceMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Harita yükleniyor...</div>
      </div>
    )
  }
);

export function StudyPlaceSearchPage({studyPlaces}: {studyPlaces: StudyPlace[]}) {
  const [filters, setFilters] = useState<StudyPlaceFilters>({
    searchQuery: '',
    category: 'all',
    isQuietOnly: false,
    isFreeOnly: false,
    sortBy: 'name'
  });

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedStudyPlace, setSelectedStudyPlace] = useState<StudyPlace | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Compare functionality state
  const [comparedStudyPlaces, setComparedStudyPlaces] = useState<StudyPlace[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Analytics-aware filter change handler
  const handleFiltersChange = useCallback((newFilters: StudyPlaceFilters) => {
    setFilters(newFilters);

    // Track filter changes
    Analytics.trackDormSearch({
      action: 'filter',
      search_query: newFilters.searchQuery
    });

    // Reset visible count when filters change  
    setVisibleCount(12);
  }, []);

  // Compare functionality handlers
  const handleCompareToggle = useCallback((studyPlace: StudyPlace, isSelected: boolean) => {
    setComparedStudyPlaces(prev => {
      if (isSelected) {
        // Check maximum limit
        if (prev.length >= 4) {
          return prev; // Don't add if already at max
        }
        return [...prev, studyPlace];
      } else {
        const newCompared = prev.filter(d => d.id !== studyPlace.id);
        // Auto-close modal if less than 2 study places remain
        if (newCompared.length < 2) {
          setShowComparison(false);
        }
        return newCompared;
      }
    });
  }, []);

  const handleOpenComparison = useCallback(() => {
    if (comparedStudyPlaces.length >= 2) {
      setShowComparison(true);
      
      // Track comparison action
      Analytics.trackDormSearch({
        action: 'external_click'
      });
    }
  }, [comparedStudyPlaces.length]);

  const handleCloseComparison = useCallback(() => {
    setShowComparison(false);
  }, []);

  const handleRemoveFromComparison = useCallback((studyPlaceId: string) => {
    setComparedStudyPlaces(prev => {
      const newCompared = prev.filter(d => d.id !== studyPlaceId);
      // Auto-close modal if less than 2 study places remain
      if (newCompared.length < 2) {
        setShowComparison(false);
      }
      return newCompared;
    });
  }, []);

  const handleClearComparison = useCallback(() => {
    setComparedStudyPlaces([]);
    setShowComparison(false);
  }, []);

  const handleAddMoreToComparison = useCallback(() => {
    setShowComparison(false);
  }, []);  // Filter and sort study places
  const filteredAndSortedStudyPlaces = useMemo(() => {
    const filtered: StudyPlace[] = studyPlaces.filter((place: StudyPlace) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText =
          `${place.name} ${place.address} ${place.description} ${place.whoCanUse}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Category filter
      if (filters.category && filters.category !== 'all' && place.category !== filters.category) {
        return false;
      }

      // Quiet only filter
      if (filters.isQuietOnly && !place.isQuiet) {
        return false;
      }

      // Free only filter
      if (filters.isFreeOnly && !place.isFree) {
        return false;
      }

      return true;
    });

    // Sort
    switch (filters.sortBy) {
      case 'distance':
        filtered.sort((a: StudyPlace, b: StudyPlace) => {
          const aDistance = a.distanceToGFZ || 999;
          const bDistance = b.distanceToGFZ || 999;
          return aDistance - bDistance;
        });
        break;
      case 'category':
        filtered.sort((a: StudyPlace, b: StudyPlace) => {
          if (a.category === b.category) {
            return a.name.localeCompare(b.name);
          }
          return a.category.localeCompare(b.category);
        });
        break;
      case 'name':
      default:
        filtered.sort((a: StudyPlace, b: StudyPlace) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [studyPlaces, filters]);

  const handleViewOnMap = useCallback((studyPlace: StudyPlace) => {
    setSelectedStudyPlace(studyPlace);
    setViewMode('map');

    // Track view on map action
    Analytics.trackDormSearch({
      action: 'map_view',
      dorm_id: studyPlace.id,
      dorm_name: studyPlace.name,
      view_mode: 'map'
    });
  }, []);

  const handleMapStudyPlaceSelect = (studyPlace: StudyPlace) => {
    setSelectedStudyPlace(studyPlace);
  };

  const loadMore = useCallback(() => {
    setIsLoading(true);

    // Track load more action
    Analytics.trackDormSearch({
      action: 'load_more',
      result_count: filteredAndSortedStudyPlaces.length
    });

    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + 12, filteredAndSortedStudyPlaces.length)
      );
      setIsLoading(false);
    }, 300);
  }, [filteredAndSortedStudyPlaces.length]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [filters]);

  // Get visible study places for virtual scrolling effect
  const visibleStudyPlaces = filteredAndSortedStudyPlaces.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedStudyPlaces.length;

  return (
    <main className="bg-[#C61E1E] min-h-screen text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Ders Çalışma Yeri Arama</h1>
        <p className="text-xl mb-8 text-gray-200 max-w-2xl">
          München&apos;te ideal ders çalışma yerinizi bulun
        </p>

        {/* Suggest Study Place Button */}
        <div className="text-center">
          <p className="text-gray-200 mb-4 text-lg">
            Bildiğiniz iyi bir ders çalışma yerini önermek ister misiniz?
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const subject = encodeURIComponent(
                'Ders Çalışma Yeri Önerisi - Turkish Club Munich'
              );
              const body = encodeURIComponent(
                'Merhaba,\n\nMünich Turkish Club\'ın ders çalışma yeri arama sayfası için bir öneri göndermek istiyorum.\n\nYer Bilgileri:\n- İsim: \n- Adres: \n- Kimler kullanabilir: \n- Açılış saatleri: \n- Açıklama: \n- Kısıtlamalar: \n- Elektrik priz durumu: \n- Yemek imkanları: \n\nTeşekkürler!'
              );
              window.open(
                `mailto:info@turkishclub.de?subject=${subject}&body=${body}`,
                '_blank'
              );
            }}
            className="border-white text-white hover:bg-white hover:text-[#C61E1E] transition-colors"
          >
            Yer Öner
          </Button>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-gray-50 text-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Search and Filters - Always visible */}
          <div className="mb-8">
            <StudyPlaceSearchAndFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              resultsCount={filteredAndSortedStudyPlaces.length}
              totalCount={studyPlaces.length}
            />
          </div>

          {/* Content */}
          {viewMode === 'grid' ? (
            <>
              {/* View Mode Toggle - Only for grid view */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? '' : 'bg-white hover:bg-gray-50'}
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Liste
                  </Button>
                  <Button
                    variant={(viewMode as any) === 'map' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className={(viewMode as any) === 'map' ? '' : 'bg-white hover:bg-gray-50'}
                  >
                    <Map className="h-4 w-4 mr-2" />
                    Harita
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Study Place Cards */}
                {visibleStudyPlaces.map((studyPlace) => (
                  <StudyPlaceCard
                    key={studyPlace.id}
                    studyPlace={studyPlace}
                    onViewOnMap={handleViewOnMap}
                    isSelected={comparedStudyPlaces.some(d => d.id === studyPlace.id)}
                    onCompareToggle={handleCompareToggle}
                  />
                ))}

                {/* Loading Skeletons */}
                {isLoading &&
                  Array.from({length: 6}).map((_, index) => (
                    <StudyPlaceCardSkeleton key={`skeleton-${index}`} />
                  ))}

                {/* Load More Button */}
                {hasMore && !isLoading && (
                  <div className="text-center py-8">
                    <Button 
                      onClick={loadMore} 
                      size="lg"
                      className="bg-[#C61E1E] hover:bg-[#A91818] text-white"
                    >
                      Daha Fazla Göster ({filteredAndSortedStudyPlaces.length - visibleCount} kaldı)
                    </Button>
                  </div>
                )}

                {/* No Results */}
                {filteredAndSortedStudyPlaces.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-xl text-gray-600 mb-4">
                      Arama kriterlerinize uygun ders çalışma yeri bulunamadı.
                    </p>
                    <p className="text-gray-500 mb-6">
                      Filtrelerinizi değiştirerek tekrar deneyin.
                    </p>
                    <Button
                      onClick={() => setFilters({
                        searchQuery: '',
                        category: 'all',
                        isQuietOnly: false,
                        isFreeOnly: false,
                        sortBy: 'name'
                      })}
                      className="bg-[#C61E1E] hover:bg-[#A91818] text-white"
                    >
                      Tüm Filtreleri Temizle
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Map View */
            <>
              {/* View Mode Toggle - Also for map view */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                  <Button
                    variant={(viewMode as any) === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={(viewMode as any) === 'grid' ? '' : 'bg-white hover:bg-gray-50'}
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Liste
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className={viewMode === 'map' ? '' : 'bg-white hover:bg-gray-50'}
                  >
                    <Map className="h-4 w-4 mr-2" />
                    Harita
                  </Button>
                </div>
              </div>

              <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
                <StudyPlaceMapLeaflet
                  studyPlaces={filteredAndSortedStudyPlaces}
                  onStudyPlaceSelect={handleMapStudyPlaceSelect}
                  selectedStudyPlace={selectedStudyPlace}
                />
              </div>
            </>
          )}

          {/* Floating Compare Button */}
          <CompareFloatingButton
            compareCount={comparedStudyPlaces.length}
            itemLabel="ders yeri"
            onOpenComparison={handleOpenComparison}
            onClearComparison={handleClearComparison}
          />

          {/* Comparison Modal */}
          {showComparison && comparedStudyPlaces.length >= 2 && (
            <StudyPlaceComparison
              comparedStudyPlaces={comparedStudyPlaces}
              onRemoveStudyPlace={handleRemoveFromComparison}
              onClose={handleCloseComparison}
              onAddMore={handleAddMoreToComparison}
            />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
