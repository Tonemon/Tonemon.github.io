import type { SiteConfig } from '@/types/content'

const siteConfig: SiteConfig = {
  name: 'Tony',
  url: 'https://tonemon.github.io',
  bio: 'A cyber security student and researcher interested in offensive security and open source software. I document my CTF writeups, security research, homelab experiments, network architectures, and other hobby projects here.',
  focusBadges: [
    { label: 'Redteaming', color: 'red' },
    { label: 'Purpleteaming', color: 'purple' },
    { label: 'Attack & Defense CTFs', color: 'green' },
    { label: 'Threat Intel', color: 'blue' },
  ],
  socials: [
    { label: 'GitHub', url: 'https://github.com/Tonemon', icon: 'github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/tonymunzer/', icon: 'linkedin' },
  ],
}

export default siteConfig
