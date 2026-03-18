import Link from 'next/link'
import type { SanityImageSource } from '@sanity/image-url'
import { EquipmentCard } from '@/components/equipos/equipment-card'

interface FeaturedEquipmentProps {
  equipos: Array<{
    _id: string
    nombre: string
    slug: string
    tipo: string
    categoria?: string | null
    marca?: string | null
    modelo?: string | null
    estado?: string | null
    imagenPrincipal?: unknown
  }>
}

export function FeaturedEquipment({ equipos }: FeaturedEquipmentProps) {
  return (
    <section className="py-16 px-4 bg-brand-bg">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-text text-center mb-8">
          Equipos Destacados
        </h2>

        {equipos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brand-text/60">Explora nuestro catalogo</p>
            <Link
              href="/equipos"
              className="text-brand-red hover:text-brand-yellow mt-2 inline-block"
            >
              Ver todos los equipos &rarr;
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipos.map((equipo) => (
                <EquipmentCard
                  key={equipo._id}
                  nombre={equipo.nombre}
                  slug={equipo.slug}
                  tipo={equipo.tipo}
                  marca={equipo.marca}
                  modelo={equipo.modelo}
                  estado={equipo.estado}
                  imagenPrincipal={equipo.imagenPrincipal as SanityImageSource | null}
                />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/equipos"
                className="text-brand-red hover:text-brand-yellow"
              >
                Ver catalogo completo &rarr;
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
