import { visit } from 'unist-util-visit'
import type { Root, Element, Text } from 'hast'

// Turns ```mermaid fences into <pre class="mermaid"> so rehype-pretty-code leaves
// them alone; the MermaidDiagrams client component renders them in the browser.
export default function rehypeMermaidBlocks() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'pre') return
      const code = node.children[0] as Element | undefined
      if (!code || code.tagName !== 'code') return
      const classes = code.properties?.className as string[] | undefined
      if (!classes?.includes('language-mermaid')) return
      const source = code.children
        .filter((c): c is Text => c.type === 'text')
        .map(c => c.value)
        .join('')
        .trim()
      node.properties = { className: ['mermaid'], 'data-source': source }
      node.children = [{ type: 'text', value: source }]
    })
  }
}
