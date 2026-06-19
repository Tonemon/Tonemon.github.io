import { format } from 'date-fns'
import Link from 'next/link'
import type { Article, ArticleMeta } from '@/types/content'
import Sidebar from '@/components/Sidebar'
import SeriesNavigator from '@/components/SeriesNavigator'
import { CATEGORY_STYLES, PLATFORM_STYLES, DIFFICULTY_STYLES } from '@/components/badges'

interface WriteupLayoutProps {
  article: Article
  relatedArticles: ArticleMeta[]
  seriesArticles: ArticleMeta[]
}

export default function WriteupLayout({ article, relatedArticles, seriesArticles }: WriteupLayoutProps) {
  const { title, date, category, tags, platform, difficulty, readingTime, contentHtml } = article

  const seriesNav = article.series && seriesArticles.length > 1 ? (
    <SeriesNavigator
      seriesName={article.series}
      parts={seriesArticles}
      currentSlug={article.slug}
    />
  ) : null

  return (
    <div className="px-10 py-7">
      <Link href="/writeups" className="text-[12px] text-gh-muted hover:text-gh-accent mb-4 inline-block">
        ← Writeups
      </Link>
      <div className="grid grid-cols-[3fr_1fr]">
        <article className="pr-7 min-w-0">
          <header className="mb-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${CATEGORY_STYLES[category]}`}>
                {category}
              </span>
              {platform && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${PLATFORM_STYLES[platform].style}`}>
                  {PLATFORM_STYLES[platform].label}
                </span>
              )}
              {difficulty && (
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${DIFFICULTY_STYLES[difficulty].color}`} />
                  <span className="text-[10px] text-gh-muted">{DIFFICULTY_STYLES[difficulty].label}</span>
                </span>
              )}
            </div>
            <h1 className="text-[22px] font-bold text-gh-text leading-snug mb-2">{title}</h1>
            <div className="flex gap-3 text-[12px] text-gh-muted mb-3">
              <span>{format(new Date(date), 'MMM d, yyyy')}</span>
              <span>·</span>
              <span>{readingTime} min read</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <Link key={tag} href={`/tags/${tag}`} className="text-[10px] text-gh-accent bg-gh-bg border border-gh-border rounded-full px-2 py-0.5 hover:border-gh-accent transition-colors">
                  {tag}
                </Link>
              ))}
            </div>
          </header>
          <div className="prose-article" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>
        <Sidebar relatedArticles={relatedArticles} tags={tags} seriesNavigator={seriesNav} />
      </div>
    </div>
  )
}
