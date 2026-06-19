import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticle, getArticleSlugs, getRelatedArticles, getArticleRawContent, getSeriesArticles } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import WriteupLayout from '@/components/layouts/WriteupLayout'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = getArticleSlugs('writeup')
  return slugs.length ? slugs.map(slug => ({ slug })) : [{ slug: '__empty__' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const article = getArticle('writeup', slug)
    return {
      title: article.title,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: [`/og/writeup/${slug}`],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        images: [`/og/writeup/${slug}`],
      },
    }
  } catch {
    return {}
  }
}

export default async function WriteupPage({ params }: Props) {
  const { slug } = await params
  let article
  try {
    article = getArticle('writeup', slug)
  } catch {
    notFound()
  }
  const rawContent = getArticleRawContent('writeup', slug)
  const contentHtml = await markdownToHtml(rawContent)
  const related = getRelatedArticles(article)
  const seriesArticles = article.series ? getSeriesArticles(article.series) : []
  return <WriteupLayout article={{ ...article, contentHtml }} relatedArticles={related} seriesArticles={seriesArticles} />
}
