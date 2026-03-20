import {
  FlaskConical, Gauge, Microscope, Wrench, CheckCircle, Shield, Settings, Zap,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  flask: FlaskConical,
  gauge: Gauge,
  microscope: Microscope,
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
  items?: string[]
}

interface ServicesSectionProps {
  servicios?: Servicio[]
}

const defaultServicios: Servicio[] = [
  {
    titulo: 'Analizadores de Gases',
    descripcion: 'Calibración de alta precisión para el control de emisiones y protección ambiental.',
    icono: 'flask',
    items: ['Analizador de Gases', 'Opacímetro', 'Detector de Gases'],
  },
  {
    titulo: 'Línea de Inspección',
    descripcion: 'Certificación de equipos críticos para la seguridad vial y el rendimiento vehicular.',
    icono: 'gauge',
    items: ['Frenómetro de Rodillos', 'Banco de Suspensión', 'Alineador de Ruedas'],
  },
  {
    titulo: 'Instrumentación Especial',
    descripcion: 'Equipamiento complementario bajo normativas internacionales de metrología.',
    icono: 'microscope',
    items: ['Regloscopio con Luxómetro', 'Sonómetro Digital', 'Retro-reflectómetro'],
  },
]

export function ServicesSection({ servicios = [] }: ServicesSectionProps) {
  const data = servicios.length > 0 ? servicios : defaultServicios
  return (
    <section className="py-24 lg:py-32 px-[8%] bg-tc-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-[800px] mx-auto mb-20">
          <h2 className="font-[Outfit,sans-serif] text-3xl lg:text-[3rem] text-tc-primary font-extrabold mb-5">
            Nuestra Especialización Técnica
          </h2>
          <p className="text-lg text-tc-text-light">
            Contamos con equipos de referencia certificados para cubrir todas las necesidades de los
            Centros de Inspección Técnica Vehicular.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {data.map((s, i) => {
              const Icon = iconMap[s.icono] ?? FlaskConical
              return (
                <div
                  key={i}
                  className="bg-white p-12 rounded-[30px] border border-tc-border hover:-translate-y-4 hover:border-tc-accent hover:shadow-premium transition-all duration-500"
                >
                  <Icon className="w-12 h-12 text-tc-accent mb-8" strokeWidth={1.5} />
                  <h3 className="text-xl lg:text-2xl font-bold text-tc-primary mb-5">
                    {s.titulo}
                  </h3>
                  {s.descripcion && (
                    <p className="text-tc-text/80 mb-5">{s.descripcion}</p>
                  )}
                  {s.items && s.items.length > 0 && (
                    <ul className="space-y-3">
                      {s.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-3 font-medium text-tc-text">
                          <CheckCircle className="w-4 h-4 text-tc-accent flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
      </div>
    </section>
  )
}
