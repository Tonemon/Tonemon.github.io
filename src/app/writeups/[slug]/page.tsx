import type { Metadata } from 'next'
import { articleMetadata, articleStaticParams, renderArticlePage } from '@/lib/article-page'
import WriteupLayout from '@/components/layouts/WriteupLayout'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return articleStaticParams('writeup')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return articleMetadata('writeup', slug)
}

export default async function WriteupPage({ params }: Props) {
  const { slug } = await params
  return renderArticlePage('writeup', slug, undefined, WriteupLayout)
}
