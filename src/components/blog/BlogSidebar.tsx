'use client';

import {User} from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface BlogSidebarProps {
  post: {
    title: string;
    slug: string | { current: string }; 
    categories?: Array<{
      title: string;
      slug: string;
    }>;
    author?: {
      name: string;
      imageUrl?: string; // Pre-processed image URL
    };
  };
  prevPost?: { title: string; slug: string } | null;
  nextPost?: { title: string; slug: string } | null;
}

export function BlogSidebar({post, prevPost, nextPost}: BlogSidebarProps) {
    const slug =
    typeof post.slug === 'string' ? post.slug : post.slug?.current || '';
    const params = useParams();
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Kategoriler</h3>
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <span
                  key={category.slug}
                  className="bg-[#C61E1E] text-white px-3 py-1 rounded-full text-sm"
                >
                  {category.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Info */}
        {post.author && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Yazar</h3>
            <div className="flex items-center gap-3">
              {post.author.imageUrl ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={post.author.imageUrl}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-[#C61E1E] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{post.author.name}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {(prevPost || nextPost) && (
        <div className="flex justify-between mt-8">
          {prevPost ? (
            <Link
              href={`/${params.locale}/blog/${prevPost.slug}`}   // ✅ include locale and /blog
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← {prevPost.title}
            </Link>
          ) : (
            <div />
          )}
          {nextPost && (
            <Link
              href={`/${params.locale}/blog/${nextPost.slug}`}   // ✅ same here
              className="bg-[#C61E1E] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              {nextPost.title} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
