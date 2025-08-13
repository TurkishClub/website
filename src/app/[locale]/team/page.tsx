import React from 'react';
import {client} from '@/sanity/lib/client';
import type {SanityDocument} from 'next-sanity';
import TeamPageClient from './team-client';
import TeamAnalyticsClient from './team-analytics-client';

// Enable ISR with 60 second revalidation for faster loading
export const revalidate = 60;

// Optimized query - fetch only essential fields for better performance
const POSITIONS_QUERY = `*[_type == "jobPosition"] | order(_createdAt desc) {
  _id,
  title,
  department,
  type,
  location,
  "summary": coalesce(summary, description[0..150] + "..."),
  description,
  requirements[0..5],
  responsibilities[0..5],
  benefits[0..3]
}`;

export default async function TeamPage() {
  try {
    const positions = await client.fetch<SanityDocument[]>(POSITIONS_QUERY);
    return (
      <TeamAnalyticsClient totalPositions={positions.length}>
        <TeamPageClient positions={positions} />
      </TeamAnalyticsClient>
    );
  } catch (error) {
    console.error('Error fetching job positions:', error);
    // Return empty array if fetch fails to prevent page crash
    return (
      <TeamAnalyticsClient totalPositions={0}>
        <TeamPageClient positions={[]} />
      </TeamAnalyticsClient>
    );
  }
}
