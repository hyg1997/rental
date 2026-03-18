---
phase: 01-foundation
plan: 02
subsystem: cms
tags: [sanity, groq, next-sanity, typescript, sanity-studio, typegen]

# Dependency graph
requires:
  - phase: 01-foundation plan 01
    provides: Next.js 15 scaffold with Sanity client, @sanity/client installed, project structure

provides:
  - 6 Sanity document type schemas (equipo, post, banner, pagina, siteSettings, reclamo)
  - Sanity Studio embedded at /studio, outside (site) route group
  - SITE_SETTINGS_QUERY GROQ query ready for Navbar/Footer data fetching
  - TypeGen scripts in package.json
  - sanity.cli.ts for CLI operations

affects:
  - 01-03 (Navbar/Footer use siteSettings query)
  - Phase 2 (equipo catalog queries)
  - Phase 3 (blog/post queries)
  - Phase 4 (reclamo form submission)

# Tech tracking
tech-stack:
  added:
    - "@sanity/vision: visionTool plugin for GROQ query explorer in Studio"
  patterns:
    - "Sanity schemas use defineType/defineField for all content types"
    - "siteSettings singleton via Object.assign with __experimental_actions (TypeScript-safe)"
    - "GROQ queries use defineQuery from groq package (not next-sanity) to avoid issue #1899"
    - "Embedded Studio at app/studio/[[...tool]]/ outside (site) route group prevents layout conflicts"
    - "Studio page is force-dynamic client component using NextStudio from next-sanity/studio"

key-files:
  created:
    - src/sanity/schemas/equipo.ts
    - src/sanity/schemas/post.ts
    - src/sanity/schemas/banner.ts
    - src/sanity/schemas/pagina.ts
    - src/sanity/schemas/site-settings.ts
    - src/sanity/schemas/reclamo.ts
    - src/sanity/schemas/index.ts
    - src/sanity/sanity.config.ts
    - src/sanity/queries/site-settings.ts
    - src/app/studio/[[...tool]]/page.tsx
    - sanity.cli.ts
  modified:
    - package.json (typegen scripts added, @sanity/vision dependency)

key-decisions:
  - "__experimental_actions singleton pattern uses Object.assign post-defineType to avoid TypeScript TS2353 error — runtime behavior correct, type system satisfied"
  - "GROQ defineQuery imported from groq package (not next-sanity) per issue #1899 guidance already established in plan 01"
  - "@sanity/vision installed as direct dependency for visionTool plugin in sanity.config.ts (was missing from initial scaffold)"

patterns-established:
  - "All GROQ queries live in src/sanity/queries/*.ts and use defineQuery from groq"
  - "Sanity schemas export named constants matching the schema name (equipo, post, siteSettings, etc.)"
  - "schemaTypes array in schemas/index.ts is the single source of truth for all schemas"

requirements-completed: [CMS-01, CMS-02, CMS-03]

# Metrics
duration: 2min
completed: 2026-03-18
---

# Phase 1 Plan 02: Sanity CMS Schemas and Studio Configuration Summary

**6 Sanity document type schemas defined with defineType, Studio embedded at /studio via NextStudio with route group separation, and SITE_SETTINGS_QUERY ready for Navbar/Footer fetching**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-18T00:16:03Z
- **Completed:** 2026-03-18T00:18:04Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments
- All 6 Sanity content schemas created: equipo (calibration equipment), post (blog), banner (hero), pagina (page), siteSettings (global config singleton), reclamo (libro de reclamaciones)
- Sanity Studio embedded at /studio using next-sanity/studio NextStudio, outside (site) route group — no layout conflicts
- SITE_SETTINGS_QUERY defined with defineQuery from groq package, ready for Plan 03 Navbar/Footer
- TypeGen scripts (typegen:extract, typegen:generate, typegen) added to package.json
- npm run build passes — Studio route correctly shows as dynamic, public site as static

## Task Commits

Each task was committed atomically:

1. **Task 1: Create all 6 Sanity schemas and schema index** - `d6caa85` (feat)
2. **Task 2: Configure Sanity Studio at /studio, sanity.config, CLI, and siteSettings query** - `848440b` (feat)

**Plan metadata:** (docs commit — follows)

## Files Created/Modified
- `src/sanity/schemas/equipo.ts` - Equipment document type with 11 fields including tipo (calibracion/venta), imagenes, destacado
- `src/sanity/schemas/post.ts` - Blog post document type with Portable Text contenido
- `src/sanity/schemas/banner.ts` - Hero banner document type with ctaTexto, ctaUrl
- `src/sanity/schemas/pagina.ts` - Generic page document type with Portable Text contenido
- `src/sanity/schemas/site-settings.ts` - Singleton siteSettings with all contact fields, navLinks, socialLinks, __experimental_actions
- `src/sanity/schemas/reclamo.ts` - Libro de reclamaciones with tipoReclamo (queja/reclamo), estado workflow
- `src/sanity/schemas/index.ts` - schemaTypes array exporting all 6 types
- `src/sanity/sanity.config.ts` - defineConfig with structureTool + visionTool, basePath /studio
- `src/sanity/queries/site-settings.ts` - SITE_SETTINGS_QUERY using defineQuery from groq
- `src/app/studio/[[...tool]]/page.tsx` - NextStudio embedded page, force-dynamic, outside (site) route group
- `sanity.cli.ts` - CLI configuration with projectId/dataset from env vars
- `package.json` - Added typegen scripts; @sanity/vision installed as dependency

## Decisions Made
- **siteSettings __experimental_actions TypeScript workaround:** `defineType` rejects `__experimental_actions` in its type signature (TS2353). Fixed by using `Object.assign(siteSettingsBase, { __experimental_actions: ['update', 'publish'] })` after the defineType call — TypeScript-safe, runtime behavior correct, singleton UI enforced in Studio.
- **@sanity/vision installed:** Was not in initial scaffold from Plan 01, required for visionTool in sanity.config.ts. Added as dependency (Rule 3 — blocking).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed site-settings.ts __experimental_actions TypeScript rejection**
- **Found during:** Task 1 (schema creation) / Task 2 verification (tsc --noEmit)
- **Issue:** `defineType` TypeScript types do not include `__experimental_actions`, causing TS2353 error
- **Fix:** First attempt used spread `...(({__experimental_actions: [...]}) as any)` which broke the inferred return type of defineType, causing a secondary TS2322 error in schemaTypes. Final fix uses `Object.assign(siteSettingsBase, {...})` post-definition, preserving the defineType return type while adding the runtime property
- **Files modified:** `src/sanity/schemas/site-settings.ts`
- **Verification:** `npx tsc --noEmit` passes with no errors
- **Committed in:** `848440b` (Task 2 commit, includes updated site-settings.ts)

**2. [Rule 3 - Blocking] Installed missing @sanity/vision dependency**
- **Found during:** Task 2 (tsc --noEmit after creating sanity.config.ts)
- **Issue:** `Cannot find module '@sanity/vision'` — package not installed from Plan 01 scaffold
- **Fix:** `npm install @sanity/vision`
- **Files modified:** `package.json`, `package-lock.json`
- **Verification:** TypeScript resolves the import, tsc --noEmit passes
- **Committed in:** `848440b` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug fix, 1 blocking dependency)
**Impact on plan:** Both fixes necessary for TypeScript correctness and Studio functionality. No scope creep.

## Issues Encountered
- None beyond the auto-fixed deviations above.

## User Setup Required
None — Sanity project ID was already noted as blocker in STATE.md. The `.env.local` file must have `NEXT_PUBLIC_SANITY_PROJECT_ID` set before the Studio can connect to a real Sanity project. This is a pre-existing known blocker, not introduced by this plan.

## Next Phase Readiness
- All 6 schemas are defined and TypeScript compiles cleanly
- Studio route is ready at /studio once `NEXT_PUBLIC_SANITY_PROJECT_ID` is configured in .env.local
- `SITE_SETTINGS_QUERY` is ready for Plan 03 to use in Navbar/Footer server components
- TypeGen workflow is documented — run `npm run typegen` after schema/query changes

---
*Phase: 01-foundation*
*Completed: 2026-03-18*
