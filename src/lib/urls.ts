import type { Category } from '@/types/content'

const CATEGORY_PATHS: Record<Category, string> = {
  writeup:  'writeups',
  project:  'projects',
  research: 'research',
}

export function articleHref(category: Category, slug: string): string {
  return `/${CATEGORY_PATHS[category]}/${slug}`
}
