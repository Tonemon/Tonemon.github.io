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
import rehypeAnchorLinks from '@/plugins/rehype-anchor-links'
import rehypeCodeDistinction from '@/plugins/rehype-code-distinction'
import rehypeImageCarousel from '@/plugins/rehype-image-carousel'

export async function markdownToHtml(content: string): Promise<string> {
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
    .use(rehypeKatex)
    .use(rehypePrettyCode, {
      theme: 'github-dark',
      keepBackground: true,
    })
    .use(rehypeCodeDistinction)
    .use(rehypeAnchorLinks)
    .use(rehypeImageCarousel)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)
  return String(result)
}
