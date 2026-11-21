import { visit, SKIP } from 'unist-util-visit'
import type { Root, Element } from 'hast'

const VIDEO_EXT = /\.(mp4|webm|mov)(\?.*)?$/i

// Turns ![caption](/videos/clip.webm) into a muted, looping video that plays
// like a GIF, full width and with the same caption as images.
export default function rehypeVideoEmbeds() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'img' || !parent || index === undefined) return
      const src = node.properties?.src
      if (typeof src !== 'string' || !VIDEO_EXT.test(src)) return

      const alt = typeof node.properties?.alt === 'string' ? node.properties.alt.trim() : ''
      const video: Element = {
        type: 'element',
        tagName: 'video',
        properties: {
          src,
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          ...(alt && { ariaLabel: alt }),
        },
        children: [],
      }

      parent.children[index] = alt
        ? {
            type: 'element',
            tagName: 'figure',
            properties: { className: ['prose-article-figure', 'prose-article-figure-video'] },
            children: [
              video,
              {
                type: 'element',
                tagName: 'figcaption',
                properties: { className: ['prose-article-figcaption'] },
                children: [{ type: 'text', value: alt }],
              },
            ],
          }
        : video
      return SKIP
    })
  }
}
