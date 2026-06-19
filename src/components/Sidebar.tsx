import Link from 'next/link'
import { format } from 'date-fns'
import type { ArticleMeta } from '@/types/content'

interface SidebarProps {
  relatedArticles: ArticleMeta[]
  tags: string[]
  paperUrl?: string
  paperCover?: string
}

function articleHref(article: ArticleMeta): string {
  return `/${article.category}s/${article.slug}`
}

export default function Sidebar({ relatedArticles, tags, paperUrl, paperCover }: SidebarProps) {
  return (
    <aside className="border-l border-gh-subtle pl-5 sticky top-[68px] max-h-[calc(100vh-80px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

      {/* PDF paper card — research only */}
      {paperUrl && (
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gh-muted mb-2">Paper</p>
          {paperCover ? (
            <a href={paperUrl} target="_blank" rel="noopener noreferrer" className="block group relative w-1/2 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={paperCover} alt="Paper cover" className="w-full rounded border border-gh-border" />
              <div className="absolute inset-0 flex items-center justify-center rounded bg-black/0 group-hover:bg-black/55 transition-all">
                <span className="hidden group-hover:block text-white text-[9px] font-bold bg-gh-accent rounded px-2 py-1">
                  View PDF
                </span>
              </div>
            </a>
          ) : (
            <a
              href={paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[11px] text-gh-accent border border-gh-border rounded px-3 py-2 mb-2 hover:border-gh-accent transition-colors w-1/2"
            >
              View PDF
            </a>
          )}
          <a
            href={paperUrl}
            download
            className="block text-[10px] text-gh-accent border border-gh-border rounded px-2 py-1.5 text-center w-1/2 hover:border-gh-accent transition-colors"
          >
            ↓ Download
          </a>
        </div>
      )}

      {/* Read more */}
      {relatedArticles.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gh-muted mb-2">Read more</p>
          {relatedArticles.map(article => (
            <Link
              key={article.slug}
              href={articleHref(article)}
              className="block text-gh-accent text-[11px] border-b border-gh-subtle pb-2 mb-2 leading-snug hover:underline"
            >
              {article.title}
              <small className="block text-gh-muted text-[10px] mt-0.5">
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)} · {format(new Date(article.date), 'MMM yyyy')}
              </small>
            </Link>
          ))}
        </div>
      )}

      {/* Related tags */}
      {tags.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gh-muted mb-2">Related tags</p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="text-[10px] text-gh-accent bg-gh-bg border border-gh-border rounded-full px-2 py-0.5 hover:border-gh-accent transition-colors"
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
