---
phase: 3
slug: content-pages-and-contact
status: approved
reviewed_at: 2026-03-17
shadcn_initialized: true
preset: base-nova
created: 2026-03-17
---

# Phase 3 — UI Design Contract

> Visual and interaction contract para Phase 3: Content Pages and Contact.
> Generado por gsd-ui-researcher. Verificado por gsd-ui-checker.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn/ui |
| Style | base-nova |
| Preset | base-nova (detected from components.json) |
| Component library | Radix UI (via shadcn) |
| Icon library | lucide-react (v0.577.0) |
| Font | Inter (via --font-heading y --font-body en globals.css) |
| CSS approach | Tailwind v4 @theme inline — no tailwind.config.js |
| Installed components | badge, button, input, sheet |

**Fuente:** components.json + `npx shadcn info` + globals.css

---

## Spacing Scale

Declarado explícitamente. Todos los valores son múltiplos de 4. El proyecto usa Tailwind v4 con escala por defecto — estos tokens mapean directamente a las clases Tailwind.

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Gaps de iconos, padding inline (p-1, gap-1) |
| sm | 8px | Espaciado compacto entre elementos (p-2, gap-2) |
| md | 16px | Espaciado por defecto en cards y formularios (p-4, gap-4) |
| lg | 24px | Padding de secciones, grid gaps de layout (p-6, gap-6) |
| xl | 32px | Separación de bloques en página (p-8, gap-8) |
| 2xl | 48px | Padding vertical de secciones principales (py-12) |
| 3xl | 64px | Padding vertical de secciones hero y métricas (py-16) |

Excepciones:
- Botón flotante de WhatsApp: posicionado a `bottom-6 right-6` (24px) — ya implementado
- Touch targets mínimos: 44px para botones icon-only (cumplido con `p-2` + tamaño de icono 24px = 44px efectivos)
- Hero banner: `h-[80vh]` — altura libre, no ligada a escala de 8pt

**Fuente:** globals.css + patrones establecidos en Phases 1-2 (equipment-card.tsx, footer.tsx)

---

## Typography

Fuente única: **Inter** para heading y body (definida en `--font-heading` y `--font-body`).
El proyecto usa exactamente 2 pesos: 400 (normal) y 700 (bold). Confirmado en equipment-card.tsx (`font-bold`) y footer.tsx.

| Role | Size | Weight | Line Height | Tailwind Class |
|------|------|--------|-------------|---------------|
| Body | 14px | 400 (normal) | 1.5 | `text-sm` |
| Label / Caption | 14px | 400 (normal) | 1.4 | `text-sm text-brand-text/60` |
| Subheading / Card title | 20px | 700 (bold) | 1.3 | `text-xl font-bold` |
| Section heading | 28px | 700 (bold) | 1.2 | `text-2xl font-bold` |
| Display / Hero heading | 48px mobile → 60px desktop | 700 (bold) | 1.1 | `text-4xl md:text-5xl font-bold` |

Regla de línea base: body siempre en `leading-relaxed` (1.625) para bloques de texto largo (blog PortableText, descripción Nosotros).

**Fuente:** Patrones observados en equipment-card.tsx, footer.tsx, RESEARCH.md patrón 4 (hero) y patrón 6 (blog)

---

## Color

Tokens OKLCH definidos en `globals.css` bajo `@theme inline`. Son los únicos colores de marca autorizados. No usar colores Tailwind genéricos (blue-500, etc.) salvo para estados de status de equipos.

| Role | Token | OKLCH | Usage |
|------|-------|-------|-------|
| Dominant (60%) | `brand-bg` | oklch(0.12 0.01 260) | Fondo de página, fondo de Navbar |
| Secondary (30%) | `brand-surface` | oklch(0.18 0.01 260) | Cards, footer, secciones alternas, formularios |
| Accent primario (10%) | `brand-red` | oklch(0.55 0.22 25) | CTAs primarios, hover en links, dot indicator activo en carousel, badge de CTA de reclamos |
| Accent secundario | `brand-yellow` | oklch(0.82 0.18 85) | Números de métricas animadas, hover de accent cuando ya está sobre brand-red |
| Text | `brand-text` | oklch(0.96 0.01 260) | Todo el texto principal |
| Text muted | `brand-text/60` | — | Metadata, labels secundarios, texto footer |
| Destructive | `--destructive` shadcn | oklch(0.577 0.245 27.325) | Solo para errores de formulario (mensajes de error en contact form y reclamo form) |

Accent reservado para los siguientes elementos **exclusivamente**:
1. Botones CTA primarios (fondo `bg-brand-red`)
2. Links de texto con acción (`text-brand-red hover:text-brand-yellow`)
3. Dot indicator activo en hero carousel (`bg-brand-red`)
4. Badge/CTA de sección libro de reclamaciones
5. Underline/border de tab activo en filtro de equipos (ya implementado)

Estados de status de equipos (excepción a la paleta brand, ya establecida en Phase 2):
- `bg-green-600` — Disponible
- `bg-amber-600` — En mantenimiento
- `bg-brand-text/20` — No disponible

**Fuente:** globals.css (tokens), equipment-card.tsx (patrones de uso), REQUIREMENTS.md UX-02, RESEARCH.md patrón 4

---

## Component Inventory

Componentes disponibles (ya instalados en shadcn):

| Component | Shadcn | Path | Used in Phase 3 |
|-----------|--------|------|-----------------|
| Button | yes | @/components/ui/button | Contact form submit, reclamo submit |
| Input | yes | @/components/ui/input | Contact form fields, reclamo form fields |
| Badge | yes | @/components/ui/badge | Blog category tag, status de equipos destacados |
| Sheet | yes | @/components/ui/sheet | Navbar mobile (ya implementado) |

Componentes nuevos requeridos (instalar via `npx shadcn add`):

| Component | Purpose | Plan |
|-----------|---------|------|
| `textarea` | Campo "detalle" en contact form y reclamo form | 03-03 |
| `select` | Campo "tipoReclamo" (queja/reclamo) en reclamo form | 03-03 |
| `label` | Labels accesibles en todos los formularios | 03-03 |
| `separator` | Divisor visual en secciones de página | 03-01 / 03-02 |

Componentes nuevos custom (no shadcn):

| Component | File | Description |
|-----------|------|-------------|
| HeroCarousel | `src/components/home/hero-carousel.tsx` | 'use client', setInterval, dot navigation |
| ServicesSection | `src/components/home/services-section.tsx` | Server, estático v1, lucide icons |
| ValuesSection | `src/components/home/values-section.tsx` | Server, estático v1, lucide icons |
| FeaturedEquipment | `src/components/home/featured-equipment.tsx` | Reutiliza EquipmentCard existente |
| MetricsCounter | `src/components/home/metrics-counter.tsx` | 'use client', Intersection Observer |
| ReclamacionesCta | `src/components/home/reclamaciones-cta.tsx` | Link a /libro-de-reclamaciones |
| PostCard | `src/components/blog/post-card.tsx` | Blog list item con imagen y extracto |
| PortableTextRenderer | `src/components/blog/portable-text-renderer.tsx` | @portabletext/react wrapper |
| ContactForm | `src/components/forms/contact-form.tsx` | 'use client', fetch /api/contact |
| ReclamoForm | `src/components/forms/reclamo-form.tsx` | 'use client', fetch /api/reclamo |

**Fuente:** RESEARCH.md arquitectura + shadcn info

---

## Layout Patterns

### Hero Banner (HOME-01)
- Altura: `relative w-full h-[80vh] overflow-hidden`
- Imagen: `next/image` con `fill` + `object-cover` + `priority` en primera imagen
- Overlay: `absolute inset-0 bg-black/50`
- Contenido: `flex flex-col items-center justify-center text-center px-4`
- Dot indicators: `absolute bottom-4`, fila de `w-2 h-2 rounded-full`, activo = `bg-brand-red`, inactivo = `bg-white/50`
- Auto-avance: `setInterval` cada 5000ms; se detiene si solo hay 1 banner

### Homepage Sections (HOME-02 a HOME-06)
- Padding vertical estándar de sección: `py-16 px-4`
- Max-width contenedor: `max-w-6xl mx-auto`
- Secciones alternas de fondo: `bg-brand-bg` y `bg-brand-surface` en alternancia
- Grid de servicios/valores: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`

### Featured Equipment Grid (HOME-04)
- Reutiliza `EquipmentCard` existente
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- CTA link al final: "Ver catálogo completo →" con `text-brand-red hover:text-brand-yellow`

### Metrics Section (HOME-05)
- Fondo: `bg-brand-surface py-16 px-4`
- Grid: `grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto`
- Número: `text-5xl font-bold text-brand-yellow` (amarillo reservado para números)
- Label: `text-sm text-brand-text/70 mt-2`

### Blog List (BLOG-01)
- Grid de cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- PostCard: imagen 16:9 en top, contenido en bottom con `bg-brand-surface p-4 rounded-b-lg`

### Blog Detail (BLOG-02)
- Contenedor: `max-w-3xl mx-auto px-4 py-12`
- Prose: `prose prose-invert max-w-none text-brand-text leading-relaxed`

### Contact Page (CONT-03)
- Layout 2 columnas en desktop: `grid grid-cols-1 lg:grid-cols-2 gap-12`
- Columna izquierda: datos de contacto + mapa iframe
- Columna derecha: formulario de contacto
- Google Maps iframe: `width="100%" height="400"`, sin API key

### Reclamo Form (CONT-04)
- Layout columna única, centrado: `max-w-2xl mx-auto px-4 py-12`
- Aviso legal en top: recuadro con `bg-brand-surface border border-brand-text/20 rounded-lg p-4 mb-8`

### Nosotros (INST-01)
- Contenedor: `max-w-4xl mx-auto px-4 py-12`
- Contenido: prose style con `leading-relaxed`

---

## Copywriting Contract

### Calls to Action

| Element | Copy | Page |
|---------|------|------|
| Primary CTA homepage hero | "Solicitar Cotización" | Homepage hero banner |
| Secondary CTA homepage hero | "Ver Catálogo" | Homepage hero banner |
| Featured equipment link | "Ver catálogo completo →" | Homepage sección equipos |
| Contact form submit | "Enviar mensaje" | /contacto |
| Reclamo form submit | "Registrar reclamo" | /libro-de-reclamaciones |
| Reclamo link CTA homepage | "Libro de Reclamaciones" | Homepage HOME-06 |
| Blog article link | "Leer artículo →" | /blog list |

### Empty States

| Context | Heading | Body |
|---------|---------|------|
| Blog sin artículos | "Pronto publicaremos artículos" | "Estamos preparando contenido sobre calibración y metrología. Vuelve pronto." |
| Equipos destacados vacíos | "Explora nuestro catálogo" | "Ver todos los equipos →" (link a /equipos) |
| Contacto: sin datos de siteSettings | (sin heading) | Mostrar datos de fallback hardcodeados en lugar de bloque vacío |

### Form States

| State | Copy |
|-------|------|
| Contact form loading | "Enviando..." (spinner en botón, botón deshabilitado) |
| Contact form success | "Mensaje enviado. Nos pondremos en contacto a la brevedad." |
| Contact form error | "No se pudo enviar el mensaje. Inténtalo de nuevo o escríbenos por WhatsApp." |
| Reclamo loading | "Registrando reclamo..." (botón deshabilitado) |
| Reclamo success | "Reclamo registrado. Recibirás una respuesta en un plazo máximo de 30 días hábiles según la Ley 29571." |
| Reclamo error | "No se pudo registrar el reclamo. Inténtalo de nuevo." |
| Campo requerido vacío (HTML5) | Validación nativa del navegador — no custom copy |

### Validation and Errors

| Field | Error copy |
|-------|-----------|
| Email inválido | Validación nativa (`type="email"`) |
| Campo requerido vacío | Validación nativa (`required`) |
| API error 500 | "Error del servidor. Inténtalo más tarde." |

### Destructive Actions

No hay acciones destructivas en Phase 3 (ningún delete, ningún cancel con pérdida de datos). Los formularios tienen un botón de reset implícito si el usuario navega fuera. No se requiere confirmación modal para ninguna acción en esta fase.

### Microcopy Institucional (estático para v1)

| Section | Copy |
|---------|------|
| Services heading | "Nuestros Servicios" |
| Services subheading | "Calibración, verificación y reparación de equipos de medición" |
| Values heading | "¿Por qué elegirnos?" |
| Nosotros heading | "Sobre Testing Calibrations S.A.C." |
| Contact page heading | "Contáctanos" |
| Reclamo page heading | "Libro de Reclamaciones" |
| Reclamo legal disclaimer | "De conformidad con el Código de Protección y Defensa del Consumidor (Ley N° 29571), ponemos a disposición el presente Libro de Reclamaciones." |

**Fuente:** REQUIREMENTS.md HOME-01 a HOME-06, CONT-01 a CONT-05, BLOG-01 a BLOG-03, INST-01 a INST-02; patrones observados en RESEARCH.md

---

## Interaction Contracts

### Hero Carousel
- Auto-advance: 5 segundos, pausa en hover (`onMouseEnter` / `onMouseLeave`)
- Indicadores: click en dot salta al slide correspondiente
- Transición: `transition-opacity duration-700` en la imagen
- Keyboard: dots son `<button>` con `aria-label="Banner N"`
- Sin controles prev/next en v1 (solo dots)

### Contact Form
- Validación: HTML5 nativa (`required`, `type="email"`, `minLength`)
- Submit: botón deshabilitado durante `status === 'loading'`
- Reset: formulario NO se resetea en error (usuario conserva lo escrito)
- Reset en success: sí, reemplazar formulario con mensaje de éxito (no limpiar campos)
- Focus management: primer campo recibe `autoFocus` no aplicado — usuario navega naturalmente

### Reclamo Form
- Todos los campos marcados como `required`
- `tipoReclamo`: shadcn Select con opciones "Reclamo" y "Queja"
- Aviso legal: visible antes del formulario (no modal, no checkbox de aceptación — no requerido por Ley 29571)
- Submit: mismo patrón que contact form (botón disabled en loading)

### Animated Counters (MetricsSection)
- Trigger: IntersectionObserver con `threshold: 0.5`
- Una sola vez: `animated.current` ref previene re-animación en scroll repetido
- Duración: 2000ms desde 0 hasta el valor target
- Easing: lineal (`progress = (now - start) / duration`)

### Blog Navigation
- PostCard es completamente clickeable (enlace `<a>` sobre toda la card via `stretched-link` o link en heading)
- Fecha formateada siempre con `toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })`

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official (ui.shadcn.com) | badge, button, input, sheet (instalados) + textarea, select, label, separator (a instalar) | not required — official registry |

No hay registros de terceros declarados ni en uso. `"registries": {}` confirmado en components.json.

**Fuente:** components.json + `npx shadcn info`

---

## Accessibility Baseline

- Contraste: brand-text (oklch 0.96) sobre brand-bg (oklch 0.12) = ratio >12:1. Cumple WCAG AAA.
- Contraste brand-red sobre brand-bg: verificar con herramienta antes de usar texto pequeño sobre fondo rojo.
- Todos los `<input>` deben tener `<label>` asociado (via shadcn Label component).
- Imágenes decorativas: `alt=""`. Imágenes de contenido: `alt` descriptivo.
- Hero banner: h1 visible siempre (no solo en hover). Banner sin texto no está permitido.
- Google Maps iframe: debe tener `title="Ubicación Testing Calibrations S.A.C."`

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
