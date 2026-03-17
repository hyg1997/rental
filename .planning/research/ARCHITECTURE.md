# Architecture Research

**Domain:** Corporate website — Sanity CMS + Next.js, deployed on Hostinger
**Researched:** 2026-03-17
**Confidence:** MEDIUM-HIGH (deployment path has a critical fork that must be decided early)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CONTENT LAYER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Sanity Studio (/studio route or sanity.io hosted)   │   │
│  │  Schemas: siteSettings, equipment, post, page        │   │
│  └─────────────────────┬────────────────────────────────┘   │
│                        │ GROQ over HTTPS (Content Lake API)  │
└────────────────────────┼────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                   FRONTEND LAYER                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Next.js App Router                   │   │
│  │  /             → Homepage (RSC, SSG)                  │   │
│  │  /equipos      → Equipment catalog (RSC, SSG)         │   │
│  │  /equipos/[slug] → Equipment detail (RSC, SSG)        │   │
│  │  /blog         → Blog list (RSC, SSG)                 │   │
│  │  /blog/[slug]  → Blog post (RSC, SSG)                 │   │
│  │  /nosotros     → About page (RSC, SSG)                │   │
│  │  /contacto     → Contact page (RSC, SSG)              │   │
│  │  /studio       → Sanity Studio (optional, App Router) │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ Static files (HTML/CSS/JS)
                         │ OR Node.js process (if VPS)
┌────────────────────────┼────────────────────────────────────┐
│                   HOSTING LAYER                             │
│  ┌─────────────────────────┐  ┌───────────────────────────┐ │
│  │   Hostinger Shared      │  │   Hostinger Business/VPS  │ │
│  │   output: 'export'      │  │   Node.js server (npm     │ │
│  │   HTML/CSS/JS only      │  │   start / pm2)            │ │
│  │   No SSR, no API routes │  │   Full SSR + API routes   │ │
│  └─────────────────────────┘  └───────────────────────────┘ │
│              OPTION A                     OPTION B           │
└─────────────────────────────────────────────────────────────┘
```

### Critical Deployment Decision (Must Decide Before Phase 1)

There are two valid paths. The choice determines the entire architecture.

| | Option A: Static Export | Option B: Node.js on Hostinger |
|---|---|---|
| **Next.js mode** | `output: 'export'` | Standard (no output override) |
| **Hostinger plan** | Any shared plan | Business plan or VPS |
| **API routes** | Not supported | Supported |
| **Contact form** | Needs EmailJS or Formspree | Nodemailer/Resend via API route |
| **Sanity Studio** | Must be hosted on sanity.io | Can embed at /studio |
| **Content updates** | Requires manual rebuild + redeploy | Can use webhooks + revalidation |
| **ISR** | Not supported | Supported |
| **Complexity** | Low | Medium |
| **Recommended for this project** | Yes (simpler, client already has shared hosting) | If client upgrades plan |

**Recommendation: Start with Option A (static export).** The site is primarily informational. Content changes infrequently. A rebuild-on-publish workflow (Sanity webhook triggers a GitHub Action that rebuilds and FTPs to Hostinger) is entirely sufficient. Avoids Node.js process management complexity.

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Sanity Studio | Content editing UI | Hosted at sanity.io/manage or `/studio` route |
| Content Lake | Content storage and GROQ API | Sanity cloud (always external, always free tier) |
| Next.js pages | Route rendering, data fetching at build time | App Router RSC with `generateStaticParams` |
| Shared UI components | Reusable visual elements | `/src/components/ui/` |
| Section components | Page-section-level blocks (Hero, Features) | `/src/components/sections/` |
| Sanity client | GROQ query executor | `/src/lib/sanity/client.ts` |
| GROQ queries | Data shape definitions | `/src/lib/sanity/queries/` |
| WhatsApp button | Floating client component | `/src/components/ui/WhatsAppButton.tsx` |
| Contact form | Client-side form + EmailJS/Formspree | `/src/components/sections/ContactForm.tsx` |

## Recommended Project Structure

```
testing-calibrations/
├── sanity/                      # Sanity Studio (separate workspace)
│   ├── schemas/
│   │   ├── documents/
│   │   │   ├── siteSettings.ts  # Global site config (singleton)
│   │   │   ├── equipment.ts     # Equipment documents
│   │   │   ├── post.ts          # Blog posts
│   │   │   └── page.ts          # Static pages (Nosotros, etc.)
│   │   ├── objects/
│   │   │   ├── seo.ts           # Reusable SEO fields object
│   │   │   ├── imageWithAlt.ts  # Image + alt text
│   │   │   └── ctaButton.ts     # CTA button object
│   │   └── index.ts
│   ├── sanity.config.ts
│   └── sanity.cli.ts
│
└── src/                         # Next.js frontend
    ├── app/
    │   ├── layout.tsx            # Root layout (fonts, global nav, WhatsApp btn)
    │   ├── page.tsx              # Homepage
    │   ├── equipos/
    │   │   ├── page.tsx          # Equipment catalog (list + filters)
    │   │   └── [slug]/
    │   │       └── page.tsx      # Equipment detail
    │   ├── blog/
    │   │   ├── page.tsx          # Blog list
    │   │   └── [slug]/
    │   │       └── page.tsx      # Blog post
    │   ├── nosotros/
    │   │   └── page.tsx
    │   ├── contacto/
    │   │   └── page.tsx
    │   └── studio/               # Sanity Studio (optional, only Option B)
    │       └── [[...tool]]/
    │           └── page.tsx
    ├── components/
    │   ├── ui/                   # Atomic reusable: Button, Card, Badge, Input
    │   ├── sections/             # Page-section blocks: Hero, ServiceGrid,
    │   │   │                     # EquipmentCard, BlogCard, ContactForm
    │   │   ├── Hero.tsx
    │   │   ├── ServiceGrid.tsx
    │   │   ├── EquipmentGrid.tsx
    │   │   ├── FeaturedEquipment.tsx
    │   │   ├── MetricsBar.tsx
    │   │   ├── BlogGrid.tsx
    │   │   ├── ContactForm.tsx
    │   │   └── WhatsAppButton.tsx
    │   └── layout/               # Nav, Footer, SEO head wrapper
    │       ├── Navbar.tsx
    │       └── Footer.tsx
    ├── lib/
    │   └── sanity/
    │       ├── client.ts         # createClient config (read-only token)
    │       ├── image.ts          # imageUrlBuilder helper
    │       └── queries/
    │           ├── equipment.ts  # GROQ for equipment list + detail
    │           ├── blog.ts       # GROQ for posts list + detail
    │           ├── homepage.ts   # GROQ for homepage data
    │           └── settings.ts   # GROQ for siteSettings singleton
    ├── types/
    │   └── sanity.types.ts       # Generated via sanity typegen (optional)
    └── next.config.ts            # output: 'export' for Option A
```

### Structure Rationale

- **sanity/ at root (separate from src/):** Keeps Studio configuration isolated. Can be deployed to sanity.io independently without touching frontend code.
- **components/sections/ vs components/ui/:** Sections map to distinct visual blocks on a page (Hero, ServiceGrid). UI components are atomic and context-free (Button, Card). Never mix these — it prevents reuse.
- **lib/sanity/queries/:** Co-locating all GROQ queries in one place means schema changes require touching one file, not hunting through pages. Each file exports typed `defineQuery()` calls.
- **app/studio/:** Optional. Only relevant if hosting Studio inside the Next.js app (Option B). If using Option A, delete this route and use sanity.io/manage instead.

## Architectural Patterns

### Pattern 1: Singleton Document for Global Settings

**What:** A single Sanity document of type `siteSettings` holds global data: site name, logo, phone, WhatsApp number, social links, footer text. Fetched once at build time and passed through layout.
**When to use:** Any data that appears site-wide (nav, footer, WhatsApp CTA message). Avoids duplicating content across documents.
**Trade-offs:** Simple and correct for this site size. Does not scale to multi-tenant or multi-locale setups.

**Example:**
```typescript
// sanity/schemas/documents/siteSettings.ts
export default {
  name: 'siteSettings',
  title: 'Configuración del Sitio',
  type: 'document',
  __experimental_actions: ['update', 'publish'], // singleton — no create/delete
  fields: [
    { name: 'siteName', type: 'string', title: 'Nombre del Sitio' },
    { name: 'whatsappNumber', type: 'string', title: 'Número WhatsApp' },
    { name: 'whatsappMessage', type: 'string', title: 'Mensaje predefinido' },
    { name: 'contactEmail', type: 'string', title: 'Email de contacto' },
  ],
}
```

### Pattern 2: Static Generation with generateStaticParams

**What:** All dynamic routes (`/equipos/[slug]`, `/blog/[slug]`) use `generateStaticParams` to enumerate all slugs at build time. Pages are rendered to HTML. No runtime server needed.
**When to use:** Always, when using static export on Hostinger. This is the entire rendering strategy.
**Trade-offs:** New content requires a rebuild. Acceptable for this use case — content changes are infrequent.

**Example:**
```typescript
// src/app/equipos/[slug]/page.tsx
export async function generateStaticParams() {
  const slugs = await client.fetch<{slug: string}[]>(ALL_EQUIPMENT_SLUGS_QUERY)
  return slugs.map(({ slug }) => ({ slug }))
}

export default async function EquipmentPage({ params }: { params: { slug: string } }) {
  const equipment = await client.fetch(EQUIPMENT_BY_SLUG_QUERY, { slug: params.slug })
  return <EquipmentDetail equipment={equipment} />
}
```

### Pattern 3: GROQ Queries as Typed Constants

**What:** Define all GROQ queries using `defineQuery` from the `groq` package (not `next-sanity`, which has a known static export incompatibility issue). Export from `lib/sanity/queries/`. Use Sanity TypeGen to auto-generate TypeScript types from these queries.
**When to use:** Always. Avoids query duplication and makes refactoring safe.
**Trade-offs:** Minor setup overhead for TypeGen. Worth it — eliminates `any` types throughout the app.

**Example:**
```typescript
// src/lib/sanity/queries/equipment.ts
import { defineQuery } from 'groq' // Use 'groq' package, NOT 'next-sanity'

export const ALL_EQUIPMENT_QUERY = defineQuery(`
  *[_type == "equipment"] | order(featured desc, _createdAt desc) {
    _id,
    title,
    slug,
    category,  // "calibration" | "sale"
    status,    // "active" | "sold" | "available"
    "imageUrl": mainImage.asset->url,
    shortDescription,
    featured
  }
`)

export const EQUIPMENT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "equipment" && slug.current == $slug][0] {
    _id, title, slug, category, status,
    mainImage, gallery,
    specifications[],
    longDescription,
    featured
  }
`)
```

## Data Flow

### Build-Time Content Fetch (Primary Flow)

```
next build
    |
    v
generateStaticParams()         -- fetches all slugs from Sanity Content Lake
    |
    v
Page component (RSC)          -- fetches full document data via GROQ
    |
    v
Sanity Content Lake            -- returns JSON
    |
    v
React component tree           -- renders to HTML
    |
    v
out/ directory (static files)  -- uploaded to Hostinger public_html/
```

### Content Update Flow (After Initial Deploy)

```
Editor edits content in Sanity Studio
    |
    v
Publishes document
    |
    v
Sanity webhook fires           -- POST to GitHub Actions trigger URL
    |
    v
GitHub Actions job runs        -- npm run build → produces out/
    |
    v
FTP/rsync to Hostinger         -- uploads new static files
    |
    v
Site updated (no downtime)
```

### Contact Form Flow (Static Export — EmailJS)

```
User fills contact form (client component)
    |
    v
Client-side JS calls EmailJS API -- no server needed
    |
    v
EmailJS sends email to configured address
    |
    v
Success/error state shown to user
```

### WhatsApp Button Flow

```
User clicks WhatsApp button (anywhere on site)
    |
    v
Opens wa.me/{number}?text={encodedMessage}  -- pre-filled message
    |
    v
WhatsApp opens in app or web
```

### Key Data Flows Summary

1. **Homepage:** `siteSettings` + `homepage` singleton + `featuredEquipment` (filtered `*[_type == "equipment" && featured == true]`) → merged props → page render
2. **Equipment catalog:** All equipment documents with pagination strategy at build time → catalog page with client-side JS filter (by category: calibration/sale) — no server needed
3. **Blog:** All posts ordered by `publishedAt` → blog list; individual post via slug → detail page with Portable Text renderer
4. **Global layout:** `siteSettings` fetched once in `layout.tsx` at build time → passed to Navbar and Footer via props or React context

## Sanity Schema Organization

| Schema | Type | Fields | Notes |
|--------|------|--------|-------|
| `siteSettings` | document (singleton) | siteName, logo, whatsappNumber, whatsappMessage, contactEmail, address | Single document, no list view |
| `equipment` | document | title, slug, category (calibration/sale), status, mainImage, gallery[], specifications[], shortDescription, longDescription, featured | `category` drives catalog filter |
| `post` | document | title, slug, publishedAt, mainImage, excerpt, body (Portable Text), categories[] | Standard blog post |
| `page` | document | title, slug, body (Portable Text) | For Nosotros and other simple pages |
| `seo` | object | metaTitle, metaDescription, ogImage | Reused across all document types |
| `imageWithAlt` | object | asset (reference), alt | Ensures alt text discipline |

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Sanity Content Lake | GROQ fetch at build time via `@sanity/client` | Public read token, no write access from frontend |
| EmailJS | Client-side SDK, called from ContactForm component | Free tier: 200 emails/month. Alternative: Formspree (free tier: 50/month) |
| WhatsApp | Plain `<a href="https://wa.me/...">` link | No SDK needed. Number + message from siteSettings |
| Sanity Image CDN | `@sanity/image-url` helper → CDN URL | Static export compatible. Use `next/image` with `unoptimized: true` or a custom loader |
| GitHub Actions | Triggered by Sanity webhook → runs build → FTP to Hostinger | Optional but strongly recommended for content update automation |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Sanity queries ↔ Page components | Function call, awaited in RSC | Queries live in `lib/sanity/queries/`, imported by pages |
| Page components ↔ Section components | Props | Pages fetch data, sections receive typed props — no sections fetch their own data |
| Section components ↔ UI components | Props | One-way data flow down |
| ContactForm ↔ EmailJS | Client-side API call inside 'use client' component | Form is the only 'use client' component that makes external calls |
| WhatsApp button ↔ siteSettings | Number/message passed from layout as prop | Avoids hardcoding the phone number |

## Anti-Patterns

### Anti-Pattern 1: Fetching Sanity Data Inside Client Components

**What people do:** Mark a component `'use client'`, then `useEffect` + `fetch` to call Sanity at runtime.
**Why it's wrong:** In a static export, runtime client fetches are fine for UX but they bypass SSG entirely — the initial HTML is empty (bad for SEO). Sanity data should be fetched at build time in Server Components.
**Do this instead:** Fetch in the RSC page component at build time, pass data as props to client components. Client components handle only interactivity (form state, WhatsApp click).

### Anti-Pattern 2: Importing from `next-sanity` in a Static Export Project

**What people do:** `import { defineQuery } from 'next-sanity'` — natural since they use the official toolkit.
**Why it's wrong:** There is a known open issue (next-sanity#1899) where server-action imports inside next-sanity prevent `output: 'export'` builds from completing.
**Do this instead:** Import `defineQuery` from the `groq` package directly. Use `@sanity/client` for the client. Limit `next-sanity` usage to the Studio embed route if it exists.

### Anti-Pattern 3: Flat Component Directory

**What people do:** Put all components directly in `/components/` as a flat list.
**Why it's wrong:** With ~15-20 components (Hero, ServiceGrid, EquipmentCard, BlogCard, Navbar, Footer, WhatsAppButton, ContactForm, Button, Input, Badge...), the directory becomes unnavigable.
**Do this instead:** Enforce the `ui/` / `sections/` / `layout/` split from day one. Takes 30 seconds to create, saves hours of confusion.

### Anti-Pattern 4: Hardcoding WhatsApp Number and Business Data

**What people do:** Hardcode phone numbers, addresses, emails in JSX strings.
**Why it's wrong:** When the client changes their phone number, you must hunt through multiple files. Also prevents the client from self-managing this data.
**Do this instead:** All business contact data lives in the `siteSettings` Sanity document. Fetched once in layout, passed as props. Client can update it themselves in Sanity Studio.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (informational site, <500 visitors/day) | Static export on shared Hostinger. No changes needed. |
| 500-5000 visitors/day | Static export still fine. Add CDN (Cloudflare free tier) in front of Hostinger. |
| 5000+ or e-commerce added | Migrate to Hostinger VPS or cloud provider. Switch to standard Next.js with ISR + webhooks for instant content updates. |

### Scaling Priorities

1. **First bottleneck:** Hostinger shared hosting bandwidth/CPU limits. Fix: add Cloudflare CDN (free), which caches static assets globally.
2. **Second bottleneck:** Manual rebuild workflow becomes painful. Fix: automate with GitHub Actions + FTP deploy action.

## Build Order Implications

Components have clear dependencies that dictate implementation order:

```
1. Sanity schemas (siteSettings, equipment, post, page)
   → Must exist before any data fetching

2. Sanity client + query helpers (lib/sanity/)
   → Must exist before pages can fetch data

3. Base layout (Navbar, Footer, WhatsAppButton, Root layout)
   → Must exist before any page is renderable

4. Homepage
   → Requires siteSettings + equipment (featured) queries

5. Equipment catalog + detail pages
   → Requires equipment schema + queries + generateStaticParams

6. Blog list + post pages
   → Requires post schema + queries + Portable Text renderer

7. Static pages (Nosotros, Contacto)
   → Nosotros: page schema or hardcoded. Contacto: EmailJS integration.

8. SEO + sitemap
   → Requires all pages to exist (generate sitemap.xml at build time)
```

## Sources

- [Next.js Sanity CMS integration — Sanity official](https://www.sanity.io/nextjs-cms)
- [next-sanity GitHub repository](https://github.com/sanity-io/next-sanity)
- [next-sanity static export incompatibility issue #1899](https://github.com/sanity-io/next-sanity/issues/1899)
- [Next.js Static Exports guide](https://nextjs.org/docs/pages/guides/static-exports)
- [Next.js App Router project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Deploying Next.js on Hostinger — DEV Community](https://dev.to/oandersonmagalhaes/deploying-your-nextjs-project-on-hostinger-4gpm)
- [Hostinger Node.js support documentation](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/)
- [NearForm: Next.js App Router + Sanity CMS in action](https://nearform.com/digital-community/powering-our-website-s-evolution-next-js-app-router-and-sanity-cms-in-action/)
- [Sanity schema design best practices — Halo Lab](https://www.halo-lab.com/blog/creating-schema-in-sanity)
- [GROQ query cheat sheet — Sanity Docs](https://www.sanity.io/docs/content-lake/query-cheat-sheet)

---
*Architecture research for: Testing Calibrations S.A.C. — Sanity + Next.js corporate website*
*Researched: 2026-03-17*
