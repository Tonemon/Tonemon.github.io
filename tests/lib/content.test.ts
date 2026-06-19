import path from 'path'

// Set CONTENT_DIR_OVERRIDE before importing content.ts so it uses fixtures
process.env.CONTENT_DIR_OVERRIDE = path.join(__dirname, '../fixtures')

import { getArticleSlugs, getArticle, getAllArticles, getArticlesByCategory } from '@/lib/content'

describe('getArticleSlugs', () => {
  it('returns slugs with date prefix stripped', () => {
    const slugs = getArticleSlugs('writeup')
    expect(slugs).toContain('test-article')
  })

  it('returns empty array for missing directory', () => {
    expect(getArticleSlugs('project')).toEqual([])
  })
})

describe('getArticle', () => {
  it('parses frontmatter correctly', () => {
    const article = getArticle('writeup', 'test-article')
    expect(article.title).toBe('Test Article')
    expect(article.date).toBe('2026-01-01')
    expect(article.tags).toEqual(['testing', 'example'])
  })

  it('calculates reading time', () => {
    const article = getArticle('writeup', 'test-article')
    expect(article.readingTime).toBeGreaterThanOrEqual(1)
  })
})

describe('getAllArticles', () => {
  it('returns articles sorted newest first', () => {
    const articles = getAllArticles()
    expect(articles.length).toBeGreaterThanOrEqual(2)
    for (let i = 1; i < articles.length; i++) {
      expect(new Date(articles[i - 1].date).getTime())
        .toBeGreaterThanOrEqual(new Date(articles[i].date).getTime())
    }
  })
})

describe('getArticlesByCategory', () => {
  it('filters by category', () => {
    const writeups = getArticlesByCategory('writeup')
    expect(writeups.every(a => a.category === 'writeup')).toBe(true)
  })
})
