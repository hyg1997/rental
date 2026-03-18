---
phase: 04-seo-and-launch
plan: 03
subsystem: api
tags: [resend, email, env-vars, production-hardening]

# Dependency graph
requires:
  - phase: 04-01
    provides: SEO metadata routes and sitemap that set the production foundation
provides:
  - Contact and reclamo API routes with configurable RESEND_FROM_EMAIL sender
  - Production email delivery from verified domain via env var (sandbox fallback for dev)
affects: [production-deployment, email-delivery]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev' — env var with sandbox fallback for Resend from address"

key-files:
  created: []
  modified:
    - src/app/api/contact/route.ts
    - src/app/api/reclamo/route.ts

key-decisions:
  - "RESEND_FROM_EMAIL env var with onboarding@resend.dev as fallback — allows verified domain in production, sandbox in development without code changes"

patterns-established:
  - "Env var pattern with sandbox fallback: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'"

requirements-completed: [SEO-01, SEO-02, SEO-03]

# Metrics
duration: 1min
completed: 2026-03-18
---

# Phase 4 Plan 03: Production Hardening Summary

**Resend from address made configurable via RESEND_FROM_EMAIL env var with onboarding@resend.dev fallback, enabling verified domain email delivery in production without code changes**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-03-18T07:43:51Z
- **Completed:** 2026-03-18T07:44:25Z
- **Tasks:** 2 of 2 (Task 1 automated; Task 2 checkpoint approved — production verification deferred until VPS ready)
- **Files modified:** 2

## Accomplishments

- Replaced hardcoded `onboarding@resend.dev` in contact/route.ts with `process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'`
- Replaced hardcoded `onboarding@resend.dev` in reclamo/route.ts with same pattern
- Removed TODO comments from both API routes — now resolved by env var approach
- TypeScript check passes clean (`npx tsc --noEmit`)

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace hardcoded Resend from address with RESEND_FROM_EMAIL env var** - `69480f0` (feat)
2. **Task 2: Production services verification checklist** - approved by user; production verification deferred until VPS is available (no code changes)

**Plan metadata:** `69bb983` (docs: complete production-hardening plan)

## Files Created/Modified

- `src/app/api/contact/route.ts` — from address now reads RESEND_FROM_EMAIL env var with sandbox fallback
- `src/app/api/reclamo/route.ts` — same pattern applied to reclamo notification email

## Decisions Made

- RESEND_FROM_EMAIL env var with `onboarding@resend.dev` as fallback: allows verified domain sender in production while keeping Resend sandbox working in development without any env var configuration required locally.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

External services require manual configuration before production email delivery will work:

1. **Resend Dashboard — Domain verification:**
   - Add `testingcalibrations.com.pe` at Resend Dashboard -> Domains -> Add Domain
   - Add SPF and DKIM DNS records provided by Resend
   - Wait for domain verification to complete

2. **Sanity CORS — Production URL:**
   - Go to manage.sanity.io -> Project -> Settings -> API -> CORS Origins
   - Add `https://testingcalibrations.com.pe` with "Allow credentials" checked

3. **Production VPS — Env vars required:**
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SITE_URL`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` (e.g., `Testing Calibrations <noreply@testingcalibrations.com.pe>`)
   - `SANITY_WRITE_TOKEN`

4. **After env var setup:** Rebuild and restart app (`npm run build && npm start`)

## Next Phase Readiness

- Code changes complete: both API routes are production-ready once env vars are configured
- Phase 4 is complete — all plans executed
- Production verification (Task 2) is approved and deferred until VPS is available. When VPS is ready, verify:
  1. Email delivery from verified domain (contact form at /contacto)
  2. Reclamo email delivery (/libro-de-reclamaciones)
  3. Sanity Studio login at /studio on production URL
  4. WhatsApp floating button on real mobile device
  5. Env var audit on VPS (`printenv | grep -E "NEXT_PUBLIC_SANITY|RESEND|SANITY_WRITE"`)

---
*Phase: 04-seo-and-launch*
*Completed: 2026-03-18*
