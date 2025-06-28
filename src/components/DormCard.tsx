"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Clock, Users, Home } from "lucide-react";
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
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg border-l-4 border-l-[#C61E1E] bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 leading-tight mb-1">
              {dorm.name}
            </CardTitle>
            <p className="text-sm text-gray-600 font-medium">{dorm.organization}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#C61E1E]">
              €{dorm.rent.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">{t("monthly")}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
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
          <h4 className="text-sm font-semibold text-gray-800 mb-2">{t("features")}</h4>
          <div className="flex flex-wrap gap-1">
            {dorm.features.slice(0, 4).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {dorm.features.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{dorm.features.length - 4}
              </Badge>
            )}
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

        {/* Waiting Time */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-gray-700">
            <span className="font-medium">{t("waitingTime")}:</span> {dorm.waitingTime}
          </span>
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
              {showFullDescription ? "Daha az göster" : "Devamını oku"}
            </button>
          )}
        </div>

        {/* Requirements */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">{t("requirements")}</h4>
          <ul className="space-y-1">
            {dorm.requirements.slice(0, 2).map((requirement, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                <span className="text-[#C61E1E] mt-0.5">•</span>
                <span>{requirement}</span>
              </li>
            ))}
            {dorm.requirements.length > 2 && (
              <li className="text-xs text-gray-500">
                +{dorm.requirements.length - 2} koşul daha...
              </li>
            )}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-4 gap-2">
        <Button
          onClick={handleWebsiteClick}
          className="flex-1 bg-[#C61E1E] hover:bg-red-700 text-white"
          size="sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {t("visitWebsite")}
        </Button>
        
        {onViewOnMap && (
          <Button
            onClick={handleViewOnMap}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-[#C61E1E] text-[#C61E1E] hover:bg-[#C61E1E] hover:text-white"
          >
            <MapPin className="w-4 h-4" />
            {t("viewOnMap")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
