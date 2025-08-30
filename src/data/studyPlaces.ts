export interface StudyPlace {
  id: string; // Required for consistency
  _id?: string; // For Sanity data (optional)
  name: string;
  address: string;
  whoCanUse: string; // Kimler kullanabilir
  openingHours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  description: string; // Giden kişi profili, düzen, ses düzeyi, masa genişliği, genelde kaçta doluyor
  restrictions: string; // Kısıtlamalar (kafe ise kahve alman lazım, üye olman lazım ücretsiz/ücretli)
  electricOutlets: boolean; // Elektrik priz durumu
  electricOutletsPercentage?: number; // Prizli yerlerin yüzdesi (varsa)
  foodOptions: string; // Yemek imkânları
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceToGFZ?: number; // minutes
  distanceToMainCampus?: number; // minutes
  category: 'library' | 'cafe' | 'university' | 'coworking' | 'other';
  isQuiet: boolean; // Sessiz mi?
  hasWifi: boolean;
  isFree: boolean; // Ücretsiz mi?
  images?: string[] | Array<{ asset: { _id: string; url: string }; alt?: string }>; // Support both formats
}

export const studyPlaceCategories = [
  'library',
  'cafe', 
  'university',
  'coworking',
  'other'
] as const;

export interface StudyPlaceFilters {
  searchQuery: string;
  category: string;
  isQuietOnly: boolean;
  isFreeOnly: boolean;
  sortBy: string;
}
