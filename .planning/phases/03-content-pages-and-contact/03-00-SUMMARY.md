---
phase: 03-content-pages-and-contact
plan: 00
subsystem: testing
tags: [playwright, e2e, smoke-tests, typescript]

# Dependency graph
requires:
  - phase: 02-equipment-catalog
    provides: playwright.config.ts and existing test patterns (smoke.spec.ts, equipos.spec.ts)
provides:
  - tests/content.spec.ts with 16 smoke test stubs covering HOME, INST, CONT, BLOG requirements
  - Nyquist compliance — every Phase 3 requirement has an automated test stub before implementation begins
affects: [03-01, 03-02, 03-03, 03-04]

# Tech tracking
tech-stack:
  added: []
  patterns: [Playwright describe-block grouping by requirement category, conditional test assertions for content-dependent pages]

key-files:
  created:
    - tests/content.spec.ts
  modified: []

key-decisions:
  - "Test names match VALIDATION.md grep patterns exactly for per-task verification commands"
  - "Blog and equipment detail tests use conditional assertions (isVisible check) to handle empty Sanity content gracefully"

patterns-established:
  - "Wave 0 test stubs: create stub tests before any implementation so verification commands are always runnable"
  - "Conditional assertions pattern: check isVisible() before clicking dynamic links to handle empty Sanity datasets"

requirements-completed:
  - HOME-01
  - HOME-02
  - HOME-03
  - HOME-04
  - HOME-05
  - HOME-06
  - INST-01
  - INST-02
  - CONT-01
  - CONT-02
  - CONT-03
  - CONT-04
  - CONT-05
  - BLOG-01
  - BLOG-02
  - BLOG-03

# Metrics
duration: 3min
completed: 2026-03-18
---

# Phase 03 Plan 00: Wave 0 Playwright Test Stubs Summary

**16 Playwright smoke test stubs in tests/content.spec.ts covering all HOME, INST, CONT, and BLOG Phase 3 requirements, organized by requirement group with grep-matching test names**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-18T03:06:01Z
- **Completed:** 2026-03-18T03:09:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Created tests/content.spec.ts with 16 test stubs organized in 4 describe blocks (Homepage, Institutional, Contact, Blog)
- Test names match all VALIDATION.md `-g` grep patterns for per-task CI verification
- Playwright lists all 16 tests without configuration errors — Nyquist compliance achieved for Phase 3

## Task Commits

Each task was committed atomically:

1. **Task 1: Create tests/content.spec.ts with 16 smoke test stubs** - `0e84638` (feat)

**Plan metadata:** (docs: complete plan — added below)

## Files Created/Modified
- `tests/content.spec.ts` - 16 Playwright E2E smoke test stubs for all Phase 3 requirements (HOME-01 to HOME-06, INST-01 to INST-02, CONT-01 to CONT-05, BLOG-01 to BLOG-03)

## Decisions Made
- Test names chosen to match VALIDATION.md `-g` grep patterns exactly (e.g., "hero banner", "services section", "valores section", etc.)
- Blog detail test uses conditional `isVisible()` check before clicking post links to handle empty Sanity datasets without flakiness

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Wave 0 complete — tests/content.spec.ts exists and Playwright can list all 16 tests without errors
- Wave 1 plans (03-01, 03-02, 03-04) can now reference tests/content.spec.ts in their verify commands
- Wave 2 plans (03-03) can also reference the CONT test stubs
- VALIDATION.md Wave 0 requirements met: tests/content.spec.ts created

---
*Phase: 03-content-pages-and-contact*
*Completed: 2026-03-18*
