import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { NOSOTROS_CONTENT_QUERY } from '@/sanity/queries/homepage'
import { CheckCircle, Shield, Users, type LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  'check-circle': CheckCircle,
  shield: Shield,
  users: Users,
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Nosotros',
    description: 'Conoce la historia, mision, vision y valores de Testing Calibrations S.A.C., empresa especializada en calibracion de equipos de medicion.',
    openGraph: {
      title: 'Nosotros | Testing Calibrations S.A.C.',
      description: 'Conoce la historia, mision, vision y valores de Testing Calibrations S.A.C.',
    },
  }
}

export default async function NosotrosPage() {
  const content = await client.fetch(NOSOTROS_CONTENT_QUERY).catch(() => null)

  const historia =
    content?.nosotrosHistoria ??
    'Testing Calibrations S.A.C. es una empresa especializada en calibracion, verificacion y reparacion de equipos de medicion. Con mas de 10 anos de experiencia, brindamos servicios de alta calidad a empresas de diversos sectores industriales.'
  const mision =
    content?.nosotrosMision ??
    'Nuestra mision es garantizar la precision y confiabilidad de los equipos de medicion de nuestros clientes, contribuyendo a la calidad de sus procesos y productos.'
  const vision =
    content?.nosotrosVision ??
    'Ser la empresa lider en servicios de calibracion y metrologia en el Peru, reconocida por la excelencia de nuestro equipo tecnico y la satisfaccion de nuestros clientes.'
  const valores = content?.nosotrosValores ?? []

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-brand-text mb-8">
        Sobre Testing Calibrations S.A.C.
      </h1>

      <div className="space-y-6">
        <p className="leading-relaxed text-brand-text/80">{historia}</p>
        <p className="leading-relaxed text-brand-text/80">{mision}</p>
        <p className="leading-relaxed text-brand-text/80">{vision}</p>
      </div>

      {valores.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-brand-text mt-12 mb-6">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {valores.map(
              (v: { titulo: string; descripcion: string; icono: string }, i: number) => {
                const Icon = iconMap[v.icono] ?? CheckCircle
                return (
                  <div key={i} className="bg-brand-surface p-6 rounded-lg">
                    <Icon className="text-brand-red mb-4" size={32} />
                    <h3 className="text-lg font-bold text-brand-text">{v.titulo}</h3>
                    <p className="text-sm text-brand-text/60 mt-2">{v.descripcion}</p>
                  </div>
                )
              }
            )}
          </div>
        </>
      )}
    </div>
  )
}
