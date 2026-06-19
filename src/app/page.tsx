import Link from 'next/link'
import { getAllArticles } from '@/lib/content'
import SearchBar from '@/components/SearchBar'
import FeedClient from '@/components/FeedClient'
import siteConfig from '../../site.config'
import { LinkedInIcon } from '@/components/icons'
import type { SocialIcon } from '@/types/content'

const FOCUS_COLOR_CLASS: Record<string, string> = {
  red:    'focus-badge-red',
  purple: 'focus-badge-purple',
  blue:   'focus-badge-blue',
  green:  'focus-badge-green',
  yellow: 'focus-badge-yellow',
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
      {icon === 'github' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/avatar.png" alt="GitHub" className="w-4 h-4 rounded-full" />
      )}
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
      <section className="min-h-[33vh] flex flex-col justify-center px-14 py-12 border-b border-gh-subtle">
        <div className="w-2/3">
          <p className="text-[14px] text-gh-muted mb-2.5 tracking-wide">Hi there, I&apos;m</p>
          <h1 className="text-[36px] font-bold text-gh-text leading-tight mb-3.5">
            {siteConfig.name}<span className="text-gh-accent">.</span>
          </h1>
          <p className="text-[16px] text-gh-muted leading-[1.7] mb-5">{siteConfig.bio}</p>

          {/* Currently focusing on */}
          <div className="flex items-center flex-wrap gap-2.5 mb-6">
            <span className="text-[12px] text-gh-muted whitespace-nowrap">Currently focusing on</span>
            <div className="flex gap-1.5 flex-wrap">
              {siteConfig.focusBadges.map(badge => (
                <span
                  key={badge.label}
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${FOCUS_COLOR_CLASS[badge.color] ?? 'focus-badge-blue'}`}
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
      <section className="px-14 py-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[14px] font-bold uppercase tracking-widest text-gh-muted">All posts</span>
          <SearchBar />
        </div>

        <FeedClient articles={articles} showFilter={true} />
      </section>
    </>
  )
}
