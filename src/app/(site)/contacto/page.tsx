import type { Metadata } from 'next'
import { Mail, Phone, MapPin } from 'lucide-react'
import { client } from '@/sanity/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/queries/site-settings'
import { ContactForm } from '@/components/forms/contact-form'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contacto',
    description: 'Contacta a Testing Calibrations S.A.C. para cotizaciones de calibración y venta de equipos de medición.',
    openGraph: {
      title: 'Contacto | Testing Calibrations S.A.C.',
      description: 'Contacta a Testing Calibrations S.A.C. para cotizaciones de calibración y venta de equipos.',
    },
  }
}

export default async function ContactoPage() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)

  return (
    <div className="pt-28">
      {/* Hero */}
      <section className="gradient-blue py-16 px-[8%] text-white">
        <div className="max-w-4xl mx-auto">
          <span className="text-tc-accent font-extrabold tracking-[2px] text-sm uppercase">
            CONTÁCTANOS
          </span>
          <h1 className="font-[Outfit,sans-serif] text-4xl lg:text-5xl font-extrabold mt-4">
            Estamos para ayudarte
          </h1>
        </div>
      </section>

      <section className="py-20 px-[8%] bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tc-surface rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-tc-accent" />
                </div>
                <span className="text-tc-text font-medium">
                  {settings?.email ?? 'contacto@testingcalibrations.com.pe'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tc-surface rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-tc-accent" />
                </div>
                <span className="text-tc-text font-medium">
                  {settings?.whatsappNumber ?? ''}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tc-surface rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-tc-accent" />
                </div>
                <span className="text-tc-text font-medium">
                  {settings?.address ?? 'Pimentel - Chiclayo'}
                </span>
              </div>
            </div>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.96!2d-77.03!3d-12.04!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDAyJzI0LjAiUyA3N8KwMDEnNDguMCJX!5e0!3m2!1ses!2spe!4v1"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Testing Calibrations S.A.C."
              className="rounded-[20px]"
            />
          </div>

          <div className="bg-tc-surface p-10 rounded-[30px] border border-tc-border">
            <h2 className="text-2xl font-bold text-tc-primary mb-6">Envíanos un mensaje</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}
