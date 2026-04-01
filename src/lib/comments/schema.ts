import {z} from 'zod';

export const listCommentsSchema = z.object({
  postSlug: z.string().trim().min(1).max(160),
  locale: z.string().trim().min(2).max(10)
});

export const createCommentSchema = z.object({
  postSlug: z.string().trim().min(1).max(160),
  locale: z.string().trim().min(2).max(10),
  parentId: z
    .string()
    .trim()
    .regex(/^\d+$/, 'Invalid parent id')
    .nullable()
    .optional(),
  authorName: z.string().trim().min(2).max(60),
  body: z.string().trim().min(3).max(1200),
  turnstileToken: z.string().trim().transform(val => val || undefined).optional(),
  honeypot: z.string().optional()
});

export type ListCommentsInput = z.infer<typeof listCommentsSchema>;
export type CreateCommentBody = z.infer<typeof createCommentSchema>;
