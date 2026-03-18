---
phase: 01-foundation
plan: 01
subsystem: ui
tags: [nextjs, tailwind, shadcn, sanity, playwright, typescript]

# Dependency graph
requires: []
provides:
  - Next.js 15 App Router project with TypeScript and ESLint
  - Tailwind v4 CSS-first brand palette (brand-bg, brand-surface, brand-red, brand-yellow, brand-text) in OKLCH
  - shadcn/ui initialized with Sheet and Button components
  - Sanity client configured via @sanity/client (not next-sanity main entry)
  - Route group structure: (site) for public pages
  - Inter font loaded via next/font/google, lang="es" set
  - Playwright test infrastructure with chromium + mobile-360 (360x640) projects
  - Smoke test stubs for CMS-02, UX-01, UX-02, UX-03
  - Placeholder homepage at / with dark brand-bg background
affects: [01-02, 01-03, all subsequent phases]

# Tech tracking
tech-stack:
  added:
    - next 16.1.7
    - react 19.2.3
    - typescript 5.x
    - tailwindcss 4.x (CSS-first, no tailwind.config.js)
    - tw-animate-css (replaces tailwindcss-animate)
    - shadcn/ui v4 (Sheet, Button)
    - @sanity/client 7.x
    - next-sanity 12.x
    - groq 5.x
    - @portabletext/react 6.x
    - @sanity/image-url 2.x
    - next-themes 0.4.x
    - lucide-react (bundled with shadcn)
    - @playwright/test 1.58.x
  patterns:
    - Tailwind v4 CSS-first custom theme via @theme inline in globals.css
    - OKLCH color values for perceptually uniform brand palette
    - Route groups for layout separation: (site) for public, studio outside any group
    - @sanity/client directly (not next-sanity main entry) for data fetching
    - Playwright multi-project config: Desktop Chrome + mobile-360

key-files:
  created:
    - src/app/(site)/layout.tsx
    - src/app/(site)/page.tsx
    - src/sanity/client.ts
    - playwright.config.ts
    - tests/smoke.spec.ts
    - components.json
  modified:
    - src/app/globals.css
    - src/app/layout.tsx
    - package.json

key-decisions:
  - "VPS architecture chosen (not static export) — full Next.js with next start, enables API routes, embedded Studio, Server Actions"
  - "OKLCH color palette in CSS-first @theme inline, no tailwind.config.js for theme customization"
  - "Import from @sanity/client directly, not next-sanity main entry, per issue #1899 workaround"
  - "Route group (site) isolates public layout from studio route which will get its own full-viewport layout"

patterns-established:
  - "Pattern: Tailwind v4 custom colors defined as --color-brand-* in @theme inline inside globals.css"
  - "Pattern: Route groups for layout isolation — (site)/layout.tsx for Navbar/Footer, studio/ outside"
  - "Pattern: Sanity client via createClient from @sanity/client with env vars, useCdn in production"
  - "Pattern: Playwright smoke tests with mobile-360 (360x640) viewport for Peruvian mobile coverage"

requirements-completed: [UX-02]

# Metrics
duration: 11min
completed: 2026-03-18
---

# Phase 1 Plan 01: Foundation Scaffold Summary

**Next.js 15 App Router with Tailwind v4 OKLCH brand palette, shadcn/ui Sheet+Button, Sanity client, and Playwright smoke tests covering 360px mobile viewport**

## Performance

- **Duration:** 11 min
- **Started:** 2026-03-18T00:00:54Z
- **Completed:** 2026-03-18T00:12:06Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Scaffolded Next.js 15 project with TypeScript, Tailwind v4, ESLint, and App Router src/ structure
- Configured brand dark theme (near-black bg, red/yellow accents, near-white text) as CSS-first OKLCH variables in globals.css @theme inline
- Installed and initialized shadcn/ui in Tailwind v4 mode, added Sheet (mobile nav drawer) and Button components
- Created Sanity client using @sanity/client directly with environment variable configuration
- Built (site) route group structure with shell layout and Spanish-language placeholder homepage
- Set up Playwright with chromium and mobile-360 (360x640) viewport projects; all smoke test stubs created; homepage test passes green

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js 15 project with Tailwind v4, shadcn/ui, and Sanity client** - `3e469ff` (feat)
2. **Task 2: Set up Playwright test infrastructure with smoke test stubs** - `b55bb3c` (feat)

**Plan metadata:** (docs commit after summary)

## Files Created/Modified

- `src/app/globals.css` - Merged brand OKLCH palette into shadcn @theme inline block; custom dark variant
- `src/app/layout.tsx` - Inter font (400/700), lang="es", project metadata
- `src/app/(site)/layout.tsx` - Site route group shell (Navbar/Footer placeholder comments)
- `src/app/(site)/page.tsx` - Placeholder homepage with bg-brand-bg dark background
- `src/sanity/client.ts` - Sanity createClient with NEXT_PUBLIC_SANITY_PROJECT_ID env var
- `src/components/ui/sheet.tsx` - shadcn Sheet component (mobile nav drawer)
- `src/components/ui/button.tsx` - shadcn Button component (CTA)
- `src/lib/utils.ts` - cn() helper (created by shadcn init)
- `playwright.config.ts` - Playwright config with chromium + mobile-360 projects
- `tests/smoke.spec.ts` - Smoke test stubs for CMS-02, UX-01, UX-02, UX-03
- `package.json` - All dependencies added, test:e2e and test:smoke scripts

## Decisions Made

- **VPS architecture:** Proceeding with full Next.js (not static export) per plan recommendation. If client confirms shared Hostinger hosting, `next.config.ts` needs `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`, and Studio deployed separately via `npx sanity deploy`.
- **Direct @sanity/client import:** Using `createClient` from `@sanity/client` instead of `next-sanity` main entry to avoid issue #1899 (static export breakage from transitive server actions import).
- **CSS-first Tailwind v4 theme:** Brand colors defined as `--color-brand-*` inside `@theme inline` in globals.css — no tailwind.config.js.
- **Inter font only:** Both heading and body use Inter, weights 400 and 700, loaded via next/font/google.

## Deviations from Plan

None - plan executed exactly as written.

The scaffolding blocked on `.planning/` directory conflict with create-next-app, so the project was created in `/tmp/testing-calibrations` and rsync'd to the project root — this matches the plan's documented fallback ("run in a temp dir and move files").

## Issues Encountered

- `create-next-app` refused to scaffold in the project directory because `.planning/` was present. Resolved per plan instructions: scaffolded in `/tmp/testing-calibrations` and used `rsync` to copy files to project root, excluding the temp `.git` directory.

## User Setup Required

**Before Plan 02 (Sanity Studio):** Update `.env.local` with a real Sanity project ID:
1. Create a Sanity project at https://sanity.io/manage
2. Replace `your_project_id_here` in `.env.local` with the actual project ID
3. Add `localhost:3000` to the CORS origins in the Sanity project settings with "Allow Credentials" enabled

## Next Phase Readiness

- Next.js project builds and type-checks cleanly (`npx tsc --noEmit` passes)
- Tailwind v4 brand colors are available as `bg-brand-bg`, `text-brand-red`, etc.
- shadcn/ui Sheet and Button ready for Plan 01-03 Navbar
- Sanity client ready for Plan 01-02 Studio embedding and schema creation
- Playwright smoke tests running; homepage test green; studio/hamburger tests will pass after Plans 02-03

---
*Phase: 01-foundation*
*Completed: 2026-03-18*

## Self-Check: PASSED

All key files verified present. Both task commits (3e469ff, b55bb3c) confirmed in git log.
