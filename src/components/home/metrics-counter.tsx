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
      <p className="text-5xl lg:text-6xl font-extrabold text-white leading-none">
        {count}
        {suffix}
      </p>
      <p className="mt-3 text-sm text-white/70 font-medium">{label}</p>
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

const defaultMetricas: Metrica[] = [
  { valor: 500, sufijo: '+', etiqueta: 'Clientes Satisfechos' },
  { valor: 15, sufijo: '+', etiqueta: 'Años de Experiencia' },
  { valor: 1000, sufijo: '+', etiqueta: 'Equipos Calibrados' },
  { valor: 50, sufijo: '+', etiqueta: 'Empresas Atendidas' },
]

export function MetricsSection({ metricas = [] }: MetricsSectionProps) {
  const data = metricas.length > 0 ? metricas : defaultMetricas

  return (
    <section className="py-20 lg:py-24 px-[8%] gradient-blue">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
        {data.map((m, i) => (
          <Counter key={i} target={m.valor} suffix={m.sufijo ?? ''} label={m.etiqueta} />
        ))}
      </div>
    </section>
  )
}
