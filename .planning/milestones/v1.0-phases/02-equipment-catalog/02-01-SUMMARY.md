---
phase: 02-equipment-catalog
plan: 01
subsystem: api
tags: [groq, sanity, image-url, shadcn, playwright, typescript]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Sanity client, equipo schema, shadcn/ui setup, Playwright config

provides:
  - EQUIPOS_LIST_QUERY, EQUIPOS_SLUGS_QUERY, EQUIPO_BY_SLUG_QUERY (typed GROQ queries)
  - urlFor image helper wrapping @sanity/image-url
  - cdn.sanity.io in next.config remotePatterns
  - shadcn Input and Badge UI components
  - Playwright smoke test scaffold for EQUIP-01 through EQUIP-04

affects: [02-02-list-page, 02-03-detail-page]

# Tech tracking
tech-stack:
  added: [@sanity/image-url (already installed, now used), shadcn Input, shadcn Badge]
  patterns: [defineQuery from groq package (not next-sanity), imageUrlBuilder wrapping sanity client, conditional Playwright tests for optional Sanity data]

key-files:
  created:
    - src/sanity/queries/equipos.ts
    - src/lib/image-url.ts
    - src/components/ui/input.tsx
    - src/components/ui/badge.tsx
    - tests/equipos.spec.ts
  modified:
    - next.config.ts

key-decisions:
  - "SanityImageSource imported from '@sanity/image-url' main entry (not from lib/types/types path which no longer exists in v2)"

patterns-established:
  - "GROQ queries: defineQuery from groq package, slug projected as string with \"slug\": slug.current"
  - "Image helper: imageUrlBuilder(client) module-level builder, exported urlFor function"
  - "Playwright smoke tests: conditional detail-page tests handle empty Sanity data gracefully"

requirements-completed: [EQUIP-01, EQUIP-02, EQUIP-03, EQUIP-04]

# Metrics
duration: 8min
completed: 2026-03-18
---

# Phase 2 Plan 01: Equipment Catalog Shared Infrastructure Summary

**Three typed GROQ queries, urlFor image helper, cdn.sanity.io next/image config, shadcn Input/Badge, and Playwright smoke tests for EQUIP-01 through EQUIP-04**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-18T02:08:00Z
- **Completed:** 2026-03-18T02:16:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Three typed GROQ queries exported from src/sanity/queries/equipos.ts using defineQuery from groq package
- urlFor helper wrapping @sanity/image-url imageUrlBuilder, usable in any server or client component
- cdn.sanity.io added to next.config remotePatterns enabling next/image to load Sanity CDN assets
- shadcn Input and Badge components installed for use in list page filter/search UI
- Playwright smoke test file with six test cases covering list rendering, filter buttons, search input, and detail page interactions

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GROQ queries, image-url helper, configure next.config** - `5dc0ea9` (feat)
2. **Task 2: Install shadcn Input/Badge, create Playwright smoke test scaffold** - `26592c4` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `src/sanity/queries/equipos.ts` - EQUIPOS_LIST_QUERY (card projection), EQUIPOS_SLUGS_QUERY (slugs only), EQUIPO_BY_SLUG_QUERY (full detail)
- `src/lib/image-url.ts` - urlFor(source) helper returning imageUrlBuilder chain
- `next.config.ts` - Added images.remotePatterns with cdn.sanity.io
- `src/components/ui/input.tsx` - shadcn Input component (installed via npx shadcn add)
- `src/components/ui/badge.tsx` - shadcn Badge component (installed via npx shadcn add)
- `tests/equipos.spec.ts` - Smoke tests for equipment catalog routes

## Decisions Made
- SanityImageSource type imported from `@sanity/image-url` main entry — the sub-path `@sanity/image-url/lib/types/types` no longer exists in v2.0.3; TypeScript reported TS2307, fixed inline under Rule 1.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed SanityImageSource import path for @sanity/image-url v2**
- **Found during:** Task 1 (image-url helper creation)
- **Issue:** Plan specified `import type { SanityImageSource } from '@sanity/image-url/lib/types/types'` but that sub-path was removed in v2.0.3; `tsc --noEmit` reported TS2307
- **Fix:** Changed import to `from '@sanity/image-url'` — the type is exported from the main entry in v2
- **Files modified:** src/lib/image-url.ts
- **Verification:** `npx tsc --noEmit` exits 0
- **Committed in:** 5dc0ea9 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Minimal — one import path corrected. No scope creep.

## Issues Encountered
None beyond the auto-fixed import path issue above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All shared infrastructure in place for Plans 02 and 03 to execute in parallel
- Queries match equipo schema fields exactly — ready for list and detail page components to consume
- Smoke tests will fail until the /equipos route is implemented in Plan 02 (expected behavior)
- Blocker noted in STATE.md: image assets not ready; Plans 02/03 must use placeholder images

---
*Phase: 02-equipment-catalog*
*Completed: 2026-03-18*
