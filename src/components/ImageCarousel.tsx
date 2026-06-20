'use client'
import { useEffect, useState, useCallback } from 'react'

export default function ImageCarousel() {
  const [lightbox, setLightbox] = useState<string | null>(null)

  const openLightbox = useCallback((src: string) => setLightbox(src), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [closeLightbox])

  useEffect(() => {
    const handlers: Array<[HTMLImageElement, () => void]> = []
    document.querySelectorAll('.prose-article img').forEach(img => {
      const el = img as HTMLImageElement
      const handler = () => openLightbox(el.src)
      el.style.cursor = 'zoom-in'
      el.addEventListener('click', handler)
      handlers.push([el, handler])
    })
    return () => handlers.forEach(([el, h]) => el.removeEventListener('click', h))
  }, [openLightbox])

  if (!lightbox) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={closeLightbox}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={lightbox}
        alt="Full size"
        className="max-w-[90vw] max-h-[90vh] object-contain rounded"
        onClick={e => e.stopPropagation()}
      />
      <button
        className="absolute top-4 right-6 text-white text-3xl leading-none hover:text-gray-300"
        onClick={closeLightbox}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  )
}
