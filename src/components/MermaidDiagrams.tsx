'use client'
import { useEffect } from 'react'

export default function MermaidDiagrams() {
  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('.prose-article pre.mermaid'))
    if (blocks.length === 0) return

    let cancelled = false
    let renderCount = 0

    async function render() {
      const { default: mermaid } = await import('mermaid')
      const dark = document.documentElement.classList.contains('dark')
      mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'default', securityLevel: 'strict' })
      renderCount++
      for (const [i, block] of blocks.entries()) {
        const source = block.dataset.source
        if (!source) continue
        try {
          const { svg } = await mermaid.render(`mermaid-${renderCount}-${i}`, source)
          if (cancelled) return
          block.innerHTML = svg
          block.dataset.rendered = 'true'
        } catch (err) {
          console.error('Mermaid render failed', err)
        }
      }
    }

    render()

    // Re-render when ThemeToggle flips the `dark` class on <html>
    const observer = new MutationObserver(() => render())
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [])

  return null
}
