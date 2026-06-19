import type { Metadata } from 'next'
import { getAllArticles, getAllTags } from '@/lib/content'
import ArticleCard from '@/components/ArticleCard'

interface Props { params: Promise<{ tag: string }> }

export async function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  return { title: `#${tag}` }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const articles = getAllArticles().filter(a => a.tags.includes(tag))
  return (
    <div className="px-10 py-8">
      <h1 className="text-[22px] font-bold text-gh-text mb-6">
        <span className="text-gh-muted">#</span>{tag}
      </h1>
      <p className="text-[13px] text-gh-muted mb-6">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
      {articles.length === 0 ? (
        <p className="text-gh-muted text-[14px]">No articles with this tag.</p>
      ) : (
        articles.map(a => <ArticleCard key={`${a.category}-${a.slug}`} article={a} />)
      )}
    </div>
  )
}
