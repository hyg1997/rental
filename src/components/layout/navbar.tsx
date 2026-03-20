'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, ChevronDown, X } from 'lucide-react'

interface DropdownItem {
  label: string
  href: string
  description?: string
}

interface NavLink {
  label: string
  href: string
  dropdown?: DropdownItem[]
}

interface NavbarProps {
  siteName: string
  navLinks: NavLink[]
  logoUrl?: string
}

export function Navbar({ siteName, navLinks, logoUrl }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-[2000] glass border-b border-tc-primary/8 transition-all duration-400 ${
        scrolled ? 'py-3 px-[8%] shadow-premium' : 'py-5 px-[8%]'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center no-underline">
          <Image
            src={logoUrl || '/logo.png'}
            alt={siteName}
            width={360}
            height={100}
            className="h-20 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.href} className="relative group py-2.5">
                <Link
                  href={link.href}
                  className="flex items-center gap-1 text-tc-dark font-bold text-sm hover:text-tc-accent transition-colors"
                >
                  {link.label}
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Link>
                <div className="absolute top-full left-[-50%] w-80 bg-white rounded-2xl p-5 shadow-[0_30px_60px_rgba(0,0,0,0.12)] opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-400">
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-4 p-3 text-tc-text-light rounded-lg hover:bg-tc-surface hover:text-tc-primary transition-colors"
                    >
                      <div>
                        <strong className="block text-sm">{item.label}</strong>
                        {item.description && (
                          <small className="text-xs opacity-70">{item.description}</small>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-tc-dark font-bold text-sm hover:text-tc-accent transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href="/contacto"
            className="bg-tc-accent text-white py-3 px-7 rounded-full font-extrabold text-sm hover:bg-tc-accent-dark hover:scale-105 transition-all shadow-[0_10px_20px_rgba(230,126,34,0.2)]"
          >
            SOLICITAR COTIZACIÓN
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-tc-dark"
          aria-label="Abrir menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[3000] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-tc-border">
              <span className="font-extrabold text-tc-primary text-lg">MENÚ</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Cerrar menu">
                <X className="w-6 h-6 text-tc-dark" />
              </button>
            </div>
            <div className="flex flex-col flex-1 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-tc-dark py-3 px-6 min-h-[48px] flex items-center hover:text-tc-accent hover:bg-tc-surface transition-colors text-base font-semibold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="p-5">
              <Link
                href="/contacto"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center bg-tc-accent text-white hover:bg-tc-accent-dark rounded-full py-3 px-6 text-sm font-extrabold transition-colors"
              >
                SOLICITAR COTIZACIÓN
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
