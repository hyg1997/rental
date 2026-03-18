'use client'

import { useRef, useEffect, useState } from 'react'

interface CounterProps {
  target: number
  label: string
  suffix?: string
}

function Counter({ target, label, suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const duration = 2000
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            setCount(Math.floor(progress * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-center">
      <p className="text-5xl font-bold text-brand-yellow">
        {count}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-brand-text/70">{label}</p>
    </div>
  )
}

interface Metrica {
  valor: number
  sufijo?: string
  etiqueta: string
}

interface MetricsSectionProps {
  metricas?: Metrica[]
}

export function MetricsSection({ metricas = [] }: MetricsSectionProps) {
  return (
    <section className="py-16 px-4 bg-brand-surface">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        {metricas.map((m, i) => (
          <Counter key={i} target={m.valor} suffix={m.sufijo ?? ''} label={m.etiqueta} />
        ))}
      </div>
    </section>
  )
}
