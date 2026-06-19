import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticle, getArticleSlugs, getRelatedArticles, getArticleRawContent, getSeriesArticles } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import ResearchLayout from '@/components/layouts/ResearchLayout'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getArticleSlugs('research').map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const article = getArticle('research', slug)
    return {
      title: article.title,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: [`/og/research/${slug}`],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        images: [`/og/research/${slug}`],
      },
    }
  } catch {
    return {}
  }
}

export default async function ResearchPage({ params }: Props) {
  const { slug } = await params
  let article
  try {
    article = getArticle('research', slug)
  } catch {
    notFound()
  }
  const rawContent = getArticleRawContent('research', slug)
  const contentHtml = await markdownToHtml(rawContent)
  const related = getRelatedArticles(article)
  const seriesArticles = article.series ? getSeriesArticles(article.series) : []
  return <ResearchLayout article={{ ...article, contentHtml }} relatedArticles={related} seriesArticles={seriesArticles} />
}
