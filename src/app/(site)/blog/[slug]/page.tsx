import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { POST_BY_SLUG_QUERY, POST_SLUGS_QUERY } from '@/sanity/queries/posts'
import { POST_SEO_BY_SLUG_QUERY } from '@/sanity/queries/seo'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/image-url'
import { Badge } from '@/components/ui/badge'
import { PortableTextRenderer } from '@/components/blog/portable-text-renderer'
import type { PortableTextBlock } from '@portabletext/types'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await client.fetch(POST_SEO_BY_SLUG_QUERY, { slug }).catch(() => null)

  if (!post) return { title: 'Articulo no encontrado' }

  const title = post.seoTitle ?? post.titulo
  const description = post.seoDescription ?? post.extracto

  const imageUrl = post.ogImage
    ? urlFor(post.ogImage).width(1200).height(630).url()
    : post.imagen
      ? urlFor(post.imagen).width(1200).height(630).url()
      : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      type: 'article',
      publishedTime: post.fechaPublicacion ?? undefined,
      authors: post.autor ? [post.autor] : undefined,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
  }
}

export async function generateStaticParams() {
  const slugs = await client.fetch(POST_SLUGS_QUERY).catch(() => [])
  return slugs.map((item: { slug: string }) => ({ slug: item.slug }))
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const post = await client.fetch(POST_BY_SLUG_QUERY, { slug }).catch(() => null)
  if (!post) notFound()

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 text-sm text-brand-text/60 mb-4">
        {post.categoria && (
          <Badge className="bg-brand-red/20 text-brand-red text-xs">{post.categoria}</Badge>
        )}
        {post.fechaPublicacion && (
          <span>
            {new Date(post.fechaPublicacion).toLocaleDateString('es-PE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        )}
        {post.autor && <span>{post.autor}</span>}
      </div>

      <h1 className="text-3xl font-bold text-brand-text mb-8">{post.titulo}</h1>

      {post.imagen && (
        <Image
          src={urlFor(post.imagen as Parameters<typeof urlFor>[0])
            .width(800)
            .quality(80)
            .auto('format')
            .url()}
          alt={post.titulo}
          width={800}
          height={450}
          className="rounded-lg object-cover w-full mb-8"
        />
      )}

      {post.contenido && (
        <PortableTextRenderer value={post.contenido as PortableTextBlock[]} />
      )}

      <Link
        href="/blog"
        className="text-sm text-brand-red hover:text-brand-yellow mt-8 inline-block"
      >
        &larr; Volver al blog
      </Link>
    </section>
  )
}
