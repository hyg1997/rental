import { Wrench, CheckCircle, Shield, Settings, Zap, type LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  wrench: Wrench,
  'check-circle': CheckCircle,
  shield: Shield,
  settings: Settings,
  zap: Zap,
}

interface Servicio {
  titulo: string
  descripcion: string
  icono: string
}

interface ServicesSectionProps {
  servicios?: Servicio[]
}

export function ServicesSection({ servicios = [] }: ServicesSectionProps) {
  return (
    <section className="py-16 px-4 bg-brand-bg">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-text text-center">Nuestros Servicios</h2>
        <p className="mt-2 text-sm text-brand-text/60 text-center">
          Calibracion, verificacion y reparacion de equipos de medicion
        </p>
        {servicios.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((s, i) => {
              const Icon = iconMap[s.icono] ?? Wrench
              return (
                <div key={i} className="text-center">
                  <Icon size={40} className="text-brand-red mx-auto" />
                  <h3 className="mt-4 text-xl font-bold text-brand-text">{s.titulo}</h3>
                  <p className="mt-2 text-sm text-brand-text/60">{s.descripcion}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
