import Link from 'next/link'
import type { ArticleMeta } from '@/types/content'
import { articleHref } from '@/lib/urls'

interface SeriesNavigatorProps {
  seriesName: string
  parts: ArticleMeta[]
  currentSlug: string
}

export default function SeriesNavigator({ seriesName, parts, currentSlug }: SeriesNavigatorProps) {
  const currentIndex = parts.findIndex(p => p.slug === currentSlug)
  const prev = parts[currentIndex - 1]
  const next = parts[currentIndex + 1]

  return (
    <div className="mb-6">
      <p className="text-[12px] font-bold uppercase tracking-widest text-gh-muted mb-3">Series</p>
      <div className="bg-gh-surface border border-gh-border rounded-md overflow-hidden">
        <div className="px-3 py-2 border-b border-gh-border">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gh-muted block mb-0.5">
            Part {currentIndex + 1} of {parts.length}
          </span>
          <span className="text-[14px] font-semibold text-gh-text leading-snug">{seriesName}</span>
        </div>
        <div>
          {parts.map((part, i) => {
            const isCurrent = part.slug === currentSlug
            return (
              <div
                key={part.slug}
                className={`flex items-start gap-2 px-3 py-2 text-[13px] ${isCurrent ? 'bg-gh-accent/[0.07]' : 'hover:bg-gh-bg'} transition-colors`}
              >
                <span className={`font-bold min-w-[18px] ${isCurrent ? 'text-gh-accent' : 'text-gh-muted'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {isCurrent ? (
                  <span className="text-gh-text font-medium flex-1 leading-snug">
                    {part.title}
                    <span className="ml-1.5 text-[9px] text-gh-accent bg-gh-accent/[0.12] rounded-full px-1.5 py-0.5">here</span>
                  </span>
                ) : (
                  <Link href={articleHref(part.category, part.slug)} className="text-gh-muted hover:text-gh-accent flex-1 leading-snug transition-colors">
                    {part.title}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
        <div className="flex border-t border-gh-border text-[12px]">
          <div className={`flex-1 px-3 py-2 border-r border-gh-border ${!prev ? 'opacity-40' : ''}`}>
            {prev ? (
              <Link href={articleHref(prev.category, prev.slug)} className="text-gh-muted hover:text-gh-accent transition-colors">← Prev</Link>
            ) : (
              <span className="text-gh-muted">← Prev</span>
            )}
          </div>
          <div className={`flex-1 px-3 py-2 text-right ${!next ? 'opacity-40' : ''}`}>
            {next ? (
              <Link href={articleHref(next.category, next.slug)} className="text-gh-accent hover:underline transition-colors">Next →</Link>
            ) : (
              <span className="text-gh-muted">Next →</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
