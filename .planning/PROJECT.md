# Testing Calibrations S.A.C.

## What This Is

Sitio web corporativo para Testing Calibrations S.A.C., empresa peruana dedicada a la calibración de analizadores de gases vehiculares. El sitio presenta sus servicios, catálogo de equipos (calibración y venta), blog informativo, y canales de contacto/cotización. Construido con Next.js como frontend y Sanity como CMS headless, con diseño moderno inspirado en rdrental.com.pe. Desplegado en Hostinger.

## Core Value

Los clientes (talleres mecánicos, plantas de revisiones técnicas, empresas de transporte y flotas) pueden conocer los servicios, ver el catálogo de equipos, y solicitar cotización de forma rápida.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Homepage con hero banner, sección de servicios, equipos destacados, métricas/experiencia, y CTA de cotización
- [ ] Catálogo de equipos: listado filtrable con equipos que calibran y equipos en venta
- [ ] Detalle de equipo con especificaciones, estado, y botón de cotización
- [ ] Blog con artículos administrables desde Sanity
- [ ] Página de contacto con formulario web que envía email
- [ ] Botón flotante de WhatsApp con mensaje predefinido
- [ ] Página "Nosotros" con historia y valores de la empresa
- [ ] Todo el contenido administrable desde Sanity CMS (textos, imágenes, equipos, artículos)
- [ ] Diseño responsive mobile-first
- [ ] SEO básico (meta tags, Open Graph, sitemap)

### Out of Scope

- Multiidioma (inglés) — solo español para v1
- Certificaciones/ISO — no cuentan con ellas actualmente
- Múltiples sedes — solo una sede por ahora
- E-commerce/pagos en línea — solo cotización
- Chat en vivo — WhatsApp cubre esta necesidad
- Sistema de cuentas de usuario — no necesario para v1

## Context

- La empresa se dedica exclusivamente a la calibración de analizadores de gases vehiculares
- Clientes: talleres mecánicos, plantas de revisiones técnicas, empresas de transporte, flotas vehiculares, minería
- El catálogo tiene dos tipos: equipos que calibran (servicio) y equipos que venden
- Todo el contenido visual (logo, fotos, textos) se creará desde cero con placeholders
- El diseño se inspira en rdrental.com.pe: colores oscuros, acentos rojos/amarillos, layout de secciones full-width, tipografía bold para headings
- Actualmente tienen Hostinger como hosting pagado

## Constraints

- **CMS**: Sanity — contenido headless administrable
- **Frontend**: Next.js — SSR/SSG para SEO y performance
- **Hosting**: Hostinger — ya cuentan con plan pagado
- **Idioma**: Solo español
- **Contenido**: Placeholder/demo inicialmente — el cliente proveerá material real después

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Sanity como CMS | Headless, flexible, free tier generoso, buen DX | — Pending |
| Next.js como frontend | SSR/SSG, SEO-friendly, ideal con Sanity | — Pending |
| Deploy en Hostinger | Cliente ya tiene hosting pagado ahí | — Pending |
| Diseño inspirado en RD Rental | Cliente quiere estilo similar pero modernizado | — Pending |
| Cotización dual (form + WhatsApp) | Maximizar canales de contacto | — Pending |

---
*Last updated: 2026-03-17 after initialization*
