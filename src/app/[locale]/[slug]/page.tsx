import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import { Link } from '@/i18n/navigation'; // UPDATED: Use locale-aware Link
import { notFound } from "next/navigation";

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
    <main className="bg-[#C61E1E] text-white flex-1 py-8 md:py-12"> {/* UPDATED: Styling for main area */}
      <div className="container mx-auto max-w-3xl px-4 md:px-6 lg:px-8 flex flex-col gap-6 md:gap-8"> {/* UPDATED: Content container */}
        <Link href="/" className="text-gray-200 hover:text-white hover:underline self-start text-sm md:text-base">
          ← Back to posts
        </Link>
        {postImageUrl && (
          <div className="w-full">
            <img
              src={postImageUrl}
              alt={post.title || 'Post image'}
              className="aspect-video rounded-lg object-cover w-full shadow-xl" // UPDATED: Enhanced image styling
              width="800" // Corresponds to urlFor width
              height="450" // Corresponds to urlFor height
            />
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold !leading-tight mt-2"> {/* UPDATED: Title styling */}
          {post.title}
        </h1>
        <div className="prose prose-invert max-w-none text-base md:text-lg lg:text-xl"> {/* UPDATED: Prose styling */}
          {post.publishedAt && (
            <p className="text-sm text-gray-300 !mt-0 !mb-4"> {/* Ensure date is styled distinctly */}
              Published: {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          )}
          {Array.isArray(post.body) && <PortableText value={post.body} />}
        </div>
      </div>
    </main>
  );
}