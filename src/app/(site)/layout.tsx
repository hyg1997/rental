import { client } from '@/sanity/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/queries/site-settings'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)

  return (
    <>
      <Navbar
        siteName={settings?.siteName ?? 'Testing Calibrations S.A.C.'}
        navLinks={settings?.navLinks ?? [
          { label: 'Inicio', href: '/' },
          { label: 'Equipos', href: '/equipos' },
          { label: 'Nosotros', href: '/nosotros' },
          { label: 'Blog', href: '/blog' },
          { label: 'Contacto', href: '/contacto' },
        ]}
      />
      <main className="min-h-screen">{children}</main>
      <Footer
        siteName={settings?.siteName ?? 'Testing Calibrations S.A.C.'}
        email={settings?.email ?? ''}
        address={settings?.address ?? ''}
        whatsappNumber={settings?.whatsappNumber ?? ''}
        navLinks={settings?.navLinks ?? []}
        socialLinks={settings?.socialLinks ?? []}
        footerText={settings?.footerText ?? ''}
      />
      <WhatsAppButton whatsappNumber={settings?.whatsappNumber ?? ''} />
    </>
  )
}
