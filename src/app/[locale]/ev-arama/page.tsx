import {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {DormSearchPage} from '@/components/dorm/DormSearchPage';
import {client} from '@/sanity/lib/client';
import {groq} from 'next-sanity';
import type {Dorm} from '@/data/dorms';
import DormSearchClient from './dorm-search-client';

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: 'en' | 'de' | 'tr'}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'dormSearch'});

  return {
    title: t('title'),
    description: t('description'),
    keywords:
      'yurt, öğrenci yurdu, München, Munich, Türk öğrenciler, student housing, dormitory',
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description')
    }
  };
}

export default async function EvAramaPage({
  params
}: {
  params: Promise<{locale: 'en' | 'de' | 'tr'}>;
}) {
  // Params await edilmeli ama locale'i kullanmıyoruz
  await params;
  // Optimized Sanity query - fetch only essential data for faster loading
  const query = groq`*[_type == "dorm"] | order(name asc){
    _id,
    "id": coalesce(id, _id),
    name,
    organization,
    address,
    rent,
    website,
    coordinates,
    distanceToGFZ,
    distanceToMainCampus,
    description,
    features,
    roomTypes,
    applicationMethod
  }`;

  try {
    const dorms = await client.fetch<Dorm[]>(query);
    return (
      <DormSearchClient>
        <main>
          <DormSearchPage dorms={dorms} />
        </main>
      </DormSearchClient>
    );
  } catch (error) {
    console.error('Error fetching dorms:', error);
    // Return empty array if fetch fails to prevent page crash
    return (
      <DormSearchClient>
        <main>
          <DormSearchPage dorms={[]} />
        </main>
      </DormSearchClient>
    );
  }
}
