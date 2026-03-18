import type { MetadataRoute } from 'next'
import { client } from '@/sanity/client'
import { defineQuery } from 'groq'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://testingcalibrations.com.pe'

const SITEMAP_POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)]{
  "slug": slug.current,
  fechaPublicacion
}`)

const SITEMAP_EQUIPOS_QUERY = defineQuery(`*[_type == "equipo" && defined(slug.current)]{
  "slug": slug.current,
  _updatedAt
}`)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, equipos] = await Promise.all([
    client.fetch(SITEMAP_POSTS_QUERY).catch(() => []),
    client.fetch(SITEMAP_EQUIPOS_QUERY).catch(() => []),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/nosotros`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/equipos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((post: { slug: string; fechaPublicacion: string }) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.fechaPublicacion ? new Date(post.fechaPublicacion) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const equipoRoutes: MetadataRoute.Sitemap = equipos.map((eq: { slug: string; _updatedAt: string }) => ({
    url: `${BASE_URL}/equipos/${eq.slug}`,
    lastModified: eq._updatedAt ? new Date(eq._updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...postRoutes, ...equipoRoutes]
}
