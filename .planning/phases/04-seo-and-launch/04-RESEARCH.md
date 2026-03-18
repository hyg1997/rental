# Phase 4: SEO and Launch - Research

**Researched:** 2026-03-18
**Domain:** Next.js App Router Metadata API, Sanity CMS SEO fields, production deployment
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SEO-01 | Cada pagina tiene meta tags (title, description) administrables desde Sanity | `generateMetadata` + new Sanity seo fields on each document type |
| SEO-02 | Open Graph tags para compartir en redes sociales | `openGraph` field in Metadata object; Sanity image URL resolved to absolute via `metadataBase` |
| SEO-03 | Sitemap XML generado automaticamente | `app/sitemap.ts` using `MetadataRoute.Sitemap`; fetches slugs from Sanity at request time |
</phase_requirements>

---

## Summary

Phase 4 is a focused SEO and launch hardening phase with two tracks running in parallel. Track A (Plan 04-01) wires up Next.js 16's built-in Metadata API to Sanity-editable fields so every page has unique, CMS-controlled title/description and Open Graph tags. Track B (Plan 04-02) confirms all production services work end-to-end: Resend email delivery from a verified domain, Sanity CORS origins covering the production URL, environment variables present on the server, and a full smoke test from a real device.

The project runs Next.js 16.1.7 on a VPS with `next start` (decision locked in Phase 01). The existing codebase already has: Sanity schemas for all content types, `@sanity/client` for data fetching, `resend` for email, and Playwright for E2E tests. There are no existing SEO fields in any schema — they must be added.

The single largest risk is the Resend `from` address: the API route currently uses `onboarding@resend.dev` with a TODO comment. Production email requires a verified sender domain with SPF and DKIM DNS records, which can take up to 24 hours to propagate. This must be done before or alongside Plan 04-02, not after.

**Primary recommendation:** Add `seo` object fields (title, description, ogImage) to every Sanity document type that has a public page, then use `generateMetadata` in each page to pull from those fields. Use `app/sitemap.ts` with `MetadataRoute.Sitemap` for the sitemap — no external package needed.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next (Metadata API) | 16.1.7 (already installed) | `generateMetadata`, `MetadataRoute.Sitemap`, `MetadataRoute.Robots` | Built-in — zero extra dependencies, fully typed |
| @sanity/client | 7.17.0 (already installed) | Fetch seo fields from Sanity inside `generateMetadata` | Already the project's data client; `fetch` calls inside `generateMetadata` are automatically memoized with the page render |
| @sanity/image-url | 2.0.3 (already installed) | Convert Sanity image refs to absolute CDN URLs for og:image | Required — OG images must be absolute URLs; Sanity CDN URL is always publicly accessible |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| resend | 6.9.4 (already installed) | Transactional email from verified domain | Plan 04-02: update `from` address to verified sender |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `app/sitemap.ts` (built-in) | `next-sitemap` npm package | next-sitemap requires post-build step and config file; built-in `sitemap.ts` is cleaner and co-located with the app |
| Sanity seo object field per doc | Global siteSettings seo defaults only | Per-document fields required for SEO-01 uniqueness per page |

**Installation:** No new packages needed. All libraries already in `package.json`.

---

## Architecture Patterns

### Recommended File Structure (new files only)

```
src/
├── app/
│   ├── layout.tsx              # Add metadataBase + root metadata with title template
│   ├── sitemap.ts              # NEW: MetadataRoute.Sitemap
│   ├── robots.ts               # NEW: MetadataRoute.Robots
│   └── (site)/
│       ├── page.tsx            # Add generateMetadata (homepage)
│       ├── nosotros/page.tsx   # Add generateMetadata
│       ├── contacto/page.tsx   # Add generateMetadata
│       ├── blog/
│       │   ├── page.tsx        # Add generateMetadata
│       │   └── [slug]/page.tsx # Add generateMetadata (dynamic)
│       └── equipos/
│           ├── page.tsx        # Add generateMetadata
│           └── [slug]/page.tsx # Add generateMetadata (dynamic)
└── sanity/
    ├── schemas/
    │   ├── site-settings.ts    # Add seo group: defaultOgImage, defaultSeoTitle, defaultSeoDescription
    │   ├── post.ts             # Add seoTitle, seoDescription, ogImage fields
    │   └── equipo.ts           # Add seoTitle, seoDescription fields
    └── queries/
        └── seo.ts              # NEW: SEO-specific GROQ queries
```

### Pattern 1: Root Layout metadataBase + title template

Set in `app/layout.tsx` (the root layout, NOT the `(site)/layout.tsx`). This must be the root-level layout.

**What:** Defines the absolute URL base so relative paths in openGraph.images resolve correctly. Defines a site-wide title template.
**When to use:** Once, in root layout. All child pages inherit the template.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://testingcalibrations.com.pe'), // production domain
  title: {
    default: 'Testing Calibrations S.A.C.',
    template: '%s | Testing Calibrations S.A.C.',
  },
  description: 'Servicios de calibracion y venta de equipos de medicion en Peru.',
}
```

**Critical:** Without `metadataBase`, any relative OG image path causes a build error or broken social previews. The value must match the production domain exactly.

### Pattern 2: Static page generateMetadata (nosotros, contacto, blog index, equipos index)

**What:** Exports a static `metadata` object (not a function) for pages with fixed content.
**When to use:** Pages where title/description don't depend on dynamic route params.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { SITE_SETTINGS_SEO_QUERY } from '@/sanity/queries/seo'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(SITE_SETTINGS_SEO_QUERY).catch(() => null)

  return {
    title: settings?.nosotrosSeoTitle ?? 'Nosotros',
    description: settings?.nosotrosSeoDescription ?? 'Conoce Testing Calibrations S.A.C.',
    openGraph: {
      title: settings?.nosotrosSeoTitle ?? 'Nosotros | Testing Calibrations S.A.C.',
      description: settings?.nosotrosSeoDescription ?? '',
      images: settings?.defaultOgImage
        ? [{ url: urlFor(settings.defaultOgImage).width(1200).height(630).url() }]
        : [],
    },
  }
}
```

### Pattern 3: Dynamic page generateMetadata (blog/[slug], equipos/[slug])

**What:** Fetches document-specific SEO fields using the route slug.
**When to use:** All `[slug]` pages.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { POST_SEO_BY_SLUG_QUERY } from '@/sanity/queries/seo'
import { urlFor } from '@/lib/image-url'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await client.fetch(POST_SEO_BY_SLUG_QUERY, { slug }).catch(() => null)

  return {
    title: post?.seoTitle ?? post?.titulo ?? undefined,
    description: post?.seoDescription ?? post?.extracto ?? undefined,
    openGraph: {
      title: post?.seoTitle ?? post?.titulo,
      description: post?.seoDescription ?? post?.extracto,
      type: 'article',
      images: post?.ogImage
        ? [{ url: urlFor(post.ogImage).width(1200).height(630).url(), width: 1200, height: 630 }]
        : post?.imagen
          ? [{ url: urlFor(post.imagen).width(1200).height(630).url(), width: 1200, height: 630 }]
          : [],
    },
  }
}
```

**Important:** `params` is a Promise in Next.js 15+ — always `await params` before destructuring. This project already follows this pattern in all existing `[slug]` pages.

### Pattern 4: app/sitemap.ts

**What:** A file at `app/sitemap.ts` (not inside `(site)/`) that Next.js serves at `/sitemap.xml`.
**When to use:** Single file covers all routes.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
import type { MetadataRoute } from 'next'
import { client } from '@/sanity/client'
import { defineQuery } from 'groq'

const BASE_URL = 'https://testingcalibrations.com.pe'

const SITEMAP_POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)]{
  "slug": slug.current,
  fechaPublicacion
}`)

const SITEMAP_EQUIPOS_QUERY = defineQuery(`*[_type == "equipo" && defined(slug.current)]{
  "slug": slug.current,
  _updatedAt
}`)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, equipos] = await Promise.all([
    client.fetch(SITEMAP_POSTS_QUERY).catch(() => []),
    client.fetch(SITEMAP_EQUIPOS_QUERY).catch(() => []),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/nosotros`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/equipos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((post: { slug: string; fechaPublicacion: string }) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.fechaPublicacion ? new Date(post.fechaPublicacion) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const equipoRoutes: MetadataRoute.Sitemap = equipos.map((eq: { slug: string; _updatedAt: string }) => ({
    url: `${BASE_URL}/equipos/${eq.slug}`,
    lastModified: eq._updatedAt ? new Date(eq._updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...postRoutes, ...equipoRoutes]
}
```

**Note:** The `/studio` and `/libro-de-reclamaciones` routes should NOT be in the sitemap.

### Pattern 5: app/robots.ts

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/studio/'],
    },
    sitemap: 'https://testingcalibrations.com.pe/sitemap.xml',
  }
}
```

### Pattern 6: Sanity SEO fields (new fields to add to schemas)

Add an `seo` group to `post.ts` and `equipo.ts`. Add global SEO defaults to `site-settings.ts`.

```typescript
// In post.ts and equipo.ts — add these fields:
defineField({
  name: 'seoTitle',
  title: 'Titulo SEO',
  type: 'string',
  group: 'seo',
  description: 'Titulo que aparece en Google. Si esta vacio, se usa el titulo del articulo.',
  validation: r => r.max(60),
}),
defineField({
  name: 'seoDescription',
  title: 'Descripcion SEO',
  type: 'text',
  rows: 2,
  group: 'seo',
  description: 'Descripcion que aparece en Google (max 160 caracteres).',
  validation: r => r.max(160),
}),
defineField({
  name: 'ogImage',
  title: 'Imagen para Redes Sociales',
  type: 'image',
  group: 'seo',
  description: 'Imagen que se muestra al compartir en WhatsApp, Facebook, etc. Tamaño ideal: 1200x630px.',
}),
```

```typescript
// In site-settings.ts — add to groups and fields:
{ name: 'seo', title: 'SEO por Defecto' },

// Fields:
defineField({
  name: 'defaultSeoTitle',
  title: 'Titulo SEO por Defecto',
  type: 'string',
  group: 'seo',
}),
defineField({
  name: 'defaultSeoDescription',
  title: 'Descripcion SEO por Defecto',
  type: 'text',
  rows: 2,
  group: 'seo',
}),
defineField({
  name: 'defaultOgImage',
  title: 'Imagen OG por Defecto',
  type: 'image',
  group: 'seo',
  description: 'Imagen de reserva cuando la pagina no tiene imagen propia. 1200x630px.',
}),
```

### Anti-Patterns to Avoid

- **Hardcoding the production domain in page.tsx files:** All canonical URL construction must use `metadataBase` set in the root layout. Pages use relative paths only.
- **Putting `sitemap.ts` inside `(site)/`:** The file must be at `app/sitemap.ts` (root of app dir) to be served at the site root `/sitemap.xml`.
- **OG images as relative paths without metadataBase:** Next.js throws a build error if URL-based metadata fields use relative paths and `metadataBase` is not set.
- **Calling `generateMetadata` and exporting `metadata` from the same file:** Not allowed by Next.js — pick one per route segment.
- **Including /studio in the sitemap:** Studio is a private admin UI, should be disallowed in robots.txt and excluded from sitemap.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| sitemap.xml generation | Custom API route or build script | `app/sitemap.ts` with `MetadataRoute.Sitemap` | Built-in, cached, typed, served at correct URL automatically |
| robots.txt serving | Static file in `/public` | `app/robots.ts` with `MetadataRoute.Robots` | Programmatic, can reference production domain dynamically |
| Meta tag injection | Manual `<head>` manipulation | `generateMetadata` + `metadata` export | Framework handles deduplication, inheritance, and <head> placement |
| OG image URL construction | String concatenation | `urlFor(image).width(1200).height(630).url()` | Handles Sanity CDN, format, quality; result is always absolute |

**Key insight:** Next.js 16 handles all SEO infrastructure natively. There is no reason to install `next-sitemap` or any other SEO package for this project.

---

## Common Pitfalls

### Pitfall 1: Missing metadataBase causes broken OG images

**What goes wrong:** Social media platforms (WhatsApp, Facebook) receive a relative URL like `/og.png` for the OG image and cannot fetch it. The share preview shows no image.
**Why it happens:** `metadataBase` is required whenever OG image paths are relative. Without it, Next.js either throws at build time or generates a malformed URL.
**How to avoid:** Set `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://testingcalibrations.com.pe')` in the root `app/layout.tsx` metadata export.
**Warning signs:** OG image URL in page source starts with `/` instead of `https://`.

### Pitfall 2: Resend `from` address still using `onboarding@resend.dev`

**What goes wrong:** Emails sent in production land in spam or are rejected entirely. Resend's sandbox `onboarding@resend.dev` only works for verified email addresses in test mode.
**Why it happens:** The API route at `src/app/api/contact/route.ts` has a TODO comment: `from: 'onboarding@resend.dev'`. This was acceptable during development.
**How to avoid:** Before launch, add the production domain to Resend, add SPF and DKIM DNS records, wait for verification (up to 24h), then update `from` to `noreply@testingcalibrations.com.pe` (or equivalent).
**Warning signs:** Emails work in dev but fail or land in spam on production.

### Pitfall 3: Sanity CORS missing for production domain

**What goes wrong:** Sanity Studio at `/studio` fails to authenticate on the production URL. Editors see login errors or blank screens.
**Why it happens:** Sanity requires explicit CORS origin registration for each domain that accesses the API (including embedded Studio).
**How to avoid:** In `manage.sanity.io` > Settings > API > CORS Origins, add the production domain with "Allow credentials" checked (required for Studio authentication). Add both `https://testingcalibrations.com.pe` and optionally `https://www.testingcalibrations.com.pe`.
**Warning signs:** Studio works on localhost but shows authentication errors on the production URL.

### Pitfall 4: NEXT_PUBLIC_ variables baked at build time

**What goes wrong:** `NEXT_PUBLIC_SANITY_PROJECT_ID` or `NEXT_PUBLIC_SANITY_DATASET` is missing on the server at build time, causing all Sanity fetches to fail silently.
**Why it happens:** `NEXT_PUBLIC_*` variables are evaluated at build time — they must be present in the environment when `next build` runs on the VPS, not just at runtime.
**How to avoid:** Verify `.env.production` (or server environment) contains all required variables before running `npm run build`. Required variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `RESEND_API_KEY`, `SANITY_WRITE_TOKEN`.
**Warning signs:** Build succeeds but all pages render fallback/empty content in production.

### Pitfall 5: title.template swallowing the root layout title

**What goes wrong:** The homepage title renders as `" | Testing Calibrations S.A.C."` instead of just `"Testing Calibrations S.A.C."`.
**Why it happens:** `title.template` applies to child segments. If the homepage `page.tsx` sets `title: ''` or omits it, the template produces a leading separator.
**How to avoid:** Set `title.default` in root layout; the homepage `(site)/page.tsx` should export its own specific `title` string (not empty).

---

## Code Examples

### Complete generateMetadata for blog [slug] page

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { defineQuery } from 'groq'
import { urlFor } from '@/lib/image-url'

const POST_SEO_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    titulo,
    extracto,
    seoTitle,
    seoDescription,
    ogImage,
    imagen,
    fechaPublicacion,
    autor
  }
`)

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await client.fetch(POST_SEO_QUERY, { slug }).catch(() => null)

  if (!post) return { title: 'Articulo no encontrado' }

  const title = post.seoTitle ?? post.titulo
  const description = post.seoDescription ?? post.extracto

  const imageUrl = post.ogImage
    ? urlFor(post.ogImage).width(1200).height(630).url()
    : post.imagen
      ? urlFor(post.imagen).width(1200).height(630).url()
      : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      type: 'article',
      publishedTime: post.fechaPublicacion ?? undefined,
      authors: post.autor ? [post.autor] : undefined,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
  }
}
```

### GROQ query for sitemap (all content types)

```typescript
// Fetch slugs for sitemap — minimal fields only
const SITEMAP_POSTS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)]{ "slug": slug.current, fechaPublicacion }`
)
const SITEMAP_EQUIPOS_QUERY = defineQuery(
  `*[_type == "equipo" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
)
```

### Resend production `from` address pattern

```typescript
// src/app/api/contact/route.ts — update from address
from: 'Testing Calibrations <noreply@testingcalibrations.com.pe>',
// Display name format is supported by Resend
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next-sitemap` npm package | `app/sitemap.ts` built-in | Next.js 13.3 | No extra dependency, no post-build script |
| Manual `<Head>` component (Pages Router) | `metadata` export / `generateMetadata` (App Router) | Next.js 13.2 | Type-safe, automatic deduplication |
| `themeColor` in metadata object | `generateViewport` function | Next.js 14 | Separate concern; metadata object no longer accepts viewport fields |
| Static `robots.txt` in `/public` | `app/robots.ts` | Next.js 13.3 | Programmatic, can reference env vars |

**Deprecated/outdated:**
- `next-seo` package: Still works but is unnecessary for App Router projects — the built-in API covers all cases.
- `<meta name="viewport">` in metadata: Moved to `generateViewport`. Do not add to the `metadata` export.

---

## Open Questions

1. **Production domain confirmed?**
   - What we know: STATE.md mentions "Hosting plan unknown — proceeding with VPS" and references `testingcalibrations.com.pe` in code comments.
   - What's unclear: Whether the client has already pointed DNS for this domain to the VPS.
   - Recommendation: The planner should include a verification task to confirm the domain is live before running smoke tests. All hardcoded domain values in `sitemap.ts`, `robots.ts`, and `metadataBase` should be pulled from `process.env.NEXT_PUBLIC_SITE_URL` to avoid updating code when the domain is confirmed.

2. **Resend verified sender domain**
   - What we know: DNS propagation takes up to 24 hours; the TODO exists in the contact API route. Also `src/app/api/reclamo/route.ts` sends email — both need updating.
   - What's unclear: Whether the client controls DNS for the sender domain, and whether they want emails from `testingcalibrations.com.pe` or a subdomain.
   - Recommendation: Plan 04-02 should document the Resend verification steps as a manual pre-task, with a test to verify delivery from the production URL.

3. **`SANITY_WRITE_TOKEN` on production server**
   - What we know: `reclamo` API route checks for this token and returns 503 if absent. It is used server-side only (not prefixed NEXT_PUBLIC_).
   - What's unclear: Whether this token has been generated in Sanity and added to the VPS environment.
   - Recommendation: Include an env var audit task in Plan 04-02 that checks all four required variables are set.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright 1.58.2 |
| Config file | `playwright.config.ts` |
| Quick run command | `npx playwright test tests/smoke.spec.ts --project=chromium` |
| Full suite command | `npx playwright test` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEO-01 | Each page `<title>` is unique and not the default fallback | e2e | `npx playwright test tests/seo.spec.ts --project=chromium` | ❌ Wave 0 |
| SEO-01 | `<meta name="description">` present on each page | e2e | same file | ❌ Wave 0 |
| SEO-02 | `og:title`, `og:description`, `og:image` present on a content page | e2e | same file | ❌ Wave 0 |
| SEO-03 | `GET /sitemap.xml` returns 200 with valid XML containing all public routes | e2e | same file | ❌ Wave 0 |
| Production | `/robots.txt` returns 200 and disallows `/studio` | e2e | same file | ❌ Wave 0 |
| Production | Contact form POST delivers email (production) | manual-only | N/A — requires live SMTP verification | — |
| Production | Studio login works at `/studio` on production URL | manual-only | N/A — requires production CORS + credentials | — |
| Production | WhatsApp button opens on mobile device | manual-only | N/A — requires physical device test | — |

### Sampling Rate
- **Per task commit:** `npx playwright test tests/seo.spec.ts --project=chromium`
- **Per wave merge:** `npx playwright test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/seo.spec.ts` — covers SEO-01, SEO-02, SEO-03, robots.txt
- No framework install needed — Playwright already installed and configured

---

## Sources

### Primary (HIGH confidence)
- [Next.js generateMetadata docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — full Metadata type, openGraph fields, metadataBase, title template (version 16.1.7, updated 2026-03-16)
- [Next.js sitemap.xml docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — MetadataRoute.Sitemap, dynamic generation (version 16.1.7, updated 2026-03-16)
- [Next.js robots.txt docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — MetadataRoute.Robots (version 16.1.7, updated 2026-03-16)
- [Sanity CORS docs](https://www.sanity.io/docs/cors) — manage.sanity.io workflow, Allow credentials requirement
- Project source: `src/app/api/contact/route.ts` — confirmed `onboarding@resend.dev` TODO
- Project source: `src/sanity/schemas/` — confirmed no SEO fields exist yet

### Secondary (MEDIUM confidence)
- [Resend domain authentication guide](https://resend.com/docs/dashboard/domains/introduction) — SPF/DKIM verification process, 24h propagation window
- [Resend email authentication blog](https://resend.com/blog/email-authentication-a-developers-guide) — production sender domain requirements

### Tertiary (LOW confidence)
- WebSearch results on Sanity + Next.js SEO patterns — corroborates built-in approach but not verified against a single authoritative source

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against official Next.js 16.1.7 docs (updated 2026-03-16)
- Architecture patterns: HIGH — all code examples follow official doc patterns; project-specific file names verified from actual codebase
- Pitfalls: HIGH — most identified from actual TODO comments in codebase and known Next.js/Sanity gotchas
- Resend production requirements: MEDIUM — confirmed by Resend docs, exact DNS record values depend on domain registrar

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (Next.js metadata API is stable; Resend API unlikely to change)
