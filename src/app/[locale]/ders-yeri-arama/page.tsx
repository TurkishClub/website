import {Metadata} from 'next';
import {StudyPlaceSearchPage} from '@/components/study-place/StudyPlaceSearchPage';
import {sampleStudyPlaces} from '@/data/sampleStudyPlaces';
import StudySearchClient from './study-search-client';
// import {client} from '@/sanity/lib/client';
// import {groq} from 'next-sanity';
// import type {StudyPlace} from '@/data/studyPlaces';

// Enable ISR with 60 second revalidation
export const revalidate = 120;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: 'en' | 'de' | 'tr'}>;
}): Promise<Metadata> {
  const {locale} = await params;
  
  return {
    title: 'Ders Çalışma Yeri Arama',
    description: 'München\'te ideal ders çalışma yerinizi bulun',
    keywords:
      'ders çalışma, kütüphane, München, Munich, Türk öğrenciler, study place, library, cafe',
    openGraph: {
      title: 'Ders Çalışma Yeri Arama',
      description: 'München\'te ideal ders çalışma yerinizi bulun',
      type: 'website',
      locale: locale
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Ders Çalışma Yeri Arama',
      description: 'München\'te ideal ders çalışma yerinizi bulun'
    }
  };
}

export default async function StudyPlaceSearchPageRoute({
  params
}: {
  params: Promise<{locale: 'en' | 'de' | 'tr'}>;
}) {
  // Params await edilmeli ama locale'i kullanmıyoruz
  await params;
  
  // For now, use sample data. In production, uncomment Sanity query below
  const studyPlaces = sampleStudyPlaces;

  // Optimized Sanity query - fetch only essential data for faster loading
  // const query = groq`*[_type == "studyPlace"] | order(name asc){
  //   _id,
  //   "id": coalesce(id, _id),
  //   name,
  //   address,
  //   whoCanUse,
  //   openingHours,
  //   description,
  //   restrictions,
  //   electricOutlets,
  //   foodOptions,
  //   coordinates,
  //   distanceToGFZ,
  //   distanceToMainCampus,
  //   category,
  //   isQuiet,
  //   hasWifi,
  //   isFree,
  //   images
  // }`;

  // try {
  //   const studyPlaces = await client.fetch<StudyPlace[]>(query);
    return (
      <StudySearchClient>
        <main>
          <StudyPlaceSearchPage studyPlaces={studyPlaces} />
        </main>
      </StudySearchClient>
    );
  // } catch (error) {
  //   console.error('Error fetching study places:', error);
  //   // Return empty array if fetch fails to prevent page crash
  //   return (
  //     <StudySearchClient>
  //       <main>
  //         <StudyPlaceSearchPage studyPlaces={[]} />
  //       </main>
  //     </StudySearchClient>
  //   );
  // }
}