import { client } from "@/sanity/client";

export interface Dorm {
  id: string;
  name: string;
  organization: string;
  address: string;
  rent: {
    type: 'single' | 'range';
    singlePrice: number;
    minPrice: number;
    maxPrice: number;
  };
  website: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceToGFZ: number; // minutes
  distanceToMainCampus: number; // minutes
  description: string;
  features: string[];
  roomTypes: string[];
  applicationMethod: string;
  images?: string[];
}

export const dormFeatures = [
  'Stüdyo daireler',
  'WG daireleri',
  'Kendi mutfağı',
  'Kendi banyosu',
  'Ortak mutfak',
  'Çamaşırhane',
  'WiFi',
  'Spor alanları',
  'Sosyal etkinlikler',
  'Çalışma odaları',
  'Kütüphane',
  'Bisiklet park yeri',
  'Market yakını',
  'Ulaşım kolaylığı'
];

export const locations = [
  'Fröttmaning',
  'Olympiadorf',
  'Schwabing',
  'Stadtmitte',
  'Freimann',
  'Biederstein',
  'Maxvorstadt'
];