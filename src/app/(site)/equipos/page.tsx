import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { EQUIPOS_LIST_QUERY } from '@/sanity/queries/equipos'
import { EquipmentGrid } from '@/components/equipos/equipment-grid'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Catálogo de Equipos',
    description: 'Explora nuestro catálogo de equipos de medición para calibración y venta. Testing Calibrations S.A.C.',
    openGraph: {
      title: 'Catálogo de Equipos | Testing Calibrations S.A.C.',
      description: 'Explora nuestro catálogo de equipos de medición para calibración y venta.',
    },
  }
}

export default async function EquiposPage() {
  const equipos = await client.fetch(EQUIPOS_LIST_QUERY).catch(() => [])

  return (
    <div className="pt-28">
      <section className="gradient-blue py-16 px-[8%] text-white">
        <div className="max-w-4xl mx-auto">
          <span className="text-tc-accent font-extrabold tracking-[2px] text-sm uppercase">
            NUESTROS EQUIPOS
          </span>
          <h1 className="font-[Outfit,sans-serif] text-4xl lg:text-5xl font-extrabold mt-4">
            Catálogo de Equipos
          </h1>
        </div>
      </section>

      <section className="py-16 px-[8%] bg-white">
        <div className="max-w-7xl mx-auto">
          <EquipmentGrid equipos={equipos} />
        </div>
      </section>
    </div>
  )
}
