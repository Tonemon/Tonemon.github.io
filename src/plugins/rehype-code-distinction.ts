import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'

const TERMINAL_LANGS = new Set(['bash', 'sh', 'zsh', 'shell'])

export default function rehypeCodeDistinction() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'pre') return
      const code = node.children[0] as Element | undefined
      if (!code || code.tagName !== 'code') return
      const lang = (code.properties?.className as string[] | undefined)
        ?.find((c: string) => c.startsWith('language-'))
        ?.replace('language-', '')
      if (!lang) return
      if (TERMINAL_LANGS.has(lang)) {
        node.properties = { ...node.properties, 'data-terminal': 'true' }
      } else {
        node.properties = { ...node.properties, 'data-lang': lang }
      }
    })
  }
}
