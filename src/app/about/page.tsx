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
    <div className="px-14 py-8">
      <div className="grid grid-cols-[2fr_1fr]">
        <div className="pr-10 border-r border-gh-subtle">
          <h1 className="text-[22px] font-bold text-gh-text mb-6">About</h1>
          <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <aside className="pl-8 sticky top-[68px] max-h-[calc(100vh-80px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gh-muted mb-3">Read Posts</p>
            {recentArticles.map(a => (
              <Link
                key={`${a.category}-${a.slug}`}
                href={articleHref(a.category, a.slug)}
                className="block text-gh-accent text-[11px] border-b border-gh-subtle pb-2 mb-2 leading-snug hover:underline"
              >
                {a.title}
                <small className="block text-gh-muted text-[10px] mt-0.5">
                  {a.category.charAt(0).toUpperCase() + a.category.slice(1)} · {a.date.slice(0, 7)}
                </small>
              </Link>
            ))}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gh-muted mb-2">Popular Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {popularTags.map(tag => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="text-[10px] text-gh-accent bg-gh-bg border border-gh-border rounded-full px-2 py-0.5 hover:border-gh-accent transition-colors"
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
