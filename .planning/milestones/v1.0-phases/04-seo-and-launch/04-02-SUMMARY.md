---
phase: 04-seo-and-launch
plan: 02
subsystem: seo
tags: [next.js, metadata, open-graph, playwright, sanity]

# Dependency graph
requires:
  - phase: 04-seo-and-launch
    provides: SEO queries (SITE_SEO_DEFAULTS_QUERY, POST_SEO_BY_SLUG_QUERY, EQUIPO_SEO_BY_SLUG_QUERY) and metadataBase in root layout
provides:
  - generateMetadata on all 7 public pages (/, /nosotros, /contacto, /blog, /blog/[slug], /equipos, /equipos/[slug])
  - Open Graph tags on all public pages
  - Dynamic SEO from Sanity on blog and equipo detail pages
affects: [05-cms-completo]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - generateMetadata async function (not metadata constant) pattern on every page
    - Dynamic pages await params before slug destructuring (Next.js 15 async params)
    - OG image built with urlFor().width(1200).height(630).url() for consistent social preview dimensions

key-files:
  created:
    - src/app/(site)/blog/[slug]/page.tsx
  modified:
    - src/app/(site)/page.tsx
    - src/app/(site)/nosotros/page.tsx
    - src/app/(site)/contacto/page.tsx
    - src/app/(site)/blog/page.tsx
    - src/app/(site)/equipos/page.tsx
    - src/app/(site)/equipos/[slug]/page.tsx

key-decisions:
  - "Homepage generateMetadata fetches SITE_SEO_DEFAULTS_QUERY from Sanity with fallback to brand name — editors can override title, description, and OG image from Studio"
  - "Static pages (nosotros, contacto, blog, equipos) use hardcoded Spanish strings — no Sanity round-trip needed for rarely-changing text"
  - "blog/[slug] sets OG type:article with publishedTime and authors from Sanity post fields"
  - "equipo/[slug] description fallback: seoDescription ?? descripcion ?? nombre + marca construction"

patterns-established:
  - "generateMetadata-only pattern: all pages use async function, never metadata constant — avoids Next.js conflict error"
  - "Dynamic page SEO: Props type with Promise<{slug}>, await params inside generateMetadata"
  - "OG image fallback chain: ogImage field -> imagen field -> no image (empty array)"

requirements-completed: [SEO-01, SEO-02]

# Metrics
duration: 15min
completed: 2026-03-18
---

# Phase 04 Plan 02: SEO Metadata Summary

**generateMetadata wired into all 7 public Next.js pages pulling dynamic SEO fields from Sanity with Open Graph tags and Playwright tests passing**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-18T08:10:00Z
- **Completed:** 2026-03-18T08:25:00Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- All 7 public pages export `generateMetadata` with title, description, and `openGraph` fields
- Homepage fetches `SITE_SEO_DEFAULTS_QUERY` from Sanity for CMS-controlled title, description, and OG image
- Blog and equipo detail pages fetch document-specific SEO fields from Sanity with fallback to content fields
- All 13 SEO Playwright tests pass (SEO-01, SEO-02, SEO-03, Robots.txt)

## Task Commits

1. **Task 1: generateMetadata on 5 static pages** - `6be28f8` (feat)
2. **Task 2: generateMetadata on blog/[slug] and equipos/[slug]** - `f420be5` (feat)

## Files Created/Modified

- `src/app/(site)/page.tsx` - generateMetadata fetching Sanity siteSettings for default OG image
- `src/app/(site)/nosotros/page.tsx` - Static generateMetadata with Spanish strings
- `src/app/(site)/contacto/page.tsx` - Static generateMetadata with Spanish strings
- `src/app/(site)/blog/page.tsx` - Static generateMetadata with Spanish strings
- `src/app/(site)/equipos/page.tsx` - Static generateMetadata with Spanish strings
- `src/app/(site)/blog/[slug]/page.tsx` - Dynamic generateMetadata with POST_SEO_BY_SLUG_QUERY, OG article type
- `src/app/(site)/equipos/[slug]/page.tsx` - Dynamic generateMetadata with EQUIPO_SEO_BY_SLUG_QUERY

## Decisions Made

- Homepage fetches Sanity for SEO defaults so editors can control brand title/description/OG image without code changes.
- Static pages use hardcoded strings — the copy rarely changes and avoids unnecessary Sanity round-trips.
- blog/[slug] sets `type: 'article'` with `publishedTime` and `authors` from Sanity post fields, improving structured data for social platforms.
- equipo/[slug] description fallback chain: `seoDescription ?? descripcion ?? nombre + marca` ensures a meaningful description is always present even without explicit SEO fields.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

First Playwright run had timeouts on 8 tests due to Next.js dev server compiling new pages on first request (cold start). On retry (1 retry), all 13 tests passed cleanly. Not a code issue — a dev server warm-up artifact.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 7 pages now have complete SEO metadata — ready for Phase 5 CMS Studio configuration
- Editors can update homepage SEO defaults via Sanity Studio siteSettings document
- Blog and equipo detail pages automatically use per-document SEO fields when set in Studio

---
*Phase: 04-seo-and-launch*
*Completed: 2026-03-18*
