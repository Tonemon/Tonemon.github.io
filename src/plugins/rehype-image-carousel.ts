import { visit } from 'unist-util-visit'
import type { Root, Element, Node } from 'hast'

function isImg(node: unknown): node is Element {
  return (node as Element).type === 'element' && (node as Element).tagName === 'img'
}

function isWhitespace(node: Node): boolean {
  return node.type === 'text' && !((node as unknown as { value: string }).value.trim())
}

function meaningfulKids(el: Element): Element[] {
  return el.children.filter(c => !isWhitespace(c as Node)) as Element[]
}

function isImageParagraph(node: Node): boolean {
  if ((node as Element).type !== 'element') return false
  const el = node as Element
  if (el.tagName !== 'p') return false
  const kids = meaningfulKids(el)
  if (kids.length !== 1) return false
  return kids[0].tagName === 'img' || kids[0].tagName === 'figure'
}

export default function rehypeImageCarousel() {
  return (tree: Root) => {
    // Pass 1: group consecutive <img> siblings within the same parent (inline images)
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

    // Pass 2: group consecutive image-only paragraphs, skipping whitespace text
    // nodes that remarkRehype inserts between block elements
    const next: Node[] = []
    let i = 0
    while (i < tree.children.length) {
      const node = tree.children[i] as Node
      if (!isImageParagraph(node)) {
        next.push(node)
        i++
        continue
      }

      // Collect run of image paragraphs, transparently skipping whitespace nodes
      const run: Element[] = [node as Element]
      let j = i + 1
      while (j < tree.children.length) {
        const c = tree.children[j] as Node
        if (isImageParagraph(c)) {
          run.push(c as Element)
          j++
        } else if (isWhitespace(c)) {
          j++
        } else {
          break
        }
      }

      if (run.length >= 2) {
        next.push({
          type: 'element',
          tagName: 'div',
          properties: { 'data-carousel': 'true' },
          children: run.map(p => meaningfulKids(p)[0]),
        } as Element)
      } else {
        // Single image paragraph — restore everything consumed in the scan
        for (let k = i; k < j; k++) next.push(tree.children[k] as Node)
      }
      i = j
    }
    tree.children = next as typeof tree.children
  }
}
