import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
/**
 * blog.ts
 * 
 * This module provides utility functions for handling blog posts stored as Markdown files
 * in the `content/blog` directory. It includes functions to read, parse, and convert Markdown
 * blog posts to HTML, extract metadata (frontmatter), calculate read time, and generate excerpts.
 * 
 * Main exports:
 * - BlogPost interface: Defines the structure of a blog post object.
 * - getBlogPosts(): Reads all Markdown files in the blog directory, parses their content and metadata,
 *   converts Markdown to HTML, and returns a sorted array of BlogPost objects.
 * - getBlogPost(slug): Reads a single Markdown file by its slug, parses and converts it, and returns
 *   a BlogPost object or null if not found.
 * 
 * This file is essential for integrating static Markdown-based blog content into a TypeScript/Node.js
 * web application, enabling dynamic blog listing and detail pages.
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  image?: string;
  excerpt: string;
  content: string;
  readTime: number;
  tags?: string[];
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

export async function getBlogPosts(): Promise<BlogPost[]> {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(async (fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        
        // Convert markdown to HTML
        const processedContent = await remark()
          .use(html)
          .process(matterResult.content);
        const contentHtml = processedContent.toString();
        
        // Calculate read time (average 200 words per minute)
        const wordCount = matterResult.content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200);
        
        // Create excerpt
        const excerpt = matterResult.data.excerpt || 
          matterResult.content.substring(0, 200).replace(/[#*]/g, '') + '...';

        return {
          id,
          slug: id,
          title: matterResult.data.title,
          publishedAt: matterResult.data.date,
          image: matterResult.data.image,
          excerpt,
          content: contentHtml,
          readTime,
          tags: matterResult.data.tags || [],
          ...matterResult.data,
        };
      })
  );

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => {
    if (a.publishedAt < b.publishedAt) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();
    
    const wordCount = matterResult.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    
    const excerpt = matterResult.data.excerpt || 
      matterResult.content.substring(0, 200).replace(/[#*]/g, '') + '...';

    return {
      id: slug,
      slug,
      title: matterResult.data.title,
      publishedAt: matterResult.data.date,
      image: matterResult.data.image,
      excerpt,
      content: contentHtml,
      readTime,
      tags: matterResult.data.tags || [],
      ...matterResult.data,
    };
  } catch {
    return null;
  }
}
