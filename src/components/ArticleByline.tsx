import { format } from 'date-fns'
import type { Article } from '@/types/content'
import { articleHref, articleVersionHref } from '@/lib/urls'
import VersionSwitcher from './VersionSwitcher'

export function formatDate(date: string): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export default function ArticleByline({ article }: { article: Article }) {
  const { date, updated, readingTime, authors, versions, version, category, slug } = article
  const versioned = versions.length > 1
  const newest = versions[versions.length - 1].version

  return (
    <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gh-muted mb-3">
      <span>{versioned && 'Published '}{formatDate(date)}</span>
      {updated && (
        <>
          <span>·</span>
          <span>Updated {formatDate(updated)}</span>
        </>
      )}
      <span>·</span>
      <span>{readingTime} min read</span>
      {authors && authors.length > 0 && (
        <>
          <span>·</span>
          <span>
            by{' '}
            {authors.map((a, i) => (
              <span key={a.url}>
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="hover:text-gh-accent transition-colors">{a.name}</a>
                {i < authors.length - 1 && ', '}
              </span>
            ))}
          </span>
        </>
      )}
      {versioned && (
        <>
          <span>·</span>
          <VersionSwitcher
            current={version}
            items={[...versions].reverse().map(v => ({
              version: v.version,
              dateLabel: formatDate(v.date),
              note: v.note,
              href: v.version === newest ? articleHref(category, slug) : articleVersionHref(category, slug, v.version),
            }))}
          />
        </>
      )}
    </div>
  )
}
