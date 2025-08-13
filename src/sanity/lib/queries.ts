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
