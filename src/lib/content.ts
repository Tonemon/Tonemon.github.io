import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Article, ArticleMeta, Category, FrontMatter } from '@/types/content'
import { readingTime } from './reading-time'

export const CONTENT_DIR =
  process.env.CONTENT_DIR_OVERRIDE || path.join(process.cwd(), 'content')

const CATEGORY_DIRS: Record<Category, string> = {
  writeup: 'writeups',
  project: 'projects',
  research: 'research',
}

function categoryDir(category: Category): string {
  return path.join(CONTENT_DIR, CATEGORY_DIRS[category])
}

function stripDatePrefix(filename: string): string {
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

function filenameToSlug(filename: string): string {
  return stripDatePrefix(filename.replace(/\.md$/, ''))
}

function findFile(category: Category, slug: string): string | undefined {
  const dir = categoryDir(category)
  if (!fs.existsSync(dir)) return undefined
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .find(f => filenameToSlug(f) === slug)
}

export function getArticleSlugs(category: Category): string[] {
  const dir = categoryDir(category)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(filenameToSlug)
}

export function getArticle(category: Category, slug: string): Article {
  const dir = categoryDir(category)
  const filename = findFile(category, slug)
  if (!filename) throw new Error(`Article not found: ${category}/${slug}`)
  const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
  const { data, content } = matter(raw)
  const fm = data as FrontMatter
  return {
    ...fm,
    tags: fm.tags ?? [],
    category: fm.category ?? category,
    slug,
    contentHtml: '',
    readingTime: readingTime(content),
  }
}

export function getArticleRawContent(category: Category, slug: string): string {
  const dir = categoryDir(category)
  const filename = findFile(category, slug)
  if (!filename) throw new Error(`Article not found: ${category}/${slug}`)
  const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
  return matter(raw).content
}

export function getAllArticleMeta(): ArticleMeta[] {
  const categories: Category[] = ['writeup', 'project', 'research']
  return categories
    .flatMap(cat =>
      getArticleSlugs(cat).map(slug => {
        const a = getArticle(cat, slug)
        return {
          title: a.title,
          date: a.date,
          category: a.category,
          tags: a.tags,
          excerpt: a.excerpt,
          coverImage: a.coverImage,
          paperUrl: a.paperUrl,
          paperCover: a.paperCover,
          projectUrl: a.projectUrl,
          platform: a.platform,
          difficulty: a.difficulty,
          series: a.series,
          series_part: a.series_part,
          slug,
          readingTime: a.readingTime,
        } satisfies ArticleMeta
      })
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllArticles(): ArticleMeta[] {
  return getAllArticleMeta()
}

export function getArticlesByCategory(category: Category): ArticleMeta[] {
  return getAllArticleMeta().filter(a => a.category === category)
}

export function getSeriesArticles(seriesName: string): ArticleMeta[] {
  return getAllArticleMeta()
    .filter(a => a.series === seriesName)
    .sort((a, b) => (a.series_part ?? 0) - (b.series_part ?? 0))
}

export function getAllTags(): { tag: string; count: number }[] {
  const tagCounts = new Map<string, number>()
  getAllArticleMeta().forEach(article => {
    article.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
    })
  })
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag))
}

export function getRelatedArticles(current: ArticleMeta, count = 3): ArticleMeta[] {
  const all = getAllArticleMeta().filter(
    a => !(a.slug === current.slug && a.category === current.category)
  )
  const scored = all.map(a => {
    const sharedTags = a.tags.filter(t => current.tags.includes(t)).length
    const sameCategory = a.category === current.category ? 1 : 0
    return { article: a, score: sharedTags * 2 + sameCategory }
  })
  return scored
    .sort((a, b) => b.score - a.score || new Date(b.article.date).getTime() - new Date(a.article.date).getTime())
    .slice(0, count)
    .map(s => s.article)
}
