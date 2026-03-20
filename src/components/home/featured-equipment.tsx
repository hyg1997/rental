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
    <section className="py-24 lg:py-32 px-[8%] bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-[800px] mx-auto mb-20">
          <h2 className="font-[Outfit,sans-serif] text-3xl lg:text-[3rem] text-tc-primary font-extrabold mb-5">
            Equipos Destacados
          </h2>
        </div>

        {equipos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-tc-text-light mb-4">Explora nuestro catálogo</p>
            <Link
              href="/equipos"
              className="text-tc-accent hover:text-tc-accent-dark font-bold transition-colors"
            >
              Ver todos los equipos &rarr;
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <div className="text-center mt-12">
              <Link
                href="/equipos"
                className="bg-tc-accent text-white py-3 px-8 rounded-full font-extrabold text-sm hover:bg-tc-accent-dark hover:scale-105 transition-all shadow-[0_10px_20px_rgba(230,126,34,0.2)]"
              >
                Ver catálogo completo &rarr;
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
