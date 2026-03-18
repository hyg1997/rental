# Phase 2: Equipment Catalog - Research

**Researched:** 2026-03-17
**Domain:** Next.js 15 App Router, Sanity GROQ queries, @sanity/image-url, client-side filtering, generateStaticParams, WhatsApp deep links
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| EQUIP-01 | Usuario puede ver listado de equipos filtrable por tipo (calibración/venta) y categoría | GROQ query fetches all equipos; React client component with useState filters by `tipo` field without page reload |
| EQUIP-02 | Usuario puede buscar equipos por nombre o marca | Client-side search with debounced useState on `nombre` and `marca` fields already in the equipo schema |
| EQUIP-03 | Usuario puede ver ficha detalle de equipo con especificaciones, imágenes y estado | `generateStaticParams` + `@portabletext/react` for `especificaciones` Portable Text field; `@sanity/image-url` for image gallery |
| EQUIP-04 | Usuario puede solicitar cotización desde la ficha de equipo (abre formulario o WhatsApp con datos del equipo) | WhatsApp deep link `wa.me/{number}?text=` with equipment name URL-encoded; link reads whatsappNumber from siteSettings |
</phase_requirements>

---

## Summary

Phase 2 builds on Phase 1's foundation to deliver the site's core product showcase. The equipo schema is already defined in Sanity (nombre, slug, tipo, categoria, marca, modelo, descripcion, especificaciones as Portable Text, imagenes as image array, estado, destacado). This phase creates two routes: `/equipos` (list with filter+search) and `/equipos/[slug]` (detail with specs, image gallery, and quote CTA).

The key architectural decision for the list page is that filtering and search are entirely client-side — the server fetches all equipos once at request time and the React component handles filtering in memory. This avoids searchParams-induced SSR deoptimization. The detail pages are statically generated via `generateStaticParams` at build time using all equipment slugs from Sanity. Two tasks are needed: one per route.

The quote CTA is a WhatsApp deep link with the equipment name pre-filled in the message, built from `siteSettings.whatsappNumber` (already available via the existing layout pattern). No contact form is needed in this phase — that pattern is deferred to Phase 3 (CONT-01).

**Primary recommendation:** Fetch all equipos in a server component, pass the full array to a `'use client'` filter+search component. Generate detail pages statically with `generateStaticParams`. WhatsApp CTA uses `encodeURIComponent` on the equipment name.

---

## Standard Stack

### Core (all already installed — no new packages needed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @sanity/client | ^7.17.0 | GROQ queries to fetch equipment data | Already in project; Pattern 2 from Phase 1 research |
| @sanity/image-url | ^2.0.3 | Generate Sanity CDN URLs for equipment images | Already installed; official Sanity image URL builder |
| @portabletext/react | ^6.0.3 | Render `especificaciones` Portable Text field | Already installed; only correct way to render Sanity block content |
| groq | ^5.17.1 | defineQuery for type-safe GROQ queries | Already in project; Pattern 3 from Phase 1 research |
| next | 16.1.7 | generateStaticParams for detail pages | App Router built-in |
| lucide-react | ^0.577.0 | Search and filter icons | Already installed |

### No new packages required
Phase 2 uses only libraries already installed in Phase 1. The only required configuration change is adding `cdn.sanity.io` to `next.config.ts` remotePatterns.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Client-side filter with useState | URL searchParams + server re-fetch | searchParams breaks static generation; client-side is simpler and sufficient for expected catalog size (<100 items) |
| WhatsApp deep link for quote CTA | Contact form modal | Form requires email service (deferred to Phase 3 CONT-01); WhatsApp CTA is immediate, no server infrastructure needed |
| generateStaticParams (SSG) | Dynamic server rendering | SSG is faster, cacheable; Sanity data changes infrequently; with VPS can use ISR if needed |
| @portabletext/react | Custom HTML renderer | Portable Text has edge cases (nested marks, custom block types); @portabletext/react handles all of them |

---

## Architecture Patterns

### Recommended Project Structure Addition
```
src/
├── app/
│   └── (site)/
│       ├── equipos/
│       │   ├── page.tsx             # List page — server component, passes data to client filter
│       │   └── [slug]/
│       │       └── page.tsx         # Detail page — generateStaticParams + server render
├── components/
│   └── equipos/
│       ├── equipment-grid.tsx       # 'use client' — filter, search, and grid rendering
│       └── equipment-card.tsx       # Presentational card (server-safe, used inside grid)
├── sanity/
│   └── queries/
│       ├── site-settings.ts         # Already exists
│       └── equipos.ts               # New — GROQ queries for list and detail
└── lib/
    └── image-url.ts                 # urlFor helper wrapping @sanity/image-url
```

### Pattern 1: Server Fetch + Client Filter Architecture
**What:** The `/equipos` page is a server component that fetches all equipos at request time. It passes the full array to a `'use client'` child component that handles filtering and search entirely in memory.
**When to use:** This is the correct pattern when you need filter/search interactivity without URL searchParams. Avoids the searchParams SSR deoptimization trap.

```typescript
// src/app/(site)/equipos/page.tsx — SERVER COMPONENT
import { client } from '@/sanity/client'
import { EQUIPOS_LIST_QUERY } from '@/sanity/queries/equipos'
import { EquipmentGrid } from '@/components/equipos/equipment-grid'

export default async function EquiposPage() {
  const equipos = await client.fetch(EQUIPOS_LIST_QUERY)
  return (
    <section className="px-4 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-text mb-8">Catálogo de Equipos</h1>
      <EquipmentGrid equipos={equipos} />
    </section>
  )
}
```

```typescript
// src/components/equipos/equipment-grid.tsx — CLIENT COMPONENT
'use client'
import { useState, useMemo } from 'react'

interface EquipmentGridProps {
  equipos: EquipoListItem[]
}

export function EquipmentGrid({ equipos }: EquipmentGridProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'calibracion' | 'venta'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    return equipos.filter(e => {
      const matchesType = activeFilter === 'all' || e.tipo === activeFilter
      const q = searchQuery.toLowerCase()
      const matchesSearch = !q ||
        e.nombre?.toLowerCase().includes(q) ||
        e.marca?.toLowerCase().includes(q)
      return matchesType && matchesSearch
    })
  }, [equipos, activeFilter, searchQuery])

  return (
    <>
      {/* Filter buttons */}
      {/* Search input */}
      {/* Equipment grid */}
    </>
  )
}
```

### Pattern 2: generateStaticParams for Detail Pages
**What:** Export `generateStaticParams` from the detail page to pre-generate all slug routes at build time. `params` is a Promise in Next.js 15 — must be awaited.
**When to use:** Always for `/equipos/[slug]` to get SSG performance.

```typescript
// src/app/(site)/equipos/[slug]/page.tsx
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
import { client } from '@/sanity/client'
import { EQUIPOS_SLUGS_QUERY, EQUIPO_BY_SLUG_QUERY } from '@/sanity/queries/equipos'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const slugs = await client.fetch(EQUIPOS_SLUGS_QUERY)
  return slugs.map((item: { slug: string }) => ({ slug: item.slug }))
}

export default async function EquipoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params  // CRITICAL: params is a Promise in Next.js 15
  const equipo = await client.fetch(EQUIPO_BY_SLUG_QUERY, { slug })

  if (!equipo) notFound()

  return (
    // ... detail layout
  )
}
```

### Pattern 3: @sanity/image-url Builder
**What:** Create a reusable `urlFor` helper that wraps `@sanity/image-url`. Must pass the full image field (not just asset) to respect hotspot/crop. Configure `next.config.ts` with `cdn.sanity.io` remotePattern.
**When to use:** Every time a Sanity image is rendered with `next/image`.

```typescript
// src/lib/image-url.ts
// Source: https://github.com/sanity-io/image-url
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from '@/sanity/client'

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
```

```typescript
// next.config.ts — add remotePatterns for cdn.sanity.io
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig
```

```tsx
// Usage with next/image
import Image from 'next/image'
import { urlFor } from '@/lib/image-url'

// Single image
<Image
  src={urlFor(equipo.imagenes[0]).width(800).height(600).quality(80).auto('format').url()}
  alt={equipo.nombre}
  width={800}
  height={600}
  className="object-cover w-full"
/>
```

### Pattern 4: GROQ Queries for Equipment
**What:** Three queries are needed — one for the list page (lightweight projection), one for slugs only (generateStaticParams), one for full detail.
**When to use:** All data fetching, using `defineQuery` from `groq` package (not `next-sanity`).

```typescript
// src/sanity/queries/equipos.ts
import { defineQuery } from 'groq'

// List page — lightweight projection
export const EQUIPOS_LIST_QUERY = defineQuery(`
  *[_type == "equipo"] | order(_createdAt desc) {
    _id,
    nombre,
    "slug": slug.current,
    tipo,
    categoria,
    marca,
    modelo,
    estado,
    "imagenPrincipal": imagenes[0]
  }
`)

// generateStaticParams — slugs only
export const EQUIPOS_SLUGS_QUERY = defineQuery(`
  *[_type == "equipo" && defined(slug.current)] {
    "slug": slug.current
  }
`)

// Detail page — full data
export const EQUIPO_BY_SLUG_QUERY = defineQuery(`
  *[_type == "equipo" && slug.current == $slug][0] {
    _id,
    nombre,
    "slug": slug.current,
    tipo,
    categoria,
    marca,
    modelo,
    descripcion,
    especificaciones,
    imagenes,
    estado,
    destacado
  }
`)
```

### Pattern 5: WhatsApp Quote CTA
**What:** A link that opens WhatsApp with a pre-filled message containing the equipment name. The number comes from `siteSettings.whatsappNumber` (already in the layout) — pass it as a prop to the detail page CTA component.
**When to use:** The primary quote action on each equipment detail page.

```typescript
// src/app/(site)/equipos/[slug]/page.tsx — wire in whatsappNumber
// Fetch siteSettings for whatsappNumber alongside the equipo data:
const [equipo, settings] = await Promise.all([
  client.fetch(EQUIPO_BY_SLUG_QUERY, { slug }),
  client.fetch(SITE_SETTINGS_QUERY),
])

// CTA component:
function QuoteCTA({ equipoName, whatsappNumber }: { equipoName: string, whatsappNumber: string }) {
  const message = encodeURIComponent(
    `Hola, me interesa solicitar una cotización para el equipo: ${equipoName}`
  )
  const href = `https://wa.me/${whatsappNumber}?text=${message}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
    >
      Solicitar Cotización por WhatsApp
    </a>
  )
}
```

### Pattern 6: @portabletext/react for Specifications
**What:** The `especificaciones` field is `array of block` (Portable Text). Use `PortableText` from `@portabletext/react` to render it.
**When to use:** Detail page specifications section.

```tsx
// Source: @portabletext/react — already installed
import { PortableText } from '@portabletext/react'

// In the detail page:
{equipo.especificaciones && (
  <div className="prose prose-invert max-w-none text-brand-text">
    <PortableText value={equipo.especificaciones} />
  </div>
)}
```

### Anti-Patterns to Avoid
- **Using `useSearchParams` for filter state:** Opts the entire page into client-side rendering and breaks SSG. Use `useState` in a `'use client'` child component instead.
- **Passing only `image.asset` to `urlFor`:** Must pass the whole image object (`equipo.imagenes[0]`) — the builder needs crop and hotspot data.
- **Not awaiting `params` in Next.js 15:** `params` is a `Promise<{ slug: string }>` — accessing `params.slug` directly (without await) returns undefined in Next.js 15+.
- **Hardcoding whatsappNumber in the CTA:** Must come from siteSettings — consistent with the project-wide rule established in Phase 1.
- **Rendering Portable Text with dangerouslySetInnerHTML:** Never. Use `@portabletext/react`.
- **Fetching all equipment data on the detail page for generateStaticParams:** Use the lightweight slugs-only query `EQUIPOS_SLUGS_QUERY` — fetching full documents in `generateStaticParams` is wasteful.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sanity image CDN URL generation | Custom URL string concatenation | @sanity/image-url builder | Handles hotspot cropping, format conversion, CDN params — not trivial to replicate |
| Portable Text rendering | Custom block renderer | @portabletext/react | Block content has nested marks, lists, custom types — weeks of edge cases |
| Debounced search | Custom setTimeout in onChange | Simple `useMemo` with synchronous filter | For in-memory filtering of <100 items, debounce is overkill — `useMemo` is instantaneous |
| Type-safe GROQ return types | Manual TypeScript interfaces | Sanity TypeGen (`npm run typegen`) | Types auto-generated from schema + query projection |

**Key insight:** The Sanity + Next.js combination has purpose-built packages for every hard problem in this phase. The only custom code needed is the filter/search UI logic itself.

---

## Common Pitfalls

### Pitfall 1: params is a Promise in Next.js 15
**What goes wrong:** Detail page receives `{ params }` and accesses `params.slug` directly. Returns undefined. Page shows 404 or crashes.
**Why it happens:** Next.js 15 changed `params` from a plain object to a Promise for better streaming support.
**How to avoid:** Always `const { slug } = await params` — never access properties directly.
**Warning signs:** `params.slug` returns undefined; `notFound()` fires for slugs that exist.

### Pitfall 2: useSearchParams Breaks Static Generation
**What goes wrong:** Adding a search input that uses `useSearchParams()` causes the `/equipos` page to opt out of SSG during `npm run build`. Build may warn about "deopted into client-side rendering."
**Why it happens:** `useSearchParams` reads from the URL at render time — Next.js cannot statically generate pages that depend on dynamic URL state.
**How to avoid:** Never use `useSearchParams` for filter/search state. Use `useState` in a `'use client'` component that receives all data as props from the server parent.
**Warning signs:** Build output shows "/(site)/equipos" is no longer static.

### Pitfall 3: cdn.sanity.io Not in remotePatterns
**What goes wrong:** `next/image` refuses to load Sanity images in production. Error: "Invalid src prop — hostname 'cdn.sanity.io' is not configured under images in next.config."
**Why it happens:** Next.js blocks external image hostnames by default for security.
**How to avoid:** Add `cdn.sanity.io` to `remotePatterns` in `next.config.ts` before any Sanity images are rendered.
**Warning signs:** Images render in dev (if using `<img>`) but break with `<Image>` component, or error appears at build time.

### Pitfall 4: Image Array Empty in Placeholder Content
**What goes wrong:** `imagenes[0]` is undefined for placeholder equipment. Passing undefined to `urlFor()` throws or returns a broken URL. `next/image` with an empty src crashes.
**Why it happens:** Phase 2 uses placeholder content — no real images yet per the State.md blocker ("Image assets not ready").
**How to avoid:** Guard all image rendering: `{equipo.imagenes?.length > 0 && <Image src={urlFor(equipo.imagenes[0])...} />}`. Show a placeholder div with brand colors when no image exists.
**Warning signs:** Runtime error "Cannot read properties of undefined" on image URL building.

### Pitfall 5: GROQ slug Projection
**What goes wrong:** Query returns `slug` as `{ current: "..." }` object instead of a string. Template renders `[object Object]` or slug comparison fails.
**Why it happens:** Sanity slug fields are objects with a `current` property — must project to string.
**How to avoid:** Always project: `"slug": slug.current` in GROQ. Never use `slug` directly in a projection that expects a string.
**Warning signs:** `equipo.slug` logs as `{ current: "..." }` in the browser.

### Pitfall 6: whatsappNumber Not Available on Detail Pages
**What goes wrong:** The detail page CTA has no access to `siteSettings.whatsappNumber` because it's only fetched in `(site)/layout.tsx`.
**Why it happens:** Layout data is not automatically passed to deep page components.
**How to avoid:** Fetch `SITE_SETTINGS_QUERY` alongside the equipo query using `Promise.all` in the detail page server component. The extra fetch is cheap — Next.js memoizes identical requests within a render.
**Warning signs:** CTA href is `https://wa.me/?text=...` (missing the number).

---

## Code Examples

### Complete GROQ Queries File
```typescript
// src/sanity/queries/equipos.ts
// Source: project equipo schema in src/sanity/schemas/equipo.ts
import { defineQuery } from 'groq'

export const EQUIPOS_LIST_QUERY = defineQuery(`
  *[_type == "equipo"] | order(_createdAt desc) {
    _id,
    nombre,
    "slug": slug.current,
    tipo,
    categoria,
    marca,
    modelo,
    estado,
    "imagenPrincipal": imagenes[0]
  }
`)

export const EQUIPOS_SLUGS_QUERY = defineQuery(`
  *[_type == "equipo" && defined(slug.current)] {
    "slug": slug.current
  }
`)

export const EQUIPO_BY_SLUG_QUERY = defineQuery(`
  *[_type == "equipo" && slug.current == $slug][0] {
    _id,
    nombre,
    "slug": slug.current,
    tipo,
    categoria,
    marca,
    modelo,
    descripcion,
    especificaciones,
    imagenes,
    estado,
    destacado
  }
`)
```

### urlFor Helper
```typescript
// src/lib/image-url.ts
// Source: https://github.com/sanity-io/image-url
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from '@/sanity/client'

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
```

### Placeholder Equipment Content for Seeding
The equipo schema fields for placeholder data (to use in Sanity Studio during development):
- nombre: "Multímetro Fluke 87V"
- tipo: "calibracion"
- categoria: "Instrumentos eléctricos"
- marca: "Fluke"
- modelo: "87V"
- estado: "disponible"
- destacado: true
- (imagenes: empty until client provides photos)

### WhatsApp URL Construction
```typescript
// Source: https://faq.whatsapp.com/5197143521421252 (official WhatsApp click-to-chat)
// Number format: international, no +, no spaces (e.g., "51987654321")
const message = encodeURIComponent(`Hola, me interesa cotizar el equipo: ${equipoNombre}`)
const href = `https://wa.me/${whatsappNumber}?text=${message}`
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `params.slug` synchronous access | `const { slug } = await params` | Next.js 15 | Breaking change — old code silently returns undefined |
| `getStaticPaths` (Pages Router) | `generateStaticParams` (App Router) | Next.js 13 | Different return shape — no `fallback` key needed |
| `domains` in next.config images | `remotePatterns` in next.config images | Next.js 13 | `domains` is deprecated; use `remotePatterns` |
| URL searchParams for filter state | `useState` in client component | N/A (always better) | Avoids SSR deoptimization in Next.js 15 |

**Deprecated/outdated:**
- `images.domains` in next.config: use `images.remotePatterns` — `domains` is deprecated
- `getStaticPaths` with `fallback`: replaced by `generateStaticParams` + `dynamicParams` config
- Accessing `params` synchronously in Next.js 15 page components: must `await params`

---

## Open Questions

1. **Image assets not ready**
   - What we know: State.md documents this as a known blocker: "Client has no digital photos yet; Phase 2 must use placeholder images and not block on this."
   - What's unclear: Whether placeholder equipment documents will be created in Sanity before or during Phase 2 execution.
   - Recommendation: Create 3-5 placeholder equipo documents in Sanity Studio with text fields filled but no images. Guard all image rendering with null checks. Detail page renders a gray placeholder rectangle when imagenes array is empty.

2. **Sanity project ID not configured**
   - What we know: `.env.local` does not have a real `NEXT_PUBLIC_SANITY_PROJECT_ID` — client uses 'placeholder' which causes all fetches to fail (gracefully via `.catch(() => null)`).
   - What's unclear: When the client will provide the real project ID.
   - Recommendation: Plan tasks must include a note that the dev server will render fallback/empty states until the real project ID is configured. Tests must account for empty Sanity responses.

3. **Filter by category vs. filter by tipo**
   - What we know: EQUIP-01 says "filtrable por tipo (calibración/venta) y categoría." The schema has both `tipo` (calibracion/venta enum) and `categoria` (free-text string).
   - What's unclear: How many distinct categories exist — the client hasn't provided content yet.
   - Recommendation: Implement tipo filter as tab buttons (binary choice: Todos / Calibración / Venta). Defer category filtering to when real content is available; the filter architecture is extensible.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (E2E smoke) — already installed and configured |
| Config file | `playwright.config.ts` — exists with chromium + mobile-360 projects |
| Quick run command | `npx playwright test tests/smoke.spec.ts --project=chromium` |
| Full suite command | `npx playwright test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EQUIP-01 | /equipos renders equipment list; tipo filter buttons change visible items | smoke | `npx playwright test tests/equipos.spec.ts -g "equipment list" --project=chromium` | Wave 0 |
| EQUIP-01 | Filter by "Calibración" shows only calibracion tipo items | smoke | `npx playwright test tests/equipos.spec.ts -g "filter calibracion" --project=chromium` | Wave 0 |
| EQUIP-02 | Search input filters list in real time by nombre/marca | smoke | `npx playwright test tests/equipos.spec.ts -g "search filter" --project=chromium` | Wave 0 |
| EQUIP-03 | /equipos/[slug] renders detail page with nombre and estado visible | smoke | `npx playwright test tests/equipos.spec.ts -g "detail page" --project=chromium` | Wave 0 |
| EQUIP-04 | Detail page has WhatsApp CTA link with wa.me href | smoke | `npx playwright test tests/equipos.spec.ts -g "whatsapp cta" --project=chromium` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` (type check, < 10 seconds)
- **Per wave merge:** `npx playwright test tests/equipos.spec.ts --project=chromium`
- **Phase gate:** `npx playwright test` (full suite including Phase 1 smoke) before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/equipos.spec.ts` — covers EQUIP-01 through EQUIP-04
- [ ] Placeholder equipo documents in Sanity (or a mock/fixture) so smoke tests have data to render

Note: `playwright.config.ts` already exists from Phase 1. No framework install needed.

---

## Sources

### Primary (HIGH confidence)
- [Next.js generateStaticParams Official Docs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — exact function signature, params Promise in Next.js 15, dynamicParams behavior. Docs dated 2026-03-16.
- [@sanity/image-url GitHub](https://github.com/sanity-io/image-url) — builder chain methods, SanityImageSource type, createImageUrlBuilder signature
- [Sanity Presenting Images Docs](https://www.sanity.io/docs/apis-and-sdks/presenting-images) — urlFor pattern, hotspot requirements
- [Next.js Missing Suspense with useSearchParams](https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout) — confirmed: useSearchParams without Suspense breaks SSG

### Secondary (MEDIUM confidence)
- [Next.js images remotePatterns config](https://nextjs.org/docs/app/api-reference/config/next-config-js/images) — cdn.sanity.io remotePatterns configuration
- [WhatsApp click-to-chat link format](https://quadlayers.com/how-to-create-a-whatsapp-link-wa-me-with-a-pre-filled-message/) — wa.me/{number}?text={encoded} format verified against multiple consistent sources
- [Build with Matija — searchParams static generation fix](https://www.buildwithmatija.com/blog/nextjs-searchparams-static-generation-fix) — architectural fix pattern (client component with useState)

### Tertiary (LOW confidence)
- None — all critical claims verified with official Next.js docs or official Sanity packages

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed and verified in Phase 1; no new dependencies
- GROQ queries: HIGH — based on the exact equipo schema defined and committed in Phase 1 (src/sanity/schemas/equipo.ts)
- generateStaticParams: HIGH — official Next.js docs from 2026-03-16 confirm exact pattern and params Promise behavior
- Client-side filter/search: HIGH — standard React useState + useMemo pattern; no external libraries needed
- @sanity/image-url: HIGH — official package, already installed, API confirmed from GitHub README
- WhatsApp deep link: MEDIUM — multiple consistent community sources; format is stable and well-documented
- Pitfalls: HIGH — params Promise change is a documented Next.js 15 breaking change; other pitfalls verified with official docs

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable stack, 30 days)
