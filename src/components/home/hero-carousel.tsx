'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/image-url'
import type { SanityImageSource } from '@sanity/image-url'

interface Banner {
  _id: string
  titulo: string
  subtitulo?: string
  imagen: unknown
  ctaTexto?: string
  ctaUrl?: string
}

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startInterval = useCallback(() => {
    if (banners.length <= 1) return
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
  }, [banners.length])

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    startInterval()
    return () => stopInterval()
  }, [startInterval, stopInterval])

  if (!banners.length) return null

  const banner = banners[current]

  return (
    <section
      className="relative w-full h-[80vh] overflow-hidden"
      onMouseEnter={stopInterval}
      onMouseLeave={startInterval}
    >
      {!!banner.imagen && (
        <Image
          src={urlFor(banner.imagen as SanityImageSource)
            .width(1920)
            .height(1080)
            .quality(80)
            .auto('format')
            .url()}
          alt={banner.titulo}
          fill
          priority={current === 0}
          className="object-cover transition-opacity duration-700"
        />
      )}
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-text">{banner.titulo}</h1>
        {banner.subtitulo && (
          <p className="mt-4 text-lg text-brand-text/80">{banner.subtitulo}</p>
        )}
        {banner.ctaTexto && banner.ctaUrl && (
          <a
            href={banner.ctaUrl}
            className="mt-8 inline-block bg-brand-red text-white font-semibold px-8 py-3 rounded-md"
          >
            {banner.ctaTexto}
          </a>
        )}
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? 'bg-brand-red' : 'bg-white/50'
              }`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
