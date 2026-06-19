import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

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
      <div className="flex h-[62px] items-center px-14">
        <Link href="/" className="flex items-center gap-2 text-gh-text">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/avatar.png" alt="Tony" className="h-[26px] w-[26px] rounded-full" />
          <span className="text-[17px] font-bold">Tony</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-6 text-[15px]">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="text-gh-muted hover:text-gh-text transition-colors">
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
