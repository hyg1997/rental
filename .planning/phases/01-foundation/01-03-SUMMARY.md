---
phase: 01-foundation
plan: 03
subsystem: ui
tags: [nextjs, tailwind, shadcn, sanity, responsive, navbar, footer, whatsapp]

# Dependency graph
requires:
  - phase: 01-foundation plan 01
    provides: Next.js scaffold with Tailwind v4 brand theme, shadcn/ui, Sanity client
  - phase: 01-foundation plan 02
    provides: Sanity siteSettings schema, SITE_SETTINGS_QUERY, Studio at /studio
provides:
  - Responsive Navbar with desktop horizontal nav links + CTA and mobile hamburger Sheet drawer
  - Three-column Footer with contact, navigation, and social columns from Sanity siteSettings
  - Fixed floating WhatsApp button (56x56px green circle) linking to wa.me
  - (site) route group server layout composing Navbar, children, Footer, WhatsAppButton
  - All contact data fetched from Sanity siteSettings with safe fallback defaults
affects: [02-equipment-catalog, 03-content-pages, all future (site) pages]

# Tech tracking
tech-stack:
  added: [lucide-react (Menu icon), shadcn Sheet component]
  patterns:
    - "use client boundary on Navbar for shadcn Sheet interactivity; Footer and WhatsAppButton remain server components"
    - "Server layout fetches Sanity siteSettings once and passes data as props to all child components"
    - "Fallback default values in layout prevent crash when Sanity has no siteSettings document"
    - "Route group (site) isolates site layout from Studio at /studio"

key-files:
  created:
    - src/components/layout/navbar.tsx
    - src/components/layout/footer.tsx
    - src/components/whatsapp-button.tsx
  modified:
    - src/app/(site)/layout.tsx
    - src/app/(site)/page.tsx
    - src/app/layout.tsx
    - src/sanity/client.ts

key-decisions:
  - "Navbar marked 'use client' because shadcn Sheet requires client-side interactivity; Footer and WhatsAppButton stay server components"
  - "siteSettings fetch happens in (site)/layout.tsx server component — data passed as props, not fetched per-component"
  - "Fallback navLinks array hard-coded as default in layout so the nav renders without a Sanity document"

patterns-established:
  - "Pattern: Client boundary isolation — only the component requiring interactivity gets 'use client'"
  - "Pattern: Layout-level data fetch — server layout owns data, passes to presentational components via props"
  - "Pattern: Safe fallbacks — ?? operator on all Sanity fields so UI never breaks on empty CMS"

requirements-completed: [UX-01, UX-03]

# Metrics
duration: ~20min (across two sessions including human verification)
completed: 2026-03-17
---

# Phase 1 Plan 03: Base Layout Summary

**Responsive Navbar (hamburger Sheet on mobile), three-column Footer, and fixed WhatsApp button wired into the (site) server layout with all contact data from Sanity siteSettings**

## Performance

- **Duration:** ~20 min (two sessions: execution + human verify)
- **Started:** 2026-03-17
- **Completed:** 2026-03-17
- **Tasks:** 2 (1 auto, 1 checkpoint:human-verify — approved)
- **Files modified:** 7

## Accomplishments

- Navbar renders horizontal nav links + red "Solicitar Cotizacion" CTA on desktop; hamburger icon opens shadcn Sheet drawer from the right on mobile (360px)
- Footer renders in a 3-column grid on desktop (Contact, Navigation, Social) and stacks to a single column on mobile; copyright bar uses `new Date().getFullYear()` for automatic year
- WhatsApp button fixed at bottom-right (`fixed bottom-6 right-6 z-50`), 56x56px green circle linking to `https://wa.me/{whatsappNumber}`
- (site)/layout.tsx is a server component that fetches Sanity siteSettings once and passes data as props — Studio at /studio is unaffected
- Fallback defaults prevent rendering errors when Sanity CMS has no siteSettings document yet

## Task Commits

Each task was committed atomically:

1. **Task 1: Build Navbar, Footer, WhatsApp button, and wire into site layout** - `4371aec` (feat)
2. **Task 2: Verify responsive layout at 360px and desktop** - Human checkpoint approved (no code changes)

**Plan metadata:** _(to be committed with this summary)_

## Files Created/Modified

- `src/components/layout/navbar.tsx` - Responsive Navbar with desktop links, red CTA, and mobile Sheet hamburger; marked 'use client'
- `src/components/layout/footer.tsx` - Three-column footer (contact, navigation, social) reading from siteSettings props; server component
- `src/components/whatsapp-button.tsx` - Fixed floating WhatsApp button with inline SVG icon; server component
- `src/app/(site)/layout.tsx` - Server layout fetching siteSettings and composing Navbar, children, Footer, WhatsAppButton
- `src/app/(site)/page.tsx` - Simplified placeholder page relying on layout for background
- `src/app/layout.tsx` - Added bg-brand-bg to body element
- `src/sanity/client.ts` - Verified client import path used by layout

## Decisions Made

- **Client boundary on Navbar only:** shadcn Sheet requires `'use client'` but Footer and WhatsAppButton have no interactivity — kept them as server components to minimize client bundle size.
- **Layout-level data fetch pattern:** siteSettings is fetched once in (site)/layout.tsx and passed as props rather than fetched inside each component. Avoids waterfall fetches and keeps presentational components pure.
- **Fallback defaults in layout:** The navLinks array is defaulted to the 5 main site sections so the nav renders correctly even before any Sanity document exists.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Build succeeded on first attempt. Human visual verification confirmed desktop and mobile 360px layouts correct.

## User Setup Required

None - no external service configuration required for this plan. (Note: Sanity project ID in .env.local still needed for live data — tracked as existing blocker in STATE.md.)

## Next Phase Readiness

- Phase 1 is now complete. All three plans done: scaffold, schemas, base layout.
- Phase 2 (Equipment Catalog) can begin immediately — (site) layout, Sanity client, and siteSettings query are all ready.
- Remaining blocker: Sanity project ID in `.env.local` needed for live data from Studio.

---
*Phase: 01-foundation*
*Completed: 2026-03-17*
