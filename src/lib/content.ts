import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Article, ArticleMeta, ArticleVersion, Category, FrontMatter } from '@/types/content'
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

interface Entry {
  slug: string
  data: Partial<FrontMatter>
  content: string
}

function readEntries(category: Category): Entry[] {
  const dir = categoryDir(category)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), 'utf-8'))
      return { slug: filenameToSlug(f), data: data as Partial<FrontMatter>, content }
    })
}

// Files with `version_of` join the article whose slug they name; the article
// itself is version 1. Groups are keyed by that slug and sorted oldest first.
export function groupVersions<T extends { slug: string; data: Partial<FrontMatter> }>(
  entries: T[]
): Map<string, (T & { version: number })[]> {
  const groups = new Map<string, (T & { version: number })[]>()
  for (const e of entries) {
    if (!e.data.version_of) groups.set(e.slug, [{ ...e, version: e.data.version ?? 1 }])
  }
  for (const e of entries) {
    const of = e.data.version_of
    if (!of) continue
    const group = groups.get(of)
    if (!group) throw new Error(`${e.slug}: version_of "${of}" does not match any article`)
    if (e.data.version === undefined) throw new Error(`${e.slug}: a version_of file needs a version number`)
    group.push({ ...e, version: e.data.version })
  }
  for (const [slug, group] of groups) {
    group.sort((a, b) => a.version - b.version)
    group.forEach((e, i) => {
      if (i > 0 && group[i - 1].version === e.version) {
        throw new Error(`${e.slug}: duplicate version ${e.version} of "${slug}"`)
      }
    })
  }
  return groups
}

function getVersionEntries(category: Category, slug: string) {
  const group = groupVersions(readEntries(category)).get(slug)
  if (!group) throw new Error(`Article not found: ${category}/${slug}`)
  return group
}

function getVersionEntry(category: Category, slug: string, version?: number) {
  const group = getVersionEntries(category, slug)
  const entry = version === undefined ? group[group.length - 1] : group.find(e => e.version === version)
  if (!entry) throw new Error(`Article not found: ${category}/${slug} v${version}`)
  return { group, entry }
}

export function getArticleSlugs(category: Category): string[] {
  return [...groupVersions(readEntries(category)).keys()]
}

function toVersions(group: (Entry & { version: number })[]): ArticleVersion[] {
  return group.map(e => ({
    version: e.version,
    date: e.data.date!,
    note: e.data.version_note ?? (e.version === 1 ? 'Original publication' : ''),
  }))
}

export function getArticleVersions(category: Category, slug: string): ArticleVersion[] {
  return toVersions(getVersionEntries(category, slug))
}

// Without a version this is the newest one; `date` is always the original publication date
export function getArticle(category: Category, slug: string, version?: number): Article {
  const { group, entry } = getVersionEntry(category, slug, version)
  const fm = entry.data as FrontMatter
  return {
    ...fm,
    tags: fm.tags ?? [],
    category: fm.category ?? category,
    slug,
    date: group[0].data.date!,
    contentHtml: '',
    readingTime: readingTime(entry.content),
    version: entry.version,
    versions: toVersions(group),
    updated: entry.version > 1 ? fm.date : undefined,
  }
}

export function getArticleRawContent(category: Category, slug: string, version?: number): string {
  return getVersionEntry(category, slug, version).entry.content
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
          authors: a.authors,
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
