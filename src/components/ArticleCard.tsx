import Link from 'next/link'
import { format } from 'date-fns'
import type { ArticleMeta } from '@/types/content'
import { CATEGORY_STYLES, PLATFORM_STYLES, DIFFICULTY_STYLES } from './badges'

function articleHref(article: ArticleMeta): string {
  return `/${article.category}s/${article.slug}`
}

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  const { title, date, category, tags, excerpt, coverImage, platform, difficulty, readingTime } = article
  const platformInfo = platform ? PLATFORM_STYLES[platform] : null
  const difficultyInfo = difficulty ? DIFFICULTY_STYLES[difficulty] : null

  return (
    <Link href={articleHref(article)} className="group block">
      <div className="flex gap-4 items-start py-6 border-b border-gh-subtle">
        {coverImage && (
          <div
            className="w-20 h-14 flex-shrink-0 rounded-md border border-gh-border bg-cover bg-center"
            style={{ backgroundImage: `url(${coverImage})` }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${CATEGORY_STYLES[category]}`}>
              {category}
            </span>
            {platformInfo && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${platformInfo.style}`}>
                {platformInfo.label}
              </span>
            )}
            {difficultyInfo && (
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${difficultyInfo.color}`} />
                <span className="text-[10px] text-gh-muted">{difficultyInfo.label}</span>
              </span>
            )}
            <span className="text-[11px] text-gh-muted">{format(new Date(date), 'MMM d, yyyy')}</span>
            <span className="text-[11px] text-gh-muted ml-auto">{readingTime} min read</span>
          </div>
          <h2 className="text-[15px] font-semibold text-gh-text leading-snug mb-1.5 group-hover:text-gh-accent transition-colors">
            {title}
          </h2>
          <p className="text-[12px] text-gh-muted leading-relaxed mb-2 line-clamp-2">{excerpt}</p>
          <div className="flex gap-1.5 flex-wrap">
            {tags.map(tag => (
              <span key={tag} className="text-[10px] text-gh-accent bg-gh-bg border border-gh-border rounded-full px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
