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

  it('turns mermaid fences into unhighlighted mermaid blocks', async () => {
    const md = '```mermaid\nflowchart LR\n  a --> b\n```'
    const html = await markdownToHtml(md)
    expect(html).toContain('<pre class="mermaid"')
    expect(html).toContain('data-source="flowchart LR\n  a --> b"')
    expect(html).not.toContain('data-language="mermaid"')
  })

  it('gives shell blocks a terminal header with a copy button', async () => {
    const html = await markdownToHtml('```bash\necho hi\n```')
    expect(html).toContain('data-terminal="true"')
    expect(html).toContain('<span class="code-label">terminal</span>')
    expect(html).toContain('class="code-copy"')
  })

  it.each(['console', 'powershell', 'fish', 'cmd'])('treats %s blocks as terminal blocks', async lang => {
    const html = await markdownToHtml('```' + lang + '\necho hi\n```')
    expect(html).toContain('data-terminal="true"')
    expect(html).toContain('<span class="code-label">terminal</span>')
  })

  it('renders output blocks as dark, dotless terminal output', async () => {
    const html = await markdownToHtml('```output\nPING 8.8.8.8\n```')
    expect(html).toContain('data-terminal="true"')
    expect(html).toContain('data-output="true"')
    expect(html).toContain('<span class="code-label">output</span>')
    expect(html).not.toContain('code-dots')
  })

  it('labels code blocks by language, and leaves plain text unlabelled', async () => {
    const ini = await markdownToHtml('```ini\n[usim]\nk = 1\n```')
    expect(ini).toContain('data-lang="ini"')
    expect(ini).toContain('<span class="code-label">ini</span>')
    const text = await markdownToHtml('```text\nhello\n```')
    expect(text).toContain('class="code-header code-header-floating"')
    expect(text).not.toContain('code-label')
    expect(text).toContain('class="code-copy"')
  })

  it('uses a code block title as the header label', async () => {
    const html = await markdownToHtml('```yaml title="mme.yaml"\na: 1\n```')
    expect(html).toContain('<span class="code-label">mme.yaml</span>')
    expect(html).not.toContain('<figcaption')
  })

  it('renders fenced code blocks', async () => {
    const md = '```python\nprint("hello")\n```'
    const html = await markdownToHtml(md)
    expect(html).toContain('pre')
  })
})
