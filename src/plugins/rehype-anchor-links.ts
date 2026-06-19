import { visit } from 'unist-util-visit'
import type { Root, Element, ElementContent } from 'hast'
import GithubSlugger from 'github-slugger'

function allText(nodes: ElementContent[]): string {
  return nodes
    .map(n => {
      if (n.type === 'text') return n.value
      if (n.type === 'element') return allText(n.children)
      return ''
    })
    .join('')
}

export default function rehypeAnchorLinks() {
  return (tree: Root) => {
    const slugger = new GithubSlugger()
    visit(tree, 'element', (node: Element) => {
      if (!['h2', 'h3', 'h4'].includes(node.tagName)) return
      const text = allText(node.children)
      if (!text.trim()) return
      const id = slugger.slug(text)
      node.properties = { ...node.properties, id }
      const anchor: Element = {
        type: 'element',
        tagName: 'a',
        properties: {
          href: `#${id}`,
          style: 'opacity:0;margin-left:6px;color:var(--accent);text-decoration:none;font-weight:400',
          'aria-hidden': 'true',
          className: ['anchor-link'],
        },
        children: [{ type: 'text', value: '#' }],
      }
      node.children.push(anchor)
      node.properties.className = ['group-heading']
    })
  }
}
