import { client } from '@/sanity/lib/client'
import { POSTS_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'

// Enhanced type definitions for our minimal queries
interface Post {
  _id: string
  title: string
  slug: { current: string }
  image?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
}

// This tells Next.js to regenerate the page periodically
export const revalidate = 60

export default async function BlogPage() {
  // Fetch posts from Sanity using your existing query
  const posts: Post[] = await client.fetch(POSTS_QUERY)


  posts.forEach(post => {
    if (post.image) {
      console.log('Image URL:', urlFor(post.image).width(400).height(200).url())
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      
      {posts.length === 0 ? (
        <p className="text-gray-600">No blog posts found. Create some posts in your Sanity Studio!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {post.image ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={urlFor(post.image).width(400).height(200).url()}
                    alt={post.image.alt || post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No image</p>
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  <Link 
                    href={`/blog/${post.slug.current}`}
                    className="text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm">
                  Click to read more about {post.title.toLowerCase()}...
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}