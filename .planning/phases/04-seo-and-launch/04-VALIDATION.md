---
phase: 4
slug: seo-and-launch
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-18
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.58.2 |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `npx playwright test tests/seo.spec.ts --project=chromium` |
| **Full suite command** | `npx playwright test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test tests/seo.spec.ts --project=chromium`
- **After every plan wave:** Run `npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | SEO-01 | e2e | `npx playwright test tests/seo.spec.ts --project=chromium` | Created in 04-01 Task 2 | pending |
| 04-01-02 | 01 | 1 | SEO-02, SEO-03 | e2e | `npx playwright test tests/seo.spec.ts --project=chromium` | Created in 04-01 Task 2 | pending |
| 04-02-01 | 02 | 2 | SEO-01, SEO-02 | e2e | `npx playwright test tests/seo.spec.ts --project=chromium` | Created in 04-01 Task 2 | pending |
| 04-02-02 | 02 | 2 | SEO-01, SEO-02 | e2e | `npx playwright test tests/seo.spec.ts --project=chromium` | Created in 04-01 Task 2 | pending |
| 04-03-01 | 03 | 2 | Production | automated | `grep "RESEND_FROM_EMAIL" src/app/api/contact/route.ts src/app/api/reclamo/route.ts` | N/A | pending |
| 04-03-02 | 03 | 2 | Production | manual | N/A — requires live production verification | N/A | pending |

*Status: pending / green / red / flaky*

---

## Test Stub Creation

Test stubs for `tests/seo.spec.ts` are created in **Plan 04-01, Task 2** (Wave 1). This is not a separate Wave 0 step — the test file is created alongside the SEO infrastructure (sitemap, robots, root layout metadataBase) in the same task. This satisfies the Nyquist requirement because the test file exists before Plan 04-02 (Wave 2) runs its tests against it.

- [x] `tests/seo.spec.ts` — created in Plan 04-01 Task 2, covers SEO-01, SEO-02, SEO-03, robots.txt
- No framework install needed — Playwright already installed and configured

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Contact form delivers email from production | Production | Requires live SMTP/Resend verification with verified sender domain | POST contact form on production URL, verify email received (not in spam) |
| Reclamo form delivers email from production | Production | Same as above | POST reclamo form on production URL, verify email received |
| Studio login at /studio on production URL | Production | Requires production CORS + credentials configured in manage.sanity.io | Navigate to production /studio, login with Sanity credentials |
| WhatsApp button opens on mobile | Production | Requires physical device | Open site on mobile, tap WhatsApp button, verify chat opens |
| Env vars present on VPS | Production | Requires server access | `printenv \| grep -E "NEXT_PUBLIC_SANITY\|RESEND\|SANITY_WRITE"` on VPS |

These manual verifications are covered by **Plan 04-03, Task 2** (checkpoint:human-verify).

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or are covered by checkpoint:human-verify
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Test stubs created in Plan 04-01 Task 2 (Wave 1), available for Wave 2 plans
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
