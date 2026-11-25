'use client';

import {Link} from '@/i18n/navigation';
import {pillClass} from '@/components/home/Pill';

interface BlogSidebarProps {
  post: {
    title: string;
    slug: string | {current: string};
    categories?: Array<{title: string; slug: string}>;
    author?: {name: string; imageUrl?: string};
  };
  prevPost?: {title: string; slug: string} | null;
  nextPost?: {title: string; slug: string} | null;
}

/** Categories, author and links to the neighbouring posts. */
export function BlogSidebar({post, prevPost, nextPost}: BlogSidebarProps) {
  return (
    <div className="border-t border-ink-950/30 pt-8">
      <dl className="grid gap-6 sm:grid-cols-2">
        {post.categories && post.categories.length > 0 && (
          <div>
            <dt className="text-sm text-ink-500">Kategoriler</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <span key={category.slug} className="rounded-full border border-ink-950/20 px-3 py-1 text-sm">
                  {category.title}
                </span>
              ))}
            </dd>
          </div>
        )}
        {post.author && (
          <div>
            <dt className="text-sm text-ink-500">Yazar</dt>
            <dd className="mt-2 font-serif text-xl">{post.author.name}</dd>
          </div>
        )}
      </dl>

      {(prevPost || nextPost) && (
        <nav aria-label="Diğer yazılar" className="mt-12 grid gap-4 sm:grid-cols-2">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} className="group block bg-white p-6">
              <span className="text-sm text-ink-500">← Önceki yazı</span>
              <span className="mt-2 block font-serif text-xl leading-snug transition-colors group-hover:text-cardinal-700">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {nextPost && (
            <Link href={`/blog/${nextPost.slug}`} className="group block bg-white p-6 sm:text-right">
              <span className="text-sm text-ink-500">Sonraki yazı →</span>
              <span className="mt-2 block font-serif text-xl leading-snug transition-colors group-hover:text-cardinal-700">
                {nextPost.title}
              </span>
            </Link>
          )}
        </nav>
      )}

      <div className="mt-12">
        <Link href="/blog" className={pillClass('outline')}>
          Tüm yazılar
        </Link>
      </div>
    </div>
  );
}
