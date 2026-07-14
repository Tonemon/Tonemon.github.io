'use client'
import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import ArticleCard from '@/components/ArticleCard'
import type { ArticleMeta, Category } from '@/types/content'

type Filter = 'all' | Category

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All',      value: 'all'      },
  { label: 'Writeups', value: 'writeup'  },
  { label: 'Projects', value: 'project'  },
  { label: 'Research', value: 'research' },
]

interface FeedClientProps {
  articles: ArticleMeta[]
}

export default function FeedClient({ articles }: FeedClientProps) {
  const [active, setActive] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const fuse = useMemo(() => new Fuse(articles, {
    keys: [
      { name: 'title',   weight: 0.5 },
      { name: 'tags',    weight: 0.3 },
      { name: 'excerpt', weight: 0.2 },
    ],
    threshold: 0.35,
  }), [articles])

  const searching = query.trim().length > 0
  const displayed = searching
    ? fuse.search(query).map(r => r.item)
    : active === 'all' ? articles : articles.filter(a => a.category === active)

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-bold uppercase tracking-widest text-gh-muted">All posts</span>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gh-muted text-[12px]">🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="bg-gh-surface border border-gh-border rounded-md pl-8 pr-3 py-1.5 text-[13px] text-gh-text placeholder:text-gh-muted w-[200px] focus:outline-none focus:border-gh-accent transition-colors"
          />
        </div>
      </div>
      {!searching && (
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActive(value)}
              className={`text-[11px] px-3 py-0.5 rounded-full border transition-colors ${
                active === value
                  ? 'text-gh-accent border-gh-accent bg-gh-accent/[0.08]'
                  : 'text-gh-muted border-gh-border hover:border-gh-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {displayed.length === 0 ? (
        <p className="text-gh-muted text-[14px] py-10">{searching ? 'No results.' : 'No articles yet.'}</p>
      ) : (
        displayed.map(a => <ArticleCard key={`${a.category}-${a.slug}`} article={a} />)
      )}
    </>
  )
}
