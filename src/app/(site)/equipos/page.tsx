import { client } from '@/sanity/client'
import { EQUIPOS_LIST_QUERY } from '@/sanity/queries/equipos'
import { EquipmentGrid } from '@/components/equipos/equipment-grid'

export default async function EquiposPage() {
  const equipos = await client.fetch(EQUIPOS_LIST_QUERY).catch(() => [])

  return (
    <section className="px-4 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-text mb-8">Catalogo de Equipos</h1>
      <EquipmentGrid equipos={equipos} />
    </section>
  )
}
