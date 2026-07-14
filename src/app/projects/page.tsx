import type { Metadata } from 'next'
import Link from 'next/link'
import { getArticlesByCategory } from '@/lib/content'
import type { ArticleMeta } from '@/types/content'
import { tagHref } from '@/lib/urls'
import CategoryPageClient from '@/components/CategoryPageClient'

export const metadata: Metadata = { title: 'Projects' }

function getPopularTags(articles: ArticleMeta[], limit = 6): string[] {
  const counts: Record<string, number> = {}
  for (const a of articles) for (const t of a.tags) counts[t] = (counts[t] ?? 0) + 1
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([t]) => t)
}

export default function ProjectsPage() {
  const articles = getArticlesByCategory('project')
  const popularTags = getPopularTags(articles)

  return (
    <div className="px-4 sm:px-14 py-8">
      <div className="mb-8 pb-6 border-b border-gh-subtle">
        <h1 className="text-[32px] font-bold text-gh-text mb-1.5">Projects</h1>
        <p className="text-[15px] text-gh-muted mb-5">Homelab experiments, tools, and open-source builds.</p>
        {popularTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-gh-muted whitespace-nowrap">Popular:</span>
            <div className="flex gap-1.5 flex-wrap">
              {popularTags.map(tag => (
                <Link
                  key={tag}
                  href={tagHref(tag)}
                  className="text-[10px] text-gh-accent bg-gh-bg border border-gh-border rounded-full px-2 py-0.5 hover:border-gh-accent transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <CategoryPageClient articles={articles} emptyMessage="No projects yet." />
    </div>
  )
}
