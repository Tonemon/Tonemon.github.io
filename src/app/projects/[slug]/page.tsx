import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticle, getArticleSlugs, getRelatedArticles, getArticleRawContent } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import ProjectLayout from '@/components/layouts/ProjectLayout'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getArticleSlugs('project').map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const article = getArticle('project', slug)
    return { title: article.title, description: article.excerpt }
  } catch {
    return {}
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  let article
  try {
    article = getArticle('project', slug)
  } catch {
    notFound()
  }
  const rawContent = getArticleRawContent('project', slug)
  const contentHtml = await markdownToHtml(rawContent)
  const related = getRelatedArticles(article)
  return <ProjectLayout article={{ ...article, contentHtml }} relatedArticles={related} />
}
