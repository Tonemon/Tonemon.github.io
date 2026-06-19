import type { Metadata } from 'next'
import { getArticlesByCategory } from '@/lib/content'
import ArticleCard from '@/components/ArticleCard'

export const metadata: Metadata = { title: 'Research' }

export default function ResearchPage() {
  const articles = getArticlesByCategory('research')
  return (
    <div className="px-10 py-8">
      <h1 className="text-[22px] font-bold text-gh-text mb-6">Research</h1>
      {articles.length === 0 ? (
        <p className="text-gh-muted text-[14px]">No research articles yet.</p>
      ) : (
        articles.map(a => <ArticleCard key={a.slug} article={a} />)
      )}
    </div>
  )
}
