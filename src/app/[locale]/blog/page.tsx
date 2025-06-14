import { type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import MobileNavbar from "@/components/MobileNavbar";
import BlogContent from "@/components/BlogContent";

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  image,
  body,
  "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "...",
  "readTime": round(length(pt::text(body)) / 5 / 180 )
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function BlogPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  // Pre-process posts with image URLs
  const processedPosts = posts.map(post => ({
    ...post,
    imageUrl: post.image ? urlFor(post.image)?.width(400).height(250).url() : undefined
  }));

  return (
    <main className="bg-[#C61E1E] text-white min-h-screen">
      <MobileNavbar />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Blog
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Stay updated with the latest news, insights, and stories from the Turkish community.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content with Search and Filtering */}
      <BlogContent posts={processedPosts} />
    </main>
  );
}
