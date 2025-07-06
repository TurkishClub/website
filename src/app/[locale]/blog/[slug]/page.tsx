import { client } from '@/sanity/lib/client'
import { POST_QUERY } from '@/sanity/lib/queries'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// Simple type definitions for individual post
interface BlogPost {
    title: string
    body: any[] // PortableText array
    image?: {
        asset: {
            _id: string
            url: string
        }
        alt?: string
    }
}

interface BlogPostPageProps {
    params: {
        slug: string
        locale: string
    }
}

// Custom components for PortableText rendering
const portableTextComponents = {
    block: {
        // Style different heading levels
        h1: ({ children }: any) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
        ),
        h2: ({ children }: any) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">{children}</h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-xl font-medium mt-5 mb-2 text-gray-700">{children}</h3>
        ),
        h4: ({ children }: any) => (
            <h4 className="text-lg font-medium mt-4 mb-2 text-gray-700">{children}</h4>
        ),
        // Style normal paragraphs
        normal: ({ children }: any) => (
            <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
        ),
        // Style blockquotes
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600">
                {children}
            </blockquote>
        ),
    },
    // Style lists
    list: {
        bullet: ({ children }: any) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>
        ),
        number: ({ children }: any) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>
        ),
    },
    // Style list items
    listItem: {
        bullet: ({ children }: any) => <li className="ml-4">{children}</li>,
        number: ({ children }: any) => <li className="ml-4">{children}</li>,
    },
    // Style marks (bold, italic, etc.)
    marks: {
        strong: ({ children }: any) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
        ),
        em: ({ children }: any) => (
            <em className="italic text-gray-800">{children}</em>
        ),
        code: ({ children }: any) => (
            <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">
                {children}
            </code>
        ),
    },
}

export default async function BlogPostPage(props: BlogPostPageProps) {
    const params = await props.params

    // Fetch the specific post using your existing query
    const post: BlogPost = await client.fetch(POST_QUERY, { slug: params.slug })

    console.log('Post data:', post)
    if (post.image) {
        console.log('Image URL:', urlFor(post.image).width(400).height(200).url())
    }

    if (!post) {
        notFound()
    }

    return (
        <article className="container mx-auto px-4 py-8 max-w-4xl">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-6 text-gray-900">{post.title}</h1>

                {post.image ? (
                    <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={urlFor(post.image).width(800).height(400).url()}
                            alt={post.image.alt || post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                ) : (
                    <div className="w-full h-96 mb-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">No image available</p>
                    </div>
                )}
            </header>

            <div className="prose prose-lg max-w-none">
                <PortableText
                    value={post.body || []}
                    components={portableTextComponents}
                />
            </div>
        </article>
    )
}