'use client'

import {
  Pencil, ClipboardList, TestTube, RefreshCw, CheckCircle,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  pencil: Pencil,
  'clipboard-list': ClipboardList,
  'test-tube': TestTube,
  'refresh-cw': RefreshCw,
  'check-circle': CheckCircle,
}

interface ProcesoStep {
  titulo: string
  descripcion?: string
  icono: string
}

interface ProcessSectionProps {
  proceso?: ProcesoStep[]
}

const defaultProceso: ProcesoStep[] = [
  { titulo: 'Recepción', descripcion: 'Recepción de la queja por correo, teléfono o formulario web.', icono: 'pencil' },
  { titulo: 'Registro', descripcion: 'Registro y evaluación de la queja recibida.', icono: 'clipboard-list' },
  { titulo: 'Investigación', descripcion: 'Investigación del caso por personal competente.', icono: 'test-tube' },
  { titulo: 'Acción', descripcion: 'Determinación de acciones correctivas si corresponde.', icono: 'refresh-cw' },
  { titulo: 'Respuesta', descripcion: 'Comunicación de la respuesta al cliente.', icono: 'check-circle' },
]

export function ProcessSection({ proceso = [] }: ProcessSectionProps) {
  const steps = proceso.length > 0 ? proceso : defaultProceso

  return (
    <section className="py-24 lg:py-32 px-[8%] bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-[800px] mx-auto mb-20">
          <h2 className="font-[Outfit,sans-serif] text-3xl lg:text-[3rem] text-tc-primary font-extrabold mb-5">
            Proceso de Atención de Quejas
          </h2>
          <p className="text-lg text-tc-text-light">
            Disponemos de un procedimiento para la atención de quejas con el fin de garantizar la satisfacción
            del cliente y la mejora continua del servicio. Todas las quejas son tratadas de forma confidencial, objetiva e imparcial.
          </p>
        </div>

        {/* Process timeline */}
        <div className="relative flex flex-col md:flex-row justify-between mt-16">
          {/* Horizontal line - desktop only */}
          <div className="hidden md:block absolute top-10 left-0 w-full h-[2px] bg-tc-border z-0" />

          {steps.map((step, i) => {
            const Icon = iconMap[step.icono] ?? CheckCircle
            return (
              <div
                key={i}
                className="flex-1 text-center relative z-[2] px-2 mb-8 md:mb-0 group"
              >
                <div className="w-20 h-20 bg-white border-2 border-tc-border rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-tc-accent group-hover:scale-110 transition-all duration-400">
                  <Icon className="w-7 h-7 text-tc-primary group-hover:text-tc-accent transition-colors" />
                </div>
                <h4 className="font-bold text-tc-dark mb-1">{step.titulo}</h4>
                {step.descripcion && (
                  <p className="text-sm text-tc-text/70">{step.descripcion}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
