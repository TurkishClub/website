"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Users, Home } from "lucide-react";
import { Dorm } from "@/data/dorms";

interface DormCardProps {
  dorm: Dorm;
  onViewOnMap?: (dorm: Dorm) => void;
}

export function DormCard({ dorm, onViewOnMap }: DormCardProps) {
  const t = useTranslations("dormSearch.card");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleViewOnMap = () => {
    if (onViewOnMap) {
      onViewOnMap(dorm);
    }
  };

  const handleWebsiteClick = () => {
    if (typeof window !== 'undefined') {
      window.open(dorm.website, "_blank", "noopener,noreferrer");
    }
  };

  const truncatedDescription = dorm.description.length > 200 
    ? dorm.description.substring(0, 200) + "..."
    : dorm.description;

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 leading-tight mb-1">
              {dorm.name}
            </CardTitle>
            <p className="text-sm text-gray-600 font-medium">{dorm.organization}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pb-2">
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="text-right">
            <div className="text-lg font-bold text-[#C61E1E]">
              €{Math.floor(dorm.rent / 100) * 100} - €{(Math.floor(dorm.rent / 100) + 1) * 100} <span className="text-sm text-gray-500 font-normal">aylık tahmini</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-700">{dorm.address}</span>
        </div>

        {/* University Distances */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Home className="w-3 h-3 text-[#C61E1E]" />
            <span className="font-medium">{t("university.gfz")}:</span>
            <span>{dorm.distanceToGFZ} {t("university.minutes")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Home className="w-3 h-3 text-green-500" />
            <span className="font-medium">{t("university.mainCampus")}:</span>
            <span>{dorm.distanceToMainCampus} {t("university.minutes")}</span>
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-1">{t("features")}</h4>
          <div className="flex flex-wrap gap-1">
            {dorm.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs py-0">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Room Types */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {dorm.roomTypes.join(", ")}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {showFullDescription ? dorm.description : truncatedDescription}
          </p>
          {dorm.description.length > 200 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-[#C61E1E] hover:text-red-700 text-sm font-medium mt-1"
            >
              {showFullDescription ? t("showLess") : t("readMore")}
            </button>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            onClick={handleWebsiteClick}
            className="bg-[#C61E1E] hover:bg-red-700 text-white text-xs py-1.5 h-auto"
            size="sm"
          >
            <ExternalLink className="w-3 h-3 mr-1.5 flex-shrink-0" />
            <span className="truncate">{t("visitWebsite")}</span>
          </Button>
          
          <Button
            onClick={handleViewOnMap}
            variant="outline"
            size="sm"
            className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 text-xs py-1.5 h-auto"
          >
            <MapPin className="w-3 h-3 mr-1.5 flex-shrink-0" />
            <span className="truncate">{t("viewOnMap")}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
