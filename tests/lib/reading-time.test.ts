import { readingTime } from '@/lib/reading-time'

describe('readingTime', () => {
  it('returns 1 for very short content', () => {
    expect(readingTime('Hello world')).toBe(1)
  })

  it('returns correct minutes for 400-word content', () => {
    const content = Array(400).fill('word').join(' ')
    expect(readingTime(content)).toBe(2)
  })

  it('rounds up fractional minutes', () => {
    const content = Array(201).fill('word').join(' ')
    expect(readingTime(content)).toBe(2)
  })

  it('handles empty string', () => {
    expect(readingTime('')).toBe(1)
  })
})
