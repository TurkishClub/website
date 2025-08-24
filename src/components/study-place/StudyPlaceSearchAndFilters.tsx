'use client';

import {useState, useCallback, useEffect, useMemo} from 'react';
import {Search, Filter, X, MapPin} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {Checkbox} from '@/components/ui/checkbox';
import {Badge} from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {StudyPlaceFilters} from '@/data/studyPlaces';

interface StudyPlaceSearchAndFiltersProps {
  onFiltersChange: (filters: StudyPlaceFilters) => void;
  totalResults: number;
  isLoading?: boolean;
}

const categoryOptions = [
  {value: 'all', label: 'Tüm kategoriler'},
  {value: 'library', label: 'Kütüphane'},
  {value: 'cafe', label: 'Kafe'},
  {value: 'university', label: 'Üniversite'},
  {value: 'coworking', label: 'Coworking'},
  {value: 'other', label: 'Diğer'}
];

const sortOptions = [
  {value: 'name', label: 'İsim'},
  {value: 'distance', label: 'Mesafe'},
  {value: 'category', label: 'Kategori'}
];

export function StudyPlaceSearchAndFilters({
  onFiltersChange,
  totalResults,
  isLoading = false
}: StudyPlaceSearchAndFiltersProps) {
  const [filters, setFilters] = useState<StudyPlaceFilters>({
    searchQuery: '',
    category: 'all',
    isQuietOnly: false,
    isFreeOnly: false,
    sortBy: 'name'
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onFiltersChange(filters);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters, onFiltersChange]);

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: value
    }));
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      category: value
    }));
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value as StudyPlaceFilters['sortBy']
    }));
  }, []);

  const handleQuietOnlyChange = useCallback((checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      isQuietOnly: checked
    }));
  }, []);

  const handleFreeOnlyChange = useCallback((checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      isFreeOnly: checked
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      category: 'all',
      isQuietOnly: false,
      isFreeOnly: false,
      sortBy: 'name'
    });
  }, []);

  const removeFilter = useCallback((filterType: string) => {
    setFilters((prev) => {
      switch (filterType) {
        case 'category':
          return {...prev, category: 'all'};
        case 'isQuietOnly':
          return {...prev, isQuietOnly: false};
        case 'isFreeOnly':
          return {...prev, isFreeOnly: false};
        default:
          return prev;
      }
    });
  }, []);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.isQuietOnly) count++;
    if (filters.isFreeOnly) count++;
    return count;
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Ders çalışma yeri ara..."
          value={filters.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 h-12 text-base"
          disabled={isLoading}
        />
      </div>

      {/* Quick Filters & Sort */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-auto min-w-[140px] bg-white">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-auto min-w-[120px] bg-white">
            <SelectValue placeholder="Sırala" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Button */}
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative bg-white">
              <Filter className="h-4 w-4 mr-2" />
              Filtreler
              {activeFiltersCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">Filtreler</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ders çalışma yerlerini filtreleyin
                </p>
              </div>

              {/* Quick Options */}
              <div className="space-y-3">
                <h4 className="font-medium">Hızlı Seçenekler</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="quiet-only"
                      checked={filters.isQuietOnly}
                      onCheckedChange={handleQuietOnlyChange}
                    />
                    <label htmlFor="quiet-only" className="text-sm">
                      Sadece sessiz yerler
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="free-only"
                      checked={filters.isFreeOnly}
                      onCheckedChange={handleFreeOnlyChange}
                    />
                    <label htmlFor="free-only" className="text-sm">
                      Sadece ücretsiz yerler
                    </label>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="w-full"
              >
                Tüm Filtreleri Temizle
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear filters button (when filters active) */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-white"
          >
            <X className="h-4 w-4 mr-1" />
            Temizle
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && filters.category !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800">
              <MapPin className="h-3 w-3" />
              {categoryOptions.find((opt) => opt.value === filters.category)?.label}
              <button
                onClick={() => removeFilter('category')}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.isQuietOnly && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-800">
              Sessiz yerler
              <button
                onClick={() => removeFilter('isQuietOnly')}
                className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.isFreeOnly && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800">
              Ücretsiz yerler
              <button
                onClick={() => removeFilter('isFreeOnly')}
                className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full mr-2" />
            Aranıyor...
          </div>
        ) : (
          <span>
            {totalResults} ders çalışma yeri bulundu
            {filters.searchQuery && ` "${filters.searchQuery}" için`}
          </span>
        )}
      </div>
    </div>
  );
}

export type {StudyPlaceFilters};
