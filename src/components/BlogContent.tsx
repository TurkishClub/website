'use client';

import { useState, useMemo } from 'react';
import { type SanityDocument } from "next-sanity";
import BlogSearch from "@/components/BlogSearch";
import BlogCard from "@/components/BlogCard";

interface BlogContentProps {
  posts: (SanityDocument & { imageUrl?: string })[];
}

export default function BlogContent({ posts }: BlogContentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter (you can add categories to your Sanity schema)
    if (selectedCategory !== 'all') {
      // For now, this is placeholder - you'd need to add categories to your posts
      // filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Date filter
    if (selectedDate !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (selectedDate) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(post => 
        post.publishedAt && new Date(post.publishedAt) >= filterDate
      );
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publishedAt || 0).getTime() - new Date(b.publishedAt || 0).getTime();
        case 'popular':
          // Placeholder for popularity sorting
          return 0;
        case 'newest':
        default:
          return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
      }
    });

    return filtered;
  }, [posts, searchTerm, selectedCategory, selectedDate, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDate('all');
  };

  return (
    <>
      {/* Search and Filters */}
      <section className="pb-8">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search */}
              <div className="flex-1 w-full">
                <BlogSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-16 md:pb-24 min-h-screen bg-[#C61E1E]">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <>
              {/* Results Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 -mt-8">
                <p className="text-gray-200">
                  Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
                
                {/* Sort Options */}
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white backdrop-blur-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <BlogCard
                    key={post._id}
                    post={post}
                  />
                ))}
              </div>
            </>
          ) : (
            /* No Results */
            <div className="text-center py-16 -mt-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">No articles found</h3>
              <p className="text-gray-200 mb-6">
                {searchTerm ? `No results for "${searchTerm}"` : 'Try adjusting your search or filter criteria'}
              </p>
              <button 
                onClick={clearFilters}
                className="bg-white text-[#C61E1E] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
