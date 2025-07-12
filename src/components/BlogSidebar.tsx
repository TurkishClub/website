"use client";

import { Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

interface BlogSidebarProps {
  post: {
    title: string;
    categories?: Array<{
      title: string;
      slug: string;
    }>;
    author?: {
      name: string;
      imageUrl?: string; // Pre-processed image URL
    };
  };
}

export function BlogSidebar({ post }: BlogSidebarProps) {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleTwitterShare = () => {
    const text = `${post.title} - Turkish Club Munich`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`,
      '_blank'
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      '_blank'
    );
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Share Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Paylaş
          </h3>
          <div className="flex gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleTwitterShare}
              className="flex-1"
            >
              Twitter
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleFacebookShare}
              className="flex-1"
            >
              Facebook
            </Button>
          </div>
        </div>

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Kategoriler</h3>
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <span
                  key={category.slug}
                  className="bg-[#C61E1E] text-white px-3 py-1 rounded-full text-sm"
                >
                  {category.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Info */}
        {post.author && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Yazar</h3>
            <div className="flex items-center gap-3">
              {post.author.imageUrl ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={post.author.imageUrl}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-[#C61E1E] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{post.author.name}</p>
                <p className="text-sm text-gray-600">Turkish Club Munich</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
