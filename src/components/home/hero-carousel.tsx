'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

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
    }, 6000)
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

  const banner = banners.length > 0 ? banners[current] : null

  return (
    <section
      className="relative h-screen gradient-blue overflow-hidden flex items-center px-[8%]"
      onMouseEnter={stopInterval}
      onMouseLeave={startInterval}
    >
      {/* Decorative shapes */}
      <div className="absolute w-[600px] h-[600px] -top-[200px] -right-[100px] rounded-full bg-white opacity-[0.03]" />
      <div className="absolute w-[400px] h-[400px] -bottom-[100px] -left-[50px] rounded-full bg-white opacity-[0.03]" />

      <div className="relative z-10 max-w-[850px]">
        <div className="inline-block bg-white/10 border border-white/20 px-5 py-2 rounded-full text-sm font-bold tracking-wider text-white mb-6">
          COMPROMISO CON LA PRECISIÓN
        </div>

        {banner ? (
          <>
            <h1 className="font-[Outfit,sans-serif] text-4xl md:text-6xl lg:text-[5rem] font-extrabold leading-none text-white mb-6">
              {banner.titulo.includes('|') ? (
                <>
                  {banner.titulo.split('|')[0]}
                  <span className="text-tc-accent">{banner.titulo.split('|')[1]}</span>
                </>
              ) : (
                banner.titulo
              )}
            </h1>
            {banner.subtitulo && (
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-[650px]">
                {banner.subtitulo}
              </p>
            )}
            <div className="flex flex-wrap gap-5">
              {banner.ctaTexto && banner.ctaUrl && (
                <a
                  href={banner.ctaUrl}
                  className="bg-tc-accent text-white py-4 px-11 rounded-full font-extrabold text-base hover:bg-tc-accent-dark hover:scale-105 transition-all shadow-[0_10px_20px_rgba(230,126,34,0.2)]"
                >
                  {banner.ctaTexto}
                </a>
              )}
              <Link
                href="/nosotros"
                className="bg-transparent border-2 border-white text-white py-4 px-8 rounded-full font-extrabold text-sm hover:bg-white/10 transition-all"
              >
                Conoce la Empresa
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="font-[Outfit,sans-serif] text-4xl md:text-6xl lg:text-[5rem] font-extrabold leading-none text-white mb-6">
              Ingeniería que garantiza{' '}
              <span className="text-tc-accent">Resultados Exactos</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-[650px]">
              Laboratorio especializado en calibración metrológica bajo la norma NTP ISO/IEC 17025.
              Aseguramos la confiabilidad en mediciones de gases vehiculares y equipos CITV.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                href="/equipos"
                className="bg-tc-accent text-white py-4 px-11 rounded-full font-extrabold text-base hover:bg-tc-accent-dark hover:scale-105 transition-all shadow-[0_10px_20px_rgba(230,126,34,0.2)]"
              >
                Explorar Soluciones
              </Link>
              <Link
                href="/nosotros"
                className="bg-transparent border-2 border-white text-white py-4 px-8 rounded-full font-extrabold text-sm hover:bg-white/10 transition-all"
              >
                Conoce la Empresa
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Banner indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === current ? 'bg-tc-accent scale-125' : 'bg-white/40'
              }`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
