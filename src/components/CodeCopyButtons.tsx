'use client'
import { useEffect } from 'react'

export default function CodeCopyButtons() {
  useEffect(() => {
    async function handleClick(e: MouseEvent) {
      const button = (e.target as HTMLElement).closest<HTMLButtonElement>('.prose-article .code-copy')
      if (!button) return
      const code = button.closest('figure')?.querySelector('pre code') as HTMLElement | null
      if (!code) return
      try {
        await navigator.clipboard.writeText(code.innerText.replace(/\n$/, ''))
        button.textContent = 'Copied'
      } catch {
        button.textContent = 'Failed'
      }
      setTimeout(() => { button.textContent = 'Copy' }, 1500)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
