import {getCommentsDb} from '@/lib/comments/db';
import type {BlogComment} from '@/lib/comments/types';
import {
  sanitizeAuthorName,
  sanitizeCommentBody
} from '@/lib/comments/sanitize';

type CreateCommentArgs = {
  postSlug: string;
  locale: string;
  parentId?: string | null;
  authorName: string;
  body: string;
  ipHash?: string;
};

type CommentRow = {
  id: string;
  post_slug: string;
  locale: string;
  parent_id: string | null;
  author_name: string;
  body: string;
  created_at: string;
  depth: number;
};

const MAX_THREAD_DEPTH = 8;

export async function listCommentsByPost(
  postSlug: string,
  locale: string
): Promise<BlogComment[]> {
  const db = getCommentsDb();
  if (!db) {
    return [];
  }

  const {rows} = await db.query<CommentRow>(
    `
      SELECT id, post_slug, locale, parent_id, author_name, body, created_at, depth
      FROM blog_comments
      WHERE post_slug = $1
        AND locale = $2
      ORDER BY created_at ASC
    `,
    [postSlug, locale]
  );

  return buildCommentTree(rows);
}

export async function createComment(args: CreateCommentArgs): Promise<BlogComment> {
  const db = getCommentsDb();
  if (!db) {
    throw new Error('Comments database is not configured');
  }

  const sanitizedName = sanitizeAuthorName(args.authorName);
  const sanitizedBody = sanitizeCommentBody(args.body);

  let depth = 0;

  if (args.parentId) {
    const parentResult = await db.query<{depth: number; post_slug: string; locale: string}>(
      `
        SELECT depth, post_slug, locale
        FROM blog_comments
        WHERE id = $1
        LIMIT 1
      `,
      [args.parentId]
    );

    if (parentResult.rowCount === 0) {
      throw new Error('Parent comment not found');
    }

    const parent = parentResult.rows[0];
    if (parent.post_slug !== args.postSlug || parent.locale !== args.locale) {
      throw new Error('Parent comment does not belong to this post');
    }

    depth = parent.depth + 1;
    if (depth > MAX_THREAD_DEPTH) {
      throw new Error('Thread depth limit exceeded');
    }
  }

  const result = await db.query<CommentRow>(
    `
      INSERT INTO blog_comments (
        post_slug,
        locale,
        parent_id,
        author_name,
        body,
        depth,
        ip_hash
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, post_slug, locale, parent_id, author_name, body, created_at, depth
    `,
    [
      args.postSlug,
      args.locale,
      args.parentId ?? null,
      sanitizedName,
      sanitizedBody,
      depth,
      args.ipHash ?? null
    ]
  );

  return toComment(result.rows[0]);
}

function buildCommentTree(rows: CommentRow[]): BlogComment[] {
  const mapped = rows.map(toComment);
  const byId = new Map<string, BlogComment>();

  for (const comment of mapped) {
    byId.set(comment.id, comment);
  }

  const roots: BlogComment[] = [];
  for (const comment of mapped) {
    if (!comment.parentId) {
      roots.push(comment);
      continue;
    }

    const parent = byId.get(comment.parentId);
    if (!parent) {
      roots.push(comment);
      continue;
    }

    parent.children.push(comment);
  }

  return roots;
}

function toComment(row: CommentRow): BlogComment {
  return {
    id: row.id,
    postSlug: row.post_slug,
    locale: row.locale,
    parentId: row.parent_id,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
    depth: row.depth,
    children: []
  };
}
