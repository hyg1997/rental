# Testing Calibrations S.A.C.

## What This Is

Sitio web corporativo para Testing Calibrations S.A.C., empresa peruana dedicada a la calibración de analizadores de gases vehiculares. El sitio presenta sus servicios, catálogo de equipos (calibración y venta), blog informativo, y canales de contacto/cotización. Todo el contenido es administrable desde Sanity Studio en español. Construido con Next.js 15 como frontend y Sanity v3 como CMS headless, desplegado en Hostinger.

## Core Value

Los clientes (talleres mecánicos, plantas de revisiones técnicas, empresas de transporte y flotas) pueden conocer los servicios, ver el catálogo de equipos, y solicitar cotización de forma rápida.

## Requirements

### Validated

- ✓ Homepage con hero banner, servicios, equipos destacados, métricas, y CTA de cotización — v1.0
- ✓ Catálogo de equipos: listado filtrable por tipo con búsqueda en tiempo real — v1.0
- ✓ Detalle de equipo con especificaciones, estado, y botón de cotización WhatsApp — v1.0
- ✓ Blog con artículos administrables desde Sanity con categorías y autor — v1.0
- ✓ Página de contacto con formulario web que envía email (Resend) — v1.0
- ✓ Botón flotante de WhatsApp con mensaje predefinido en toda la web — v1.0
- ✓ Página "Nosotros" con historia, misión, visión y valores — v1.0
- ✓ Todo el contenido administrable desde Sanity CMS con Studio en español — v1.0
- ✓ Diseño responsive mobile-first con menú hamburguesa — v1.0
- ✓ SEO: meta tags editables desde Sanity, Open Graph, sitemap XML — v1.0
- ✓ Libro de reclamaciones con formulario regulado y persistencia en Sanity — v1.0

### Active

(Ninguno — definir con `/gsd:new-milestone`)

### Out of Scope

- Multiidioma (inglés) — solo español para v1
- Certificaciones/ISO — no cuentan con ellas actualmente
- Múltiples sedes — solo una sede por ahora
- E-commerce/pagos en línea — solo cotización
- Chat en vivo — WhatsApp cubre esta necesidad
- Sistema de cuentas de usuario — no necesario
- App móvil — web responsive es suficiente

## Context

Shipped v1.0 con 3,436 LOC TypeScript en 1 día.
Tech stack: Next.js 15 (App Router), Sanity v3, Tailwind v4, shadcn/ui, Resend, Playwright.
Hosting: Hostinger (VPS con next start).

**Known tech debt (8 items):**
- Sanity project ID es placeholder — requiere configuración real
- Test de hamburguesa con assertions comentadas
- No hay CI/CD pipeline configurado
- Badge `en_mantenimiento` es dead code en EquipmentCard
- Email from/to son defaults sandbox de Resend
- Google Maps iframe con coordenadas placeholder
- RESEND_API_KEY no configurado en .env.local
- SANITY_WRITE_TOKEN no configurado en .env.local

## Constraints

- **CMS**: Sanity v3 — contenido headless administrable
- **Frontend**: Next.js 15 — App Router, SSR/SSG para SEO y performance
- **Hosting**: Hostinger — VPS con `next start`
- **Idioma**: Solo español
- **Contenido**: Placeholder/demo — el cliente proveerá material real

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Sanity como CMS | Headless, flexible, free tier generoso, buen DX | ✓ Good — Studio funcional, schemas completos |
| Next.js como frontend | SSR/SSG, SEO-friendly, ideal con Sanity | ✓ Good — 7 páginas con generateMetadata |
| VPS en Hostinger | Cliente ya tiene hosting pagado, permite next start | ✓ Good — habilita Studio embebido y API routes |
| Diseño inspirado en RD Rental | Cliente quiere estilo similar modernizado | ✓ Good — colores oscuros + acentos rojos/amarillos |
| Cotización dual (form + WhatsApp) | Maximizar canales de contacto | ✓ Good — ambos canales implementados |
| @sanity/client directo (no next-sanity) | Evitar issue #1899 de server actions | ✓ Good — sin problemas de importación |
| OKLCH color palette CSS-first | Tailwind v4 pattern, sin tailwind.config.js | ✓ Good — tokens brand-* consistentes |
| siteSettings singleton para todo | Simpler para editores no-técnicos | ✓ Good — un solo documento con fieldGroups |
| Structure Builder + locale español | UX intuitiva para editores hispanohablantes | ✓ Good — sidebar organizado con labels en español |

---
*Last updated: 2026-03-18 after v1.0 milestone*
