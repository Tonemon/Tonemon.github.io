'use client'
import { useSyncExternalStore } from 'react'

// The inline script in layout.tsx sets the `dark` class before hydration,
// so the class on <html> is the single source of truth for the theme.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

function getSnapshot() {
  return document.documentElement.classList.contains('dark')
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, () => true)

  function toggle() {
    const next = !dark
    localStorage.setItem('theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <button
      onClick={toggle}
      className="rounded border border-gh-border px-2 py-0.5 text-[12px] text-gh-muted hover:text-gh-text hover:border-gh-muted transition-colors"
      aria-label="Toggle dark mode"
    >
      {dark ? '☀ Light' : '☾ Dark'}
    </button>
  )
}
