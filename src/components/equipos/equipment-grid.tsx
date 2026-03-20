'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { SanityImageSource } from '@sanity/image-url'
import { EquipmentCard } from '@/components/equipos/equipment-card'

interface EquipoListItem {
  _id: string
  nombre: string
  slug: string
  tipo: string
  categoria?: string | null
  marca?: string | null
  modelo?: string | null
  estado?: string | null
  imagenPrincipal?: unknown
}

interface EquipmentGridProps {
  equipos: EquipoListItem[]
}

export function EquipmentGrid({ equipos }: EquipmentGridProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'calibracion' | 'venta'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return equipos.filter((equipo) => {
      const matchesType =
        activeFilter === 'all' || equipo.tipo === activeFilter
      const matchesSearch =
        !searchQuery ||
        equipo.nombre?.toLowerCase().includes(q) ||
        equipo.marca?.toLowerCase().includes(q)
      return matchesType && matchesSearch
    })
  }, [equipos, activeFilter, searchQuery])

  const filterBtnClass = (active: boolean) =>
    active
      ? 'min-h-[44px] px-4 py-2 rounded-md font-semibold bg-tc-accent text-white'
      : 'min-h-[44px] px-4 py-2 rounded-md font-semibold bg-tc-surface text-tc-text hover:text-tc-accent transition-colors'

  return (
    <div>
      {/* Filter bar */}
      <div className="flex gap-3 flex-wrap">
        <button
          className={filterBtnClass(activeFilter === 'all')}
          onClick={() => setActiveFilter('all')}
        >
          Todos
        </button>
        <button
          className={filterBtnClass(activeFilter === 'calibracion')}
          onClick={() => setActiveFilter('calibracion')}
        >
          Calibración
        </button>
        <button
          className={filterBtnClass(activeFilter === 'venta')}
          onClick={() => setActiveFilter('venta')}
        >
          En Venta
        </button>
      </div>

      {/* Search input */}
      <div className="relative max-w-sm mt-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-tc-text/60"
        />
        <Input
          placeholder="Buscar por nombre o marca..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid or Empty state */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filtered.map((equipo) => (
            <EquipmentCard
              key={equipo._id}
              nombre={equipo.nombre}
              slug={equipo.slug}
              tipo={equipo.tipo}
              marca={equipo.marca}
              modelo={equipo.modelo}
              estado={equipo.estado}
              imagenPrincipal={equipo.imagenPrincipal as SanityImageSource | null | undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-in fade-in-0">
          <Search className="mx-auto text-tc-text/30 mb-4" size={48} />
          <h3 className="text-xl font-bold text-tc-text">No se encontraron equipos</h3>
          <p className="text-tc-text/60 mt-2">
            Intenta con otro termino de busqueda o selecciona una categoria diferente.
          </p>
        </div>
      )}
    </div>
  )
}
