import React from 'react';
import BlogCard from './BlogCard';
import { BlogPost } from '@/lib/blog';

interface RecommendedBlogsProps {
  recommendedPosts: BlogPost[];
}

export default function RecommendedBlogs({ recommendedPosts }: RecommendedBlogsProps) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Recommended Blogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendedPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}