# Requirements: Testing Calibrations S.A.C.

**Defined:** 2026-03-17
**Core Value:** Los clientes pueden conocer los servicios de calibración, explorar el catálogo de equipos, y solicitar cotización de forma rápida.

## v1 Requirements

### Homepage

- [ ] **HOME-01**: Usuario ve hero banner rotativo con imágenes, texto y CTAs administrables desde Sanity
- [ ] **HOME-02**: Usuario ve sección de servicios que describe qué hace la empresa
- [ ] **HOME-03**: Usuario ve sección "Por qué elegirnos" con valores diferenciadores e íconos
- [ ] **HOME-04**: Usuario ve grid de equipos destacados con link al catálogo
- [ ] **HOME-05**: Usuario ve métricas de experiencia con contadores animados (clientes, proyectos, años, etc.)
- [ ] **HOME-06**: Usuario ve sección/enlace al libro de reclamaciones

### Catálogo de Equipos

- [ ] **EQUIP-01**: Usuario puede ver listado de equipos filtrable por tipo (calibración/venta) y categoría
- [ ] **EQUIP-02**: Usuario puede buscar equipos por nombre o marca
- [ ] **EQUIP-03**: Usuario puede ver ficha detalle de equipo con especificaciones, imágenes y estado
- [ ] **EQUIP-04**: Usuario puede solicitar cotización desde la ficha de equipo (abre formulario o WhatsApp con datos del equipo)

### Contacto y Cotización

- [ ] **CONT-01**: Usuario puede enviar formulario de contacto/cotización que notifica por email
- [ ] **CONT-02**: Usuario puede abrir WhatsApp con mensaje predefinido desde botón flotante en toda la web
- [ ] **CONT-03**: Página de contacto muestra ubicación, teléfono, email y mapa
- [ ] **CONT-04**: Usuario puede enviar reclamo a través del libro de reclamaciones (formulario según normativa peruana)
- [ ] **CONT-05**: Reclamos se guardan en Sanity y se envía email de notificación a la empresa

### Blog

- [ ] **BLOG-01**: Usuario puede ver listado de artículos del blog con imagen, título y extracto
- [ ] **BLOG-02**: Usuario puede leer artículo completo con contenido rich text (Portable Text)
- [ ] **BLOG-03**: Artículos son administrables desde Sanity con categorías y autor

### Páginas Institucionales

- [ ] **INST-01**: Usuario puede ver página "Nosotros" con historia y valores de la empresa
- [ ] **INST-02**: Footer muestra datos de contacto, dirección, redes sociales y links de navegación

### CMS y Administración

- [ ] **CMS-01**: Todo el contenido es administrable desde Sanity Studio (textos, imágenes, equipos, artículos, banners)
- [ ] **CMS-02**: Sanity Studio accesible en ruta /studio del sitio
- [ ] **CMS-03**: Schemas de Sanity cubren: equipos, artículos de blog, banners hero, páginas, configuración del sitio, reclamos

### Diseño y UX

- [ ] **UX-01**: Sitio es responsive y mobile-first
- [ ] **UX-02**: Diseño moderno inspirado en rdrental.com.pe (colores oscuros, acentos rojos/amarillos, tipografía bold)
- [ ] **UX-03**: Navegación principal con menú hamburguesa en mobile

### SEO

- [ ] **SEO-01**: Cada página tiene meta tags (title, description) administrables desde Sanity
- [ ] **SEO-02**: Open Graph tags para compartir en redes sociales
- [ ] **SEO-03**: Sitemap XML generado automáticamente

## v2 Requirements

### Notificaciones

- **NOTF-01**: Notificaciones por email cuando se publica nuevo artículo en blog
- **NOTF-02**: Newsletter con suscripción desde el sitio

### Mejoras Catálogo

- **EQPV2-01**: Comparador de equipos lado a lado
- **EQPV2-02**: Galería de imágenes con lightbox en ficha de equipo

### Multiidioma

- **LANG-01**: Sitio disponible en inglés además de español

### Certificaciones

- **CERT-01**: Sección de certificaciones con badges y documentos descargables

## Out of Scope

| Feature | Reason |
|---------|--------|
| E-commerce / pagos en línea | Solo cotización, no venta directa online |
| Chat en vivo | WhatsApp cubre esta necesidad |
| Cuentas de usuario / login | No necesario para un sitio corporativo B2B |
| App móvil | Web responsive es suficiente para v1 |
| OAuth / redes sociales login | No hay cuentas de usuario |
| Múltiples sedes | Solo una sede actualmente |
| Panel analytics propio | Google Analytics es suficiente |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| HOME-01 | — | Pending |
| HOME-02 | — | Pending |
| HOME-03 | — | Pending |
| HOME-04 | — | Pending |
| HOME-05 | — | Pending |
| HOME-06 | — | Pending |
| EQUIP-01 | — | Pending |
| EQUIP-02 | — | Pending |
| EQUIP-03 | — | Pending |
| EQUIP-04 | — | Pending |
| CONT-01 | — | Pending |
| CONT-02 | — | Pending |
| CONT-03 | — | Pending |
| CONT-04 | — | Pending |
| CONT-05 | — | Pending |
| BLOG-01 | — | Pending |
| BLOG-02 | — | Pending |
| BLOG-03 | — | Pending |
| INST-01 | — | Pending |
| INST-02 | — | Pending |
| CMS-01 | — | Pending |
| CMS-02 | — | Pending |
| CMS-03 | — | Pending |
| UX-01 | — | Pending |
| UX-02 | — | Pending |
| UX-03 | — | Pending |
| SEO-01 | — | Pending |
| SEO-02 | — | Pending |
| SEO-03 | — | Pending |

**Coverage:**
- v1 requirements: 29 total
- Mapped to phases: 0
- Unmapped: 29 ⚠️

---
*Requirements defined: 2026-03-17*
*Last updated: 2026-03-17 after initial definition*
