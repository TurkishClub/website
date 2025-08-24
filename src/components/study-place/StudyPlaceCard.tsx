'use client';

import {useState, memo, useCallback, useMemo} from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {
  MapPin,
  Clock,
  Zap,
  UtensilsCrossed,
  Users,
  Volume2,
  VolumeX,
  Wifi,
  Euro
} from 'lucide-react';
import {StudyPlace} from '@/data/studyPlaces';
import {Analytics} from '@/lib/analytics';
import {Checkbox} from '@/components/ui/checkbox';

interface StudyPlaceCardProps {
  studyPlace: StudyPlace;
  onViewOnMap?: (studyPlace: StudyPlace) => void;
  isSelected?: boolean;
  onCompareToggle?: (studyPlace: StudyPlace, isSelected: boolean) => void;
}

function StudyPlaceCardComponent({studyPlace, onViewOnMap, isSelected, onCompareToggle}: StudyPlaceCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Memoize expensive calculations
  const truncatedDescription = useMemo(() => {
    let description = studyPlace.description;

    if (!description || typeof description !== 'string' || description.trim() === '') {
      const parts = [];

      if (studyPlace.whoCanUse) {
        parts.push(`Kullanıcılar: ${studyPlace.whoCanUse}`);
      }

      if (studyPlace.restrictions) {
        parts.push(`Kısıtlamalar: ${studyPlace.restrictions}`);
      }

      description = parts.join('. ') + '.';
    }

    return description.length > 300 ? description.substring(0, 300) + '...' : description;
  }, [studyPlace.description, studyPlace.whoCanUse, studyPlace.restrictions]);

  const categoryDisplay = useMemo(() => {
    const categoryMap = {
      library: 'Kütüphane',
      cafe: 'Kafe',
      university: 'Üniversite',
      coworking: 'Coworking',
      other: 'Diğer'
    };
    return categoryMap[studyPlace.category] || studyPlace.category;
  }, [studyPlace.category]);

  const openingHoursToday = useMemo(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    const dayKey = days[today] as keyof typeof studyPlace.openingHours;
    return studyPlace.openingHours[dayKey] || 'Bilinmiyor';
  }, [studyPlace]);

  const handleViewOnMap = useCallback(() => {
    Analytics.trackDormSearch({
      action: 'map_view',
      dorm_id: studyPlace.id,
      dorm_name: studyPlace.name,
      view_mode: 'map'
    });

    if (onViewOnMap) {
      onViewOnMap(studyPlace);
    }
  }, [onViewOnMap, studyPlace]);

  const toggleDescription = useCallback(() => {
    setShowFullDescription((prev) => !prev);
  }, []);

  const handleCompareToggle = useCallback((checked: boolean) => {
    if (onCompareToggle) {
      onCompareToggle(studyPlace, checked);
    }
  }, [onCompareToggle, studyPlace]);

  return (
    <Card className={`w-full mb-4 hover:shadow-lg transition-all duration-200 bg-white ${
      isSelected ? 'ring-2 ring-opacity-50 shadow-md' : ''
    }`}>
      <div className="flex flex-col lg:flex-row">
        {/* Sol taraf - Ana bilgiler */}
        <div className="flex-1 p-6">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  {/* Compare Checkbox */}
                  {onCompareToggle && (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={handleCompareToggle}
                      className="mt-1 "
                      aria-label="Karşılaştırmak için seç"
                    />
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                      {studyPlace.name}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{studyPlace.address}</span>
                    </div>
                    <Badge variant="outline" className="mb-3">
                      {categoryDisplay}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Özellikler - Yatay düzen */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="flex items-center text-sm">
                {studyPlace.isQuiet ? (
                  <>
                    <VolumeX className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-green-600">Sessiz</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="text-orange-500">Sesli</span>
                  </>
                )}
              </div>

              <div className="flex items-center text-sm">
                {studyPlace.hasWifi ? (
                  <>
                    <Wifi className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-green-600">WiFi</span>
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-400">WiFi Yok</span>
                  </>
                )}
              </div>

              <div className="flex items-center text-sm">
                {studyPlace.electricOutlets ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-green-600">Priz</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-400">Priz Yok</span>
                  </>
                )}
              </div>

              <div className="flex items-center text-sm">
                {studyPlace.isFree ? (
                  <>
                    <Euro className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-green-600">Ücretsiz</span>
                  </>
                ) : (
                  <>
                    <Euro className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="text-orange-500">Ücretli</span>
                  </>
                )}
              </div>
            </div>

            {/* Açık saatler */}
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Bugün: {openingHoursToday}</span>
            </div>

            {/* Kimler kullanabilir */}
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{studyPlace.whoCanUse}</span>
            </div>

            {/* Yemek imkanları */}
            {studyPlace.foodOptions && (
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <UtensilsCrossed className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{studyPlace.foodOptions}</span>
              </div>
            )}

            {/* Açıklama */}
            <div className="text-sm text-gray-700 mb-4">
              <p className="leading-relaxed">
                {showFullDescription ? studyPlace.description : truncatedDescription}
              </p>
              {studyPlace.description && studyPlace.description.length > 300 && (
                <button
                  onClick={toggleDescription}
                  className="text-blue-600 hover:text-blue-800 text-xs mt-1 transition-colors"
                >
                  {showFullDescription ? 'Daha az göster' : 'Devamını oku'}
                </button>
              )}
            </div>

            {/* Kısıtlamalar */}
            {studyPlace.restrictions && (
              <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-md mb-4">
                <strong>Kısıtlamalar:</strong> {studyPlace.restrictions}
              </div>
            )}
          </CardContent>
        </div>

        {/* Sağ taraf - Aksiyon butonları */}
        <div className="lg:w-48 p-6 lg:pl-0 flex flex-col justify-between bg-gray-50 lg:bg-transparent">
          <div className="space-y-3">
            <Button
              onClick={handleViewOnMap}
              variant="outline"
              size="sm"
              className="w-full bg-white hover:bg-gray-50 border-gray-200"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Haritada Gör
            </Button>

            {/* Mesafe bilgileri */}
            {(studyPlace.distanceToGFZ || studyPlace.distanceToMainCampus) && (
              <div className="text-xs text-gray-600 space-y-1">
                {studyPlace.distanceToGFZ && (
                  <div>GFZ&apos;ye: {studyPlace.distanceToGFZ} dk</div>
                )}
                {studyPlace.distanceToMainCampus && (
                  <div>Ana kampüs: {studyPlace.distanceToMainCampus} dk</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

// Memoized export for better performance
export const StudyPlaceCard = memo(StudyPlaceCardComponent);

// Skeleton component for loading states
export function StudyPlaceCardSkeleton() {
  return (
    <Card className="w-full mb-4 bg-white">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-6">
          <div className="mb-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className="h-5 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
        </div>
        <div className="lg:w-48 p-6 lg:pl-0">
          <div className="h-9 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </Card>
  );
}
