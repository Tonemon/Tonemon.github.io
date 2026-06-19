import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { markdownToHtml } from '@/lib/markdown'

export const metadata: Metadata = { title: 'About' }

export default async function AboutPage() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'content/about.md'), 'utf-8')
  const { content } = matter(raw)
  const html = await markdownToHtml(content)

  return (
    <div className="px-10 py-8 max-w-2xl">
      <h1 className="text-[22px] font-bold text-gh-text mb-6">About</h1>
      <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
