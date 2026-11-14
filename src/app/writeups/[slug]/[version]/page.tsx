import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { articleMetadata, articleVersionStaticParams, parseVersionParam, renderArticlePage } from '@/lib/article-page'
import WriteupLayout from '@/components/layouts/WriteupLayout'

interface Props { params: Promise<{ slug: string; version: string }> }

export const dynamicParams = false

export async function generateStaticParams() {
  return articleVersionStaticParams('writeup')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, version } = await params
  const v = parseVersionParam(version)
  return v ? articleMetadata('writeup', slug, v) : {}
}

export default async function WriteupVersionPage({ params }: Props) {
  const { slug, version } = await params
  const v = parseVersionParam(version)
  if (!v) notFound()
  return renderArticlePage('writeup', slug, v, WriteupLayout)
}
