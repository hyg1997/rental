import { client } from '@/sanity/client'
import { BANNERS_QUERY } from '@/sanity/queries/banners'
import { FEATURED_EQUIPOS_QUERY } from '@/sanity/queries/home'
import { HOMEPAGE_CONTENT_QUERY } from '@/sanity/queries/homepage'
import { HeroCarousel } from '@/components/home/hero-carousel'
import { ServicesSection } from '@/components/home/services-section'
import { ValuesSection } from '@/components/home/values-section'
import { FeaturedEquipment } from '@/components/home/featured-equipment'
import { MetricsSection } from '@/components/home/metrics-counter'
import { ReclamacionesCta } from '@/components/home/reclamaciones-cta'

export default async function HomePage() {
  const [banners, featuredEquipos, homepageContent] = await Promise.all([
    client.fetch(BANNERS_QUERY).catch(() => []),
    client.fetch(FEATURED_EQUIPOS_QUERY).catch(() => []),
    client.fetch(HOMEPAGE_CONTENT_QUERY).catch(() => null),
  ])

  return (
    <>
      <HeroCarousel banners={banners} />
      <ServicesSection servicios={homepageContent?.servicios ?? []} />
      <ValuesSection valores={homepageContent?.valores ?? []} />
      <FeaturedEquipment equipos={featuredEquipos} />
      <MetricsSection metricas={homepageContent?.metricas ?? []} />
      <ReclamacionesCta />
    </>
  )
}
