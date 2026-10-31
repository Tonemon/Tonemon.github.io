import { visit } from 'unist-util-visit'
import type { Root, Element, ElementContent, Text } from 'hast'

const TERMINAL_LANGS = new Set([
  'bash', 'sh', 'zsh', 'shell', 'shellscript', 'fish', 'nu', 'nushell',
  'console', 'shellsession',
  'powershell', 'ps', 'ps1', 'pwsh',
  'cmd', 'bat', 'batch',
])
// Command output: dark like a terminal, but without dots or highlighting
const OUTPUT_LANGS = new Set(['output', 'out', 'stdout'])
const PLAIN_LANGS = new Set(['text', 'txt', 'plaintext', 'code'])

// Runs after rehype-pretty-code: gives every code figure a header bar with a
// label (terminal dots for shell blocks, the language or title otherwise) and a
// copy button that the CodeCopyButtons client component wires up.
export default function rehypeCodeDistinction() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'figure' || !('data-rehype-pretty-code-figure' in node.properties)) return
      const pre = node.children.find((c): c is Element => c.type === 'element' && c.tagName === 'pre')
      if (!pre) return
      const lang = String(pre.properties['data-language'] ?? '')
      const output = OUTPUT_LANGS.has(lang)
      const terminal = TERMINAL_LANGS.has(lang)

      // A ```lang title="..." caption becomes the header label instead
      const caption = node.children.find(
        (c): c is Element => c.type === 'element' && c.tagName === 'figcaption'
      )
      const title = caption?.children
        .filter((c): c is Text => c.type === 'text')
        .map(c => c.value)
        .join('')
      const label =
        title || (terminal ? 'terminal' : output ? 'output' : PLAIN_LANGS.has(lang) ? '' : lang)

      const header: ElementContent[] = []
      if (terminal) {
        header.push({
          type: 'element',
          tagName: 'span',
          properties: { className: ['code-dots'], ariaHidden: 'true' },
          children: [{ type: 'text', value: '● ● ●' }],
        })
      }
      if (label) {
        header.push({
          type: 'element',
          tagName: 'span',
          properties: { className: ['code-label'] },
          children: [{ type: 'text', value: label }],
        })
      }
      header.push(
        {
          type: 'element',
          tagName: 'button',
          properties: { type: 'button', className: ['code-copy'], ariaLabel: 'Copy code' },
          children: [{ type: 'text', value: 'Copy' }],
        }
      )

      node.properties = {
        ...node.properties,
        ...(terminal
          ? { 'data-terminal': 'true' }
          : output
            ? { 'data-terminal': 'true', 'data-output': 'true' }
            : { 'data-lang': lang }),
      }
      // Unlabelled blocks get no header bar, only a copy button floating over the code
      const headerClass = label ? ['code-header'] : ['code-header', 'code-header-floating']
      node.children = [
        { type: 'element', tagName: 'div', properties: { className: headerClass }, children: header },
        pre,
      ]
    })
  }
}
