import { Award, Clock, Users, Shield, CheckCircle, type LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  clock: Clock,
  users: Users,
  shield: Shield,
  'check-circle': CheckCircle,
}

interface Valor {
  titulo: string
  descripcion: string
  icono: string
}

interface ValuesSectionProps {
  valores?: Valor[]
}

export function ValuesSection({ valores = [] }: ValuesSectionProps) {
  return (
    <section className="bg-brand-surface py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-text text-center">Por que elegirnos?</h2>
        {valores.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valores.map((v, i) => {
              const Icon = iconMap[v.icono] ?? Award
              return (
                <div key={i} className="text-center">
                  <Icon size={40} className="text-brand-red mx-auto" />
                  <h3 className="mt-4 text-xl font-bold text-brand-text">{v.titulo}</h3>
                  <p className="mt-2 text-sm text-brand-text/60">{v.descripcion}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
