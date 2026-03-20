import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { EQUIPO_BY_SLUG_QUERY, EQUIPOS_SLUGS_QUERY } from '@/sanity/queries/equipos'
import { EQUIPO_SEO_BY_SLUG_QUERY } from '@/sanity/queries/seo'
import { SITE_SETTINGS_QUERY } from '@/sanity/queries/site-settings'
import { urlFor } from '@/lib/image-url'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Package } from 'lucide-react'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const equipo = await client.fetch(EQUIPO_SEO_BY_SLUG_QUERY, { slug }).catch(() => null)

  if (!equipo) return { title: 'Equipo no encontrado' }

  const title = equipo.seoTitle ?? equipo.nombre
  const description = equipo.seoDescription ?? equipo.descripcion
    ?? `${equipo.nombre}${equipo.marca ? ` - ${equipo.marca}` : ''} | Testing Calibrations S.A.C.`

  const imageUrl = equipo.imagen
    ? urlFor(equipo.imagen).width(1200).height(630).url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
  }
}

export async function generateStaticParams() {
  const slugs = await client.fetch(EQUIPOS_SLUGS_QUERY).catch(() => [])
  return slugs.map((item: { slug: string }) => ({ slug: item.slug }))
}

export default async function EquipoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [equipo, settings] = await Promise.all([
    client.fetch(EQUIPO_BY_SLUG_QUERY, { slug }).catch(() => null),
    client.fetch(SITE_SETTINGS_QUERY).catch(() => null),
  ])

  if (!equipo) notFound()

  const whatsappNumber = settings?.whatsappNumber ?? ''
  const message = encodeURIComponent(
    `Hola, me interesa solicitar una cotizacion para el equipo: ${equipo.nombre}`
  )
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <section className="max-w-5xl mx-auto px-[8%] pt-32 pb-16">
      {/* Breadcrumb */}
      <nav className="text-sm text-tc-text-light mb-6">
        <Link href="/equipos" className="hover:text-tc-accent transition-colors">
          Catálogo
        </Link>
        {' / '}
        <span className="text-tc-text font-medium">{equipo.nombre}</span>
      </nav>

      {/* Two-column hero */}
      <div className="lg:grid lg:grid-cols-2 gap-12">
        {/* Left column — Primary image */}
        <div>
          {equipo.imagenes?.length > 0 ? (
            <Image
              src={urlFor(equipo.imagenes[0]).width(800).height(600).quality(80).auto('format').url()}
              alt={equipo.nombre}
              width={800}
              height={600}
              className="w-full aspect-[4/3] object-cover rounded-lg"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full aspect-[4/3] rounded-lg bg-tc-surface flex items-center justify-center">
              <Package size={64} className="text-tc-text/30" />
            </div>
          )}
        </div>

        {/* Right column — Info */}
        <div>
          <h1 className="font-[Outfit,sans-serif] text-3xl font-extrabold text-tc-primary">{equipo.nombre}</h1>

          {equipo.marca && (
            <p className="text-sm text-tc-text/60 mt-1">
              {equipo.marca}
              {equipo.modelo ? ` ${equipo.modelo}` : ''}
            </p>
          )}

          <div className="flex gap-2 mt-3 flex-wrap">
            {equipo.tipo && (
              <Badge className="bg-tc-surface text-tc-text">
                {equipo.tipo === 'calibracion' ? 'Calibracion' : 'En Venta'}
              </Badge>
            )}
            {equipo.estado === 'disponible' && (
              <Badge className="bg-green-600 text-white">Disponible</Badge>
            )}
            {equipo.estado === 'no_disponible' && (
              <Badge className="bg-tc-text/20 text-tc-text/60">No disponible</Badge>
            )}
          </div>

          {equipo.descripcion && (
            <p className="text-base text-tc-text mt-4 leading-relaxed">
              {equipo.descripcion}
            </p>
          )}

          {/* WhatsApp CTA */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-tc-accent hover:bg-tc-accent-dark text-white font-extrabold py-4 px-8 rounded-full transition-all hover:scale-105 mt-6 w-full lg:w-auto justify-center shadow-[0_10px_20px_rgba(230,126,34,0.2)]"
          >
            <MessageCircle size={20} />
            Solicitar Cotizacion por WhatsApp
          </a>
        </div>
      </div>

      {/* Specifications section */}
      {equipo.especificaciones && (
        <section className="mt-12 pt-8 border-t border-tc-text/10">
          <h2 className="text-xl font-bold text-tc-text mb-4">Especificaciones</h2>
          <div className="prose max-w-none text-tc-text">
            <PortableText value={equipo.especificaciones} />
          </div>
        </section>
      )}
    </section>
  )
}
