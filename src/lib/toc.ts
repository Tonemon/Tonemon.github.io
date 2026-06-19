export interface TocEntry {
  id: string
  text: string
  level: 2 | 3
}

export function extractHeadings(html: string): TocEntry[] {
  const entries: TocEntry[] = []
  const re = /<h([23])[^>]+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const text = m[3].replace(/<[^>]+>/g, '').trim()
    if (text) entries.push({ id: m[2], level: parseInt(m[1]) as 2 | 3, text })
  }
  return entries
}
