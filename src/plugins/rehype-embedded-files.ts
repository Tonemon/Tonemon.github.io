import { visit } from 'unist-util-visit'
import type { Root, Text, Element } from 'hast'

export default function rehypeEmbeddedFiles() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index == null) return
      const match = node.value.match(/^!\[\[(.+?)\]\]$/)
      if (!match) return
      const filename = match[1]
      const imgEl: Element = {
        type: 'element', tagName: 'img',
        properties: { src: `/images/${filename}`, alt: filename },
        children: [],
      }
      ;(parent.children as (Element | Text)[])[index] = imgEl
    })
  }
}
