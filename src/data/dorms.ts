import { client } from "@/sanity/client";

export interface Dorm {
  id: string;
  name: string;
  organization: string;
  address: string;
  rent: number | [number, number]; // single price or price range [min, max]
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

// Sanity query to fetch dorms
const DORMS_QUERY = `*[_type == "dorm"] | order(name asc) {
  _id,
  name,
  organization,
  address,
  rent,
  website,
  coordinates {
    lat,
    lng
  },
  distanceToGFZ,
  distanceToMainCampus,
  description,
  features,
  roomTypes,
  applicationMethod,
  "images": images[].asset->url
}`;

// Interface for Sanity dorm data
interface SanityDorm {
  _id: string;
  name: string;
  organization: string;
  address: string;
  rent: any; // We'll log this to see the actual structure
  website: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceToGFZ: number;
  distanceToMainCampus: number;
  description: string;
  features: string[];
  roomTypes: string[];
  applicationMethod: string;
  images?: string[];
}

// Function to fetch dorms from Sanity
export async function getDormsFromSanity(): Promise<Dorm[]> {
  try {
    const sanityDorms: SanityDorm[] = await client.fetch(DORMS_QUERY);
    
    // Transform Sanity data to match our Dorm interface
    return sanityDorms.map((sanityDorm) => {
      // Handle rent field - can be single number or range
      let rent: number | [number, number];
      
      if (sanityDorm.rent) {
        // If rent is a number directly
        if (typeof sanityDorm.rent === 'number') {
          rent = sanityDorm.rent;
        }
        // If rent is an object with structure
        else if (typeof sanityDorm.rent === 'object' && sanityDorm.rent !== null) {
          if (sanityDorm.rent.type === 'range' && sanityDorm.rent.minPrice && sanityDorm.rent.maxPrice) {
            rent = [sanityDorm.rent.minPrice, sanityDorm.rent.maxPrice];
          } else if (sanityDorm.rent.type === 'single') {
            // For single price, try different field names
            if (sanityDorm.rent.price && typeof sanityDorm.rent.price === 'number') {
              rent = sanityDorm.rent.price;
            } else if (sanityDorm.rent.singlePrice && typeof sanityDorm.rent.singlePrice === 'number') {
              rent = sanityDorm.rent.singlePrice;
            } else if (sanityDorm.rent.minPrice && typeof sanityDorm.rent.minPrice === 'number') {
              rent = sanityDorm.rent.minPrice;
            } else if (sanityDorm.rent.maxPrice && typeof sanityDorm.rent.maxPrice === 'number') {
              rent = sanityDorm.rent.maxPrice;
            } else {
              console.warn('Single price type but no valid price found for', sanityDorm.name);
              rent = 0;
            }
          } else {
            console.warn('Unknown rent structure for', sanityDorm.name, sanityDorm.rent);
            rent = 0;
          }
        } else {
          console.warn('Rent is not a number or object for', sanityDorm.name);
          rent = 0;
        }
      } else {
        console.warn('No rent data for', sanityDorm.name);
        rent = 0; // fallback
      }
      
      return {
        id: sanityDorm._id,
        name: sanityDorm.name,
        organization: sanityDorm.organization,
        address: sanityDorm.address,
        rent: rent,
        website: sanityDorm.website,
        coordinates: sanityDorm.coordinates,
        distanceToGFZ: sanityDorm.distanceToGFZ,
        distanceToMainCampus: sanityDorm.distanceToMainCampus,
        description: sanityDorm.description,
        features: sanityDorm.features || [],
        roomTypes: sanityDorm.roomTypes || [],
        applicationMethod: sanityDorm.applicationMethod,
        images: sanityDorm.images
      };
    });
  } catch (error) {
    console.error('Failed to fetch dorms from Sanity:', error);
    // Return empty array if Sanity fails
    return [];
  }
}

export const dormFeatures = [
  "Stüdyo daireler",
  "WG daireleri", 
  "Kendi mutfağı",
  "Kendi banyosu",
  "Ortak mutfak",
  "Çamaşırhane",
  "WiFi",
  "Spor alanları",
  "Sosyal etkinlikler",
  "Çalışma odaları",
  "Kütüphane",
  "Bisiklet park yeri",
  "Market yakını",
  "Ulaşım kolaylığı"
];

export const locations = [
  "Fröttmaning",
  "Olympiadorf", 
  "Schwabing",
  "Stadtmitte",
  "Freimann",
  "Biederstein",
  "Maxvorstadt",
  "Garching",
  "Freising",
  "Dachau",
  "Planegg",
  "Unterföhring"
];