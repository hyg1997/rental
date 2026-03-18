import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { EQUIPOS_LIST_QUERY } from '@/sanity/queries/equipos'
import { EquipmentGrid } from '@/components/equipos/equipment-grid'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Catalogo de Equipos',
    description: 'Explora nuestro catalogo de equipos de medicion para calibracion y venta. Testing Calibrations S.A.C.',
    openGraph: {
      title: 'Catalogo de Equipos | Testing Calibrations S.A.C.',
      description: 'Explora nuestro catalogo de equipos de medicion para calibracion y venta.',
    },
  }
}

export default async function EquiposPage() {
  const equipos = await client.fetch(EQUIPOS_LIST_QUERY).catch(() => [])

  return (
    <section className="px-4 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-text mb-8">Catálogo de Equipos</h1>
      <EquipmentGrid equipos={equipos} />
    </section>
  )
}
