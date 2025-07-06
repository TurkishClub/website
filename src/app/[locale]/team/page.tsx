import React from 'react';
import { client } from "@/sanity/lib/client";
import type { SanityDocument } from "next-sanity";
import TeamPageClient from "./team-client";

const POSITIONS_QUERY = `*[_type == "jobPosition"] | order(_createdAt desc) {
  _id,
  title,
  department,
  type,
  location,
  summary,
  description,
  requirements,
  responsibilities,
  benefits
}`;

const options = { next: { revalidate: 30 } };

export default async function TeamPage() {
  const positions = await client.fetch<SanityDocument[]>(POSITIONS_QUERY, {}, options);

  return <TeamPageClient positions={positions} />;
}
