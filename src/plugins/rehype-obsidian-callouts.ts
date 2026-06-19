import { visit } from 'unist-util-visit'
import type { Root, Element, Text } from 'hast'

const CALLOUT_STYLES: Record<string, { border: string; titleColor: string; icon: string }> = {
  NOTE:       { border: '#58a6ff', titleColor: '#58a6ff', icon: '📝' },
  TIP:        { border: '#56d364', titleColor: '#56d364', icon: '💡' },
  WARNING:    { border: '#f0c040', titleColor: '#f0c040', icon: '⚠️' },
  DANGER:     { border: '#ff7b72', titleColor: '#ff7b72', icon: '🚨' },
  DISCLOSURE: { border: '#79c0ff', titleColor: '#79c0ff', icon: '📋' },
}

function getCalloutType(node: Element): string | null {
  const first = node.children.find(c => c.type === 'element') as Element | undefined
  if (!first) return null
  const textNode = first.children.find(c => c.type === 'text') as Text | undefined
  const text = textNode?.value ?? ''
  const match = text.match(/^\[!([\w]+)\]/)
  return match ? match[1].toUpperCase() : null
}

function allText(nodes: (Element | Text | { type: string })[]): string {
  return nodes.map(n => {
    if (n.type === 'text') return (n as Text).value
    if (n.type === 'element') return allText((n as Element).children as (Element | Text)[])
    return ''
  }).join('')
}

export default function rehypeObsidianCallouts() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'blockquote' || !parent || index == null) return
      const type = getCalloutType(node)
      if (!type || !CALLOUT_STYLES[type]) return
      const style = CALLOUT_STYLES[type]

      const firstParagraph = node.children.find(c => (c as Element).type === 'element') as Element | undefined
      const firstText = firstParagraph ? allText(firstParagraph.children as (Element | Text)[]) : ''
      const titleText = firstText.replace(/^\[!\w+\]\s*/, '').trim()
      const bodyNodes = node.children.filter(c => c !== firstParagraph)

      if (type === 'DISCLOSURE') {
        // Collect list items for timeline
        const lines: string[] = []
        bodyNodes.forEach(child => {
          const el = child as Element
          if (el.tagName === 'ul' || el.tagName === 'ol') {
            el.children.forEach(li => {
              const text = allText((li as Element).children as (Element | Text)[]).trim()
              if (text) lines.push(text)
            })
          }
        })

        const items = lines.map(l => {
          const parts = l.replace(/^-\s*/, '').split(/\s*—\s*/)
          return { date: parts[0]?.trim() ?? '', event: parts.slice(1).join(' — ').trim() || l }
        })

        const timelineRows = items.map((item, i) => ({
          type: 'raw' as const,
          value: `<div style="display:flex;gap:12px;align-items:flex-start;${i < items.length - 1 ? 'padding-bottom:10px' : ''}"><div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0"><div style="width:10px;height:10px;border-radius:50%;background:${style.border};margin-top:3px"></div>${i < items.length - 1 ? `<div style="width:2px;flex:1;background:#30363d;margin-top:2px;min-height:16px"></div>` : ''}</div><div style="font-size:11px;color:#8b949e;font-family:monospace;white-space:nowrap;padding-top:2px;min-width:90px">${item.date}</div><div style="font-size:12px;color:#e6edf3;padding-top:2px;line-height:1.4">${item.event}</div></div>`,
        }))

        const callout: Element = {
          type: 'element', tagName: 'div',
          properties: { style: `background:#111820;border:1px solid #1f3a5a;border-radius:8px;padding:14px 16px;margin:1rem 0` },
          children: [
            { type: 'element', tagName: 'div', properties: { style: `font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${style.titleColor};margin-bottom:12px` }, children: [{ type: 'text', value: `${style.icon} ${titleText || 'Disclosure'}` }] } as Element,
            ...timelineRows as unknown as Element[],
          ],
        }
        parent.children.splice(index, 1, callout)
        return
      }

      const callout: Element = {
        type: 'element', tagName: 'div',
        properties: { style: `background:#1c2128;border-left:3px solid ${style.border};border-radius:0 6px 6px 0;padding:10px 14px;margin:1rem 0` },
        children: [
          { type: 'element', tagName: 'div', properties: { style: `font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${style.titleColor};margin-bottom:4px` }, children: [{ type: 'text', value: `${style.icon} ${type}${titleText ? ': ' + titleText : ''}` }] } as Element,
          ...bodyNodes,
        ],
      }
      parent.children.splice(index, 1, callout)
    })
  }
}
