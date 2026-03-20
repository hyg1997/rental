import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

interface FooterProps {
  siteName: string
  email: string
  address: string
  whatsappNumber: string
  navLinks: Array<{ label: string; href: string }>
  socialLinks: Array<{ platform: string; url: string }>
  footerText: string
  logoUrl?: string
}

const socialIcons: Record<string, string> = {
  Facebook: 'fab fa-facebook-f',
  Instagram: 'fab fa-instagram',
  LinkedIn: 'fab fa-linkedin-in',
  YouTube: 'fab fa-youtube',
}

export function Footer({
  siteName,
  email,
  address,
  whatsappNumber,
  navLinks,
  socialLinks,
  footerText,
  logoUrl,
}: FooterProps) {
  const phone = whatsappNumber
    ? `+${whatsappNumber.slice(0, 2)} ${whatsappNumber.slice(2, 5)} ${whatsappNumber.slice(5, 8)} ${whatsappNumber.slice(8)}`
    : ''

  return (
    <footer className="bg-tc-dark text-white pt-24 lg:pt-32 pb-10 px-[8%]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 lg:gap-20 mb-20 max-w-7xl mx-auto">
        {/* Column 1: About */}
        <div>
          <Image
            src={logoUrl || '/logo.png'}
            alt={siteName}
            width={280}
            height={70}
            className="h-16 w-auto brightness-0 invert mb-6"
          />
          <p className="text-white/60 leading-relaxed text-sm">
            Laboratorio especializado en calibración de equipos de inspección técnica vehicular en
            el norte del Perú. Comprometidos con la imparcialidad y la integridad técnica.
          </p>
          {socialLinks.length > 0 && (
            <div className="mt-8 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-tc-accent transition-colors"
                >
                  <span className="text-sm font-bold">
                    {social.platform.charAt(0)}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Navigation */}
        <div>
          <h5 className="text-sm font-bold text-tc-accent mb-8 uppercase tracking-[2px]">
            Navegación
          </h5>
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/70 hover:text-tc-accent hover:pl-2 text-sm transition-all"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/libro-de-reclamaciones"
                className="text-white/70 hover:text-tc-accent hover:pl-2 text-sm transition-all"
              >
                Libro de Reclamaciones
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Services */}
        <div>
          <h5 className="text-sm font-bold text-tc-accent mb-8 uppercase tracking-[2px]">
            Servicios
          </h5>
          <ul className="space-y-4">
            <li>
              <Link href="/equipos" className="text-white/70 hover:text-tc-accent hover:pl-2 text-sm transition-all">
                Gases Vehiculares
              </Link>
            </li>
            <li>
              <Link href="/equipos" className="text-white/70 hover:text-tc-accent hover:pl-2 text-sm transition-all">
                Frenómetros
              </Link>
            </li>
            <li>
              <Link href="/equipos" className="text-white/70 hover:text-tc-accent hover:pl-2 text-sm transition-all">
                Opacímetros
              </Link>
            </li>
            <li>
              <Link href="/equipos" className="text-white/70 hover:text-tc-accent hover:pl-2 text-sm transition-all">
                Sonómetros
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h5 className="text-sm font-bold text-tc-accent mb-8 uppercase tracking-[2px]">
            Contacto
          </h5>
          <ul className="space-y-5">
            {address && (
              <li className="flex gap-4 text-white/70 text-sm">
                <MapPin className="w-5 h-5 text-tc-accent flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
            )}
            {phone && (
              <li className="flex gap-4 text-white/70 text-sm">
                <Phone className="w-5 h-5 text-tc-accent flex-shrink-0" />
                <span>{phone}</span>
              </li>
            )}
            {email && (
              <li className="flex gap-4 text-white/70 text-sm">
                <Mail className="w-5 h-5 text-tc-accent flex-shrink-0" />
                <span>{email}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10 pt-10 text-center max-w-7xl mx-auto">
        <p className="text-xs text-white/50">
          {footerText || `© ${new Date().getFullYear()} ${siteName}. | Laboratorio en Proceso de Acreditación ante INACAL. Todos los derechos reservados.`}
        </p>
      </div>
    </footer>
  )
}
