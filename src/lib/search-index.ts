import { getAllArticles, getArticleRawContent } from './content'
import type { Category } from '@/types/content'

export interface SearchEntry {
  slug: string
  category: string
  title: string
  excerpt: string
  tags: string[]
  date: string
  content: string
}

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]+`/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/_([^_\n]+)_/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/\[\[.*?\]\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function buildSearchIndex(): SearchEntry[] {
  return getAllArticles().map(a => {
    let content = ''
    try {
      content = stripMarkdown(getArticleRawContent(a.category as Category, a.slug)).slice(0, 5000)
    } catch { /* article file missing, skip */ }
    return {
      slug: a.slug,
      category: a.category,
      title: a.title,
      excerpt: a.excerpt ?? '',
      tags: a.tags,
      date: a.date,
      content,
    }
  })
}
