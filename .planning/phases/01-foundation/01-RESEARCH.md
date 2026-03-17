# Phase 1: Foundation - Research

**Researched:** 2026-03-17
**Domain:** Next.js 15 App Router, Sanity CMS v3, Tailwind CSS v4, shadcn/ui, Hostinger deployment
**Confidence:** HIGH (core stack), MEDIUM (Hostinger-specific deployment paths)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CMS-01 | Todo el contenido es administrable desde Sanity Studio (textos, imágenes, equipos, artículos, banners) | Sanity v3 with defineType schemas + TypeGen covers full content model |
| CMS-02 | Sanity Studio accesible en ruta /studio del sitio | Embedded Studio via `app/studio/[[...tool]]/page.tsx` with `next-sanity` |
| CMS-03 | Schemas de Sanity cubren: equipos, artículos de blog, banners hero, páginas, configuración del sitio, reclamos | Six document types defined with defineType/defineField, TypeGen generates types |
| UX-01 | Sitio es responsive y mobile-first | Next.js 15 + Tailwind v4 mobile-first utility classes, 360px breakpoint validation |
| UX-02 | Diseño moderno inspirado en rdrental.com.pe (colores oscuros, acentos rojos/amarillos, tipografía bold) | Tailwind v4 CSS-first OKLCH custom palette + shadcn/ui dark base |
| UX-03 | Navegación principal con menú hamburguesa en mobile | shadcn Sheet component for mobile nav drawer |
</phase_requirements>

---

## Summary

This phase establishes the full project foundation: a Next.js 15 App Router project with TypeScript, Tailwind CSS v4, shadcn/ui, embedded Sanity Studio at /studio, all six content schemas, and a base layout (Navbar, Footer, WhatsApp button) that reads from Sanity siteSettings. The result is a deployable skeleton on Hostinger that every subsequent phase builds on top of.

The single highest-risk decision going into this phase is **which Hostinger plan the client has**: shared hosting requires `output: 'export'` (static), which fundamentally constrains architecture — no Server Actions, no API routes, no embedded Sanity Studio in the same build. VPS/Node.js hosting enables full Next.js capabilities. This must be confirmed before writing a single line of code.

Assuming VPS (recommended path), the stack is: Next.js 15 with `next start`, Sanity Studio embedded at `/studio`, `@sanity/client` for data fetching, Sanity TypeGen for type safety, Tailwind v4 CSS-first theming, shadcn/ui components, PM2 + Nginx on Hostinger VPS, and GitHub Actions for CI/CD.

**Primary recommendation:** Confirm Hostinger plan type before scaffolding. If VPS — use full Next.js with embedded Studio. If shared hosting — deploy Studio separately to `sanity.studio` and use static export with `output: 'export'`.

---

## Critical Pre-Phase Decision

### Hostinger Plan Type (BLOCKER)

This decision gates the entire architecture. It must be answered before any scaffolding.

| If Hostinger Plan | Architecture | Studio | Email | CI/CD |
|-------------------|-------------|--------|-------|-------|
| **Shared hosting** | `output: 'export'` (static) | Separate deploy to `sanity.studio` or Sanity Cloud | EmailJS (client-side) | GitHub Actions + FTP upload of `out/` |
| **VPS/KVM** | `next start` (full SSR/ISR) | Embedded at `/studio` | Resend/Nodemailer via API routes | GitHub Actions + SSH + PM2 reload |

The STATE.md already flags this as the #1 blocker. The research findings below cover BOTH paths, but the VPS path is the recommended default.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 15.x | React framework with App Router | Project constraint; SSR/ISR/SSG + SEO |
| react | 19.x | UI library | Peer dep of Next.js 15 |
| typescript | 5.x | Type safety | Project constraint |
| tailwindcss | 4.x | Utility CSS | Project constraint; CSS-first config |
| sanity | 3.x | CMS core + Studio | Project constraint; free tier, headless |
| next-sanity | 9.x | Sanity toolkit for Next.js | Official integration; embedded Studio |
| @sanity/client | 6.x | Fetch data from Sanity API | Used directly when avoiding next-sanity imports |
| groq | 3.x | GROQ query builder + defineQuery | Type-safe queries; required for TypeGen |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @shadcn/ui (CLI) | latest | Component library | Accessible, Tailwind v4 compatible |
| @portabletext/react | 3.x | Render Sanity Portable Text | Blog/page rich text rendering |
| @sanity/image-url | 1.x | Sanity image URL builder | All Sanity image transformations |
| next-themes | 0.4.x | Dark/light mode toggle | Dark mode via data-theme attribute |
| lucide-react | 0.x | Icon library | Bundled with shadcn/ui |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind v4 | Tailwind v3 | v3 is more widely documented; v4 is where shadcn/ui is moving — stick with v4 |
| shadcn/ui Sheet (mobile nav) | Custom hamburger | Sheet is accessible, Tailwind v4 compatible, no custom code needed |
| Embedded Studio (/studio) | Sanity Cloud (sanity.studio) | Embedded is better UX for client; requires VPS; Sanity Cloud is fallback for shared hosting |
| next start (VPS) | Static export (shared) | VPS enables API routes, Server Actions, ISR — required for email, reclamos form in later phases |

**Installation (VPS path):**
```bash
npx create-next-app@latest testing-calibrations --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd testing-calibrations
npx sanity@latest init --env
npm install next-sanity @sanity/client @sanity/image-url groq @portabletext/react
npx shadcn@latest init
```

**Installation (shared hosting path):**
```bash
# Same as above but add to next.config.ts:
# output: 'export'
# trailingSlash: true
# images: { unoptimized: true }
# Sanity Studio deployed separately: npx sanity deploy
```

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── (site)/              # Public site routes with shared layout
│   │   ├── layout.tsx       # Root layout — imports Navbar, Footer
│   │   └── page.tsx         # Homepage placeholder
│   ├── studio/              # Sanity Studio — EXCLUDED from site layout
│   │   └── [[...tool]]/
│   │       └── page.tsx     # Embedded Studio page
│   ├── globals.css          # Tailwind v4 @import + @theme custom palette
│   └── layout.tsx           # Root HTML shell (no Navbar/Footer here)
├── components/
│   ├── layout/
│   │   ├── navbar.tsx       # Desktop nav + mobile Sheet
│   │   └── footer.tsx       # Footer with siteSettings data
│   ├── ui/                  # shadcn/ui components (auto-generated)
│   └── whatsapp-button.tsx  # Floating WhatsApp CTA
├── sanity/
│   ├── client.ts            # createClient from @sanity/client
│   ├── queries/
│   │   └── site-settings.ts # defineQuery for siteSettings
│   ├── schemas/
│   │   ├── index.ts         # schemaTypes array
│   │   ├── equipo.ts        # Equipo document type
│   │   ├── post.ts          # Blog post document type
│   │   ├── banner.ts        # Hero banner document type
│   │   ├── pagina.ts        # Generic page document type
│   │   ├── site-settings.ts # Global site config (singleton)
│   │   └── reclamo.ts       # Libro de reclamaciones document type
│   └── sanity.config.ts     # defineConfig with all schemas
├── sanity.types.ts          # Auto-generated by TypeGen (do not edit)
└── lib/
    └── utils.ts             # cn() helper from shadcn
```

### Route Groups for Layout Separation (CRITICAL)
Use route groups to prevent the Studio from inheriting the site Navbar/Footer layout. Without this, the embedded Studio will render broken.

```typescript
// src/app/(site)/layout.tsx — applies to all public routes
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

// src/app/studio/[[...tool]]/page.tsx — no layout wrapper
// Studio gets its OWN full-height layout, not the site layout
```

### Pattern 1: Embedded Sanity Studio
**What:** Studio runs inside Next.js at `/studio` using a catch-all route.
**When to use:** VPS hosting path only (requires `next start`).

```typescript
// src/app/studio/[[...tool]]/page.tsx
// Source: https://www.sanity.io/docs/studio/embedding-sanity-studio
'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

CORS must be added for the studio domain in Sanity project settings with "Allow Credentials" enabled.

### Pattern 2: Sanity Client (data fetching)
**What:** Fetch content using `@sanity/client` directly, not the `next-sanity` main entry.
**When to use:** All data fetching in server components and API routes.

```typescript
// src/sanity/client.ts
// Source: https://github.com/sanity-io/next-sanity/issues/1899
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})
```

### Pattern 3: Type-Safe GROQ Queries with TypeGen
**What:** Define queries with `defineQuery` from `groq`, run TypeGen to generate types.
**When to use:** Every GROQ query in the codebase.

```typescript
// src/sanity/queries/site-settings.ts
// Source: https://www.sanity.io/docs/apis-and-sdks/sanity-typegen
import { defineQuery } from 'groq'

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    siteName,
    logo,
    whatsappNumber,
    email,
    address,
    navLinks[]{label, href},
    socialLinks[]{platform, url},
    footerText
  }
`)
```

Run TypeGen after schema or query changes:
```bash
npx sanity@latest schema extract && npx sanity@latest typegen generate
```

### Pattern 4: Tailwind v4 Custom Theme (CSS-first)
**What:** Define brand colors as OKLCH CSS variables in globals.css — no tailwind.config.js.
**When to use:** Entire project.

```css
/* src/app/globals.css */
/* Source: https://ui.shadcn.com/docs/tailwind-v4 */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

@theme inline {
  /* Brand palette — dark base, red + yellow accents */
  --color-brand-bg: oklch(0.12 0.01 260);        /* near-black */
  --color-brand-surface: oklch(0.18 0.01 260);   /* card/panel dark */
  --color-brand-red: oklch(0.55 0.22 25);        /* primary accent red */
  --color-brand-yellow: oklch(0.82 0.18 85);     /* secondary accent yellow */
  --color-brand-text: oklch(0.96 0.01 260);      /* near-white text */

  --font-heading: 'Inter', sans-serif;  /* bold headings */
  --font-body: 'Inter', sans-serif;
}
```

### Pattern 5: siteSettings Singleton Schema
**What:** A single document that stores all global site config — name, logo, contact, nav, footer.
**When to use:** Navbar and Footer components read from this. Never hardcode contact data in JSX.

```typescript
// src/sanity/schemas/site-settings.ts
import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del Sitio',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', title: 'Nombre del Sitio', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({ name: 'whatsappNumber', title: 'WhatsApp (con código país)', type: 'string' }),
    defineField({ name: 'email', title: 'Email de Contacto', type: 'string' }),
    defineField({ name: 'address', title: 'Dirección', type: 'string' }),
    defineField({ name: 'navLinks', title: 'Links de Navegación', type: 'array',
      of: [defineField({ name: 'navLink', type: 'object', fields: [
        defineField({ name: 'label', type: 'string' }),
        defineField({ name: 'href', type: 'string' }),
      ]})]
    }),
    defineField({ name: 'footerText', title: 'Texto Footer', type: 'string' }),
  ],
  __experimental_actions: ['update', 'publish'],  // singleton: no create/delete
})
```

### Pattern 6: Mobile Hamburger Nav (shadcn Sheet)
**What:** Use shadcn Sheet component as a slide-in menu drawer for mobile.
**When to use:** Viewport < md breakpoint (mobile-first).

```typescript
// src/components/layout/navbar.tsx (mobile portion)
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

// Inside Navbar:
<Sheet>
  <SheetTrigger asChild className="md:hidden">
    <button aria-label="Abrir menú"><Menu /></button>
  </SheetTrigger>
  <SheetContent side="right" className="bg-brand-surface w-64">
    {/* nav links */}
  </SheetContent>
</Sheet>
```

### Anti-Patterns to Avoid
- **Importing from `next-sanity` main entry for data:** Use `@sanity/client` + `groq` directly. Issue #1899 is closed but subpath imports are more explicit and stable.
- **Hardcoding contact data (WhatsApp, email, address) in JSX:** Must come from siteSettings Sanity document.
- **Putting Studio in the (site) route group:** Studio must be at `app/studio/[[...tool]]/page.tsx` outside any layout that includes Navbar/Footer.
- **Using `tailwind.config.js` for custom colors:** Tailwind v4 is CSS-first — define everything in `globals.css` with `@theme inline`.
- **Using `tailwindcss-animate`:** Replaced by `tw-animate-css` in the shadcn/ui Tailwind v4 stack.
- **Static export with embedded Studio:** These are mutually exclusive. If `output: 'export'`, Studio must be deployed separately via `npx sanity deploy`.
- **Not setting `trailingSlash: true` on shared hosting:** Causes 404s on direct URL access in Hostinger shared hosting.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CMS content editing UI | Custom admin panel | Sanity Studio | Field types, image upload, publish workflow, roles — months of work |
| GROQ query TypeScript types | Manual interfaces | Sanity TypeGen CLI | Types are derived from schema + query projections automatically |
| Portable text rendering | Custom HTML parser | @portabletext/react | Handles all Sanity block content edge cases |
| Image CDN transformations | Custom image sizing | @sanity/image-url | Generates Sanity CDN URLs with width/quality/format params |
| Accessible mobile nav drawer | Custom CSS slide-in | shadcn Sheet | Handles focus trap, aria attributes, keyboard close |
| Icon set | SVG files | lucide-react | Tree-shakeable, consistent stroke style |
| Dark mode toggle state | Custom context | next-themes | Handles SSR flash, localStorage, system preference |

**Key insight:** The Sanity + Next.js combination is well-supported by official tooling. Do not reinvent the schema editor, type generation, or image pipeline.

---

## Common Pitfalls

### Pitfall 1: Hostinger Shared Hosting — Static Export Limitations
**What goes wrong:** Developer embeds Sanity Studio at /studio and uses API routes for forms. Build succeeds locally but `next build` with `output: 'export'` fails with "Server Actions are not supported with static export."
**Why it happens:** Shared hosting does not run Node.js. Static export removes all server-side features.
**How to avoid:** Confirm hosting plan FIRST. If shared: no embedded Studio (use `npx sanity deploy`), no API routes, no Server Actions, no `next/image` optimization (set `images: { unoptimized: true }`).
**Warning signs:** Client says "Hostinger" without specifying plan type. Default Hostinger plans are shared.

### Pitfall 2: Studio Layout Conflict
**What goes wrong:** Sanity Studio renders with a broken layout — site Navbar/Footer overlaps the Studio chrome or the Studio height is clipped.
**Why it happens:** Studio route is inside a Next.js layout that adds Navbar/Footer HTML. Studio expects full-viewport control.
**How to avoid:** Use route groups — `(site)/` for public pages (has Navbar/Footer layout), `studio/` outside any group (no shared layout). Studio page must be `'use client'` with `dynamic = 'force-dynamic'`.
**Warning signs:** Studio loads but looks visually broken. Nav items appear over Studio toolbar.

### Pitfall 3: next-sanity Import in Static Export
**What goes wrong:** `next build` fails with "Server Actions are not supported" even though you don't intentionally use Server Actions.
**Why it happens:** Importing anything from the `next-sanity` main entrypoint transitively imports the visual editing server actions module.
**How to avoid:** Import `createClient` from `@sanity/client`, import `defineQuery` and `groq` from `groq`, import `PortableText` from `@portabletext/react`. Use `next-sanity/studio` for the embedded Studio page only.
**Warning signs:** Issue #1899 symptoms — error references `server-actions` in the build log.

### Pitfall 4: Tailwind v4 Configuration Confusion
**What goes wrong:** Developer creates `tailwind.config.js` and adds custom colors. Colors don't work. Existing guides conflict with each other.
**Why it happens:** Tailwind v4 is CSS-first — `tailwind.config.js` is deprecated for theme customization. All custom tokens go in `globals.css` via `@theme inline`.
**How to avoid:** Do NOT create `tailwind.config.js` for theme customization in a new v4 project. Define brand colors in `globals.css` using the `@theme inline` directive with OKLCH values.
**Warning signs:** Custom color classes like `bg-brand-red` don't resolve. IDE shows "unknown utility class."

### Pitfall 5: Sanity TypeGen Not in Dev Workflow
**What goes wrong:** Types in `sanity.types.ts` get stale as schemas evolve. TypeScript errors appear for valid queries.
**Why it happens:** TypeGen must be re-run after every schema or query change. It's not automatic by default.
**How to avoid:** Add a `typegen` script to `package.json`. Enable `typegen.enabled: true` in `sanity.cli.ts` for auto-generation during `sanity dev`.
**Warning signs:** `sanity.types.ts` shows fields that don't exist in the schema, or missing fields that do exist.

### Pitfall 6: siteSettings — Contact Data Hardcoded
**What goes wrong:** WhatsApp number, email, or address is hardcoded in Navbar/Footer JSX. Client can't update it from Sanity.
**Why it happens:** It feels simpler during development.
**How to avoid:** All contact data lives in the `siteSettings` Sanity document. Navbar and Footer receive siteSettings as props fetched in the layout server component. This is a project-wide rule from STATE.md.
**Warning signs:** Any string literal matching a phone number, email, or address in component files.

### Pitfall 7: 360px Mobile Viewport
**What goes wrong:** Mobile nav looks fine at 375px but breaks at 360px (very common Android resolution in Peru).
**Why it happens:** Tailwind's `sm:` breakpoint is 640px — there's no built-in 360px breakpoint. Elements with fixed widths or padding can overflow.
**How to avoid:** Test at 360px explicitly. Use `w-full` and `max-w-*` patterns. Avoid fixed-pixel widths in nav elements. WhatsApp button must not cover nav or CTA content.
**Warning signs:** Horizontal scroll appears at 360px viewport.

---

## Code Examples

### Equipo Schema (representative document type)
```typescript
// src/sanity/schemas/equipo.ts
import { defineField, defineType } from 'sanity'

export const equipo = defineType({
  name: 'equipo',
  title: 'Equipo',
  type: 'document',
  fields: [
    defineField({ name: 'nombre', title: 'Nombre', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'nombre' }, validation: r => r.required() }),
    defineField({ name: 'tipo', title: 'Tipo', type: 'string',
      options: { list: [{ title: 'Calibración', value: 'calibracion' }, { title: 'Venta', value: 'venta' }] },
      validation: r => r.required()
    }),
    defineField({ name: 'categoria', title: 'Categoría', type: 'string' }),
    defineField({ name: 'marca', title: 'Marca', type: 'string' }),
    defineField({ name: 'modelo', title: 'Modelo', type: 'string' }),
    defineField({ name: 'descripcion', title: 'Descripción', type: 'text' }),
    defineField({ name: 'especificaciones', title: 'Especificaciones', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'imagenes', title: 'Imágenes', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'estado', title: 'Estado', type: 'string',
      options: { list: [{ title: 'Disponible', value: 'disponible' }, { title: 'No disponible', value: 'no_disponible' }] }
    }),
    defineField({ name: 'destacado', title: 'Destacado en Homepage', type: 'boolean', initialValue: false }),
  ],
})
```

### Reclamo Schema (Libro de Reclamaciones)
```typescript
// src/sanity/schemas/reclamo.ts
import { defineField, defineType } from 'sanity'

export const reclamo = defineType({
  name: 'reclamo',
  title: 'Reclamo',
  type: 'document',
  fields: [
    defineField({ name: 'fechaReclamo', title: 'Fecha', type: 'datetime' }),
    defineField({ name: 'nombreConsumidor', title: 'Nombre del Consumidor', type: 'string', validation: r => r.required() }),
    defineField({ name: 'dniRuc', title: 'DNI / RUC', type: 'string' }),
    defineField({ name: 'emailConsumidor', title: 'Email', type: 'string' }),
    defineField({ name: 'telefonoConsumidor', title: 'Teléfono', type: 'string' }),
    defineField({ name: 'tipoReclamo', title: 'Tipo', type: 'string',
      options: { list: [{ title: 'Queja', value: 'queja' }, { title: 'Reclamo', value: 'reclamo' }] }
    }),
    defineField({ name: 'bienServicio', title: 'Bien / Servicio reclamado', type: 'text' }),
    defineField({ name: 'detalle', title: 'Detalle del reclamo', type: 'text', validation: r => r.required() }),
    defineField({ name: 'pedido', title: 'Pedido del consumidor', type: 'text' }),
    defineField({ name: 'estado', title: 'Estado', type: 'string',
      options: { list: [{ title: 'Pendiente', value: 'pendiente' }, { title: 'Resuelto', value: 'resuelto' }] },
      initialValue: 'pendiente'
    }),
  ],
})
```

### Schemas Index
```typescript
// src/sanity/schemas/index.ts
import { equipo } from './equipo'
import { post } from './post'
import { banner } from './banner'
import { pagina } from './pagina'
import { siteSettings } from './site-settings'
import { reclamo } from './reclamo'

export const schemaTypes = [equipo, post, banner, pagina, siteSettings, reclamo]
```

### Sanity Config
```typescript
// src/sanity/sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'testing-calibrations',
  title: 'Testing Calibrations S.A.C.',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
```

### GitHub Actions CI/CD (VPS path)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Hostinger VPS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci && npm run build
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/testing-calibrations
            git pull origin main
            npm ci --production
            npm run build
            pm2 reload testing-calibrations
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js for custom colors | CSS-first `@theme inline` in globals.css | Tailwind v4 (Jan 2025) | No JS config file for theme; all in CSS |
| tailwindcss-animate | tw-animate-css | shadcn/ui Tailwind v4 support (early 2025) | Different import in globals.css |
| HSL color variables | OKLCH color variables | shadcn/ui v4 migration | More perceptually uniform; better dark mode |
| ForwardRef in shadcn/ui | Direct props | React 19 + shadcn v4 update | Simpler component signatures |
| import { groq } from 'next-sanity' | import groq from 'groq' | Issue #1899 fix (2024-2025) | Avoids static export breakage |
| next export command | output: 'export' in next.config | Next.js 14+ | `next export` is deprecated in App Router |

**Deprecated/outdated:**
- `tailwind.config.js` for custom theme: superseded by `@theme` directive in globals.css
- `tailwindcss-animate`: replaced by `tw-animate-css`
- `next export` CLI command: use `output: 'export'` in next.config.ts
- Importing `createClient`, `groq`, `PortableText` from `next-sanity` main entry: use subpackages directly

---

## Open Questions

1. **Hostinger plan type (BLOCKER)**
   - What we know: Client "has Hostinger" — plan type unconfirmed
   - What's unclear: Shared hosting (static export required) vs VPS (full Node.js)
   - Recommendation: Ask client before Phase 1 starts. Default to VPS architecture in planning, with a clear note that the build config changes if shared. The critical divergence is in `next.config.ts` (output), Studio location, and email approach.

2. **siteSettings singleton enforcement**
   - What we know: `__experimental_actions` can hide create/delete buttons in Studio
   - What's unclear: Whether this API is stable in Sanity v3
   - Recommendation: Use it anyway for the UX benefit; it's widely used in the community despite the `__experimental_` prefix.

3. **CORS configuration for embedded Studio**
   - What we know: Sanity project must list the hosting domain with credentials allowed
   - What's unclear: Exact production domain (depends on Hostinger setup)
   - Recommendation: Add `localhost:3000` and `localhost:3333` during development; add production domain as part of deployment task.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (E2E) + Jest/Vitest (unit — if added later) |
| Config file | `playwright.config.ts` — Wave 0 creates it |
| Quick run command | `npx playwright test --project=chromium tests/smoke.spec.ts` |
| Full suite command | `npx playwright test` |

For Phase 1 (scaffolding + schemas + base layout), the most valuable tests are smoke tests confirming the site renders and the Studio loads — not unit tests of individual React components.

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CMS-01 | Content is editable via Studio | smoke (manual verify) | — | manual only — browser inspection |
| CMS-02 | Studio accessible at /studio | smoke | `npx playwright test tests/smoke.spec.ts -g "studio loads"` | Wave 0 |
| CMS-03 | All 6 schemas defined (equipo, post, banner, pagina, siteSettings, reclamo) | unit (TypeGen check) | `npx tsc --noEmit` (types fail if schema missing) | implicit |
| UX-01 | Renders at 360px without horizontal scroll | smoke | `npx playwright test tests/smoke.spec.ts -g "360px mobile"` | Wave 0 |
| UX-02 | Dark theme with red/yellow accents visible | smoke (visual) | `npx playwright test tests/smoke.spec.ts -g "dark theme"` | Wave 0 |
| UX-03 | Hamburger menu opens on mobile | smoke | `npx playwright test tests/smoke.spec.ts -g "hamburger menu"` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` (type check, < 10 seconds)
- **Per wave merge:** `npx playwright test tests/smoke.spec.ts` (smoke suite)
- **Phase gate:** Full smoke suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/smoke.spec.ts` — covers CMS-02, UX-01, UX-02, UX-03
- [ ] `playwright.config.ts` — Playwright configuration with 360px viewport project
- [ ] Framework install: `npm install -D @playwright/test && npx playwright install chromium`

---

## Sources

### Primary (HIGH confidence)
- [Sanity Embedding Docs](https://www.sanity.io/docs/studio/embedding-sanity-studio) — embedded Studio setup, route pattern
- [shadcn/ui Tailwind v4 Docs](https://ui.shadcn.com/docs/tailwind-v4) — CSS-first config, OKLCH migration, tw-animate-css
- [next-sanity Issue #1899 (CLOSED)](https://github.com/sanity-io/next-sanity/issues/1899) — static export compatibility, workaround pattern
- [Sanity TypeGen Docs](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen) — TypeGen CLI commands, sanity.types.ts generation
- [Next.js Deploying Docs](https://nextjs.org/docs/app/getting-started/deploying) — static export, self-hosting

### Secondary (MEDIUM confidence)
- [Hostinger Next.js VPS Guide 2025](https://ayyaztech.com/blog/how-to-deploy-nextjs-to-hostinger-vps-complete-guide-2025) — PM2 + Nginx setup
- [Next.js Static Export on Hostinger Guide](https://coldfusion-example.blogspot.com/2026/02/how-to-deploy-nextjs-on-hostinger.html) — trailingSlash, out/ upload
- [DEV: Next.js 15 + shadcn + Tailwind v4 Setup](https://dev.to/darshan_bajgain/setting-up-2025-nextjs-15-with-shadcn-tailwind-css-v4-no-config-needed-dark-mode-5kl) — verified with official shadcn docs

### Tertiary (LOW confidence)
- Community patterns for `__experimental_actions` on siteSettings singleton — not officially documented for v3, but widely used

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified via official docs and npm
- Architecture: HIGH — route group pattern and Studio embedding from official Sanity docs
- Hostinger deployment: MEDIUM — multiple consistent third-party guides; official Hostinger docs confirm Node.js on VPS
- Tailwind v4 + shadcn/ui: HIGH — verified from official shadcn/ui Tailwind v4 migration docs
- TypeGen workflow: HIGH — official Sanity docs
- Pitfalls: HIGH — issues #1899 and #703 are documented in official repos; layout conflict is well-known community issue

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable stack, 30 days)
