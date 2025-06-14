import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import type { SanityDocument } from "next-sanity";

interface BlogCardProps {
  post: SanityDocument & { imageUrl?: string };
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 group">
      {/* Image */}
      {post.imageUrl && (
        <div className="aspect-video overflow-hidden relative">
          <Image
            src={post.imageUrl}
            alt={post.title || 'Post image'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          )}
          {post.readTime && (
            <>
              <span>•</span>
              <span>{post.readTime} min read</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-gray-100 transition-colors">
          <Link href={`/${post.slug?.current}`} className="block">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-200 text-sm leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Read More */}
        <Link
          href={`/${post.slug?.current}`}
          className="inline-flex items-center text-white font-medium hover:underline group"
        >
          Read More
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
