import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { BANNERS_QUERY } from '@/sanity/queries/banners'
import { FEATURED_EQUIPOS_QUERY } from '@/sanity/queries/home'
import { HOMEPAGE_CONTENT_QUERY } from '@/sanity/queries/homepage'
import { SITE_SEO_DEFAULTS_QUERY } from '@/sanity/queries/seo'
import { urlFor } from '@/lib/image-url'
import { HeroCarousel } from '@/components/home/hero-carousel'
import { AboutSection } from '@/components/home/about-section'
import { ServicesSection } from '@/components/home/services-section'
import { ProcessSection } from '@/components/home/process-section'
import { ValuesSection } from '@/components/home/values-section'
import { FeaturedEquipment } from '@/components/home/featured-equipment'
import { MetricsSection } from '@/components/home/metrics-counter'
import { ReclamacionesCta } from '@/components/home/reclamaciones-cta'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await client.fetch(SITE_SEO_DEFAULTS_QUERY).catch(() => null)

  return {
    title: seo?.defaultSeoTitle ?? 'Testing Calibrations S.A.C. | Ingeniería y Metrología de Precisión',
    description: seo?.defaultSeoDescription ?? 'Laboratorio especializado en calibración metrológica bajo la norma NTP ISO/IEC 17025.',
    openGraph: {
      title: seo?.defaultSeoTitle ?? 'Testing Calibrations S.A.C.',
      description: seo?.defaultSeoDescription ?? 'Laboratorio especializado en calibración metrológica bajo la norma NTP ISO/IEC 17025.',
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

  const historia =
    homepageContent?.nosotrosHistoria ??
    'Testing Calibrations S.A.C. es un laboratorio especializado en la calibración de analizadores de gases vehiculares, comprometido con la confiabilidad de las mediciones, la calidad técnica y el cumplimiento de los requisitos normativos aplicables. Contamos con personal técnico capacitado, procedimientos estandarizados y equipos de referencia que aseguran resultados de calibración precisos, confiables y trazables.'
  const mision =
    homepageContent?.nosotrosMision ??
    'Brindar servicios de calibración de analizadores de gases vehiculares con altos estándares técnicos, garantizando exactitud, confiabilidad y trazabilidad metrológica, mediante la aplicación de la NTP ISO/IEC 17025 y la mejora continua de nuestro sistema de gestión.'
  const vision =
    homepageContent?.nosotrosVision ??
    'Ser un laboratorio de calibración reconocido a nivel nacional, acreditado y referente en la confiabilidad de las mediciones de gases vehiculares, destacando por nuestra competencia técnica, imparcialidad, innovación y compromiso con la calidad y el medio ambiente.'

  return (
    <>
      <HeroCarousel banners={banners} />
      <AboutSection
        historia={historia}
        mision={mision}
        vision={vision}
        aboutImage={homepageContent?.aboutImage}
        experienceYears={homepageContent?.aboutExperienceYears}
      />
      <ServicesSection servicios={homepageContent?.servicios ?? []} />
      <ProcessSection proceso={homepageContent?.proceso ?? []} />
      <FeaturedEquipment equipos={featuredEquipos} />
      <MetricsSection metricas={homepageContent?.metricas ?? []} />
      <ValuesSection valores={homepageContent?.valores ?? []} />
      <ReclamacionesCta />
    </>
  )
}
