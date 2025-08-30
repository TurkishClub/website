import { client } from '@/sanity/lib/client';
import { STUDY_PLACES_QUERY, STUDY_PLACE_QUERY } from '@/sanity/lib/queries';
import { StudyPlace } from '@/data/studyPlaces';
import { sampleStudyPlaces } from '@/data/sampleStudyPlaces';

export async function getAllStudyPlaces(): Promise<StudyPlace[]> {
  try {
    // Try to fetch from Sanity first
    const studyPlaces = await client.fetch(STUDY_PLACES_QUERY);
    
    // If we have data from Sanity, use it
    if (studyPlaces && studyPlaces.length >= 0) {
      console.log(`✅ Using Sanity data: Found ${studyPlaces.length} study places`);
      return studyPlaces.map(transformSanityStudyPlace);
    }
    
    console.log('⚠️ No data found in Sanity, using sample data');
    // Fallback to sample data
    return sampleStudyPlaces;
  } catch (error) {
    console.error('❌ Error fetching study places from Sanity:', error);
    console.log('⚠️ Falling back to sample data');
    // Fallback to sample data on error
    return sampleStudyPlaces;
  }
}

export async function getStudyPlaceById(id: string): Promise<StudyPlace | null> {
  try {
    // Try to fetch from Sanity first
    const studyPlace = await client.fetch(STUDY_PLACE_QUERY, { id });
    
    if (studyPlace) {
      return transformSanityStudyPlace(studyPlace);
    }
    
    // Fallback to sample data
    const samplePlace = sampleStudyPlaces.find(place => place.id === id);
    return samplePlace || null;
  } catch (error) {
    console.error('Error fetching study place from Sanity:', error);
    // Fallback to sample data on error
    const samplePlace = sampleStudyPlaces.find(place => place.id === id);
    return samplePlace || null;
  }
}

// Transform Sanity data to match our StudyPlace interface
function transformSanityStudyPlace(sanityPlace: any): StudyPlace {
  return {
    id: sanityPlace._id, // Use _id as the primary id
    _id: sanityPlace._id,
    name: sanityPlace.name,
    address: sanityPlace.address,
    whoCanUse: sanityPlace.whoCanUse,
    openingHours: sanityPlace.openingHours || {},
    description: sanityPlace.description,
    restrictions: sanityPlace.restrictions,
    electricOutlets: sanityPlace.electricOutlets || false,
    electricOutletsPercentage: sanityPlace.electricOutletsPercentage,
    foodOptions: sanityPlace.foodOptions,
    coordinates: sanityPlace.coordinates,
    distanceToGFZ: sanityPlace.distanceToGFZ,
    distanceToMainCampus: sanityPlace.distanceToMainCampus,
    category: sanityPlace.category,
    isQuiet: sanityPlace.isQuiet || false,
    hasWifi: sanityPlace.hasWifi || true,
    isFree: sanityPlace.isFree || true,
    images: sanityPlace.images || []
  };
}

// Utility function to get a unique identifier for a study place
export function getStudyPlaceId(studyPlace: StudyPlace): string {
  return studyPlace.id;
}
