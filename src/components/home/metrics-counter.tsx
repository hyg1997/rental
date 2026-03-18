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

export function MetricsSection() {
  return (
    <section className="py-16 px-4 bg-brand-surface">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        <Counter target={200} suffix="+" label="Clientes atendidos" />
        <Counter target={500} suffix="+" label="Equipos calibrados" />
        <Counter target={10} suffix="+" label="Anos de experiencia" />
        <Counter target={15} suffix="+" label="Tipos de equipos" />
      </div>
    </section>
  )
}
