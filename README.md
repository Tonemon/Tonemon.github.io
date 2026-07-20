# tonemon.github.io

Personal site for CTF writeups, security research, and project documentation. Built with Next.js (static export) and deployed to GitHub Pages.

## Stack

- **Next.js** (static export) + **Tailwind CSS**
- Content in **Markdown** with YAML frontmatter
- Deployed via **GitHub Pages** from the `main` branch

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding content

Create a `.md` file in `content/writeups/`, `content/projects/`, or `content/research/`. Filename format: `YYYY-MM-DD-slug.md`.

### Frontmatter fields

```yaml
title: "Article title"
date: "2026-01-01"
category: writeup          # writeup | project | research
excerpt: "One-line summary shown in article cards."
tags: [tag-one, tag-two]

# Optional
authors:
  - name: "Tony"
    url: "https://github.com/Tonemon"
coverImage: /images/cover.png
series: "Series Name"
series_part: 1

# Writeups / Projects only
platform: hackthebox        # hackthebox | tryhackme | vulnhub | ctfd
difficulty: medium          # easy | medium | hard | insane
projectUrl: "https://github.com/..."

# Research only
paperUrl: /papers/paper.pdf
paperCover: /paper-covers/paper-cover.png
```

## Building

```bash
npm run build
```

Output is written to `out/`. Pushing to `main` triggers the GitHub Pages deploy action.
