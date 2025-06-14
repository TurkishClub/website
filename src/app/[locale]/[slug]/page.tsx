import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import MobileNavbar from "@/components/MobileNavbar";
import Image from 'next/image';


const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = await client.fetch<SanityDocument>(POST_QUERY, resolvedParams, options);

  if (!post) {
    notFound();
  }

  const postImageUrl = post.image
    ? urlFor(post.image)?.width(800).height(450).url() // Slightly larger image for better quality
    : null;

  return (
    <main className="bg-[#C61E1E] text-white">
      <MobileNavbar />
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex gap-8">
          
          <div className="flex-1">
            {/* Read time and Date */}
            <div className="text-center mb-8 pt-8">
              <span className="text-gray-300 text-sm">
                10 min read | {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'May 18, 2025'}
              </span>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight max-w-4xl mx-auto">
                {post.title}
              </h1>
            </div>
            
            {/* Description */}
            <div className="text-center mb-12">
              <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
                The best blog is one that captivates readers with engaging, 
                well-researched content presented in a clear and relatable way.
              </p>
            </div>

            {/* Featured Image */}
            {postImageUrl && (
              <div className="w-full mb-12">
                <Image
                  src={postImageUrl}
                  alt={post.title || 'Post image'}
                  className="rounded-lg w-full"
                  width={800}
                  height={450}
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none mb-16">
              {Array.isArray(post.body) && <PortableText value={post.body} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}