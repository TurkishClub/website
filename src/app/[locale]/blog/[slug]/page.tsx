import {client} from '@/sanity/lib/client';
import {POST_QUERY} from '@/sanity/lib/queries';
import {PortableText} from '@portabletext/react';
import {urlFor} from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, Calendar, Clock} from 'lucide-react';
import {BlogSidebar} from '@/components/blog/BlogSidebar';
import {TableOfContents} from '@/components/TableOfContents';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPostClient from './blog-post-client';

// Enable ISR with 60 second revalidation for faster loading
export const revalidate = 60;

// Simple type definitions for individual post
interface BlogPost {
  title: string;
  slug: string;
  publishedAt: string;
  author?: {
    name: string;
    image?: any;
  };
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
  block: {
    // Style different heading levels with IDs for TOC
    h1: ({children}: any) => (
      <h1 className="text-5xl font-bold mt-20 mb-10 text-gray-900 border-b border-gray-200 pb-6">
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
          className="text-2xl font-semibold mt-12 mb-6 text-gray-800 scroll-mt-8"
        >
          {children}
        </h2>
      );
    },
    h3: ({children}: any) => (
      <h3 className="text-xl font-medium mt-8 mb-4 text-gray-700">
        {children}
      </h3>
    ),
    h4: ({children}: any) => (
      <h4 className="text-lg font-medium mt-6 mb-3 text-gray-700">
        {children}
      </h4>
    ),
    // Style normal paragraphs - smaller font size
    normal: ({children}: any) => (
      <p className="mb-6 text-gray-700 leading-relaxed text-lg">{children}</p>
    ),
    // Style blockquotes
    blockquote: ({children}: any) => (
      <blockquote className="border-l-4 border-[#C61E1E] bg-red-50 pl-6 pr-4 py-4 italic my-8 text-gray-700 rounded-r-lg text-lg">
        {children}
      </blockquote>
    )
  },
  // Style lists
  list: {
    bullet: ({children}: any) => (
      <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-700 text-lg">
        {children}
      </ul>
    ),
    number: ({children}: any) => (
      <ol className="list-decimal ml-6 mb-6 space-y-2 text-gray-700 text-lg">
        {children}
      </ol>
    )
  },
  // Style list items
  listItem: {
    bullet: ({children}: any) => <li className="leading-loose">{children}</li>,
    number: ({children}: any) => <li className="leading-loose">{children}</li>
  },
  // Style marks (bold, italic, etc.)
  marks: {
    strong: ({children}: any) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({children}: any) => (
      <em className="italic text-gray-800">{children}</em>
    ),
    code: ({children}: any) => (
      <code className="bg-gray-100 text-[#C61E1E] px-2 py-1 rounded text-base font-mono border">
        {children}
      </code>
    ),
    link: ({children, value}: any) => (
      <a
        href={value?.href}
        className="text-[#C61E1E] hover:text-red-700 underline decoration-2 underline-offset-4"
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
  const post: BlogPost = await client.fetch(POST_QUERY, {slug: params.slug});

  if (!post) {
    notFound();
  }

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
          ...post.author,
          imageUrl: post.author.image
            ? urlFor(post.author.image).width(48).height(48).url()
            : undefined
        }
      : undefined
  };

  return (
    <BlogPostClient post={processedPost} readTime={readTime}>
      <div
        className="min-h-screen bg-[#C61E1E] text-white"
        style={{scrollBehavior: 'smooth'}}
      >
        <Navbar />

        {/* Hero Section */}
        <div className="bg-[#C61E1E] text-white">
          <div className="container mx-auto px-4 py-24">
            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-12 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-lg">Blog&apos;a Dön</span>
            </Link>

            {/* Article Header */}
            <div className="max-w-6xl mx-auto">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-8 text-white/80 text-lg">
                {post.publishedAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span>{readTime} dakika okuma</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="bg-white">
          {/* Featured Image */}
          {post.image ? (
            <div className="relative mt-16 mb-16">
              <div className="max-w-6xl mx-auto px-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src={urlFor(post.image).width(1200).height(675).url()}
                    alt={post.image.alt || post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-20" />
          )}

          {/* Article Body with TOC */}
          <div className="max-w-7xl mx-auto px-4 pb-24">
            {/* Desktop Layout */}
            <div className="hidden xl:flex gap-8 items-start">
              {/* Table of Contents - Left Sidebar */}
              <div className="w-64 sticky top-8">
                <TableOfContents />
              </div>

              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                <div className="prose prose-lg max-w-none">
                  <PortableText
                    value={post.body || []}
                    components={portableTextComponents}
                  />
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="xl:hidden">
              <div className="prose prose-lg max-w-none">
                <PortableText
                  value={post.body || []}
                  components={portableTextComponents}
                />
              </div>
            </div>

            {/* Sidebar - Below Content */}
            <div className="hidden xl:flex gap-8 items-start mt-20">
              <div className="w-64 flex-shrink-0">
                {/* Empty space to align with TOC */}
              </div>
              <div className="flex-1 max-w-4xl">
                <BlogSidebar post={processedPost} />
              </div>
            </div>

            {/* Mobile/Tablet Sidebar */}
            <div className="xl:hidden mt-20">
              <BlogSidebar post={processedPost} />
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </BlogPostClient>
  );
}
