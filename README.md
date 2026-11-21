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

### Images and videos

Put images in `public/images/` and videos in `public/videos/`, and embed both with the image syntax. The alt text becomes the caption:

```md
![Image 1. The world map](/images/telecom-map-overview.png)
![Image 2. Towers and phones moving](/videos/telecom-map-UEs-towers.webm)
```

`.mp4`, `.webm` and `.mov` files play muted and on a loop, like a GIF. GIFs are embedded as normal images. Not every browser plays `.mov`, so convert those first:

```bash
ffmpeg -i clip.mov -c:v libvpx-vp9 -b:v 0 -crf 35 -an clip.webm
```

### Article versions

To update an article but keep the earlier text available, add a new file for the new version in the same folder, rather than editing the original. The original file stays as it is and counts as version 1. Name the new file `YYYY-MM-DD-<slug>-v2.md`, where the date is the update date. Give it a complete frontmatter (title, tags, excerpt and so on), plus:

```yaml
date: "2026-11-20"           # the date of this version
version_of: your-own-telecom-part1   # slug of the original article
version: 2
version_note: "Short note on what changed"   # shown in the version switcher
```

- The plain URL (`/projects/<slug>`) always shows the newest version, without a redirect.
- Every version has its own link at `/projects/<slug>/vN`, including v1.
- Cards, the feed and RSS keep the original publication date and position, and use the newest version's title and excerpt.
- Older versions show a notice linking to the latest one, and are hidden from search engines.
- The build fails if a version number appears twice, if `version_of` names an article that doesn't exist, or if `version` is missing.

A new version should correct facts in place and keep the original story. New work belongs in a new article in the series.

To compare two versions word by word:

```bash
git diff --no-index --word-diff=color \
  content/projects/2026-10-29-your-own-telecom-part1.md \
  content/projects/2026-11-20-your-own-telecom-part1-v2.md
```

## Building

```bash
npm run build
```

Output is written to `out/`. Pushing to `main` triggers the GitHub Pages deploy action.
