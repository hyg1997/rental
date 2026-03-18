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
    <article className="rounded-lg overflow-hidden hover:shadow-md hover:scale-[1.01] transition-transform duration-150">
      {imagenPrincipal ? (
        <Image
          src={urlFor(imagenPrincipal).width(600).height(450).quality(80).auto('format').url()}
          alt={nombre}
          width={600}
          height={450}
          className="object-cover w-full aspect-[4/3] rounded-t-lg"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full aspect-[4/3] rounded-t-lg bg-brand-surface flex items-center justify-center">
          <Package size={48} className="text-brand-text/30" />
        </div>
      )}

      <div className="bg-brand-surface rounded-b-lg p-4">
        <h3 className="text-xl font-bold text-brand-text line-clamp-2">{nombre}</h3>

        {marca && (
          <p className="text-sm text-brand-text/60 mt-1">
            {marca}{modelo ? ` ${modelo}` : ''}
          </p>
        )}

        {estado === 'disponible' && (
          <Badge className="bg-green-600 text-white mt-2">Disponible</Badge>
        )}
        {estado === 'no_disponible' && (
          <Badge className="bg-brand-text/20 text-brand-text/60 mt-2">No disponible</Badge>
        )}
        {estado === 'en_mantenimiento' && (
          <Badge className="bg-amber-600 text-white mt-2">En mantenimiento</Badge>
        )}

        <Link
          href={'/equipos/' + slug}
          className="text-sm text-brand-red hover:text-brand-yellow mt-3 inline-block"
        >
          Ver detalles &rarr;
        </Link>
      </div>
    </article>
  )
}
