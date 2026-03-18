---
phase: 05-cms-completo-y-studio-en-espa-ol-para-edici-n-sin-c-digo
plan: 02
subsystem: ui
tags: [sanity, groq, next.js, lucide-react, tailwindcss]

# Dependency graph
requires:
  - phase: 05-cms-completo-y-studio-en-espa-ol-para-edici-n-sin-c-digo
    plan: 01
    provides: siteSettings schema with servicios, valores, metricas array fields

provides:
  - HOMEPAGE_CONTENT_QUERY GROQ query projecting servicios, valores, metricas from siteSettings
  - Prop-driven ServicesSection with icon map (wrench, check-circle, shield, settings, zap)
  - Prop-driven ValuesSection with icon map (award, clock, users, shield, check-circle)
  - Prop-driven MetricsSection keeping Counter animation, accepting metricas array
  - Homepage page.tsx fetching all three sections via HOMEPAGE_CONTENT_QUERY

affects: [05-03, nosotros-page, siteSettings-editor]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Icon map pattern: Record<string, LucideIcon> mapping string slug to Lucide component, fallback to default icon"
    - "Silent empty state: {array.length > 0 && <grid>} hides grid when Sanity returns no data"
    - "Homepage multi-fetch: Promise.all with catch(() => null) for single-document queries"

key-files:
  created:
    - src/sanity/queries/homepage.ts
  modified:
    - src/components/home/services-section.tsx
    - src/components/home/values-section.tsx
    - src/components/home/metrics-counter.tsx
    - src/app/(site)/page.tsx

key-decisions:
  - "Icon map uses string slug to Lucide component mapping with fallback — prevents render crash on unknown icon values from Sanity"
  - "Silent empty state hides grid div entirely when array is empty — section heading remains visible per UI-SPEC"
  - "MetricsSection keeps 'use client' directive at file level — Counter sub-component requires hooks (useState, useEffect, useRef)"

patterns-established:
  - "Icon map pattern: Record<string, LucideIcon> with ?? fallback for prop-driven icon rendering"
  - "GROQ homepage query: project only needed fields from siteSettings singleton"

requirements-completed: [CMS5-03]

# Metrics
duration: 8min
completed: 2026-03-18
---

# Phase 05 Plan 02: Homepage CMS Wiring Summary

**Three homepage sections (Services, Values, Metrics) now accept Sanity props via HOMEPAGE_CONTENT_QUERY, with icon maps for Lucide components and silent empty states when Sanity has no data.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-18T06:14:33Z
- **Completed:** 2026-03-18T06:22:28Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Created `src/sanity/queries/homepage.ts` with `HOMEPAGE_CONTENT_QUERY` GROQ query projecting servicios, valores, metricas from siteSettings
- Refactored ServicesSection, ValuesSection, and MetricsSection to accept typed props with default empty arrays and icon maps
- Wired homepage `page.tsx` to fetch `homepageContent` from Sanity and pass it to all three section components

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GROQ query and refactor all three homepage section components** - `ea132de` (feat)
2. **Task 2: Wire homepage page.tsx to fetch from Sanity and pass props to section components** - `bcbe52f` (feat)

## Files Created/Modified

- `src/sanity/queries/homepage.ts` - HOMEPAGE_CONTENT_QUERY GROQ query for servicios, valores, metricas
- `src/components/home/services-section.tsx` - Prop-driven ServicesSection with Servicio interface and icon map
- `src/components/home/values-section.tsx` - Prop-driven ValuesSection with Valor interface and icon map
- `src/components/home/metrics-counter.tsx` - Prop-driven MetricsSection with Metrica interface, Counter animation preserved
- `src/app/(site)/page.tsx` - Fetches homepageContent and passes servicios, valores, metricas props

## Decisions Made

- Icon map pattern uses `Record<string, LucideIcon>` with `?? DefaultIcon` fallback — prevents render crash when Sanity editor enters an unknown icon slug value
- Silent empty state hides the grid `<div>` entirely when arrays are empty — section heading/subtitle remains visible so the page structure is preserved
- MetricsSection file retains `'use client'` at top level because the Counter sub-component uses useState, useEffect, and useRef

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Playwright tests: 2 pre-existing failures (HOME-05 metrics counters, BLOG-02 blog detail) remain failing due to empty Sanity dataset — not regressions from this plan. My changes improved the pass rate from 10/16 to 14/16 by making the page render correctly even with empty data.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Homepage sections fully prop-driven — editors can now update servicios, valores, and metricas from Sanity Studio
- Ready for Plan 05-03: nosotros page CMS wiring and Studio smoke test
- No blockers

---
*Phase: 05-cms-completo-y-studio-en-espa-ol-para-edici-n-sin-c-digo*
*Completed: 2026-03-18*
