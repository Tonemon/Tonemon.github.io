import { format } from 'date-fns'
import Link from 'next/link'
import type { Article, ArticleMeta } from '@/types/content'
import Sidebar from '@/components/Sidebar'
import SeriesNavigator from '@/components/SeriesNavigator'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import ImageCarousel from '@/components/ImageCarousel'
import { CATEGORY_STYLES } from '@/components/badges'
import { extractHeadings } from '@/lib/toc'

interface ResearchLayoutProps {
  article: Article
  relatedArticles: ArticleMeta[]
  seriesArticles: ArticleMeta[]
}

export default function ResearchLayout({ article, relatedArticles, seriesArticles }: ResearchLayoutProps) {
  const { title, date, category, tags, readingTime, contentHtml, paperUrl, paperCover } = article

  const seriesNav = article.series && seriesArticles.length > 1 ? (
    <SeriesNavigator
      seriesName={article.series}
      parts={seriesArticles}
      currentSlug={article.slug}
    />
  ) : null

  const toc = extractHeadings(contentHtml)

  return (
    <>
      <ReadingProgressBar />
      <div className="px-4 sm:px-14 py-7">
        <Link href="/research" className="text-[12px] text-gh-muted hover:text-gh-accent mb-4 inline-block">
          ← Research
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr]">
          <article className="pr-0 md:pr-7 min-w-0">
            <header className="mb-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${CATEGORY_STYLES[category]}`}>
                  {category}
                </span>
              </div>
              <h1 className="text-[22px] font-bold text-gh-text leading-snug mb-2">{title}</h1>
              <div className="flex gap-3 text-[13px] text-gh-muted mb-3">
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
              {seriesNav && <div className="md:hidden mt-5">{seriesNav}</div>}
              {paperUrl && (
                <div className="md:hidden mt-4 flex gap-2">
                  <a
                    href={paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-[14px] text-gh-accent border border-gh-border rounded px-3 py-2 hover:border-gh-accent transition-colors text-center"
                  >
                    View PDF
                  </a>
                  <a
                    href={paperUrl}
                    download
                    className="text-[13px] text-gh-accent border border-gh-border rounded px-3 py-2 hover:border-gh-accent transition-colors"
                  >
                    ↓ Download
                  </a>
                </div>
              )}
            </header>
            <div className="prose-article" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            <ImageCarousel />
          </article>
          <div className="hidden md:block">
            <Sidebar
              relatedArticles={relatedArticles}
              tags={tags}
              paperUrl={paperUrl}
              paperCover={paperCover}
              seriesNavigator={seriesNav}
              toc={toc}
            />
          </div>
        </div>
      </div>
    </>
  )
}
