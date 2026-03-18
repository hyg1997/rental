import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { BANNERS_QUERY } from '@/sanity/queries/banners'
import { FEATURED_EQUIPOS_QUERY } from '@/sanity/queries/home'
import { HOMEPAGE_CONTENT_QUERY } from '@/sanity/queries/homepage'
import { SITE_SEO_DEFAULTS_QUERY } from '@/sanity/queries/seo'
import { urlFor } from '@/lib/image-url'
import { HeroCarousel } from '@/components/home/hero-carousel'
import { ServicesSection } from '@/components/home/services-section'
import { ValuesSection } from '@/components/home/values-section'
import { FeaturedEquipment } from '@/components/home/featured-equipment'
import { MetricsSection } from '@/components/home/metrics-counter'
import { ReclamacionesCta } from '@/components/home/reclamaciones-cta'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await client.fetch(SITE_SEO_DEFAULTS_QUERY).catch(() => null)

  return {
    title: seo?.defaultSeoTitle ?? 'Testing Calibrations S.A.C.',
    description: seo?.defaultSeoDescription ?? 'Servicios de calibracion y venta de equipos de medicion en Peru.',
    openGraph: {
      title: seo?.defaultSeoTitle ?? 'Testing Calibrations S.A.C.',
      description: seo?.defaultSeoDescription ?? 'Servicios de calibracion y venta de equipos de medicion en Peru.',
      images: seo?.defaultOgImage
        ? [{ url: urlFor(seo.defaultOgImage).width(1200).height(630).url(), width: 1200, height: 630 }]
        : [],
    },
  }
}

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
