'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Search, Filter, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {Badge} from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {dormFeatures} from '@/data/dorms';

export interface DormFilters {
  searchQuery: string;
  maxPrice: number | null;
  features: string[];
  sortBy: string;
}

interface DormSearchAndFiltersProps {
  filters: DormFilters;
  onFiltersChange: (filters: DormFilters) => void;
  resultsCount: number;
  totalCount: number;
}

export function DormSearchAndFilters({
  filters,
  onFiltersChange,
  resultsCount,
  totalCount
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

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter((f) => f !== feature)
      : [...filters.features, feature];

    onFiltersChange({
      ...filters,
      features: newFeatures
    });
  };

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
      features: [],
      sortBy: 'name'
    });
  };

  const activeFiltersCount = [
    filters.maxPrice !== null,
    filters.features.length > 0
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder={t('search.placeholder')}
          value={filters.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Filters Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="w-4 h-4 mr-2" />
                {t('filters.title')}
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-blue-600 text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>{t('filters.title')}</SheetTitle>
                <SheetDescription>
                  Arama kriterlerinizi ayarlayın
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <MobileFilters
                  filters={filters}
                  onMaxPriceChange={handleMaxPriceChange}
                  onFeatureToggle={handleFeatureToggle}
                  onClearAll={clearAllFilters}
                  t={t}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Max Price Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {t('filters.maxPrice')}:
              </span>
              <Input
                type="number"
                placeholder="€500"
                value={filters.maxPrice || ''}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                className="w-20 h-8"
              />
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 text-gray-600 hover:text-gray-800"
              >
                <X className="w-4 h-4 mr-1" />
                {t('filters.clearAll')}
              </Button>
            )}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {t('sort.label')}:
          </span>
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">{t('sort.name')}</SelectItem>
              <SelectItem value="price_asc">{t('sort.price_asc')}</SelectItem>
              <SelectItem value="price_desc">{t('sort.price_desc')}</SelectItem>
              <SelectItem value="distance">{t('sort.distance')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.features.length > 0 || filters.maxPrice) && (
        <div className="flex flex-wrap gap-2">
          {filters.maxPrice && (
            <Badge variant="secondary" className="text-xs">
              Max €{filters.maxPrice}
              <button
                onClick={() => handleMaxPriceChange('')}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.features.map((feature) => (
            <Badge key={feature} variant="secondary" className="text-xs">
              {feature}
              <button
                onClick={() => handleFeatureToggle(feature)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {resultsCount === totalCount
          ? t('results.foundResults', {count: totalCount.toString()})
          : t('results.showing', {
              filtered: resultsCount.toString(),
              total: totalCount.toString()
            })}
      </div>
    </div>
  );
}

// Mobile Filters Component
function MobileFilters({
  filters,
  onMaxPriceChange,
  onFeatureToggle,
  onClearAll,
  t
}: {
  filters: DormFilters;
  onMaxPriceChange: (value: string) => void;
  onFeatureToggle: (feature: string) => void;
  onClearAll: () => void;
  t: any;
}) {
  return (
    <div className="space-y-6">
      {/* Max Price */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t('filters.maxPrice')}
        </label>
        <Input
          type="number"
          placeholder="€500"
          value={filters.maxPrice || ''}
          onChange={(e) => onMaxPriceChange(e.target.value)}
        />
      </div>

      {/* Features */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t('filters.features')}
        </label>
        <div className="flex flex-wrap gap-2">
          {dormFeatures.map((feature) => (
            <button
              key={feature}
              onClick={() => onFeatureToggle(feature)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                filters.features.includes(feature)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      {/* Clear All */}
      <Button variant="outline" onClick={onClearAll} className="w-full">
        {t('filters.clearAll')}
      </Button>
    </div>
  );
}
