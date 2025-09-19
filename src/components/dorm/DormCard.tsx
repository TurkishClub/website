'use client';

import {useState, memo, useCallback, useMemo} from 'react';
import {useTranslations} from 'next-intl';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {ExternalLink, MapPin, Home} from 'lucide-react';
import {Dorm} from '@/data/dorms';
import {Analytics} from '@/lib/analytics';

interface DormCardProps {
  dorm: Dorm;
  onViewOnMap?: (dorm: Dorm) => void;
  isSelected?: boolean;
  onToggleCompare?: (dorm: Dorm, selected: boolean) => void;
}

function DormCardComponent({dorm, onViewOnMap, isSelected = false, onToggleCompare}: DormCardProps) {
  const t = useTranslations('dormSearch.card');
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Memoize expensive calculations
  const truncatedDescription = useMemo(() => {
    let description = dorm.description;

    // If no description, create one from available information
    if (
      !description ||
      typeof description !== 'string' ||
      description.trim() === ''
    ) {
      const parts = [];

      // Add room types
      if (dorm.roomTypes && dorm.roomTypes.length > 0) {
        parts.push(`Oda tipleri: ${dorm.roomTypes.join(', ')}`);
      }

      description = parts.join('. ') + '.';
    }

    return description.length > 200
      ? description.substring(0, 200) + '...'
      : description;
  }, [dorm.description, dorm.roomTypes]);

  const priceDisplay = useMemo(() => {
    if (!dorm.rent) {
      return 'Price not available';
    }
    return dorm.rent.type === 'range'
      ? `€${dorm.rent.minPrice} - €${dorm.rent.maxPrice}`
      : `€${dorm.rent.singlePrice}`;
  }, [dorm.rent]);

  const handleViewOnMap = useCallback(() => {
    // Track view on map interaction
    Analytics.trackDormSearch({
      action: 'dorm_view',
      dorm_id: dorm.id,
      dorm_name: dorm.name,
      view_mode: 'map'
    });

    if (onViewOnMap) {
      onViewOnMap(dorm);
    }
  }, [onViewOnMap, dorm]);

  const handleWebsiteClick = useCallback(() => {
    // Track external website click (conversion)
    Analytics.trackDormSearch({
      action: 'external_click',
      dorm_id: dorm.id,
      dorm_name: dorm.name
    });

    if (typeof window !== 'undefined' && dorm.website) {
      window.open(dorm.website, '_blank', 'noopener,noreferrer');
    }
  }, [dorm.website, dorm.id, dorm.name]);

  const toggleDescription = useCallback(() => {
    setShowFullDescription((prev) => !prev);
  }, []);

  const handleCompareToggle = useCallback((checked: boolean) => {
    if (onToggleCompare) {
      onToggleCompare(dorm, checked);
    }
  }, [onToggleCompare, dorm]);

  return (
    <Card
      className={`h-full flex flex-col transition-all duration-300 hover:shadow-lg bg-white relative ring-2 ${
        isSelected ? 'ring-gray-900' : 'ring-transparent'
      }`}
    >
      {/* Compare Checkbox */}
      {onToggleCompare && (
        <div className="absolute top-3 right-3 z-10 w-8 h-8">
          <div className="w-full h-full flex items-center justify-center rounded-md bg-white/80 hover:bg-gray-100">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleCompareToggle}
              className="h-4 w-4 bg-white border-2 border-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 pr-8">
            <CardTitle className="text-lg font-bold text-gray-900 leading-tight mb-1">
              {dorm.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pb-2">
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-right">
            <div className="text-lg font-bold text-black">
              {priceDisplay}{' '}
              <span className="text-sm text-gray-500 font-normal">
                {t('monthlyPrice')}
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        {dorm.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{dorm.address}</span>
          </div>
        )}

        {/* University Distances */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Home className="w-3 h-3 text-[#C61E1E]" />
            <span className="font-medium">{t('university.gfz')}:</span>
            <span>
              {dorm.distanceToGFZ} {t('university.minutes')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Home className="w-3 h-3 text-green-500" />
            <span className="font-medium">{t('university.mainCampus')}:</span>
            <span>
              {dorm.distanceToMainCampus} {t('university.minutes')}
            </span>
          </div>
        </div>

     
        {/* Description */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Açıklama</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {showFullDescription
              ? dorm.description && dorm.description.trim() !== ''
                ? dorm.description
                : truncatedDescription
              : truncatedDescription}
          </p>
          {((dorm.description && dorm.description.length > 200) ||
            (!dorm.description && truncatedDescription.length > 200)) && (
            <button
              onClick={toggleDescription}
              className="text-[#C61E1E] hover:text-red-700 text-sm font-medium mt-1"
            >
              {showFullDescription ? t('showLess') : t('readMore')}
            </button>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div
          className={`grid gap-2 w-full ${dorm.website ? 'grid-cols-2' : 'grid-cols-1'}`}
        >
          {dorm.website && (
            <Button
              onClick={handleWebsiteClick}
              className="bg-[#C61E1E] hover:bg-red-700 text-white text-xs py-1.5 h-auto"
              size="sm"
            >
              <ExternalLink className="w-3 h-3 mr-1.5 flex-shrink-0" />
              <span className="truncate">{t('visitWebsite')}</span>
            </Button>
          )}

          <Button
            onClick={handleViewOnMap}
            variant="outline"
            size="sm"
            className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 text-xs py-1.5 h-auto"
          >
            <MapPin className="w-3 h-3 mr-1.5 flex-shrink-0" />
            <span className="truncate">{t('viewOnMap')}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const DormCard = memo(DormCardComponent);

// Loading skeleton component
export function DormCardSkeleton() {
  return (
    <Card className="h-full flex flex-col bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pb-2">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-100 rounded animate-pulse w-16" />
          <div className="h-6 bg-gray-100 rounded animate-pulse w-20" />
          <div className="h-6 bg-gray-100 rounded animate-pulse w-18" />
        </div>
        <div className="h-16 bg-gray-100 rounded animate-pulse" />
      </CardContent>

      <CardFooter className="pt-2">
        <div className="grid grid-cols-2 gap-2 w-full">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 bg-gray-100 rounded animate-pulse" />
        </div>
      </CardFooter>
    </Card>
  );
}
