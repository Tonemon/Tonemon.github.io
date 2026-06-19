import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'

function isImg(node: unknown): node is Element {
  return (node as Element).type === 'element' && (node as Element).tagName === 'img'
}

export default function rehypeImageCarousel() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const children = node.children as Element[]
      let i = 0
      while (i < children.length) {
        if (!isImg(children[i])) { i++; continue }
        let j = i + 1
        while (j < children.length && isImg(children[j])) j++
        if (j - i >= 2) {
          const imgs = children.slice(i, j)
          const carousel: Element = {
            type: 'element',
            tagName: 'div',
            properties: { 'data-carousel': 'true' },
            children: imgs,
          }
          children.splice(i, j - i, carousel)
          i++
        } else {
          i = j
        }
      }
    })
  }
}
