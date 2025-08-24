'use client';

import {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {MapPin, Navigation, ExternalLink} from 'lucide-react';
import {StudyPlace} from '@/data/studyPlaces';
import L from 'leaflet';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default markers in SSR
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  {ssr: false}
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  {ssr: false}
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  {ssr: false}
);
const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  {ssr: false}
);

interface StudyPlaceMapProps {
  studyPlaces: StudyPlace[];
  selectedStudyPlace?: StudyPlace | null;
  onStudyPlaceSelect?: (studyPlace: StudyPlace) => void;
}

export function StudyPlaceMapLeaflet({
  studyPlaces,
  selectedStudyPlace,
  onStudyPlaceSelect
}: StudyPlaceMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component is mounted before rendering the map
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleStudyPlaceClick = (studyPlace: StudyPlace) => {
    if (onStudyPlaceSelect) {
      onStudyPlaceSelect(studyPlace);
    }
  };

  const openInGoogleMaps = (studyPlace: StudyPlace) => {
    if (typeof window !== 'undefined') {
      const query = encodeURIComponent(studyPlace.address);
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const openAllInGoogleMaps = () => {
    if (typeof window !== 'undefined') {
      const munichCenter = '48.1351,11.5820';
      const url = `https://www.google.com/maps/search/library+study+place+München/@${munichCenter},12z`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Don't render the map on the server
  if (!isMounted) {
    return (
      <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden">
        <div className="p-4 bg-white border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Ders Çalışma Yerleri Haritası
          </h3>
          <p className="text-sm text-gray-600 mt-1">Harita yükleniyor...</p>
        </div>
        <div className="flex-1 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-500">Harita yükleniyor...</div>
        </div>
      </div>
    );
  }

  // Munich coordinates as center
  const munichCoords: [number, number] = [48.1351, 11.582];

  return (
    <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-white border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Ders Çalışma Yerleri Haritası
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {studyPlaces.length} ders çalışma yeri gösteriliyor
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={openAllInGoogleMaps}
            className="flex items-center"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Google Maps&apos;te Aç
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={munichCoords}
          zoom={12}
          scrollWheelZoom={true}
          zoomControl={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />

          {studyPlaces.map((studyPlace) => (
            <Marker
              key={studyPlace.id}
              position={[studyPlace.coordinates.lat, studyPlace.coordinates.lng]}
              eventHandlers={{
                click: () => handleStudyPlaceClick(studyPlace)
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Selected Study Place Info */}
      {selectedStudyPlace && (
        <div className="p-4 bg-white border-t">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {selectedStudyPlace.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-start text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{selectedStudyPlace.address}</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="outline" className="text-xs">
                  {selectedStudyPlace.category === 'library' && 'Kütüphane'}
                  {selectedStudyPlace.category === 'cafe' && 'Kafe'}
                  {selectedStudyPlace.category === 'university' && 'Üniversite'}
                  {selectedStudyPlace.category === 'coworking' && 'Coworking'}
                  {selectedStudyPlace.category === 'other' && 'Diğer'}
                </Badge>
                {selectedStudyPlace.isQuiet && (
                  <Badge variant="secondary" className="text-xs">
                    Sessiz
                  </Badge>
                )}
                {selectedStudyPlace.hasWifi && (
                  <Badge variant="secondary" className="text-xs">
                    WiFi
                  </Badge>
                )}
                {selectedStudyPlace.isFree && (
                  <Badge variant="secondary" className="text-xs">
                    Ücretsiz
                  </Badge>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openInGoogleMaps(selectedStudyPlace)}
                  className="flex items-center text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Yol Tarifi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default StudyPlaceMapLeaflet;
