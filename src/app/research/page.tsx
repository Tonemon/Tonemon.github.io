import type { Metadata } from 'next'
import Link from 'next/link'
import { getArticlesByCategory } from '@/lib/content'
import ArticleCard from '@/components/ArticleCard'
import SearchBar from '@/components/SearchBar'
import type { ArticleMeta } from '@/types/content'

export const metadata: Metadata = { title: 'Research' }

function getPopularTags(articles: ArticleMeta[], limit = 6): string[] {
  const counts: Record<string, number> = {}
  for (const a of articles) for (const t of a.tags) counts[t] = (counts[t] ?? 0) + 1
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([t]) => t)
}

export default function ResearchPage() {
  const articles = getArticlesByCategory('research')
  const popularTags = getPopularTags(articles)

  return (
    <div className="px-14 py-8">
      <div className="mb-8 pb-6 border-b border-gh-subtle">
        <h1 className="text-[32px] font-bold text-gh-text mb-1.5">Research</h1>
        <p className="text-[15px] text-gh-muted mb-5">Academic papers, experiments, and technical deep-dives.</p>
        <div className="flex items-center gap-3">
          <SearchBar />
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[11px] text-gh-muted whitespace-nowrap">Popular:</span>
            <div className="flex gap-1.5 flex-wrap">
              {popularTags.map(tag => (
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
        </div>
      </div>
      {articles.length === 0 ? (
        <p className="text-gh-muted text-[14px]">No research articles yet.</p>
      ) : (
        articles.map(a => <ArticleCard key={a.slug} article={a} />)
      )}
    </div>
  )
}
