'use client';

import {memo} from 'react';
import {X, ExternalLink, MapPin, Home} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Dorm} from '@/data/dorms';
import {ComparisonModal, ComparisonTab} from '@/components/ui/comparison-modal';
import {ComparisonTable, TableRow} from '@/components/ui/comparison-table';

interface DormComparisonProps {
  comparedDorms: Dorm[];
  onRemoveDorm: (dormId: string) => void;
  onClose: () => void;
  onAddMore?: () => void;
}

function DormComparisonComponent({
  comparedDorms,
  onRemoveDorm,
  onClose,
  onAddMore
}: DormComparisonProps) {
  if (comparedDorms.length === 0) {
    return null;
  }

  const handleWebsiteClick = (website: string) => {
    if (typeof window !== 'undefined') {
      window.open(website, '_blank', 'noopener,noreferrer');
    }
  };

  const getPriceDisplay = (dorm: Dorm) => {
    if (!dorm.rent) {
      return 'Fiyat bilgisi yok';
    }
    return dorm.rent.type === 'range'
      ? `€${dorm.rent.minPrice} - €${dorm.rent.maxPrice}`
      : `€${dorm.rent.singlePrice}`;
  };

  const getPriceValue = (dorm: Dorm): number => {
    if (!dorm.rent) return 0;
    return dorm.rent.type === 'range' ? dorm.rent.minPrice : dorm.rent.singlePrice;
  };

  // Define table rows for overview
  const overviewRows: TableRow<Dorm>[] = [
    {
      key: 'price',
      label: 'Aylık Kira',
      render: (dorm) => {
        const price = getPriceValue(dorm);
        const prices = comparedDorms.map(getPriceValue).filter(p => p > 0);
        const minPrice = Math.min(...prices);
        const isLowest = price === minPrice && price > 0;
        
        return (
          <div className={`text-lg font-bold ${isLowest ? 'text-green-600' : 'text-gray-900'}`}>
            {getPriceDisplay(dorm)}
            {isLowest && (
              <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                En Uygun
              </Badge>
            )}
          </div>
        );
      }
    },
    {
      key: 'gfzDistance',
      label: 'GFZ Mesafesi',
      render: (dorm) => {
        const gfzTimes = comparedDorms.map(d => d.distanceToGFZ).filter(t => t > 0);
        const minGfzTime = Math.min(...gfzTimes);
        const isClosest = dorm.distanceToGFZ === minGfzTime && dorm.distanceToGFZ > 0;
        
        return (
          <div className={`font-medium ${isClosest ? 'text-green-600' : 'text-gray-900'}`}>
            {dorm.distanceToGFZ} dakika
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
      render: (dorm) => {
        const campusTimes = comparedDorms.map(d => d.distanceToMainCampus).filter(t => t > 0);
        const minCampusTime = Math.min(...campusTimes);
        const isClosest = dorm.distanceToMainCampus === minCampusTime && dorm.distanceToMainCampus > 0;
        
        return (
          <div className={`font-medium ${isClosest ? 'text-green-600' : 'text-gray-900'}`}>
            {dorm.distanceToMainCampus} dakika
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
      key: 'roomTypes',
      label: 'Oda Tipleri',
      render: (dorm) => (
        <div className="flex flex-wrap gap-1">
          {dorm.roomTypes && dorm.roomTypes.length > 0 ? 
            dorm.roomTypes.map(type => (
              <Badge key={type} variant="outline" className="text-xs text-gray-700 border-gray-300">
                {type}
              </Badge>
            )) : (
              <span className="text-gray-500 text-sm">Bilgi yok</span>
            )
          }
        </div>
      )
    },
    {
      key: 'website',
      label: 'Web Sitesi',
      render: (dorm) => (
        dorm.website ? (
          <Button
            onClick={() => handleWebsiteClick(dorm.website)}
            size="sm"
            className="bg-[#C61E1E] hover:bg-red-700 text-white text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Ziyaret Et
          </Button>
        ) : (
          <span className="text-gray-500 text-sm">Mevcut değil</span>
        )
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
          items={comparedDorms}
          rows={overviewRows}
          onRemoveItem={onRemoveDorm}
        />
      )
    },
    {
      key: 'location',
      label: 'Konum & Ulaşım',
      content: (
        <div className="p-6">
          <div className="grid gap-6">
            {comparedDorms.map(dorm => (
              <Card key={dorm.id} className="relative">
                <button
                  onClick={() => onRemoveDorm(dorm.id)}
                  className="absolute top-3 right-3 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 pr-8">
                    <MapPin className="w-5 h-5 text-[#C61E1E]" />
                    <span className="text-gray-900">{dorm.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Adres</h4>
                      <p className="text-gray-900">{dorm.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">GFZ Kampüsü</h4>
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-[#C61E1E]" />
                          <span className="text-gray-900">{dorm.distanceToGFZ} dakika</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Ana Kampüs</h4>
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-green-500" />
                          <span className="text-gray-900">{dorm.distanceToMainCampus} dakika</span>
                        </div>
                      </div>
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
            {comparedDorms.map(dorm => (
              <Card key={dorm.id} className="relative">
                <button
                  onClick={() => onRemoveDorm(dorm.id)}
                  className="absolute top-3 right-3 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <CardHeader>
                  <CardTitle className="pr-8 text-gray-900">{dorm.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Açıklama</h4>
                      <p className="text-gray-900 leading-relaxed">
                        {dorm.description || 'Açıklama bulunmuyor'}
                      </p>
                    </div>
                    {dorm.roomTypes && dorm.roomTypes.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Oda Tipleri</h4>
                        <div className="flex flex-wrap gap-2 text-gray-900">
                          {dorm.roomTypes.map(type => (
                            <Badge key={type} variant="outline">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
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
      items={comparedDorms}
      title="Yurt Karşılaştırması"
      itemLabel="yurt"
      onClose={onClose}
      onAddMore={onAddMore}
      tabs={tabs}
      maxItems={4}
    />
  );
}

export const DormComparison = memo(DormComparisonComponent);
