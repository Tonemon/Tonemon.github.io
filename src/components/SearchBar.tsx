'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import type { SearchEntry } from '@/lib/search-index'
import { articleHref } from '@/lib/urls'
import type { Category } from '@/types/content'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchEntry[]>([])
  const [open, setOpen] = useState(false)
  const fuseRef = useRef<Fuse<SearchEntry> | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (fuseRef.current) return
    fetch('/search-index.json')
      .then(r => r.json())
      .then((entries: SearchEntry[]) => {
        fuseRef.current = new Fuse(entries, {
          keys: ['title', 'excerpt', 'tags'],
          threshold: 0.35,
        })
      })
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    if (!q.trim() || !fuseRef.current) {
      setResults([])
      setOpen(false)
      return
    }
    const hits = fuseRef.current.search(q).slice(0, 6).map(r => r.item)
    setResults(hits)
    setOpen(hits.length > 0)
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gh-muted text-[12px]">🔍</span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search articles…"
          className="bg-gh-surface border border-gh-border rounded-md pl-8 pr-3 py-1.5 text-[13px] text-gh-text placeholder:text-gh-muted w-[200px] focus:outline-none focus:border-gh-accent transition-colors"
        />
      </div>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] w-[320px] bg-gh-surface border border-gh-border rounded-md shadow-lg z-50 overflow-hidden">
          {results.map(entry => (
            <Link
              key={`${entry.category}-${entry.slug}`}
              href={articleHref(entry.category as Category, entry.slug)}
              onClick={() => { setOpen(false); setQuery('') }}
              className="flex flex-col px-3 py-2.5 hover:bg-gh-bg transition-colors border-b border-gh-subtle last:border-0"
            >
              <span className="text-[13px] font-medium text-gh-text leading-snug">{entry.title}</span>
              <span className="text-[11px] text-gh-muted mt-0.5">{entry.category} · {entry.date.slice(0, 7)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
