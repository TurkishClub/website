import {defineQuery} from 'next-sanity';

export const POSTS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current)][0...12]{
  _id,
  title,
  slug,
  "description": pt::text(body)[0..160],
  "image": coalesce(mainImage, image)
}`);

export const POST_QUERY =
  defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  title,
  slug,
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
  author->{
    name,
    image
  },
  categories[]->{
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