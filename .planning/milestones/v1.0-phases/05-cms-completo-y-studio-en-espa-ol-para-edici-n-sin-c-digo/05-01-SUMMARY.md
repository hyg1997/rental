---
phase: 05-cms-completo-y-studio-en-espa-ol-para-edici-n-sin-c-digo
plan: 01
subsystem: cms
tags: [sanity, schema, fieldGroups, locale, structure-builder, site-settings]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: siteSettings singleton schema, @sanity/client pattern, sanity.config.ts base config
  - phase: 02-equipment-catalog
    provides: equipo schema registered in schemaTypes
  - phase: 03-content-pages-and-contact
    provides: post, pagina, banner, reclamo schemas registered
provides:
  - siteSettings extended with 5 fieldGroups (general, homepage, nosotros, contacto, navegacion)
  - servicios, valores, metricas content arrays in siteSettings (homepage tab)
  - nosotrosHistoria, nosotrosMision, nosotrosVision, nosotrosValores fields in siteSettings (nosotros tab)
  - Custom Structure Builder sidebar with Spanish labels and singleton edit pane for siteSettings
  - Studio UI chrome in Spanish via @sanity/locale-es-es plugin
affects: [05-02-PLAN, 05-03-PLAN, homepage components, nosotros page]

# Tech tracking
tech-stack:
  added: ["@sanity/locale-es-es@1.2.32"]
  patterns:
    - "fieldGroups on siteSettings document type for tab-based Studio UI"
    - "defineArrayMember for inline array member objects (not defineField with name)"
    - "options.list for constrained icon selection (no free-text)"
    - "StructureResolver with S.listItem().documentId() for singleton edit pane"
    - "esESLocale() in plugins array translates all Studio chrome to Spanish"

key-files:
  created:
    - src/sanity/structure.ts
  modified:
    - src/sanity/schemas/site-settings.ts
    - src/sanity/sanity.config.ts
    - package.json

key-decisions:
  - "All homepage and nosotros content fields added to siteSettings singleton (not separate documents) — keeps all config in one place, easier for non-technical editors"
  - "Icon fields constrained via options.list to prevent typo-driven rendering failures"
  - "Structure Builder renders siteSettings as singleton edit pane (S.document().documentId('siteSettings')) — prevents client from creating duplicate documents"

patterns-established:
  - "Pattern: fieldGroups on document schemas — add groups array to defineType, assign group property to each defineField"
  - "Pattern: Singleton Structure Builder — S.listItem().id(docType).child(S.document().schemaType(docType).documentId(docType))"

requirements-completed: [CMS5-01, CMS5-02]

# Metrics
duration: 2min
completed: 2026-03-18
---

# Phase 05 Plan 01: CMS Schema Extension and Studio Espanol Summary

**siteSettings extended to 5 fieldGroups with servicios/valores/metricas/nosotros content arrays, Studio chrome translated to Spanish via esESLocale plugin, and custom Structure Builder sidebar with Spanish labels and singleton edit pane**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-18T06:10:29Z
- **Completed:** 2026-03-18T06:12:26Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Extended siteSettings schema with 5 fieldGroups, 3 homepage content arrays (servicios, valores, metricas), and 4 nosotros fields — all homepage and nosotros content is now CMS-editable
- All icon fields constrained to options.list with Spanish display titles — prevents typos breaking the UI
- Studio UI chrome fully translated to Spanish via @sanity/locale-es-es plugin
- Custom Structure Builder sidebar organizes content by section with Spanish labels; siteSettings renders as singleton (no create/delete)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install locale plugin and extend siteSettings schema** - `8e7e9a7` (feat)
2. **Task 2: Create Structure Builder and update sanity.config.ts** - `fcfcfc7` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/sanity/schemas/site-settings.ts` - Extended with fieldGroups, servicios/valores/metricas arrays, nosotros fields, Spanish descriptions, constrained icon lists
- `src/sanity/structure.ts` - NEW: custom Structure Builder resolver with Spanish labels and singleton siteSettings pattern
- `src/sanity/sanity.config.ts` - Added esESLocale() plugin and structureTool({ structure: myStructure })
- `package.json` - Added @sanity/locale-es-es@1.2.32 dependency

## Decisions Made
- All content arrays (servicios, valores, metricas, nosotros*) added to siteSettings singleton rather than creating separate document types — consistent with project pattern and simpler for the non-technical client
- Icons constrained to options.list (not free-text) — prevents silent rendering failures from typos (documented anti-pattern in RESEARCH.md)
- Structure Builder singleton pattern uses `.documentId('siteSettings')` so Studio opens the existing document directly, not a new empty one

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- siteSettings schema is ready for Plans 02 and 03 to connect homepage components and nosotros page to Sanity data
- Studio sidebar and Spanish locale are functional immediately on next `npm run dev`
- Real Sanity project ID still required in `.env.local` before content can be saved from Studio (pre-existing blocker)

---
*Phase: 05-cms-completo-y-studio-en-espa-ol-para-edici-n-sin-c-digo*
*Completed: 2026-03-18*
