'use client'
import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import ArticleCard from '@/components/ArticleCard'
import type { ArticleMeta } from '@/types/content'

interface Props {
  articles: ArticleMeta[]
  emptyMessage: string
}

export default function CategoryPageClient({ articles, emptyMessage }: Props) {
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
  const displayed = searching ? fuse.search(query).map(r => r.item) : articles

  return (
    <>
      <div className="relative mb-6">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gh-muted text-[12px]">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search articles…"
          className="bg-gh-surface border border-gh-border rounded-md pl-8 pr-3 py-1.5 text-[13px] text-gh-text placeholder:text-gh-muted w-[200px] focus:outline-none focus:border-gh-accent transition-colors"
        />
      </div>
      {displayed.length === 0 ? (
        <p className="text-gh-muted text-[14px]">{searching ? 'No results.' : emptyMessage}</p>
      ) : (
        displayed.map(a => <ArticleCard key={`${a.category}-${a.slug}`} article={a} />)
      )}
    </>
  )
}
