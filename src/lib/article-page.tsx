import type { ComponentType } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticle, getArticleSlugs, getArticleVersions, getRelatedArticles, getArticleRawContent, getSeriesArticles } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import { articleHref } from '@/lib/urls'
import type { Article, ArticleMeta, Category } from '@/types/content'
import siteConfig from '../../site.config'

// Shared by the plain article routes and their /vN version routes

type ArticleLayout = ComponentType<{ article: Article; relatedArticles: ArticleMeta[]; seriesArticles: ArticleMeta[] }>

export function parseVersionParam(param: string): number | undefined {
  const match = /^v([1-9]\d*)$/.exec(param)
  return match ? Number(match[1]) : undefined
}

export function articleStaticParams(category: Category): { slug: string }[] {
  const slugs = getArticleSlugs(category)
  return slugs.length ? slugs.map(slug => ({ slug })) : [{ slug: '__empty__' }]
}

export function articleVersionStaticParams(category: Category): { slug: string; version: string }[] {
  const params = getArticleSlugs(category).flatMap(slug =>
    getArticleVersions(category, slug).map(v => ({ slug, version: `v${v.version}` }))
  )
  return params.length ? params : [{ slug: '__empty__', version: 'v1' }]
}

export async function articleMetadata(category: Category, slug: string, version?: number): Promise<Metadata> {
  try {
    const article = getArticle(category, slug, version)
    const isOld = article.version < article.versions[article.versions.length - 1].version
    return {
      title: article.title,
      description: article.excerpt,
      // The plain URL always shows the newest version, so it is the canonical one
      alternates: { canonical: `${siteConfig.url}${articleHref(category, slug)}/` },
      ...(isOld && { robots: { index: false, follow: true } }),
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: [`/og/${category}/${slug}`],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        images: [`/og/${category}/${slug}`],
      },
    }
  } catch {
    return {}
  }
}

export async function renderArticlePage(category: Category, slug: string, version: number | undefined, Layout: ArticleLayout) {
  let article
  try {
    article = getArticle(category, slug, version)
  } catch {
    notFound()
  }
  const contentHtml = await markdownToHtml(getArticleRawContent(category, slug, article.version))
  const related = getRelatedArticles(article)
  const seriesArticles = article.series ? getSeriesArticles(article.series) : []
  return <Layout article={{ ...article, contentHtml }} relatedArticles={related} seriesArticles={seriesArticles} />
}
