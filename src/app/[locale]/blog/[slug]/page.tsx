import {client} from '@/sanity/lib/client';
import {POST_QUERY} from '@/sanity/lib/queries';
import {ADJACENT_POSTS_QUERY} from '@/sanity/lib/queries';
import {PortableText} from '@portabletext/react';
import {urlFor} from '@/sanity/lib/image';
import {Link} from '@/i18n/navigation';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {BlogSidebar} from '@/components/blog/BlogSidebar';
import {TableOfContents} from '@/components/TableOfContents';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPostClient from './blog-post-client';
import {getImageDimensions} from '@sanity/asset-utils';

// Enable ISR with 60 second revalidation for faster loading
export const revalidate = 60;

// Simple type definitions for individual post
interface BlogPost {
  title: string;
  slug: string;
  publishedAt: string;
  author?: string; // Currently just the author's name, add more fields if needed
  excerpt?: string;
  readTime?: number;
  body: any[]; // PortableText array
  image?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  categories?: Array<{
    title: string;
    slug: string;
  }>;
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

// Custom components for PortableText rendering
const portableTextComponents = {
  types: {
    image: ({value}: any) => {
      if (!value?.asset) return null;
      const {width, height} = getImageDimensions(value);

      // Build the Sanity CDN URL (no forced height → no crop)
      const src = urlFor(value).fit('max').url();

      return (
        <figure className="my-12">
          <Image
            src={src}
            alt={value.alt || 'Blog image'}
            width={Math.round(width)}
            height={Math.round(height)}
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 800px"
            priority={false}
          />
          {value.alt && (
            <figcaption className="mt-3 text-sm text-ink-500">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    }
  },
  block: {
    // Style different heading levels with IDs for TOC
    h1: ({children}: any) => (
      <h1 className="mb-8 mt-16 font-serif text-[clamp(2.25rem,4vw,3.25rem)] font-normal leading-[1.1] tracking-[-0.015em] text-ink-950">
        {children}
      </h1>
    ),
    h2: ({children}: any) => {
      // Extract text content from children (handles complex objects)
      const extractText = (child: any): string => {
        if (typeof child === 'string') return child;
        if (typeof child === 'number') return child.toString();
        if (Array.isArray(child)) return child.map(extractText).join('');
        if (
          child &&
          typeof child === 'object' &&
          child.props &&
          child.props.children
        ) {
          return extractText(child.props.children);
        }
        return '';
      };

      const text = extractText(children);
      const slug =
        text
          .toLowerCase()
          .replace(/[^a-z0-9\u00C0-\u017F]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') || 'section';

      const id = `section-${slug}`;

      return (
        <h2
          id={id}
          className="mb-5 mt-14 scroll-mt-8 font-serif text-[clamp(1.75rem,3vw,2.25rem)] font-normal leading-[1.15] tracking-[-0.01em] text-ink-950"
        >
          {children}
        </h2>
      );
    },
    h3: ({children}: any) => (
      <h3 className="mb-4 mt-10 font-serif text-2xl font-normal text-ink-950">
        {children}
      </h3>
    ),
    h4: ({children}: any) => (
      <h4 className="mb-3 mt-8 text-lg font-semibold text-ink-950">
        {children}
      </h4>
    ),
    // Style normal paragraphs - smaller font size
    normal: ({children}: any) => (
      <p className="mb-6 text-lg leading-[1.75] text-ink-700">{children}</p>
    ),
    // Style blockquotes
    blockquote: ({children}: any) => (
      <blockquote className="my-10 border-l-2 border-cardinal-700 pl-6 font-serif text-2xl leading-snug text-ink-950">
        {children}
      </blockquote>
    )
  },
  // Style lists
  list: {
    bullet: ({children}: any) => (
      <ul className="mb-6 ml-6 list-disc space-y-2 text-lg text-ink-700 marker:text-cardinal-700">
        {children}
      </ul>
    ),
    number: ({children}: any) => (
      <ol className="mb-6 ml-6 list-decimal space-y-2 text-lg text-ink-700 marker:text-cardinal-700">
        {children}
      </ol>
    )
  },
  // Style list items
  listItem: {
    bullet: ({children}: any) => <li className="leading-relaxed">{children}</li>,
    number: ({children}: any) => <li className="leading-relaxed">{children}</li>
  },
  // Style marks (bold, italic, etc.)
  marks: {
    strong: ({children}: any) => (
      <strong className="font-semibold text-ink-950">{children}</strong>
    ),
    em: ({children}: any) => (
      <em className="italic">{children}</em>
    ),
    underline: ({children}: any) => (
      <u className="underline decoration-2 underline-offset-2">{children}</u>
    ),
    code: ({children}: any) => (
      <code className="rounded bg-stone-200 px-1.5 py-0.5 font-mono text-base text-ink-950">
        {children}
      </code>
    ),
    link: ({children, value}: any) => (
      <a
        href={value?.href}
        className="text-cardinal-700 underline decoration-1 underline-offset-4 hover:text-cardinal-800"
        target={value?.blank ? '_blank' : '_self'}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  }
};

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params;

  // Fetch the specific post using your existing query
  const post: BlogPost = await client.fetch(POST_QUERY, { slug: params.slug });
  if (!post) {
    notFound();
  }
  const { previousPost, nextPost } = await client.fetch(ADJACENT_POSTS_QUERY, {
    date: post.publishedAt,
  });

  // Format date
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

  // Calculate estimated reading time
  const calculateReadTime = (body: any[]) => {
    if (!body) return 5;
    const wordsPerMinute = 200;
    const wordCount = JSON.stringify(body).split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readTime = post.readTime || calculateReadTime(post.body);

  // Process author image URL on server side and fix slug structure
  const processedPost = {
    ...post,
    slug: {
      current: post.slug
    },
    author: post.author
      ? {
          name: post.author,
          imageUrl: undefined
        }
      : undefined
  };

  return (
    <BlogPostClient post={processedPost} readTime={readTime}>
      <main className="min-h-screen bg-stone-50 text-ink-950">
        <div className="bg-maroon-950">
          <Navbar tone="dark" />
          <section className="text-white">
            <div className="mx-auto max-w-[90rem] px-4 pb-14 pt-10 md:px-6 md:pb-20 md:pt-14">
              <Link href="/blog" className="text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline">
                ← Blog&apos;a dön
              </Link>
              <h1 className="mt-10 max-w-5xl font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.025em]">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-6 max-w-3xl text-xl leading-relaxed text-white/75">{post.excerpt}</p>
              )}
              <p className="mt-8 text-sm text-white/60">
                {[post.publishedAt && formatDate(post.publishedAt), `${readTime} dk okuma`].filter(Boolean).join(' · ')}
              </p>
            </div>
          </section>
        </div>

        <article>
          {post.image && (
            <div className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-16">
              <div className="relative aspect-video overflow-hidden bg-stone-200">
                <Image
                  src={urlFor(post.image).width(1200).height(675).url()}
                  alt={post.image.alt || post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  priority
                />
              </div>
            </div>
          )}

          <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-12 md:px-6 md:pb-32 md:pt-16">
            <div className="xl:grid xl:grid-cols-[14rem_minmax(0,48rem)_14rem] xl:justify-center xl:gap-12">
              <aside className="hidden xl:block">
                <div className="sticky top-8">
                  <TableOfContents />
                </div>
              </aside>
              <div>
                <PortableText value={post.body || []} components={portableTextComponents} />
                <div className="mt-20">
                  <BlogSidebar post={processedPost} prevPost={previousPost || null} nextPost={nextPost || null} />
                </div>
              </div>
              {/* Mirrors the contents column so the text stays centred. */}
              <div aria-hidden className="hidden xl:block" />
            </div>
          </div>
        </article>

        <Footer />
      </main>
    </BlogPostClient>
  );
}
