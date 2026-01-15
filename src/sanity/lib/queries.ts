import { defineQuery } from 'next-sanity';

export const POSTS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current)][0...12]{
  _id,
  title,
  slug,
  "description": pt::text(body)[0..160],
  "image": coalesce(mainImage, image)
}`);

export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  publishedAt,
  body,
  excerpt,
  "readTime": 5,
  "image": coalesce(mainImage, image){
    asset->{
      _id,
      url
    },
    alt
  },
  author,
  categories[]->{
    title,
    "slug": slug.current
  }
}`);


export const ADJACENT_POSTS_QUERY = defineQuery(`{
  "previousPost": *[
    _type == "post" &&
    defined(slug.current) &&
    publishedAt < $date
  ] | order(publishedAt desc)[0]{
    title,
    "slug": slug.current
  },

  "nextPost": *[
    _type == "post" &&
    defined(slug.current) &&
    publishedAt > $date
  ] | order(publishedAt asc)[0]{
    title,
    "slug": slug.current
  }
}`);


export const STUDY_PLACES_QUERY =
  defineQuery(`*[_type == "studyPlace"]{
  _id,
  name,
  address,
  whoCanUse,
  openingHours,
  description,
  restrictions,
  electricOutlets,
  electricOutletsPercentage,
  foodOptions,
  coordinates,
  distanceToGFZ,
  distanceToMainCampus,
  category,
  isQuiet,
  hasWifi,
  isFree,
  "images": images[]{
    asset->{
      _id,
      url
    },
    alt
  }
}`);

export const STUDY_PLACE_QUERY =
  defineQuery(`*[_type == "studyPlace" && _id == $id][0]{
  _id,
  name,
  address,
  whoCanUse,
  openingHours,
  description,
  restrictions,
  electricOutlets,
  electricOutletsPercentage,
  foodOptions,
  coordinates,
  distanceToGFZ,
  distanceToMainCampus,
  category,
  isQuiet,
  hasWifi,
  isFree,
  "images": images[]{
    asset->{
      _id,
      url
    },
    alt
  }
}`);

export const DORM_QUERY =
  defineQuery(`*[_type == "dorm" && id == $id][0]{
  _id,
  "id": coalesce(id, _id),
  name,
  address,
  rent,
  website,
  coordinates,
  distanceToGFZ,
  distanceToMainCampus,
  description,
  roomTypes,
}`);

export const DORMS_QUERY =
  defineQuery(`*[_type == "dorm"]{
  _id,
  "id": coalesce(id, _id),
  name,
  address,
  rent,
  website,
  coordinates,
  distanceToGFZ,
  distanceToMainCampus,
  description,
  roomTypes,
}`);

export const HIGHLIGHT_CARDS_QUERY =
  defineQuery(`*[_type == "highlightCard"]{
  _id,
  title,
  type,
  description,
  link,
  "image": image{
    asset->{
      _id,
      url
    },
    alt,
    hotspot
  }
}`);

export const HIGHLIGHT_CARD_QUERY =
  defineQuery(`*[_type == "highlightCard" && _id == $id][0]{
  _id,
  title,
  type,
  description,
  link,
  "image": image{
    asset->{
      _id,
      url
    },
    alt,
    hotspot
  }
}`);

export const GALLERIES_QUERY =
  defineQuery(`*[_type == "gallery"]{
  _id,
  title,
  "image": image{
    asset->{
      _id,
      url
    },
    alt,
    hotspot
  }
}`);

export const GALLERY_QUERY =
  defineQuery(`*[_type == "gallery" && _id == $id][0]{
  _id,
  title,
  "image": image{
    asset->{
      _id,
      url
    },
    alt,
    hotspot
  }
}`);

export const NEXT_EVENT_QUERY =
  defineQuery(`*[_type == "event" && time > now()] | order(time asc)[0]{
  _id,
  name,
  embedUrl,
  time,
  location
}`);

export const PAST_EVENTS_QUERY =
  defineQuery(`*[_type == "event" && time < now()] | order(time desc){
  _id,
  name,
  embedUrl,
  time,
  location,
  description,
  "image": image{
    asset->{
      _id,
      url
    },
    alt,
    hotspot
  }
}`);