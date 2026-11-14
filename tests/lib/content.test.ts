import path from 'path'

// Set CONTENT_DIR_OVERRIDE before importing content.ts so it uses fixtures
process.env.CONTENT_DIR_OVERRIDE = path.join(__dirname, '../fixtures')

import {
  getArticleSlugs, getArticle, getAllArticles, getArticlesByCategory,
  getArticleRawContent, getArticleVersions, groupVersions,
} from '@/lib/content'

describe('getArticleSlugs', () => {
  it('returns slugs with date prefix stripped', () => {
    const slugs = getArticleSlugs('writeup')
    expect(slugs).toContain('test-article')
  })

  it('returns one slug per versioned article', () => {
    const slugs = getArticleSlugs('writeup')
    expect(slugs).toContain('versioned')
    expect(slugs).not.toContain('versioned-v2')
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

describe('article versions', () => {
  it('lists a versioned article once, with the newest metadata and the original date', () => {
    const entries = getAllArticles().filter(a => a.slug.startsWith('versioned'))
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({ slug: 'versioned', title: 'Versioned v2', date: '2025-03-01', tags: ['new'] })
  })

  it('loads the newest version by default', () => {
    const article = getArticle('writeup', 'versioned')
    expect(article.version).toBe(2)
    expect(article.date).toBe('2025-03-01')
    expect(article.updated).toBe('2026-02-01')
    expect(article.versions).toEqual([
      { version: 1, date: '2025-03-01', note: 'Original publication' },
      { version: 2, date: '2026-02-01', note: 'Rewrote it' },
    ])
    expect(getArticleVersions('writeup', 'versioned')).toEqual(article.versions)
  })

  it('loads an older version on request', () => {
    const article = getArticle('writeup', 'versioned', 1)
    expect(article.title).toBe('Versioned v1')
    expect(article.version).toBe(1)
    expect(article.date).toBe('2025-03-01')
    expect(article.updated).toBeUndefined()
  })

  it('returns the raw content of the requested version', () => {
    expect(getArticleRawContent('writeup', 'versioned', 1)).toContain('First version body')
    expect(getArticleRawContent('writeup', 'versioned')).toContain('Second version body')
  })

  it('throws for an unknown version, and gives plain articles a single version', () => {
    expect(() => getArticle('writeup', 'versioned', 3)).toThrow(/not found/)
    expect(getArticle('writeup', 'test-article').versions).toHaveLength(1)
  })
})

describe('groupVersions', () => {
  const root = { slug: 'a', data: {} }
  const v2 = { slug: 'a-v2', data: { version_of: 'a', version: 2 } }

  it('treats an explicit version 1 root like an implicit one', () => {
    const groups = groupVersions([{ slug: 'a', data: { version: 1 } }, v2])
    expect(groups.get('a')!.map(e => e.version)).toEqual([1, 2])
  })

  it('rejects duplicate version numbers', () => {
    expect(() => groupVersions([root, v2, { ...v2, slug: 'a-v2b' }])).toThrow(/duplicate/i)
  })

  it('rejects version_of pointing to a missing article', () => {
    expect(() => groupVersions([{ slug: 'b-v2', data: { version_of: 'b', version: 2 } }])).toThrow(/version_of/)
  })

  it('rejects a version file without a version number', () => {
    expect(() => groupVersions([root, { slug: 'a-v2', data: { version_of: 'a' } }])).toThrow(/version/)
  })
})
