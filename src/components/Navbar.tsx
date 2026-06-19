'use client'
import { useState } from 'react'
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
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-gh-border bg-gh-surface">
      <div className="flex h-[62px] items-center px-4 sm:px-14">
        <Link href="/" className="flex items-center gap-2 text-gh-text">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/avatar.png" alt="Tony" className="h-[26px] w-[26px] rounded-full" />
          <span className="text-[17px] font-bold">Tony</span>
        </Link>
        <div className="flex-1" />
        <div className="hidden sm:flex items-center gap-6 text-[15px]">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="text-gh-muted hover:text-gh-text transition-colors">
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
        <div className="flex sm:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setOpen(o => !o)}
            className="text-gh-muted hover:text-gh-text p-1"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 4l12 12M16 4L4 16" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 5h14M3 10h14M3 15h14" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {open && (
        <div className="sm:hidden border-t border-gh-border bg-gh-surface px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[15px] text-gh-muted hover:text-gh-text transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
