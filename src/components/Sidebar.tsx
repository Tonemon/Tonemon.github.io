import Link from 'next/link'
import { format } from 'date-fns'
import type { ArticleMeta } from '@/types/content'
import type { TocEntry } from '@/lib/toc'
import { articleHref as buildHref } from '@/lib/urls'

interface SidebarProps {
  relatedArticles: ArticleMeta[]
  tags: string[]
  paperUrl?: string
  paperCover?: string
  seriesNavigator?: React.ReactNode
  toc?: TocEntry[]
  projectUrl?: string
}

export default function Sidebar({ relatedArticles, tags, paperUrl, paperCover, seriesNavigator, toc, projectUrl }: SidebarProps) {
  return (
    <aside className="border-l border-gh-subtle pl-7 sticky top-[78px] max-h-[calc(100vh-90px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* Visit Project — project articles only */}
      {projectUrl && (
        <div className="mb-6">
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full bg-[#238636] hover:bg-[#2ea043] text-white text-[15px] font-semibold py-2.5 rounded-md transition-colors"
          >
            ↗ Visit Project
          </a>
        </div>
      )}

      {seriesNavigator}

      {/* PDF paper card — research only */}
      {paperUrl && (
        <div className="mb-7">
          <p className="text-[12px] font-bold uppercase tracking-widest text-gh-muted mb-3">Paper</p>
          {paperCover ? (
            <a href={paperUrl} target="_blank" rel="noopener noreferrer" className="block group relative w-1/2 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={paperCover} alt="Paper cover" className="w-full rounded border border-gh-border" />
              <div className="absolute inset-0 flex items-center justify-center rounded bg-black/0 group-hover:bg-black/55 transition-all">
                <span className="hidden group-hover:block text-white text-[11px] font-bold bg-gh-accent rounded px-2 py-1">
                  View PDF
                </span>
              </div>
            </a>
          ) : (
            <a
              href={paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[14px] text-gh-accent border border-gh-border rounded px-3 py-2 mb-2 hover:border-gh-accent transition-colors w-1/2"
            >
              View PDF
            </a>
          )}
          <a
            href={paperUrl}
            download
            className="block text-[13px] text-gh-accent border border-gh-border rounded px-2 py-1.5 text-center w-1/2 hover:border-gh-accent transition-colors"
          >
            ↓ Download
          </a>
        </div>
      )}

      {/* Table of Contents */}
      {toc && toc.length > 0 && (
        <div className="mb-7">
          <p className="text-[12px] font-bold uppercase tracking-widest text-gh-muted mb-3">On this page</p>
          {toc.map(entry => (
            <a
              key={entry.id}
              href={`#${entry.id}`}
              className={`block py-1 hover:text-gh-accent transition-colors border-l-2 hover:border-gh-accent ${
                entry.level === 3
                  ? 'pl-5 text-[13px] text-gh-muted border-gh-subtle'
                  : 'pl-3 text-[14px] text-gh-accent border-gh-border'
              }`}
            >
              {entry.text}
            </a>
          ))}
        </div>
      )}

      {/* Read more */}
      {relatedArticles.length > 0 && (
        <div className="mb-7">
          <p className="text-[12px] font-bold uppercase tracking-widest text-gh-muted mb-3">Read more</p>
          {relatedArticles.map(article => (
            <Link
              key={article.slug}
              href={buildHref(article.category, article.slug)}
              className="block text-gh-accent text-[14px] border-b border-gh-subtle pb-3 mb-3 leading-snug hover:underline"
            >
              {article.title}
              <small className="block text-gh-muted text-[12px] mt-1">
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)} · {format(new Date(article.date), 'MMM yyyy')}
              </small>
            </Link>
          ))}
        </div>
      )}

      {/* Related tags */}
      {tags.length > 0 && (
        <div>
          <p className="text-[12px] font-bold uppercase tracking-widest text-gh-muted mb-3">Related tags</p>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="text-[13px] text-gh-accent bg-gh-bg border border-gh-border rounded-full px-3 py-0.5 hover:border-gh-accent transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
