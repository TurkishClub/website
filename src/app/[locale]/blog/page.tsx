import {client} from '@/sanity/lib/client';
import {urlFor} from '@/sanity/lib/image';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/utils';
import {pillClass} from '@/components/home/Pill';
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

  const pageHref = (n: number) => `/blog?page=${n}${sort !== 'newest' ? `&sort=${sort}` : ''}`;

  return (
    <BlogPageClient
      searchQuery={query}
      currentPage={currentPage}
      totalPosts={totalPosts}
    >
      <main className="min-h-screen bg-stone-100 text-ink-950">
        <div className="bg-maroon-950">
          <Navbar tone="dark" />
          <section className="text-white">
            <div className="mx-auto max-w-[90rem] px-4 pb-12 pt-14 md:px-6 md:pb-14 md:pt-20">
              <h1 className="font-serif text-[clamp(3rem,7.5vw,7rem)] font-normal leading-[0.96] tracking-[-0.03em]">
                Blog
              </h1>
              <p className="mt-6 text-lg text-white/75">{totalPosts} yazı</p>
            </div>
          </section>
        </div>

        <section className="mx-auto max-w-[90rem] px-4 pb-24 pt-12 md:px-6 md:pb-32 md:pt-16">
          <BlogSearch />

          <div className="mt-8 border-t border-ink-950/30 pt-8">
            {posts.length === 0 ? (
              <div className="flex flex-col items-center bg-white px-6 py-20 text-center">
                <h2 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-tight">
                  {query ? 'Arama sonucu bulunamadı' : 'Henüz blog yazısı yok'}
                </h2>
                {query && <p className="mt-3 text-lg text-ink-700">Farklı anahtar kelimeler deneyin.</p>}
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post: Post, idx: number) => (
                  <li key={post._id}>
                    <Link
                      href={`/blog/${post.slug.current}`}
                      className="group flex h-full flex-col bg-white transition-shadow duration-200 hover:shadow-[0_24px_60px_-30px_rgb(20_17_17/0.35)]"
                    >
                      {post.image ? (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-200">
                          <Image
                            src={urlFor(post.image).width(720).height(450).url()}
                            alt={post.image.alt || post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            priority={idx === 0}
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[16/10] w-full items-end bg-maroon-950 p-6 md:p-7">
                          <span className="font-serif text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[1.1] tracking-[-0.01em] text-white">
                            {post.title}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-6 md:p-7">
                        {post.categories && post.categories.length > 0 && (
                          <span className="text-sm font-medium text-cardinal-700">{post.categories[0].title}</span>
                        )}
                        <h2
                          className={cn(
                            'mt-2 font-serif text-[1.65rem] font-normal leading-[1.15] tracking-[-0.01em] transition-colors duration-200 group-hover:text-cardinal-700',
                            !post.image && 'sr-only'
                          )}
                        >
                          {post.title}
                        </h2>
                        {post.description && (
                          <p className="mt-3 line-clamp-3 leading-relaxed text-ink-700">{post.description}</p>
                        )}
                        <p className="mt-auto pt-6 text-sm text-ink-500">
                          {[post.publishedAt && formatDate(post.publishedAt), post.author?.name].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {!query && totalPages > 1 && (
              <nav aria-label="Sayfalar" className="mt-16 flex flex-wrap items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link href={pageHref(currentPage - 1)} className={pillClass('outline', 'px-5 py-2.5')}>
                    Önceki
                  </Link>
                )}
                {Array.from({length: totalPages}, (_, i) => i + 1).map((n) => (
                  <Link
                    key={n}
                    href={pageHref(n)}
                    aria-current={n === currentPage ? 'page' : undefined}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors',
                      n === currentPage ? 'bg-ink-950 text-white' : 'text-ink-700 hover:bg-stone-200'
                    )}
                  >
                    {n}
                  </Link>
                ))}
                {hasMore && (
                  <Link href={pageHref(currentPage + 1)} className={pillClass('outline', 'px-5 py-2.5')}>
                    Sonraki
                  </Link>
                )}
              </nav>
            )}

            {query && (
              <p className="mt-10 text-center text-sm text-ink-500">
                &quot;{query}&quot; için {posts.length} sonuç
              </p>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </BlogPageClient>
  );
}
