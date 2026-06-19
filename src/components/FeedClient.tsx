'use client'
import { useState } from 'react'
import ArticleCard from '@/components/ArticleCard'
import type { ArticleMeta, Category } from '@/types/content'

type Filter = 'all' | Category

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Writeups', value: 'writeup' },
  { label: 'Projects', value: 'project' },
  { label: 'Research', value: 'research' },
]

interface FeedClientProps {
  articles: ArticleMeta[]
  showFilter?: boolean
}

export default function FeedClient({ articles, showFilter = true }: FeedClientProps) {
  const [active, setActive] = useState<Filter>('all')
  const filtered = active === 'all' ? articles : articles.filter(a => a.category === active)

  return (
    <>
      {showFilter && (
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
      {filtered.length === 0 ? (
        <p className="text-gh-muted text-[14px] py-10">No articles yet.</p>
      ) : (
        filtered.map(a => <ArticleCard key={`${a.category}-${a.slug}`} article={a} />)
      )}
    </>
  )
}
