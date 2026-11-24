'use client';

import {useState, memo, useCallback, useMemo} from 'react';
import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils';
import {pillClass} from '@/components/home/Pill';
import {Checkbox} from '@/components/ui/checkbox';
import {MapPin} from 'lucide-react';
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

  const hasLongDescription =
    (dorm.description && dorm.description.length > 200) ||
    (!dorm.description && truncatedDescription.length > 200);

  return (
    <article
      className={cn(
        'relative flex h-full flex-col bg-white p-6 ring-2 ring-inset transition-shadow duration-200 ease-out-strong md:p-7',
        isSelected ? 'ring-cardinal-700' : 'ring-transparent'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-serif text-[1.75rem] font-normal leading-[1.1] tracking-[-0.01em]">{dorm.name}</h3>
        {onToggleCompare && (
          <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-ink-950/20 px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-ink-950">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleCompareToggle}
              className="h-4 w-4 border-ink-950/40 data-[state=checked]:border-cardinal-700 data-[state=checked]:bg-cardinal-700 data-[state=checked]:text-white"
            />
            Karşılaştır
          </label>
        )}
      </div>

      <p className="mt-5 font-serif text-[2rem] leading-none tracking-[-0.01em] text-cardinal-700">
        {priceDisplay} <span className="font-sans text-sm text-ink-500">{t('monthlyPrice')}</span>
      </p>

      {dorm.address && (
        <p className="mt-4 flex items-start gap-2 text-sm text-ink-700">
          <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ink-500" />
          {dorm.address}
        </p>
      )}

      <dl className="mt-5 grid grid-cols-2 border-y border-ink-950/15 py-3 text-sm">
        <div>
          <dt className="text-xs text-ink-500">{t('university.gfz')}</dt>
          <dd className="mt-1 font-medium">
            {dorm.distanceToGFZ} {t('university.minutes')}
          </dd>
        </div>
        <div className="border-l border-ink-950/15 pl-4">
          <dt className="text-xs text-ink-500">{t('university.mainCampus')}</dt>
          <dd className="mt-1 font-medium">
            {dorm.distanceToMainCampus} {t('university.minutes')}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex-1">
        <p className="leading-relaxed text-ink-700">
          {showFullDescription && dorm.description && dorm.description.trim() !== ''
            ? dorm.description
            : truncatedDescription}
        </p>
        {hasLongDescription && (
          <button
            type="button"
            onClick={toggleDescription}
            className="mt-2 text-sm font-medium text-cardinal-700 underline-offset-4 hover:underline"
          >
            {showFullDescription ? t('showLess') : t('readMore')}
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {dorm.website && (
          <button type="button" onClick={handleWebsiteClick} className={pillClass('ink', 'px-5 py-2.5')}>
            {t('visitWebsite')}
            <span aria-hidden>↗</span>
          </button>
        )}
        <button type="button" onClick={handleViewOnMap} className={pillClass('outline', 'px-5 py-2.5')}>
          <MapPin aria-hidden className="h-4 w-4" />
          {t('viewOnMap')}
        </button>
      </div>
    </article>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const DormCard = memo(DormCardComponent);

// Loading skeleton component
export function DormCardSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 bg-white p-6 md:p-7" aria-hidden>
      <div className="h-7 w-3/4 animate-pulse bg-stone-200" />
      <div className="h-8 w-1/2 animate-pulse bg-stone-200" />
      <div className="h-4 w-2/3 animate-pulse bg-stone-100" />
      <div className="h-14 animate-pulse bg-stone-100" />
      <div className="h-16 animate-pulse bg-stone-100" />
      <div className="flex gap-2">
        <div className="h-10 w-36 animate-pulse rounded-full bg-stone-200" />
        <div className="h-10 w-32 animate-pulse rounded-full bg-stone-100" />
      </div>
    </div>
  );
}
