import { ImageResponse } from 'next/og'
import { getArticle, getAllArticleMeta } from '@/lib/content'
import type { Category } from '@/types/content'

export const dynamic = 'force-static'

const CATEGORY_COLORS: Record<string, string> = {
  writeup:  '#79c0ff',
  project:  '#56d364',
  research: '#d2a8ff',
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  const { category, slug } = await params

  let title = 'tonemon.github.io'
  let excerpt = ''

  try {
    const article = getArticle(category as Category, slug)
    title = article.title
    excerpt = article.excerpt ?? ''
  } catch {
    // fallback to defaults above
  }

  const accentColor = CATEGORY_COLORS[category] ?? '#58a6ff'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: accentColor,
            marginBottom: '20px',
          }}
        >
          {category}
        </div>
        <div
          style={{
            fontSize: '52px',
            fontWeight: 700,
            color: '#e6edf3',
            lineHeight: 1.2,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '20px',
            color: '#8b949e',
            lineHeight: 1.5,
            maxWidth: '800px',
          }}
        >
          {excerpt}
        </div>
        <div
          style={{
            marginTop: 'auto',
            fontSize: '16px',
            color: '#30363d',
            letterSpacing: '0.05em',
          }}
        >
          tonemon.github.io
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

export async function generateStaticParams() {
  const articles = getAllArticleMeta()
  return articles.map(a => ({ category: a.category, slug: a.slug }))
}
