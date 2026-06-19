import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { markdownToHtml } from '@/lib/markdown'
import { getAllArticles, getAllTags } from '@/lib/content'
import { articleHref } from '@/lib/urls'

export const metadata: Metadata = { title: 'About' }

export default async function AboutPage() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'content/about.md'), 'utf-8')
  const { content } = matter(raw)
  const html = await markdownToHtml(content)
  const recentArticles = getAllArticles().slice(0, 5)
  const popularTags = getAllTags().sort((a, b) => b.count - a.count).slice(0, 8).map(t => t.tag)

  return (
    <div className="px-4 sm:px-14 py-12 min-h-[calc(100vh-62px)] flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div className="pr-0 md:pr-10 md:border-r border-gh-subtle">
          <h1 className="text-[22px] font-bold text-gh-text mb-6">About</h1>
          <div className="prose-article no-heading-anchors" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <aside className="hidden md:block pl-8 self-start sticky top-[78px]">
          <div className="mb-7">
            <p className="text-[12px] font-bold uppercase tracking-widest text-gh-muted mb-3">Read Posts</p>
            {recentArticles.map(a => (
              <Link
                key={`${a.category}-${a.slug}`}
                href={articleHref(a.category, a.slug)}
                className="block text-gh-accent text-[14px] border-b border-gh-subtle pb-3 mb-3 leading-snug hover:underline"
              >
                {a.title}
                <small className="block text-gh-muted text-[12px] mt-1">
                  {a.category.charAt(0).toUpperCase() + a.category.slice(1)} · {a.date.slice(0, 7)}
                </small>
              </Link>
            ))}
          </div>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-widest text-gh-muted mb-3">Popular Tags</p>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="text-[13px] text-gh-accent bg-gh-bg border border-gh-border rounded-full px-3 py-0.5 hover:border-gh-accent transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
