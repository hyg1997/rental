import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { NOSOTROS_CONTENT_QUERY } from '@/sanity/queries/homepage'
import {
  CheckCircle, Shield, Users, Scale, Star,
  GraduationCap, HeartHandshake, TrendingUp,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  'check-circle': CheckCircle,
  shield: Shield,
  users: Users,
  scale: Scale,
  star: Star,
  'graduation-cap': GraduationCap,
  'heart-handshake': HeartHandshake,
  'trending-up': TrendingUp,
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nosotros',
    description: 'Conoce la historia, misión, visión y valores de Testing Calibrations S.A.C., empresa especializada en calibración de equipos de medición.',
    openGraph: {
      title: 'Nosotros | Testing Calibrations S.A.C.',
      description: 'Conoce la historia, misión, visión y valores de Testing Calibrations S.A.C.',
    },
  }
}

export default async function NosotrosPage() {
  const content = await client.fetch(NOSOTROS_CONTENT_QUERY).catch(() => null)

  const historia =
    content?.nosotrosHistoria ??
    'Testing Calibrations S.A.C. es un laboratorio especializado en la calibración de analizadores de gases vehiculares, comprometido con la confiabilidad de las mediciones, la calidad técnica y el cumplimiento de los requisitos normativos aplicables.\n\nNuestro laboratorio se encuentra en proceso de acreditación como laboratorio de calibración ante el Instituto Nacional de Calidad (INACAL), implementando un sistema de gestión basado en la Norma NTP ISO/IEC 17025.'
  const mision =
    content?.nosotrosMision ??
    'Brindar servicios de calibración de analizadores de gases vehiculares con altos estándares técnicos, garantizando exactitud, confiabilidad y trazabilidad metrológica, contribuyendo al control de emisiones y al cumplimiento de los requisitos regulatorios, mediante la aplicación de la NTP ISO/IEC 17025 y la mejora continua de nuestro sistema de gestión.'
  const vision =
    content?.nosotrosVision ??
    'Ser un laboratorio de calibración reconocido a nivel nacional, acreditado y referente en la confiabilidad de las mediciones de gases vehiculares, destacando por nuestra competencia técnica, imparcialidad, innovación y compromiso con la calidad y el medio ambiente.'
  const valores = content?.nosotrosValores ?? []

  return (
    <div className="pt-28">
      {/* Hero section */}
      <section className="gradient-blue py-20 px-[8%] text-white">
        <div className="max-w-4xl mx-auto">
          <span className="text-tc-accent font-extrabold tracking-[2px] text-sm uppercase">
            LA EMPRESA
          </span>
          <h1 className="font-[Outfit,sans-serif] text-4xl lg:text-5xl font-extrabold mt-4 mb-6">
            Sobre Testing Calibrations S.A.C.
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">{historia}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-[8%] bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-tc-surface p-10 rounded-[30px] border border-tc-border">
            <h2 className="text-2xl font-bold text-tc-primary mb-4">Misión</h2>
            <p className="text-tc-text leading-relaxed">{mision}</p>
          </div>
          <div className="bg-tc-surface p-10 rounded-[30px] border border-tc-border">
            <h2 className="text-2xl font-bold text-tc-primary mb-4">Visión</h2>
            <p className="text-tc-text leading-relaxed">{vision}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      {valores.length > 0 && (
        <section className="py-20 px-[8%] bg-tc-surface">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-[Outfit,sans-serif] text-3xl font-extrabold text-tc-primary text-center mb-16">
              Nuestros Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {valores.map(
                (v: { titulo: string; descripcion: string; icono: string }, i: number) => {
                  const Icon = iconMap[v.icono] ?? CheckCircle
                  return (
                    <div
                      key={i}
                      className="bg-white p-10 rounded-[30px] border border-tc-border hover:-translate-y-3 hover:border-tc-accent hover:shadow-premium transition-all duration-500"
                    >
                      <Icon className="w-10 h-10 text-tc-accent mb-5" strokeWidth={1.5} />
                      <h3 className="text-lg font-bold text-tc-primary">{v.titulo}</h3>
                      <p className="text-sm text-tc-text/70 mt-3">{v.descripcion}</p>
                    </div>
                  )
                }
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
