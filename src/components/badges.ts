import type { Category, Platform, Difficulty } from '@/types/content'

export const CATEGORY_STYLES: Record<Category, string> = {
  writeup:  'bg-[#1f4068] text-[#79c0ff]',
  project:  'bg-[#1a3a1a] text-[#56d364]',
  research: 'bg-[#3a1a3a] text-[#d2a8ff]',
}

export const PLATFORM_STYLES: Record<Platform, { label: string; style: string }> = {
  hackthebox: { label: 'HackTheBox', style: 'bg-[#0a2a1a] text-[#9fef00] border border-[#1a4a2a]' },
  tryhackme:  { label: 'TryHackMe',  style: 'bg-[#2a0a0a] text-[#ff6b6b] border border-[#4a1a1a]' },
  vulnhub:    { label: 'VulnHub',    style: 'bg-[#1a1a0a] text-[#f0c040] border border-[#3a3a1a]' },
  ctfd:       { label: 'CTFd',       style: 'bg-[#0a1a2a] text-[#60aaff] border border-[#1a3a5a]' },
}

export const DIFFICULTY_STYLES: Record<Difficulty, { color: string; label: string }> = {
  easy:   { color: 'bg-[#56d364]', label: 'Easy' },
  medium: { color: 'bg-[#f0c040]', label: 'Medium' },
  hard:   { color: 'bg-[#ff7b72]', label: 'Hard' },
  insane: { color: 'bg-[#d2a8ff]', label: 'Insane' },
}
