'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

interface NavbarProps {
  siteName: string
  navLinks: Array<{ label: string; href: string }>
}

export function Navbar({ siteName, navLinks }: NavbarProps) {
  return (
    <header className="bg-brand-surface w-full px-4 md:px-8 py-6">
      <nav className="flex items-center justify-between">
        {/* Logo / Site Name */}
        <Link
          href="/"
          className="text-brand-text font-bold text-xl hover:text-brand-text/80 transition-colors"
        >
          {siteName}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-brand-text text-sm font-normal hover:text-brand-red transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center bg-brand-red text-white hover:bg-brand-yellow hover:text-black rounded-md py-2 px-4 text-sm font-medium transition-colors"
          >
            Solicitar Cotizacion
          </Link>
        </div>

        {/* Mobile hamburger */}
        <Sheet>
          <SheetTrigger
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-brand-text bg-transparent border-0 cursor-pointer"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-brand-surface w-64 flex flex-col">
            <SheetTitle className="sr-only">Menu de navegacion</SheetTitle>
            <div className="flex flex-col flex-1 pt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-brand-text py-3 px-4 min-h-[48px] flex items-center hover:text-brand-red transition-colors text-base"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="p-4">
              <Link
                href="/contacto"
                className="w-full inline-flex items-center justify-center bg-brand-red text-white hover:bg-brand-yellow hover:text-black rounded-md py-2 px-4 text-sm font-medium transition-colors"
              >
                Solicitar Cotizacion
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
