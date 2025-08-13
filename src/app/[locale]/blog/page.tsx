import {client} from '@/sanity/lib/client';
import {urlFor} from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import BlogPageClient from './blog-client';

import {BlogSearch} from '@/components/blog/BlogSearch';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Enhanced type definitions for our minimal queries
interface Post {
  _id: string;
  title: string;
  slug: {current: string};
  publishedAt?: string;
  description?: string;
  readTime?: number;
  author?: {
    name: string;
  };
  categories?: Array<{
    title: string;
    slug: string;
  }>;
  image?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
}

// Enable ISR with 60 second revalidation for faster loading
export const revalidate = 60;

interface BlogPageProps {
  searchParams?: Promise<{
    query?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function BlogPage({searchParams}: BlogPageProps) {
  // Fetch posts from Sanity using optimized query with pagination
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query?.trim() || '';
  const sort = resolvedSearchParams?.sort || 'newest';
  const currentPage = parseInt(resolvedSearchParams?.page || '1', 10);
  const postsPerPage = 12;
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;

  // Build dynamic GROQ with server-side filtering/sorting for efficiency
  const sortExpr =
    sort === 'oldest'
      ? 'publishedAt asc'
      : sort === 'alphabetical'
        ? 'title asc'
        : 'publishedAt desc';

  const whereSearch = query
    ? '&& (title match $q || pt::text(body) match $q)'
    : '';

  // Optimized query - fetch only essential data
  const groq = `*[_type == "post" && defined(slug.current) ${whereSearch}] | order(${sortExpr})[${startIndex}...${endIndex}]{
    _id,
    title,
    slug,
    publishedAt,
    "description": pt::text(body)[0..120],
    "image": coalesce(mainImage, image){
      asset->{
        _id,
        url
      },
      alt
    },
    "readTime": 5,
    author->{
      name
    },
    categories[]->{
      title,
      "slug": slug.current
    }
  }`;

  // Also get total count for pagination
  const countQuery = `count(*[_type == "post" && defined(slug.current) ${whereSearch}])`;

  const [posts, totalPosts]: [Post[], number] = await Promise.all([
    client.fetch(groq, query ? {q: `${query}*`} : {}),
    client.fetch(countQuery, query ? {q: `${query}*`} : {})
  ]);

  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const hasMore = currentPage < totalPages;

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <BlogPageClient
      searchQuery={query}
      currentPage={currentPage}
      totalPosts={totalPosts}
    >
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {/* Blog Content */}
        <div className="w-full max-w-none px-4 py-16">
          <div className="w-[80%] mx-auto">
            {/* Header with Search and Filters */}
            <div className="mb-12">
              <div className="flex flex-col gap-8 mb-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-4xl lg:text-4xl font-light text-gray-900 mb-2">
                    Blog Yazılarımız
                  </h2>
                </div>

                {/* Search and Filter Controls */}
                <div className="flex justify-center lg:justify-start">
                  <BlogSearch />
                </div>
              </div>
            </div>

            {/* Blog Posts Grid */}
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-lg shadow-sm p-12 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {query
                      ? 'Arama sonucu bulunamadı'
                      : 'Henüz blog yazısı yok'}
                  </h3>
                  <p className="text-gray-600">
                    {query
                      ? 'Farklı anahtar kelimeler deneyin.'
                      : "Sanity Studio'da yeni yazılar oluşturun!"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post: Post, idx: number) => (
                  <Card
                    key={post._id}
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-md"
                  >
                    {post.image ? (
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        <Image
                          src={urlFor(post.image).width(400).height(240).url()}
                          alt={post.image.alt || post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                          priority={idx === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-gradient-to-br from-[#C61E1E] to-red-600 flex items-center justify-center rounded-t-lg">
                        <div className="text-center text-white">
                          <h3 className="text-lg font-semibold mb-1">
                            Turkish Club
                          </h3>
                          <p className="text-sm opacity-90">Munich</p>
                        </div>
                      </div>
                    )}

                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        {post.categories && post.categories.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {post.categories[0].title}
                          </Badge>
                        )}
                        {post.readTime && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {post.readTime} dk
                          </div>
                        )}
                      </div>

                      <CardTitle className="text-lg leading-tight group-hover:text-[#C61E1E] transition-colors">
                        <Link href={`/blog/${post.slug.current}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {post.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {post.publishedAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(post.publishedAt)}
                            </div>
                          )}
                          {post.author && <span>{post.author.name}</span>}
                        </div>

                        <Link href={`/blog/${post.slug.current}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#C61E1E] hover:text-red-700 hover:bg-red-50 p-1"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!query && totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16 mb-8">
                <Link
                  href={
                    currentPage > 1
                      ? `/blog?page=${currentPage - 1}${sort !== 'newest' ? `&sort=${sort}` : ''}`
                      : '#'
                  }
                  className={currentPage > 1 ? '' : 'pointer-events-none'}
                >
                  <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Önceki
                  </Button>
                </Link>

                <div className="flex items-center gap-2">
                  {Array.from({length: Math.min(totalPages, 5)}, (_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <Link
                        key={pageNum}
                        href={`/blog?page=${pageNum}${sort !== 'newest' ? `&sort=${sort}` : ''}`}
                      >
                        <Button
                          variant={isActive ? 'default' : 'outline'}
                          size="sm"
                          className={
                            isActive ? 'bg-[#C61E1E] hover:bg-red-700' : ''
                          }
                        >
                          {pageNum}
                        </Button>
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href={
                    hasMore
                      ? `/blog?page=${currentPage + 1}${sort !== 'newest' ? `&sort=${sort}` : ''}`
                      : '#'
                  }
                  className={hasMore ? '' : 'pointer-events-none'}
                >
                  <Button
                    variant="outline"
                    disabled={!hasMore}
                    className="flex items-center gap-2"
                  >
                    Sonraki
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Results count */}
            <div className="text-center text-gray-600 text-sm mb-8 mt-8 ">
              {query ? (
                <p>
                  &quot;{query}&quot; için {posts.length} sonuç bulundu
                </p>
              ) : (
                <p>
                  {totalPosts} toplam yazı • Sayfa {currentPage} / {totalPages}
                </p>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </BlogPageClient>
  );
}
