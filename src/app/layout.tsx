import type { Metadata } from 'next'
import './globals.css'
import 'katex/dist/katex.min.css'
import Navbar from '@/components/Navbar'
import siteConfig from '../../site.config'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.bio,
  icons: {
    icon: '/avatar.png',
    shortcut: '/avatar.png',
    apple: '/avatar.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&d)){document.documentElement.classList.add('dark');}})();` }} />
        <link rel="alternate" type="application/rss+xml" title="Tony's Blog" href="/feed.xml" />
      </head>
      <body className="min-h-screen bg-gh-bg text-gh-text antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
