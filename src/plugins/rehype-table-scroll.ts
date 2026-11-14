import { visit, SKIP } from 'unist-util-visit'
import type { Root, Element } from 'hast'

// Wide tables scroll inside their own box instead of widening the page on phones
export default function rehypeTableScroll() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === undefined) return
      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'] },
        children: [node],
      }
      return SKIP
    })
  }
}
