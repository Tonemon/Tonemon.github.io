import { markdownToHtml } from '@/lib/markdown'

describe('markdownToHtml', () => {
  it('renders basic markdown to HTML', async () => {
    const html = await markdownToHtml('**bold** and _italic_')
    expect(html).toContain('<strong>bold</strong>')
    expect(html).toContain('<em>italic</em>')
  })

  it('renders GFM tables', async () => {
    const md = `| A | B |\n|---|---|\n| 1 | 2 |`
    const html = await markdownToHtml(md)
    expect(html).toContain('<table>')
  })

  it('renders inline math', async () => {
    const html = await markdownToHtml('Equation: $x^2$')
    expect(html).toContain('katex')
  })

  it('renders wiki-links as anchor tags', async () => {
    const html = await markdownToHtml('See [[My Article]]')
    expect(html).toContain('href=')
    expect(html).toContain('my-article')
  })

  it('renders fenced code blocks', async () => {
    const md = '```python\nprint("hello")\n```'
    const html = await markdownToHtml(md)
    expect(html).toContain('pre')
  })
})
