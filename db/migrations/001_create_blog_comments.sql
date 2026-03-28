CREATE TABLE IF NOT EXISTS blog_comments (
  id BIGSERIAL PRIMARY KEY,
  post_slug TEXT NOT NULL,
  locale VARCHAR(10) NOT NULL,
  parent_id BIGINT REFERENCES blog_comments(id) ON DELETE CASCADE,
  author_name VARCHAR(60) NOT NULL,
  body TEXT NOT NULL,
  depth INTEGER NOT NULL DEFAULT 0,
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_post_locale
  ON blog_comments (post_slug, locale);

CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id
  ON blog_comments (parent_id);

CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at
  ON blog_comments (created_at);
