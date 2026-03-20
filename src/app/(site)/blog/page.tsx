import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { POSTS_LIST_QUERY } from '@/sanity/queries/posts'
import { PostCard } from '@/components/blog/post-card'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog',
    description: 'Artículos sobre calibración, metrología y equipos de medición por Testing Calibrations S.A.C.',
    openGraph: {
      title: 'Blog | Testing Calibrations S.A.C.',
      description: 'Artículos sobre calibración, metrología y equipos de medición.',
    },
  }
}

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_LIST_QUERY).catch(() => [])

  return (
    <div className="pt-28">
      <section className="gradient-blue py-16 px-[8%] text-white">
        <div className="max-w-4xl mx-auto">
          <span className="text-tc-accent font-extrabold tracking-[2px] text-sm uppercase">
            NOTICIAS Y ARTÍCULOS
          </span>
          <h1 className="font-[Outfit,sans-serif] text-4xl lg:text-5xl font-extrabold mt-4">
            Blog
          </h1>
        </div>
      </section>

      <section className="py-16 px-[8%] bg-white">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-tc-primary">Pronto publicaremos artículos</h2>
              <p className="text-tc-text-light mt-3">
                Estamos preparando contenido sobre calibración y metrología. Vuelve pronto.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>
      </section>
    </div>
  )
}
