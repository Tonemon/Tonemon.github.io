import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { articleMetadata, articleVersionStaticParams, parseVersionParam, renderArticlePage } from '@/lib/article-page'
import ResearchLayout from '@/components/layouts/ResearchLayout'

interface Props { params: Promise<{ slug: string; version: string }> }

export const dynamicParams = false

export async function generateStaticParams() {
  return articleVersionStaticParams('research')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, version } = await params
  const v = parseVersionParam(version)
  return v ? articleMetadata('research', slug, v) : {}
}

export default async function ResearchVersionPage({ params }: Props) {
  const { slug, version } = await params
  const v = parseVersionParam(version)
  if (!v) notFound()
  return renderArticlePage('research', slug, v, ResearchLayout)
}
