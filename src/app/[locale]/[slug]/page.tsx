import {notFound} from 'next/navigation';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import {getBlogPost} from '@/lib/blog';

export default async function PostPage({
  params
}: {
  params: Promise<{slug: string}>;
}) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-[#C61E1E] text-white">
      <Navbar />
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex gap-8">
          <div className="flex-1">
            {/* Read time and Date */}
            <div className="text-center mb-8 pt-8">
              <span className="text-gray-300 text-sm">
                {post.readTime} min read |{' '}
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Tarih belirtilmemiş'}
              </span>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight max-w-4xl mx-auto">
                {post.title}
              </h1>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="w-full mb-12">
                <Image
                  src={post.image}
                  alt={post.title || 'Post image'}
                  className="rounded-lg w-full"
                  width={800}
                  height={450}
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="prose-blog mb-16">
              <div dangerouslySetInnerHTML={{__html: post.content}} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
