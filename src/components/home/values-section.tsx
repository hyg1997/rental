import {
  Award, Clock, Users, Shield, CheckCircle, Scale, Star,
  GraduationCap, HeartHandshake, TrendingUp,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  clock: Clock,
  users: Users,
  shield: Shield,
  'check-circle': CheckCircle,
  scale: Scale,
  star: Star,
  'graduation-cap': GraduationCap,
  'heart-handshake': HeartHandshake,
  'trending-up': TrendingUp,
}

interface Valor {
  titulo: string
  descripcion: string
  icono: string
}

interface ValuesSectionProps {
  valores?: Valor[]
}

const defaultValores: Valor[] = [
  {
    titulo: 'Imparcialidad',
    descripcion: 'Actuamos con objetividad, evitando conflictos de interés que puedan afectar la confiabilidad de nuestros resultados.',
    icono: 'scale',
  },
  {
    titulo: 'Integridad',
    descripcion: 'Desarrollamos nuestras actividades con honestidad, transparencia y ética profesional.',
    icono: 'shield',
  },
  {
    titulo: 'Calidad',
    descripcion: 'Trabajamos bajo estándares técnicos que garantizan la confiabilidad y exactitud de nuestros servicios.',
    icono: 'star',
  },
  {
    titulo: 'Competencia Técnica',
    descripcion: 'Promovemos la capacitación continua de nuestro personal para asegurar servicios técnicamente competentes.',
    icono: 'graduation-cap',
  },
  {
    titulo: 'Compromiso con el Cliente',
    descripcion: 'Buscamos satisfacer las necesidades de nuestros clientes mediante un servicio eficiente y confiable.',
    icono: 'heart-handshake',
  },
  {
    titulo: 'Mejora Continua',
    descripcion: 'Fortalecemos permanentemente nuestro sistema de gestión y nuestros procesos.',
    icono: 'trending-up',
  },
]

export function ValuesSection({ valores = [] }: ValuesSectionProps) {
  const data = valores.length > 0 ? valores : defaultValores

  return (
    <section className="py-24 lg:py-32 px-[8%] bg-tc-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-[800px] mx-auto mb-20">
          <h2 className="font-[Outfit,sans-serif] text-3xl lg:text-[3rem] text-tc-primary font-extrabold mb-5">
            Nuestros Valores
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((v, i) => {
            const Icon = iconMap[v.icono] ?? Award
            return (
              <div
                key={i}
                className="bg-white p-10 rounded-[30px] border border-tc-border text-center hover:-translate-y-3 hover:border-tc-accent hover:shadow-premium transition-all duration-500"
              >
                <Icon className="w-12 h-12 text-tc-accent mx-auto mb-6" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-tc-primary mb-3">{v.titulo}</h3>
                <p className="text-sm text-tc-text/70">{v.descripcion}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
