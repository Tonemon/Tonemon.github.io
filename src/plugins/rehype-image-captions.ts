import { visit, SKIP } from 'unist-util-visit'
import type { Root, Element } from 'hast'

export default function rehypeImageCaptions() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'img') return
      if (!parent || index === undefined) return

      const alt = node.properties?.alt
      if (!alt || typeof alt !== 'string' || !alt.trim()) return

      // Create a figure wrapper
      const figure: Element = {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['prose-article-figure'] },
        children: [
          node,
          {
            type: 'element',
            tagName: 'figcaption',
            properties: { className: ['prose-article-figcaption'] },
            children: [
              {
                type: 'text',
                value: alt,
              },
            ],
          },
        ],
      }

      // Replace the img node with the figure
      ;(parent.children as any)[index] = figure
      return SKIP
    })
  }
}
