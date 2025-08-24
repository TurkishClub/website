export interface Dorm {
  id: string;
  name: string;
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
  roomTypes: string[];
  images?: string[];
}

export const locations = [
  'Fröttmaning',
  'Olympiadorf',
  'Schwabing',
  'Stadtmitte',
  'Freimann',
  'Biederstein',
  'Maxvorstadt'
];