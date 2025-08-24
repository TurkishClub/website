'use client';

import {memo} from 'react';
import {X, MapPin, Home, Clock, Users, Wifi, Zap, UtensilsCrossed, VolumeX} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {StudyPlace} from '@/data/studyPlaces';
import {ComparisonModal, ComparisonTab} from '@/components/ui/comparison-modal';
import {ComparisonTable, TableRow} from '@/components/ui/comparison-table';

interface StudyPlaceComparisonProps {
  comparedStudyPlaces: StudyPlace[];
  onRemoveStudyPlace: (studyPlaceId: string) => void;
  onClose: () => void;
  onAddMore?: () => void;
}

function StudyPlaceComparisonComponent({
  comparedStudyPlaces,
  onRemoveStudyPlace,
  onClose,
  onAddMore
}: StudyPlaceComparisonProps) {
  if (comparedStudyPlaces.length === 0) {
    return null;
  }

  const getCategoryDisplay = (category: string) => {
    const categoryMap = {
      library: 'Kütüphane',
      cafe: 'Kafe', 
      university: 'Üniversite',
      coworking: 'Coworking',
      other: 'Diğer'
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  const getOpeningHoursToday = (studyPlace: StudyPlace) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    const dayKey = days[today] as keyof typeof studyPlace.openingHours;
    return studyPlace.openingHours[dayKey] || 'Bilinmiyor';
  };

  // Define table rows for overview
  const overviewRows: TableRow<StudyPlace>[] = [
    {
      key: 'category',
      label: 'Kategori',
      render: (studyPlace) => (
        <Badge variant="outline" className="text-gray-700 border-gray-300">
          {getCategoryDisplay(studyPlace.category)}
        </Badge>
      )
    },
    {
      key: 'gfzDistance',
      label: 'GFZ Mesafesi',
      render: (studyPlace) => {
        const gfzTimes = comparedStudyPlaces
          .map(s => s.distanceToGFZ)
          .filter((t): t is number => typeof t === 'number' && t > 0);
        const minGfzTime = gfzTimes.length > 0 ? Math.min(...gfzTimes) : 0;
        const isClosest = typeof studyPlace.distanceToGFZ === 'number' && 
                         studyPlace.distanceToGFZ === minGfzTime && 
                         studyPlace.distanceToGFZ > 0;
        
        return (
          <div className={`font-medium ${isClosest ? 'text-green-600' : 'text-gray-900'}`}>
            {studyPlace.distanceToGFZ || 'Bilinmiyor'} 
            {typeof studyPlace.distanceToGFZ === 'number' && ' dakika'}
            {isClosest && (
              <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                En Yakın
              </Badge>
            )}
          </div>
        );
      }
    },
    {
      key: 'campusDistance',
      label: 'Ana Kampüs Mesafesi',
      render: (studyPlace) => {
        const campusTimes = comparedStudyPlaces
          .map(s => s.distanceToMainCampus)
          .filter((t): t is number => typeof t === 'number' && t > 0);
        const minCampusTime = campusTimes.length > 0 ? Math.min(...campusTimes) : 0;
        const isClosest = typeof studyPlace.distanceToMainCampus === 'number' && 
                         studyPlace.distanceToMainCampus === minCampusTime && 
                         studyPlace.distanceToMainCampus > 0;
        
        return (
          <div className={`font-medium ${isClosest ? 'text-green-600' : 'text-gray-900'}`}>
            {studyPlace.distanceToMainCampus || 'Bilinmiyor'} 
            {typeof studyPlace.distanceToMainCampus === 'number' && ' dakika'}
            {isClosest && (
              <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                En Yakın
              </Badge>
            )}
          </div>
        );
      }
    },
    {
      key: 'features',
      label: 'Özellikler',
      render: (studyPlace) => (
        <div className="flex flex-wrap gap-2">
          {studyPlace.isQuiet && (
            <Badge variant="outline" className="text-xs text-green-700 border-green-300">
              <VolumeX className="w-3 h-3 mr-1" />
              Sessiz
            </Badge>
          )}
          {studyPlace.hasWifi && (
            <Badge variant="outline" className="text-xs text-blue-700 border-blue-300">
              <Wifi className="w-3 h-3 mr-1" />
              WiFi
            </Badge>
          )}
          {studyPlace.isFree && (
            <Badge variant="outline" className="text-xs text-purple-700 border-purple-300">
              Ücretsiz
            </Badge>
          )}
          {studyPlace.electricOutlets && (
            <Badge variant="outline" className="text-xs text-orange-700 border-orange-300">
              <Zap className="w-3 h-3 mr-1" />
              Priz
            </Badge>
          )}
          {studyPlace.foodOptions && (
            <Badge variant="outline" className="text-xs text-red-700 border-red-300">
              <UtensilsCrossed className="w-3 h-3 mr-1" />
              Yemek
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'openingHours',
      label: 'Bugünkü Saatler',
      render: (studyPlace) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#C61E1E]" />
          <span className="text-gray-900">{getOpeningHoursToday(studyPlace)}</span>
        </div>
      )
    }
  ];

  // Define tabs
  const tabs: ComparisonTab[] = [
    {
      key: 'overview',
      label: 'Genel Bakış',
      content: (
        <ComparisonTable
          items={comparedStudyPlaces}
          rows={overviewRows}
          onRemoveItem={onRemoveStudyPlace}
        />
      )
    },
    {
      key: 'location',
      label: 'Konum & Ulaşım',
      content: (
        <div className="p-6">
          <div className="grid gap-6">
            {comparedStudyPlaces.map(studyPlace => (
              <Card key={studyPlace.id} className="relative">
                <button
                  onClick={() => onRemoveStudyPlace(studyPlace.id)}
                  className="absolute top-3 right-3 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 pr-8">
                    <MapPin className="w-5 h-5 text-[#C61E1E]" />
                    <span className="text-gray-900">{studyPlace.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Adres</h4>
                      <p className="text-gray-900">{studyPlace.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">GFZ Kampüsü</h4>
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-[#C61E1E]" />
                          <span className="text-gray-900">
                            {typeof studyPlace.distanceToGFZ === 'number' 
                              ? `${studyPlace.distanceToGFZ} dakika` 
                              : 'Bilinmiyor'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Ana Kampüs</h4>
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-green-500" />
                          <span className="text-gray-900">
                            {typeof studyPlace.distanceToMainCampus === 'number' 
                              ? `${studyPlace.distanceToMainCampus} dakika` 
                              : 'Bilinmiyor'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Kategori</h4>
                      <Badge variant="outline" className="text-gray-700 border-gray-300">
                        {getCategoryDisplay(studyPlace.category)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'details',
      label: 'Detaylar',
      content: (
        <div className="p-6">
          <div className="grid gap-6">
            {comparedStudyPlaces.map(studyPlace => (
              <Card key={studyPlace.id} className="relative">
                <button
                  onClick={() => onRemoveStudyPlace(studyPlace.id)}
                  className="absolute top-3 right-3 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <CardHeader>
                  <CardTitle className="pr-8 text-gray-900">{studyPlace.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Açıklama</h4>
                      <p className="text-gray-900 leading-relaxed">
                        {studyPlace.description || 'Açıklama bulunmuyor'}
                      </p>
                    </div>
                    {studyPlace.whoCanUse && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Kim Kullanabilir</h4>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#C61E1E]" />
                          <span className="text-gray-900">{studyPlace.whoCanUse}</span>
                        </div>
                      </div>
                    )}
                    {studyPlace.restrictions && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Kısıtlamalar</h4>
                        <p className="text-gray-900">{studyPlace.restrictions}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Özellikler</h4>
                      <div className="flex flex-wrap gap-2">
                        {studyPlace.isQuiet && (
                          <Badge variant="outline">Sessiz Ortam</Badge>
                        )}
                        {studyPlace.hasWifi && (
                          <Badge variant="outline">WiFi Var</Badge>
                        )}
                        {studyPlace.isFree && (
                          <Badge variant="outline">Ücretsiz</Badge>
                        )}
                        {studyPlace.electricOutlets && (
                          <Badge variant="outline">Elektrik Prizi</Badge>
                        )}
                        {studyPlace.foodOptions && (
                          <Badge variant="outline">Yemek Seçenekleri</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <ComparisonModal
      items={comparedStudyPlaces}
      title="Ders Yeri Karşılaştırması"
      itemLabel="ders yeri"
      onClose={onClose}
      onAddMore={onAddMore}
      tabs={tabs}
      maxItems={4}
    />
  );
}

export const StudyPlaceComparison = memo(StudyPlaceComparisonComponent);
