'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export interface VersionItem {
  version: number
  dateLabel: string
  note: string
  href: string
}

interface VersionSwitcherProps {
  current: number
  // Newest first
  items: VersionItem[]
}

export default function VersionSwitcher({ current, items }: VersionSwitcherProps) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const newest = items[0].version

  useEffect(() => {
    if (!open) return
    function onPointer(e: MouseEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      setOpen(false)
      button.current?.focus()
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={root} className="inline-flex sm:relative">
      <button
        ref={button}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Version ${current}, show all versions`}
        className="flex items-center gap-1 rounded border border-gh-border px-1.5 text-[12px] leading-[20px] text-gh-muted hover:text-gh-text hover:border-gh-muted transition-colors"
      >
        v{current}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={open ? 'rotate-180' : undefined}>
          <path d="M2 3.5l3 3 3-3" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1.5 w-[280px] max-w-[calc(100vw-2rem)] rounded-md border border-gh-border bg-gh-surface py-1 shadow-lg shadow-black/20">
          <div className="px-3 pt-1.5 pb-2 text-[11px] font-semibold uppercase tracking-wide text-gh-muted border-b border-gh-border">
            Versions
          </div>
          <ul>
            {items.map(item => {
              const viewing = item.version === current
              return (
                <li key={item.version}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={viewing ? 'page' : undefined}
                    className="flex gap-2 px-3 py-2 hover:bg-gh-bg transition-colors"
                  >
                    <span className="w-3.5 shrink-0 text-gh-accent text-[13px] leading-[20px]">{viewing ? '✓' : ''}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[13px] leading-[20px]">
                        <span className="font-semibold text-gh-text">v{item.version}</span>
                        <span className="text-gh-muted">· {item.dateLabel}</span>
                        {item.version === newest && (
                          <span className="ml-auto rounded-full border border-gh-border px-1.5 text-[10px] leading-[16px] text-gh-accent">
                            current
                          </span>
                        )}
                      </span>
                      {item.note && <span className="block text-[12px] leading-snug text-gh-muted">{item.note}</span>}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
