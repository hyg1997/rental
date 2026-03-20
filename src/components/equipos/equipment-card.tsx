import Image from 'next/image'
import Link from 'next/link'
import { Package } from 'lucide-react'
import type { SanityImageSource } from '@sanity/image-url'
import { urlFor } from '@/lib/image-url'
import { Badge } from '@/components/ui/badge'

interface EquipmentCardProps {
  nombre: string
  slug: string
  tipo: string
  marca?: string | null
  modelo?: string | null
  estado?: string | null
  imagenPrincipal?: SanityImageSource | null
}

export function EquipmentCard({
  nombre,
  slug,
  tipo,
  marca,
  modelo,
  estado,
  imagenPrincipal,
}: EquipmentCardProps) {
  return (
    <article className="bg-white rounded-[20px] overflow-hidden border border-tc-border hover:-translate-y-2 hover:border-tc-accent hover:shadow-premium transition-all duration-500">
      {imagenPrincipal ? (
        <Image
          src={urlFor(imagenPrincipal).width(600).height(450).quality(80).auto('format').url()}
          alt={nombre}
          width={600}
          height={450}
          className="object-cover w-full aspect-[4/3]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full aspect-[4/3] bg-tc-surface flex items-center justify-center">
          <Package size={48} className="text-tc-text-light/30" />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-lg font-bold text-tc-primary line-clamp-2">{nombre}</h3>

        {marca && (
          <p className="text-sm text-tc-text-light mt-1">
            {marca}{modelo ? ` ${modelo}` : ''}
          </p>
        )}

        {estado === 'disponible' && (
          <Badge className="bg-green-500 text-white mt-3">Disponible</Badge>
        )}
        {estado === 'no_disponible' && (
          <Badge className="bg-tc-text-light/20 text-tc-text-light mt-3">No disponible</Badge>
        )}
        {estado === 'en_mantenimiento' && (
          <Badge className="bg-amber-500 text-white mt-3">En mantenimiento</Badge>
        )}

        <Link
          href={'/equipos/' + slug}
          className="text-sm text-tc-accent hover:text-tc-accent-dark font-bold mt-4 inline-block transition-colors"
        >
          Ver detalles &rarr;
        </Link>
      </div>
    </article>
  )
}
