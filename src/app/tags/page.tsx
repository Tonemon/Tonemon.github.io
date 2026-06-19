import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags } from '@/lib/content'

export const metadata: Metadata = { title: 'Tags' }

export default function TagsPage() {
  const tags = getAllTags()
  return (
    <div className="px-10 py-8">
      <h1 className="text-[22px] font-bold text-gh-text mb-6">Tags</h1>
      {tags.length === 0 ? (
        <p className="text-gh-muted text-[14px]">No tags yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="flex items-center gap-1.5 text-[12px] text-gh-accent bg-gh-bg border border-gh-border rounded-full px-3 py-1 hover:border-gh-accent transition-colors"
            >
              {tag}
              <span className="text-gh-muted text-[10px]">{count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
