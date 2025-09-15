import { client } from '@/sanity/lib/client';
import { DORMS_QUERY } from '@/sanity/lib/queries';
import { Dorm } from '@/data/dorms';

export async function getAllDorms(): Promise<Dorm[]> {
    try {
        // Try to fetch from Sanity first
        const dorms = await client.fetch(DORMS_QUERY);

        // If we have data from Sanity, use it
        if (dorms && dorms.length >= 0) {
            return dorms.map(transformSanityDorm);
        }

        // Fallback to sample data
        return [];
    } catch (error) {
        console.error('❌ Error fetching dorms from Sanity:', error);
        // Fallback to sample data on error
        return [];
    }
}

// Transform Sanity data to match our Dorm interface
function transformSanityDorm(sanityDorm: any): Dorm {
    // Ensure id/_id exist while preserving all other fields from Sanity
    return {
        ...sanityDorm,
        id: sanityDorm._id,
        _id: sanityDorm._id,
    } as Dorm;
}

// Utility function to get a unique identifier for a dorm
export function getDormId(dorm: Dorm): string {
    return dorm.id;
}
