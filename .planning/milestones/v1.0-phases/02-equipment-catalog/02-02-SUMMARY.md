---
phase: 02-equipment-catalog
plan: 02
subsystem: ui
tags: [nextjs, react, sanity, shadcn, tailwind, lucide-react]

# Dependency graph
requires:
  - phase: 02-equipment-catalog-01
    provides: EQUIPOS_LIST_QUERY in src/sanity/queries/equipos.ts, urlFor in src/lib/image-url.ts, Sanity client, Badge and Input shadcn components

provides:
  - EquipmentCard presentational component (server-safe) with image, estado badge, detail link
  - EquipmentGrid client component with filter tabs and search input
  - /equipos page (server component) fetching and displaying equipment catalog

affects: [02-equipment-catalog-03, detail-page, catalog-browsing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server component fetches data and passes to client component for interactivity
    - useMemo client-side filtering avoids network round-trips for filter/search
    - catch(() => []) graceful degradation when Sanity not configured

key-files:
  created:
    - src/components/equipos/equipment-card.tsx
    - src/components/equipos/equipment-grid.tsx
    - src/app/(site)/equipos/page.tsx
  modified: []

key-decisions:
  - "EquipmentGrid accepts imagenPrincipal as unknown and casts to SanityImageSource at the EquipmentCard call site — keeps EquipoListItem generic and avoids importing Sanity types in the grid"

patterns-established:
  - "Server page fetches data + passes to 'use client' grid component — standard Next.js data/interaction split"
  - "useMemo with searchQuery.toLowerCase() computed once outside filter — avoids per-item toLowerCase calls"

requirements-completed: [EQUIP-01, EQUIP-02]

# Metrics
duration: 2min
completed: 2026-03-18
---

# Phase 02 Plan 02: Equipment Catalog List Page Summary

**Filterable /equipos list page with client-side filter tabs (Todos/Calibracion/En Venta), real-time name/brand search, responsive 3-column card grid, and empty state handling**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-18T02:17:17Z
- **Completed:** 2026-03-18T02:19:40Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- EquipmentCard: image (or Package icon placeholder), name, marca/modelo, estado badge (3 states), "Ver detalles" link
- EquipmentGrid: three filter buttons with 44px touch targets, search input with lucide Search icon, useMemo filtering, empty state with animate-in fade-in-0
- /equipos page: async server component fetching EQUIPOS_LIST_QUERY with graceful catch(() => []) fallback

## Task Commits

Each task was committed atomically:

1. **Task 1: Create EquipmentCard presentational component** - `dcde1d3` (feat)
2. **Task 2: Create EquipmentGrid client component and /equipos server page** - `7b3685b` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `src/components/equipos/equipment-card.tsx` - Server-safe card with image/placeholder, estado badge, detail link
- `src/components/equipos/equipment-grid.tsx` - Client component with filter tabs, search, grid, empty state
- `src/app/(site)/equipos/page.tsx` - Server page component fetching EQUIPOS_LIST_QUERY

## Decisions Made
- `imagenPrincipal` typed as `unknown` in EquipoListItem (grid interface) and cast to `SanityImageSource | null | undefined` at the EquipmentCard call site — avoids forcing Sanity types into the generic list interface while maintaining TypeScript correctness.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript error: unknown not assignable to SanityImageSource**
- **Found during:** Task 2 (EquipmentGrid creation)
- **Issue:** `imagenPrincipal?: unknown` in EquipoListItem was not assignable to `SanityImageSource | null | undefined` in EquipmentCard props — TypeScript error TS2322
- **Fix:** Added `import type { SanityImageSource } from '@sanity/image-url'` in equipment-grid.tsx and cast `equipo.imagenPrincipal as SanityImageSource | null | undefined` at the call site
- **Files modified:** src/components/equipos/equipment-grid.tsx
- **Verification:** `npx tsc --noEmit` exits 0
- **Committed in:** 7b3685b (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Type cast required for TypeScript correctness. No scope creep.

## Issues Encountered
None beyond the TypeScript type mismatch (auto-fixed above).

## Next Phase Readiness
- /equipos list page fully functional — ready for detail page (02-03) implementation
- Filter tabs and search work client-side against whatever data Sanity returns
- Image placeholder renders correctly when no images are present (client has no photos yet)

---
*Phase: 02-equipment-catalog*
*Completed: 2026-03-18*

## Self-Check: PASSED
- FOUND: src/components/equipos/equipment-card.tsx
- FOUND: src/components/equipos/equipment-grid.tsx
- FOUND: src/app/(site)/equipos/page.tsx
- FOUND: .planning/phases/02-equipment-catalog/02-02-SUMMARY.md
- FOUND commit: dcde1d3 (Task 1)
- FOUND commit: 7b3685b (Task 2)
