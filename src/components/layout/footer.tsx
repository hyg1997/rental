import Link from 'next/link'

interface FooterProps {
  siteName: string
  email: string
  address: string
  whatsappNumber: string
  navLinks: Array<{ label: string; href: string }>
  socialLinks: Array<{ platform: string; url: string }>
  footerText: string
}

export function Footer({
  siteName,
  email,
  address,
  whatsappNumber,
  navLinks,
  socialLinks,
  footerText,
}: FooterProps) {
  return (
    <footer className="bg-brand-surface w-full py-12 px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Contact */}
        <div>
          <h3 className="text-brand-text font-bold text-lg mb-4">Contacto</h3>
          {email && (
            <p className="text-brand-text/60 text-sm mb-2">{email}</p>
          )}
          {address && (
            <p className="text-brand-text/60 text-sm mb-2">{address}</p>
          )}
          {whatsappNumber && (
            <p className="text-brand-text/60 text-sm mb-2">{whatsappNumber}</p>
          )}
        </div>

        {/* Column 2: Navigation */}
        <div>
          <h3 className="text-brand-text font-bold text-lg mb-4">Navegacion</h3>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-brand-text/60 hover:text-brand-red text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Social */}
        <div>
          <h3 className="text-brand-text font-bold text-lg mb-4">Redes Sociales</h3>
          <ul className="space-y-2">
            {socialLinks.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-text/60 hover:text-brand-red text-sm transition-colors"
                >
                  {social.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-brand-text/10 mt-8 pt-8">
        {footerText ? (
          <p className="text-brand-text/60 text-sm text-center">{footerText}</p>
        ) : (
          <p className="text-brand-text/60 text-sm text-center">
            © {new Date().getFullYear()} Testing Calibrations S.A.C. Todos los derechos reservados.
          </p>
        )}
      </div>
    </footer>
  )
}
