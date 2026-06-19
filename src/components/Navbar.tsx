import Link from 'next/link'
import { GitHubIcon } from './icons'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/writeups', label: 'Writeups' },
  { href: '/projects', label: 'Projects' },
  { href: '/research', label: 'Research' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gh-border bg-gh-surface">
      <div className="flex h-[52px] items-center px-10">
        <Link href="/" className="flex items-center gap-2 text-gh-text">
          <GitHubIcon className="h-[22px] w-[22px]" />
          <span className="text-[15px] font-bold">Tony</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-6 text-[13px]">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-gh-muted hover:text-gh-text transition-colors"
            >
              {label}
            </Link>
          ))}
          {/* Dark mode toggle — implemented in Plan 2 */}
          <button
            disabled
            className="rounded border border-gh-border px-2 py-0.5 text-[12px] text-gh-muted opacity-50 cursor-not-allowed"
          >
            ☀ Light
          </button>
        </div>
      </div>
    </nav>
  )
}
