export type Category = 'writeup' | 'project' | 'research'
export type Platform = 'hackthebox' | 'tryhackme' | 'vulnhub' | 'ctfd'
export type Difficulty = 'easy' | 'medium' | 'hard' | 'insane'
export type FocusColor = 'red' | 'purple' | 'blue' | 'green' | 'yellow'
export type SocialIcon = 'github' | 'linkedin' | 'twitter' | 'email'

export interface FrontMatter {
  title: string
  date: string
  category: Category
  tags: string[]
  excerpt: string
  coverImage?: string
  paperUrl?: string
  paperCover?: string
  platform?: Platform
  difficulty?: Difficulty
  series?: string
  series_part?: number
}

export interface ArticleMeta extends FrontMatter {
  slug: string
  readingTime: number
}

export interface Article extends ArticleMeta {
  contentHtml: string
}

export interface FocusBadge {
  label: string
  color: FocusColor
}

export interface Social {
  label: string
  url: string
  icon: SocialIcon
}

export interface SiteConfig {
  name: string
  url: string
  bio: string
  focusBadges: FocusBadge[]
  socials: Social[]
}
