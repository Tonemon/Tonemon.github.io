import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { articleMetadata, articleVersionStaticParams, parseVersionParam, renderArticlePage } from '@/lib/article-page'
import ProjectLayout from '@/components/layouts/ProjectLayout'

interface Props { params: Promise<{ slug: string; version: string }> }

export const dynamicParams = false

export async function generateStaticParams() {
  return articleVersionStaticParams('project')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, version } = await params
  const v = parseVersionParam(version)
  return v ? articleMetadata('project', slug, v) : {}
}

export default async function ProjectVersionPage({ params }: Props) {
  const { slug, version } = await params
  const v = parseVersionParam(version)
  if (!v) notFound()
  return renderArticlePage('project', slug, v, ProjectLayout)
}
