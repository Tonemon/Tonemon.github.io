import type { SiteConfig } from '@/types/content'

const siteConfig: SiteConfig = {
  name: 'Tony',
  url: 'https://tonemon.github.io',
  bio: 'A cyber security student and researcher interested in offensive security and open source software. I document my homelab experiments, CTF writeups, and security research here consisting of CTF writeups to network architectures.',
  focusBadges: [
    { label: 'Redteaming', color: 'red' },
    { label: 'Purpleteaming', color: 'purple' },
    { label: 'Threat Intel', color: 'blue' },
  ],
  socials: [
    { label: 'GitHub', url: 'https://github.com/Tonemon', icon: 'github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/yourprofile', icon: 'linkedin' },
  ],
}

export default siteConfig
