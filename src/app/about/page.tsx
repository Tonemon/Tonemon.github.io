import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { markdownToHtml } from '@/lib/markdown'
import { getAllArticles, getAllTags } from '@/lib/content'

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
            <p className="text-[11px] font-bold uppercase tracking-widest text-gh-muted mb-3">Read Posts</p>
            {recentArticles.map(a => (
              <div key={`${a.category}-${a.slug}`} className="border-b border-gh-subtle pb-2 mb-2">
                <span className="block text-[12px] text-gh-text leading-snug">{a.title}</span>
                <small className="block text-gh-muted text-[11px] mt-0.5">
                  {a.category.charAt(0).toUpperCase() + a.category.slice(1)} · {a.date.slice(0, 7)}
                </small>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gh-muted mb-2">Popular Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {popularTags.map(tag => (
                <span
                  key={tag}
                  className="text-[11px] text-gh-muted bg-gh-bg border border-gh-border rounded-full px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
