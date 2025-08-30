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
import {Checkbox} from '@/components/ui/checkbox';

export interface StudyPlaceFilters {
  searchQuery: string;
  category: string;
  isQuietOnly: boolean;
  isFreeOnly: boolean;
  sortBy: string;
}

interface StudyPlaceSearchAndFiltersProps {
  filters: StudyPlaceFilters;
  onFiltersChange: (filters: StudyPlaceFilters) => void;
  resultsCount: number;
  totalCount: number;
}

export function StudyPlaceSearchAndFilters({
  filters,
  onFiltersChange,
  resultsCount,
  totalCount
}: StudyPlaceSearchAndFiltersProps) {
  const t = useTranslations('studyPlaceSearch');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: value
    });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      category: value
    });
  };

  const handleQuietOnlyChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      isQuietOnly: checked
    });
  };

  const handleFreeOnlyChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      isFreeOnly: checked
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
      category: 'all',
      isQuietOnly: false,
      isFreeOnly: false,
      sortBy: 'name'
    });
  };

  const activeFiltersCount = [
    filters.category !== 'all',
    filters.isQuietOnly,
    filters.isFreeOnly
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
            <SheetContent side="left" className="w-80 bg-white">
              <SheetHeader>
                <SheetTitle>{t('filters.title')}</SheetTitle>
                <SheetDescription>
                  Arama kriterlerinizi ayarlayın
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <MobileFilters
                  filters={filters}
                  onCategoryChange={handleCategoryChange}
                  onQuietOnlyChange={handleQuietOnlyChange}
                  onFreeOnlyChange={handleFreeOnlyChange}
                  onClearAll={clearAllFilters}
                  t={t}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {t('filters.category')}:
              </span>
              <Select value={filters.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">{t('filters.categories.all')}</SelectItem>
                  <SelectItem value="library">{t('filters.categories.library')}</SelectItem>
                  <SelectItem value="cafe">{t('filters.categories.cafe')}</SelectItem>
                  <SelectItem value="university">{t('filters.categories.university')}</SelectItem>
                  <SelectItem value="coworking">{t('filters.categories.coworking')}</SelectItem>
                  <SelectItem value="other">{t('filters.categories.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quiet Only Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="quietOnly"
                checked={filters.isQuietOnly}
                onCheckedChange={handleQuietOnlyChange}
              />
              <label
                htmlFor="quietOnly"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {t('filters.quietOnly')}
              </label>
            </div>

            {/* Free Only Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="freeOnly"
                checked={filters.isFreeOnly}
                onCheckedChange={handleFreeOnlyChange}
              />
              <label
                htmlFor="freeOnly"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {t('filters.freeOnly')}
              </label>
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
            <SelectTrigger className="w-48 h-8 bg-white border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="name">{t('sort.name')}</SelectItem>
              <SelectItem value="category">{t('sort.category')}</SelectItem>
              <SelectItem value="distance">{t('sort.distance')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.category !== 'all' || filters.isQuietOnly || filters.isFreeOnly) && (
        <div className="flex flex-wrap gap-2">
          {filters.category !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {filters.category === 'all' ? t('filters.categories.all') : 
               filters.category === 'library' ? t('filters.categories.library') :
               filters.category === 'cafe' ? t('filters.categories.cafe') :
               filters.category === 'university' ? t('filters.categories.university') :
               filters.category === 'coworking' ? t('filters.categories.coworking') :
               t('filters.categories.other')}
              <button
                onClick={() => handleCategoryChange('all')}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.isQuietOnly && (
            <Badge variant="secondary" className="text-xs">
              {t('filters.quietOnly')}
              <button
                onClick={() => handleQuietOnlyChange(false)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.isFreeOnly && (
            <Badge variant="secondary" className="text-xs">
              {t('filters.freeOnly')}
              <button
                onClick={() => handleFreeOnlyChange(false)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
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
  onCategoryChange,
  onQuietOnlyChange,
  onFreeOnlyChange,
  onClearAll,
  t
}: {
  filters: StudyPlaceFilters;
  onCategoryChange: (value: string) => void;
  onQuietOnlyChange: (checked: boolean) => void;
  onFreeOnlyChange: (checked: boolean) => void;
  onClearAll: () => void;
  t: any;
}) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t('filters.category')}
        </label>
        <Select value={filters.category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">{t('filters.categories.all')}</SelectItem>
            <SelectItem value="library">{t('filters.categories.library')}</SelectItem>
            <SelectItem value="cafe">{t('filters.categories.cafe')}</SelectItem>
            <SelectItem value="university">{t('filters.categories.university')}</SelectItem>
            <SelectItem value="coworking">{t('filters.categories.coworking')}</SelectItem>
            <SelectItem value="other">{t('filters.categories.other')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quiet Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="quietOnlyMobile"
          checked={filters.isQuietOnly}
          onCheckedChange={onQuietOnlyChange}
        />
        <label
          htmlFor="quietOnlyMobile"
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          {t('filters.quietOnly')}
        </label>
      </div>

      {/* Free Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="freeOnlyMobile"
          checked={filters.isFreeOnly}
          onCheckedChange={onFreeOnlyChange}
        />
        <label
          htmlFor="freeOnlyMobile"
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          {t('filters.freeOnly')}
        </label>
      </div>

      {/* Clear All */}
      <Button variant="outline" onClick={onClearAll} className="w-full">
        {t('filters.clearAll')}
      </Button>
    </div>
  );
}
