import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'

export default function rehypeExternalLinks() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'a') return
      const href = node.properties?.href
      if (typeof href !== 'string') return

      // Skip internal links and anchors
      if (href.startsWith('/') || href.startsWith('#')) return

      node.properties.target = '_blank'
      node.properties.rel = 'noopener noreferrer'
    })
  }
}
