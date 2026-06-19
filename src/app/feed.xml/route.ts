import { generateRssFeed } from '@/lib/rss'

export const dynamic = 'force-static'

export function GET() {
  const xml = generateRssFeed()
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
