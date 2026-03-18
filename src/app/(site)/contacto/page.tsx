import { Mail, Phone, MapPin } from 'lucide-react'
import { client } from '@/sanity/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/queries/site-settings'
import { ContactForm } from '@/components/forms/contact-form'

export default async function ContactoPage() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null)

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-brand-text mb-8">Contactanos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-brand-red" />
              <span className="text-brand-text">
                {settings?.email ?? 'contacto@testingcalibrations.com.pe'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={20} className="text-brand-red" />
              <span className="text-brand-text">
                {settings?.whatsappNumber ?? ''}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-brand-red" />
              <span className="text-brand-text">
                {settings?.address ?? 'Lima, Peru'}
              </span>
            </div>
          </div>

          {/* TODO: Replace with real Google Maps embed URL */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.96!2d-77.03!3d-12.04!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDAyJzI0LjAiUyA3N8KwMDEnNDguMCJX!5e0!3m2!1ses!2spe!4v1"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicacion Testing Calibrations S.A.C."
          />
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
