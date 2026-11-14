import type { Metadata } from 'next'
import { articleMetadata, articleStaticParams, renderArticlePage } from '@/lib/article-page'
import ResearchLayout from '@/components/layouts/ResearchLayout'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return articleStaticParams('research')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return articleMetadata('research', slug)
}

export default async function ResearchPage({ params }: Props) {
  const { slug } = await params
  return renderArticlePage('research', slug, undefined, ResearchLayout)
}
