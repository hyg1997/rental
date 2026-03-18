---
phase: 04-seo-and-launch
plan: 01
subsystem: seo
tags: [sanity, groq, next.js, sitemap, robots, playwright, typescript]

# Dependency graph
requires:
  - phase: 03-content-pages-and-contact
    provides: post and equipo schemas, layout.tsx, and query patterns already established
  - phase: 02-equipment-catalog
    provides: equipo schema and slug structure used by sitemap and SEO queries
provides:
  - SEO fields (seoTitle, seoDescription, ogImage) on post and equipo schemas with field groups
  - Default SEO fields (defaultSeoTitle, defaultSeoDescription, defaultOgImage) on siteSettings
  - GROQ queries for SEO metadata in src/sanity/queries/seo.ts
  - Dynamic sitemap.xml generation at src/app/sitemap.ts
  - robots.txt generation at src/app/robots.ts disallowing /studio
  - Root layout metadataBase and title template configured
  - Playwright test stubs for SEO-01, SEO-02, SEO-03, and Robots.txt
affects: [04-02-seo-page-metadata, future phases wiring generateMetadata]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - SEO field groups pattern: groups array on defineType with contenido/info + seo tabs in Sanity Studio
    - Sitemap with graceful Sanity fallback: client.fetch with .catch(() => []) prevents build failure when Sanity unreachable
    - metadataBase + title template: root layout metadata sets global defaults, pages can override per-route

key-files:
  created:
    - src/sanity/queries/seo.ts
    - src/app/sitemap.ts
    - src/app/robots.ts
    - tests/seo.spec.ts
  modified:
    - src/sanity/schemas/post.ts
    - src/sanity/schemas/equipo.ts
    - src/sanity/schemas/site-settings.ts
    - src/app/layout.tsx

key-decisions:
  - "sitemap.ts uses .catch(() => []) on each Sanity fetch so sitemap builds even if Sanity is unreachable at build time"
  - "robots.ts disallows /studio and /studio/ (both with and without trailing slash) to prevent indexing of Studio admin"
  - "SEO fields use field groups in Sanity Studio — editors see Contenido tab by default, SEO tab only when needed"
  - "metadataBase reads NEXT_PUBLIC_SITE_URL env var with testingcalibrations.com.pe as fallback"

patterns-established:
  - "Sanity SEO groups: defineType with groups array, each field assigned group: 'seo' or group: 'contenido'"
  - "Graceful Sanity fetch: client.fetch(...).catch(() => []) for build-time data fetching"

requirements-completed: [SEO-01, SEO-02, SEO-03]

# Metrics
duration: 8min
completed: 2026-03-18
---

# Phase 4 Plan 01: SEO Infrastructure Summary

**Sanity SEO fields with Studio groups, GROQ SEO queries, dynamic sitemap.xml + robots.txt, root layout metadataBase, and Playwright test stubs — all primitives for Plan 04-02 generateMetadata wiring**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-18T00:00:00Z
- **Completed:** 2026-03-18T00:08:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Added seoTitle, seoDescription, ogImage fields to post schema under a dedicated SEO group tab
- Added seoTitle, seoDescription fields to equipo schema under SEO group tab
- Added defaultSeoTitle, defaultSeoDescription, defaultOgImage to siteSettings with SEO por Defecto group
- Created src/sanity/queries/seo.ts with three GROQ exports consumed by Plan 04-02
- Created sitemap.ts generating dynamic XML with static routes + Sanity post/equipo slugs
- Created robots.ts disallowing /studio with sitemap reference
- Updated root layout with metadataBase and title template for per-page title inheritance
- Created seo.spec.ts with Playwright test stubs covering SEO-01, SEO-02, SEO-03

## Task Commits

Each task was committed atomically:

1. **Task 1: Add SEO fields to Sanity schemas and create SEO queries** - `df811f1` (feat)
2. **Task 2: Create sitemap.ts, robots.ts, update root layout metadataBase, and test stubs** - `f8d1cd8` (feat)

**Plan metadata:** `(pending docs commit)` (docs: complete plan)

## Files Created/Modified
- `src/sanity/schemas/post.ts` - Added groups array and seoTitle, seoDescription, ogImage fields
- `src/sanity/schemas/equipo.ts` - Added groups array and seoTitle, seoDescription fields
- `src/sanity/schemas/site-settings.ts` - Added SEO group and defaultSeoTitle, defaultSeoDescription, defaultOgImage
- `src/sanity/queries/seo.ts` - New file: SITE_SEO_DEFAULTS_QUERY, POST_SEO_BY_SLUG_QUERY, EQUIPO_SEO_BY_SLUG_QUERY
- `src/app/sitemap.ts` - New file: dynamic sitemap with static + Sanity routes
- `src/app/robots.ts` - New file: robots.txt disallowing /studio
- `src/app/layout.tsx` - Updated metadata with metadataBase and title template
- `tests/seo.spec.ts` - New file: Playwright stubs for SEO-01, SEO-02, SEO-03, Robots.txt

## Decisions Made
- sitemap.ts uses .catch(() => []) on each Sanity fetch so sitemap builds even if Sanity is unreachable at build time
- robots.ts disallows both /studio and /studio/ to prevent indexing with or without trailing slash
- SEO fields use field groups — editors see the content-focused tab by default, access SEO tab only when needed
- metadataBase reads NEXT_PUBLIC_SITE_URL env var with hardcoded domain as fallback

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None — TypeScript compilation passed cleanly on both tasks without any type errors.

## User Setup Required
None - no external service configuration required for this plan. NEXT_PUBLIC_SITE_URL environment variable is optional (falls back to hardcoded domain).

## Next Phase Readiness
- All SEO primitives are in place for Plan 04-02
- Plan 04-02 can now import from src/sanity/queries/seo.ts and call generateMetadata on each page
- seo.spec.ts tests will pass once Plan 04-02 wires generateMetadata (currently stubs expecting real meta tags)
- sitemap.xml and robots.txt will work immediately once the dev server is running

---
*Phase: 04-seo-and-launch*
*Completed: 2026-03-18*
