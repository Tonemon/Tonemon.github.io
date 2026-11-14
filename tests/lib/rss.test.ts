import path from 'path'

// Set CONTENT_DIR_OVERRIDE before importing rss.ts so it uses fixtures
process.env.CONTENT_DIR_OVERRIDE = path.join(__dirname, '../fixtures')

import { generateRssFeed } from '@/lib/rss'

describe('generateRssFeed', () => {
  const xml = generateRssFeed()

  it("is titled Tony's Blog", () => {
    expect(xml).toContain("<title>Tony's Blog</title>")
  })

  it('links items with the trailing slash the site uses', () => {
    expect(xml).toContain('<link>https://tonemon.github.io/writeups/test-article/</link>')
    expect(xml).toContain('<guid isPermaLink="true">https://tonemon.github.io/writeups/test-article/</guid>')
  })
})

describe('generateRssFeed with versioned articles', () => {
  const xml = generateRssFeed()

  it('lists a versioned article once, under its original date', () => {
    expect(xml.match(/\/writeups\/versioned\//g)).toHaveLength(2)
    expect(xml).not.toContain('versioned-v2')
    const item = xml.split('<item>').find(i => i.includes('/writeups/versioned/'))!
    expect(item).toContain(`<pubDate>${new Date('2025-03-01').toUTCString()}</pubDate>`)
  })
})
