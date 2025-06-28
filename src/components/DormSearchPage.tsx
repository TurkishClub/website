"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Map, List, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DormCard } from "@/components/DormCard";
import { DormSearchAndFilters, DormFilters } from "@/components/DormSearchAndFilters";
import { mockDorms, Dorm } from "@/data/dorms";
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

// Dynamic import for DormMapLeaflet to avoid SSR issues
const DormMapLeaflet = dynamic(
  () => import("@/components/DormMapLeaflet").then((mod) => mod.DormMapLeaflet),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Harita yükleniyor...</div>
      </div>
    )
  }
);

export function DormSearchPage() {
  const t = useTranslations("dormSearch");
  
  const [filters, setFilters] = useState<DormFilters>({
    searchQuery: "",
    maxPrice: null,
    location: null,
    features: [],
    sortBy: "name"
  });

  const [viewMode, setViewMode] = useState<"list" | "grid" | "map">("grid");
  const [selectedDorm, setSelectedDorm] = useState<Dorm | null>(null);

  // Filter and sort dorms
  const filteredAndSortedDorms = useMemo(() => {
    const filtered = mockDorms.filter((dorm) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = `${dorm.name} ${dorm.address} ${dorm.organization} ${dorm.description}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Price filter
      if (filters.maxPrice && dorm.rent > filters.maxPrice) {
        return false;
      }

      // Location filter
      if (filters.location) {
        if (!dorm.address.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Features filter
      if (filters.features.length > 0) {
        const hasAllFeatures = filters.features.every(feature =>
          dorm.features.some(dormFeature => 
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
      case "price_asc":
        filtered.sort((a, b) => a.rent - b.rent);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.rent - a.rent);
        break;
      case "distance":
        filtered.sort((a, b) => a.distanceToGFZ - b.distanceToGFZ);
        break;
      case "name":
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [filters]);

  const handleViewOnMap = (dorm: Dorm) => {
    setSelectedDorm(dorm);
    setViewMode("map");
  };

  const handleMapDormSelect = (dorm: Dorm) => {
    setSelectedDorm(dorm);
  };

  const handleScrollToDorm = (dorm: Dorm) => {
    // Switch to grid view and scroll to the specific dorm
    setSelectedDorm(dorm);
    setViewMode("grid");
    
    // Wait for the view to change, then scroll to the dorm card
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const dormElement = document.getElementById(`dorm-${dorm.id}`);
        if (dormElement) {
          dormElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Add a highlight effect
          dormElement.classList.add('ring-2', 'ring-[#C61E1E]', 'ring-opacity-75');
          setTimeout(() => {
            dormElement.classList.remove('ring-2', 'ring-[#C61E1E]', 'ring-opacity-75');
          }, 3000);
        }
      }
    }, 100);
  };

  return (
    <main className="bg-[#C61E1E] min-h-screen text-white">
      <MobileNavbar />
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {t("title")}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl">
          {t("subtitle")}
        </p>
        <p className="text-gray-200 max-w-2xl text-lg">
          {t("description")}
        </p>
      </section>

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="mb-8">
            <DormSearchAndFilters
              filters={filters}
              onFiltersChange={setFilters}
              resultsCount={filteredAndSortedDorms.length}
              totalCount={mockDorms.length}
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border shadow-sm">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex items-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Liste</span>
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="flex items-center gap-2"
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">{t("map.showMap")}</span>
              </Button>
            </div>

            {viewMode === "map" && (
              <Button
                variant="outline"
                onClick={() => setViewMode("grid")}
                className="text-sm"
              >
                {t("map.showList")}
              </Button>
            )}
          </div>

          {/* Content Based on View Mode */}
          {viewMode === "map" ? (
            <div className="h-[600px] bg-white rounded-lg shadow-sm border">
              <DormMapLeaflet
                dorms={filteredAndSortedDorms}
                selectedDorm={selectedDorm}
                onDormSelect={handleMapDormSelect}
                onScrollToDorm={handleScrollToDorm}
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
                    {t("results.noResults")}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Arama kriterlerinizi değiştirmeyi deneyin.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setFilters({
                      searchQuery: "",
                      maxPrice: null,
                      location: null,
                      features: [],
                      sortBy: "name"
                    })}
                  >
                    {t("filters.clearAll")}
                  </Button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredAndSortedDorms.map((dorm) => (
                    <div key={dorm.id} id={`dorm-${dorm.id}`} className={viewMode === "list" ? "max-w-none" : ""}>
                      <DormCard dorm={dorm} onViewOnMap={handleViewOnMap} />
                    </div>
                  ))}
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
