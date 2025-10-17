import React from 'react';
import TeamPageClient from './team-client';
import TeamAnalyticsClient from './team-analytics-client';

export default async function TeamPage() {
  try {
    return (
      <TeamAnalyticsClient totalPositions={0}>
        <TeamPageClient />
      </TeamAnalyticsClient>
    );
  } catch (error) {
    console.error('Error fetching job positions:', error);
    // Return empty array if fetch fails to prevent page crash
    return (
      <TeamAnalyticsClient totalPositions={0}>
        <TeamPageClient />
      </TeamAnalyticsClient>
    );
  }
}
