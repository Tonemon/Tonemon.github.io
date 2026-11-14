import type { Metadata } from 'next'
import { articleMetadata, articleStaticParams, renderArticlePage } from '@/lib/article-page'
import ProjectLayout from '@/components/layouts/ProjectLayout'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return articleStaticParams('project')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return articleMetadata('project', slug)
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  return renderArticlePage('project', slug, undefined, ProjectLayout)
}
