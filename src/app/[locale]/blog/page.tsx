import { client } from '@/sanity/lib/client'
import { POSTS_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { BlogHero } from '@/components/BlogHero'
import { BlogSearch } from '@/components/BlogSearch'
import MobileNavbar from '@/components/MobileNavbar'
import Footer from '@/components/Footer'

// Enhanced type definitions for our minimal queries
interface Post {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  excerpt?: string
  readTime?: number
  author?: {
    name: string
  }
  categories?: Array<{
    title: string
    slug: string
  }>
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

interface BlogPageProps {
  searchParams?: {
    query?: string
    sort?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Fetch posts from Sanity using your existing query
  const posts: Post[] = await client.fetch(POSTS_QUERY)
  
  // Get search parameters
  const query = searchParams?.query || ''
  const sort = searchParams?.sort || 'newest'
  
  // Filter posts based on search query
  const filteredPosts = posts.filter(post => {
    if (!query) return true
    return post.title.toLowerCase().includes(query.toLowerCase()) ||
           post.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
           post.categories?.some(cat => cat.title.toLowerCase().includes(query.toLowerCase()))
  })
  
  // Sort posts based on sort parameter
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sort) {
      case 'oldest':
        return new Date(a.publishedAt || '').getTime() - new Date(b.publishedAt || '').getTime()
      case 'alphabetical':
        return a.title.localeCompare(b.title, 'tr-TR')
      case 'newest':
      default:
        return new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime()
    }
  })

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavbar />
      
      {/* Hero Section */}
      <BlogHero />

      {/* Blog Content */}
      <div className="w-full max-w-none px-4 py-16">
        <div className="w-[80%] mx-auto">
          {/* Header with Search and Filters */}
          <div className="mb-12">
            <div className="flex flex-col gap-8 mb-8">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl lg:text-4xl font-extralight text-gray-900 mb-2">Son Yazılar</h2>
                <p className="text-gray-600 text-lg">Topluluğumuzdan en güncel haberler ve rehberler</p>
              </div>
              
              {/* Search and Filter Controls */}
              <div className="flex justify-center lg:justify-start">
                <BlogSearch />
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          {sortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg shadow-sm p-12 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {query ? 'Arama sonucu bulunamadı' : 'Henüz blog yazısı yok'}
                </h3>
                <p className="text-gray-600">
                  {query ? 'Farklı anahtar kelimeler deneyin.' : 'Sanity Studio\'da yeni yazılar oluşturun!'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPosts.map((post) => (
              <Card key={post._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-md">
                {post.image ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={urlFor(post.image).width(400).height(240).url()}
                      alt={post.image.alt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-[#C61E1E] to-red-600 flex items-center justify-center rounded-t-lg">
                    <div className="text-center text-white">
                      <h3 className="text-lg font-semibold mb-1">Turkish Club</h3>
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
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
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
                      {post.author && (
                        <span>{post.author.name}</span>
                      )}
                    </div>
                    
                    <Link href={`/blog/${post.slug.current}`}>
                      <Button variant="ghost" size="sm" className="text-[#C61E1E] hover:text-red-700 hover:bg-red-50 p-1">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {sortedPosts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="bg-white border-gray-300 hover:bg-gray-50">
              Daha Fazla Yazı Yükle
            </Button>
          </div>
        )}
        </div>
      </div>

      <Footer />
    </div>
  )
}