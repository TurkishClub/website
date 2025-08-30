import {Metadata} from 'next';
import {StudyPlaceSearchPage} from '@/components/study-place/StudyPlaceSearchPage';
import {getAllStudyPlaces} from '@/lib/studyPlaces';
import StudySearchClient from './study-search-client';

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
  
  // Try to get data from Sanity, fallback to sample data
  const studyPlaces = await getAllStudyPlaces();

  return (
    <StudySearchClient>
      <main>
        <StudyPlaceSearchPage studyPlaces={studyPlaces} />
      </main>
    </StudySearchClient>
  );
}