import fs from 'fs'
import path from 'path'
import { getAllArticles } from './content'

export interface SearchEntry {
  slug: string
  category: string
  title: string
  excerpt: string
  tags: string[]
  date: string
}

export function buildSearchIndex(): SearchEntry[] {
  return getAllArticles().map(a => ({
    slug: a.slug,
    category: a.category,
    title: a.title,
    excerpt: a.excerpt,
    tags: a.tags,
    date: a.date,
  }))
}

export function writeSearchIndex(): void {
  const index = buildSearchIndex()
  const outPath = path.join(process.cwd(), 'public', 'search-index.json')
  fs.writeFileSync(outPath, JSON.stringify(index))
}
