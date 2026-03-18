import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { POSTS_LIST_QUERY } from '@/sanity/queries/posts'
import { PostCard } from '@/components/blog/post-card'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog',
    description: 'Articulos sobre calibracion, metrologia y equipos de medicion por Testing Calibrations S.A.C.',
    openGraph: {
      title: 'Blog | Testing Calibrations S.A.C.',
      description: 'Articulos sobre calibracion, metrologia y equipos de medicion.',
    },
  }
}

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_LIST_QUERY).catch(() => [])

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-brand-text mb-8">Blog</h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-brand-text">Pronto publicaremos articulos</h2>
          <p className="text-sm text-brand-text/60 mt-2">
            Estamos preparando contenido sobre calibracion y metrologia. Vuelve pronto.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: { _id: string; titulo: string; slug: string | null; extracto: string | null; imagen: unknown; autor: string | null; categoria: string | null; fechaPublicacion: string | null }) => (
            <PostCard
              key={post._id}
              titulo={post.titulo}
              slug={post.slug ?? ''}
              extracto={post.extracto}
              imagen={post.imagen}
              autor={post.autor}
              categoria={post.categoria}
              fechaPublicacion={post.fechaPublicacion}
            />
          ))}
        </div>
      )}
    </section>
  )
}
