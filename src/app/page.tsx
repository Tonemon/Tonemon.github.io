import Link from 'next/link'
import { getAllArticles } from '@/lib/content'
import ArticleCard from '@/components/ArticleCard'
import SearchBar from '@/components/SearchBar'
import siteConfig from '../../site.config'
import { GitHubIcon, LinkedInIcon } from '@/components/icons'
import type { SocialIcon } from '@/types/content'

const FOCUS_COLOR_STYLES: Record<string, string> = {
  red:    'text-[#ff7b72] border-[#6e2020] bg-[#1a0a0a]',
  purple: 'text-[#d2a8ff] border-[#5a3a7a] bg-[#1a0a2a]',
  blue:   'text-[#79c0ff] border-[#1f4068] bg-[#0d1a2a]',
  green:  'text-[#56d364] border-[#1a4a1a] bg-[#0a1a0a]',
  yellow: 'text-[#f0c040] border-[#4a3a1a] bg-[#1a1a0a]',
}

function SocialButton({ label, url, icon }: { label: string; url: string; icon: SocialIcon }) {
  const isLinkedIn = icon === 'linkedin'
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[13px] font-medium border transition-colors ${
        isLinkedIn
          ? 'text-gh-accent border-[#1f4068] bg-gh-bg hover:border-gh-accent'
          : 'text-gh-text border-gh-border bg-gh-surface hover:border-gh-muted'
      }`}
    >
      {icon === 'github' && <GitHubIcon className="w-4 h-4" />}
      {icon === 'linkedin' && <LinkedInIcon className="w-4 h-4" />}
      {label}
    </a>
  )
}

export default function HomePage() {
  const articles = getAllArticles()

  return (
    <>
      {/* Intro section (~1/3 vh) */}
      <section className="min-h-[33vh] flex flex-col justify-center px-10 py-12 border-b border-gh-subtle">
        <div className="w-2/3">
          <p className="text-[13px] text-gh-muted mb-2.5 tracking-wide">Hi there, I&apos;m</p>
          <h1 className="text-[36px] font-bold text-gh-text leading-tight mb-3.5">
            {siteConfig.name}<span className="text-gh-accent">.</span>
          </h1>
          <p className="text-[15px] text-gh-muted leading-[1.7] mb-5">{siteConfig.bio}</p>

          {/* Currently focusing on */}
          <div className="flex items-center flex-wrap gap-2.5 mb-6">
            <span className="text-[12px] text-gh-muted whitespace-nowrap">Currently focusing on</span>
            <div className="flex gap-1.5 flex-wrap">
              {siteConfig.focusBadges.map(badge => (
                <span
                  key={badge.label}
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${FOCUS_COLOR_STYLES[badge.color] ?? FOCUS_COLOR_STYLES.blue}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div className="flex gap-2.5 flex-wrap">
            {siteConfig.socials.map(social => (
              <SocialButton key={social.label} {...social} />
            ))}
          </div>
        </div>
      </section>

      {/* Feed section */}
      <section className="px-10 py-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] font-bold uppercase tracking-widest text-gh-muted">All posts</span>
          <SearchBar />
        </div>

        {/* Category filter pills — static display, interactive in Plan 2 */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {(['All', 'Writeups', 'Projects', 'Research'] as const).map(label => (
            <span
              key={label}
              className={`text-[11px] px-3 py-0.5 rounded-full border cursor-default ${
                label === 'All'
                  ? 'text-gh-accent border-gh-accent bg-gh-accent/[0.08]'
                  : 'text-gh-muted border-gh-border'
              }`}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Article feed */}
        {articles.length === 0 ? (
          <p className="text-gh-muted text-[14px] py-10">No articles yet — push a markdown file to content/ to get started.</p>
        ) : (
          articles.map(article => (
            <ArticleCard key={`${article.category}-${article.slug}`} article={article} />
          ))
        )}
      </section>
    </>
  )
}
