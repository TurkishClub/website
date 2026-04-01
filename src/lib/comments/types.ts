export interface BlogComment {
  id: string;
  postSlug: string;
  locale: string;
  parentId: string | null;
  authorName: string;
  body: string;
  createdAt: string;
  depth: number;
  children: BlogComment[];
}

export interface CreateCommentInput {
  postSlug: string;
  locale: string;
  parentId?: string | null;
  authorName: string;
  body: string;
  turnstileToken?: string;
  honeypot?: string;
}
