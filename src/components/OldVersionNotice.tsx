import Link from 'next/link'
import type { Article } from '@/types/content'
import { articleHref } from '@/lib/urls'
import { formatDate } from './ArticleByline'

// Shown on a /vN page that is not the newest version
export default function OldVersionNotice({ article }: { article: Article }) {
  const { version, versions, category, slug } = article
  if (version === versions[versions.length - 1].version) return null
  const viewed = versions.find(v => v.version === version)!

  return (
    <div role="note" className="version-notice flex gap-2.5 rounded-md border px-4 py-3 mb-6 text-[14px] leading-relaxed">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="version-notice-icon mt-[3px] shrink-0">
        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm6.5-.25A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
      </svg>
      <p>
        You&apos;re reading <strong>version {version}</strong> ({formatDate(viewed.date)}). This article has been updated since.{' '}
        <Link href={articleHref(category, slug)} className="version-notice-link font-semibold whitespace-nowrap hover:underline">
          Read the latest version →
        </Link>
      </p>
    </div>
  )
}
