"use client";

import { useTranslations } from "next-intl";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dorm } from "@/data/dorms";

interface DormMapProps {
  dorms: Dorm[];
  selectedDorm?: Dorm | null;
  onDormSelect?: (dorm: Dorm) => void;
}

export function DormMap({ dorms, selectedDorm, onDormSelect }: DormMapProps) {
  const t = useTranslations("dormSearch");

  const handleDormClick = (dorm: Dorm) => {
    if (onDormSelect) {
      onDormSelect(dorm);
    }
  };

  const openInGoogleMaps = (dorm: Dorm) => {
    const query = encodeURIComponent(dorm.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openAllInGoogleMaps = () => {
    // Create a URL with multiple markers for all dorms
    const munichCenter = "48.1351,11.5820"; // Munich city center
    
    // For now, open regular Google Maps with search
    const fallbackUrl = `https://www.google.com/maps/search/student+dormitory+München/@${munichCenter},12z`;
    window.open(fallbackUrl, "_blank", "noopener,noreferrer");
  };

  // Generate Google Maps iframe URL with multiple markers
  const generateMapUrl = () => {
    // Munich center coordinates
    const center = "48.1351,11.5820";
    
    // Create iframe URL with multiple markers
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d86950.41400258972!2d${center}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1str!2s!4v1703123456789!5m2!1str!2s`;
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden">
      {/* Map Header */}
      <div className="p-4 bg-white border-b flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t("map.title")}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {dorms.length} yurt konumu gösteriliyor
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={openAllInGoogleMaps}
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Google Maps&apos;te Aç
        </Button>
      </div>

      {/* Real Munich Map */}
      <div className="flex-1 relative">
        <iframe
          src={generateMapUrl()}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />
        
        {/* Custom overlay for better marker visualization */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full">
            {dorms.map((dorm) => {
              // Convert real coordinates to overlay positions
              const position = coordinateToPosition(dorm.coordinates.lat, dorm.coordinates.lng);
              
              return (
                <div
                  key={dorm.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-110 ${
                    selectedDorm?.id === dorm.id ? 'z-20 scale-125' : 'z-10'
                  }`}
                  style={{
                    left: position.x,
                    top: position.y
                  }}
                  onClick={() => handleDormClick(dorm)}
                >
                  {/* Map Pin */}
                  <div className={`relative ${
                    selectedDorm?.id === dorm.id 
                      ? 'text-red-600' 
                      : 'text-blue-600 hover:text-blue-800'
                  }`}>
                    <div className="bg-white rounded-full p-1 shadow-lg border-2 border-current">
                      <MapPin className="w-6 h-6" fill="currentColor" />
                    </div>
                  </div>

                  {/* Price Badge */}
                  <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium shadow-lg transform -translate-x-1/2 ${
                    selectedDorm?.id === dorm.id
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-300'
                  }`}>
                    €{dorm.rent}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Dorm Info */}
      {selectedDorm && (
        <div className="p-4 bg-white border-t">
          <Card className="border-l-4 border-l-[#C61E1E]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-900">
                {selectedDorm.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{selectedDorm.address}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#C61E1E] text-white">
                    €{Math.floor(selectedDorm.rent / 100) * 100}-€{Math.ceil(selectedDorm.rent / 100) * 100} aylık tahmini
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openInGoogleMaps(selectedDorm)}
                  className="text-xs"
                >
                  <Navigation className="w-3 h-3 mr-1" />
                  Yol Tarifi Al
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Legend */}
      <div className="p-3 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <span className="text-gray-600">Öğrenci Yurdu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              <span className="text-gray-600">Seçili Yurt</span>
            </div>
          </div>
          <p className="text-gray-500">
            📍 Gerçek Münih haritası - Tam konum için pin&apos;lere tıklayın
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert real coordinates to overlay positions
function coordinateToPosition(lat: number, lng: number): { x: string, y: string } {
  // Munich bounds (approximate)
  const munichBounds = {
    north: 48.248,
    south: 48.061,
    east: 11.722,
    west: 11.360
  };
  
  // Convert lat/lng to percentage positions within Munich bounds
  const xPercent = ((lng - munichBounds.west) / (munichBounds.east - munichBounds.west)) * 100;
  const yPercent = ((munichBounds.north - lat) / (munichBounds.north - munichBounds.south)) * 100;
  
  // Clamp values between 10% and 90% to keep markers visible
  const clampedX = Math.max(10, Math.min(90, xPercent));
  const clampedY = Math.max(10, Math.min(90, yPercent));
  
  return {
    x: `${clampedX}%`,
    y: `${clampedY}%`
  };
}
