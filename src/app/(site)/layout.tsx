import { client } from '@/sanity/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/queries/site-settings'
import { urlFor } from '@/lib/image-url'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

const defaultNavLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'La Empresa', href: '/nosotros' },
  { label: 'Servicios', href: '/equipos' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
]

const defaultSocialLinks = [
  { platform: 'LinkedIn', url: '#' },
  { platform: 'Facebook', url: '#' },
]

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)

  const validNavLinks = settings?.navLinks?.filter(
    (link: { label?: string; href?: string }) => link.label && link.href
  )
  const navLinks = validNavLinks?.length ? validNavLinks : defaultNavLinks
  const logoUrl = settings?.logo
    ? urlFor(settings.logo).height(80).url()
    : '/logo.png'

  return (
    <>
      <Navbar
        siteName={settings?.siteName ?? 'Testing Calibrations'}
        navLinks={navLinks}
        logoUrl={logoUrl}
      />
      <main className="min-h-screen">{children}</main>
      <Footer
        siteName={settings?.siteName ?? 'Testing Calibrations'}
        logoUrl={logoUrl}
        email={settings?.email ?? 'servicios@testingcs.com'}
        address={settings?.address ?? 'Predio Los Arenales Sub Lote B-1C, Pimentel - Chiclayo'}
        whatsappNumber={settings?.whatsappNumber ?? '51978444224'}
        navLinks={navLinks}
        socialLinks={settings?.socialLinks?.length ? settings.socialLinks : defaultSocialLinks}
        footerText={settings?.footerText ?? '© 2026 Testing Calibrations S.A.C. | Laboratorio en Proceso de Acreditación ante INACAL. Todos los derechos reservados.'}
      />
      <WhatsAppButton whatsappNumber={settings?.whatsappNumber ?? '51978444224'} />
    </>
  )
}
