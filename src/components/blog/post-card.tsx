import Image from 'next/image'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { urlFor } from '@/lib/image-url'
import { Badge } from '@/components/ui/badge'

interface PostCardProps {
  titulo: string
  slug: string
  extracto?: string | null
  imagen?: unknown
  autor?: string | null
  categoria?: string | null
  fechaPublicacion?: string | null
}

export function PostCard({
  titulo,
  slug,
  extracto,
  imagen,
  autor,
  categoria,
  fechaPublicacion,
}: PostCardProps) {
  return (
    <article className="rounded-lg overflow-hidden hover:shadow-md transition">
      {imagen ? (
        <Image
          src={urlFor(imagen as Parameters<typeof urlFor>[0]).width(600).height(338).quality(80).auto('format').url()}
          alt={titulo}
          width={600}
          height={338}
          className="object-cover w-full aspect-video rounded-t-lg"
        />
      ) : (
        <div className="w-full aspect-video rounded-t-lg bg-brand-surface flex items-center justify-center">
          <FileText size={48} className="text-brand-text/30" />
        </div>
      )}

      <div className="bg-brand-surface p-4 rounded-b-lg">
        {categoria && (
          <Badge className="bg-brand-red/20 text-brand-red text-xs mb-2">{categoria}</Badge>
        )}

        <h3 className="text-xl font-bold text-brand-text line-clamp-2">{titulo}</h3>

        {extracto && (
          <p className="text-sm text-brand-text/60 mt-2 line-clamp-3">{extracto}</p>
        )}

        <div className="flex items-center gap-4 mt-3 text-xs text-brand-text/50">
          {autor && <span>{autor}</span>}
          {fechaPublicacion && (
            <span>
              {new Date(fechaPublicacion).toLocaleDateString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
        </div>

        <Link
          href={'/blog/' + slug}
          className="text-sm text-brand-red hover:text-brand-yellow mt-3 inline-block"
        >
          Leer articulo &rarr;
        </Link>
      </div>
    </article>
  )
}
