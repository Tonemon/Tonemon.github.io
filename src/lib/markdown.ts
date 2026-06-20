import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkWikiLink from 'remark-wiki-link'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'
import rehypeObsidianCallouts from '@/plugins/rehype-obsidian-callouts'
import rehypeEmbeddedFiles from '@/plugins/rehype-embedded-files'
import rehypeCveLinks from '@/plugins/rehype-cve-links'
import rehypeAnchorLinks from '@/plugins/rehype-anchor-links'
import rehypeCodeDistinction from '@/plugins/rehype-code-distinction'
import rehypeImageCarousel from '@/plugins/rehype-image-carousel'
import rehypeExternalLinks from '@/plugins/rehype-external-links'
import rehypeImageCaptions from '@/plugins/rehype-image-captions'
import { fetchCveInfo } from '@/lib/cve-data'

export async function markdownToHtml(content: string): Promise<string> {
  // Pre-fetch CVE data at build time
  const cveMatches = [...content.matchAll(/CVE-\d{4}-\d{4,}/g)].map(m => m[0])
  const cveData = new Map<string, { description: string; severity: string; cvss: string }>()
  await Promise.all(
    [...new Set(cveMatches)].map(async id => {
      const info = await fetchCveInfo(id)
      if (info) cveData.set(id, info)
    })
  )

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkWikiLink, {
      pageResolver: (name: string) => [name.toLowerCase().replace(/\s+/g, '-')],
      hrefTemplate: (permalink: string) => `/${permalink}`,
      aliasDivider: '|',
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeObsidianCallouts)
    .use(rehypeEmbeddedFiles)
    .use(rehypeCveLinks, cveData)
    .use(rehypeKatex)
    .use(rehypePrettyCode, {
      theme: 'github-dark',
      keepBackground: true,
    })
    .use(rehypeCodeDistinction)
    .use(rehypeAnchorLinks)
    .use(rehypeExternalLinks)
    .use(rehypeImageCaptions)
    .use(rehypeImageCarousel)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)
  return String(result)
}
