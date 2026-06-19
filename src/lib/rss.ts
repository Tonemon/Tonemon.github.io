import { getAllArticles } from './content'
import { articleHref } from './urls'
import type { ArticleMeta } from '@/types/content'
import siteConfig from '../../site.config'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function articleToItem(article: ArticleMeta): string {
  const url = `${siteConfig.url}${articleHref(article.category, article.slug)}`
  return `
  <item>
    <title>${escapeXml(article.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description>${escapeXml(article.excerpt)}</description>
    <pubDate>${new Date(article.date).toUTCString()}</pubDate>
    <category>${escapeXml(article.category)}</category>
  </item>`
}

export function generateRssFeed(): string {
  const articles = getAllArticles()
  const items = articles.map(articleToItem).join('')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.bio)}</description>
    <language>en</language>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`
}
