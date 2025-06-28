"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Dorm } from "@/data/dorms";
import L from "leaflet";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Fix for default markers in SSR
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface DormMapProps {
  dorms: Dorm[];
  selectedDorm?: Dorm | null;
  onDormSelect?: (dorm: Dorm) => void;
  onScrollToDorm?: (dorm: Dorm) => void;
}

export function DormMapLeaflet({ dorms, selectedDorm, onDormSelect, onScrollToDorm }: DormMapProps) {
  const t = useTranslations("dormSearch");
  const [isMounted, setIsMounted] = useState(false);

  // Ensure the component is mounted before rendering the map
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDormClick = (dorm: Dorm) => {
    if (onDormSelect) {
      onDormSelect(dorm);
    }
  };

  const openInGoogleMaps = (dorm: Dorm) => {
    if (typeof window !== 'undefined') {
      const query = encodeURIComponent(dorm.address);
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const openAllInGoogleMaps = () => {
    if (typeof window !== 'undefined') {
      const munichCenter = "48.1351,11.5820";
      const url = `https://www.google.com/maps/search/student+dormitory+München/@${munichCenter},12z`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Don't render the map on the server
  if (!isMounted) {
    return (
      <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden">
        <div className="p-4 bg-white border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("map.title")}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Harita yükleniyor...
          </p>
        </div>
        <div className="flex-1 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-500">Harita yükleniyor...</div>
        </div>
      </div>
    );
  }

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

      {/* Leaflet Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[48.1351, 11.5820]} // Munich center
          zoom={11}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {dorms.map((dorm) => (
            <Marker
              key={dorm.id}
              position={[dorm.coordinates.lat, dorm.coordinates.lng]}
              eventHandlers={{
                click: () => handleDormClick(dorm),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[250px]">
                  <h4 className="font-semibold text-sm mb-1">{dorm.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{dorm.address}</p>
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-[#C61E1E] text-white text-xs">
                      €{dorm.rent}/ay
                    </Badge>
                    <span className="text-xs text-gray-500">{dorm.waitingTime}</span>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onScrollToDorm && onScrollToDorm(dorm)}
                        className="w-full text-xs bg-[#C61E1E] hover:bg-[#A01818] text-white"
                      >
                        {t("map.popup.moreInfo")}
                      </Button>
                      
                      {dorm.website && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              window.open(dorm.website, "_blank", "noopener,noreferrer");
                            }
                          }}
                          className="w-full text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {t("map.popup.visitWebsite")}
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openInGoogleMaps(dorm)}
                      className="w-full text-xs"
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      {t("map.popup.getDirections")}
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
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
                    €{selectedDorm.rent}/ay
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {selectedDorm.waitingTime}
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
            🗺️ Interaktif Münih haritası - Pin&apos;lere tıklayarak detayları görün
          </p>
        </div>
      </div>
    </div>
  );
}
