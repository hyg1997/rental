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
    <article className="bg-white rounded-[20px] overflow-hidden border border-tc-border hover:-translate-y-2 hover:border-tc-accent hover:shadow-premium transition-all duration-500">
      {imagen ? (
        <Image
          src={urlFor(imagen as Parameters<typeof urlFor>[0]).width(600).height(338).quality(80).auto('format').url()}
          alt={titulo}
          width={600}
          height={338}
          className="object-cover w-full aspect-video"
        />
      ) : (
        <div className="w-full aspect-video bg-tc-surface flex items-center justify-center">
          <FileText size={48} className="text-tc-text-light/30" />
        </div>
      )}

      <div className="p-6">
        {categoria && (
          <Badge className="bg-tc-accent/20 text-tc-accent text-xs mb-3">{categoria}</Badge>
        )}

        <h3 className="text-lg font-bold text-tc-primary line-clamp-2">{titulo}</h3>

        {extracto && (
          <p className="text-sm text-tc-text/70 mt-2 line-clamp-3">{extracto}</p>
        )}

        <div className="flex items-center gap-4 mt-3 text-xs text-tc-text-light">
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
          className="text-sm text-tc-accent hover:text-tc-accent-dark font-bold mt-4 inline-block transition-colors"
        >
          Leer artículo &rarr;
        </Link>
      </div>
    </article>
  )
}
