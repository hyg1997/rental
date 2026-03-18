---
phase: 4
slug: seo-and-launch
status: draft
nyquist_compliant: false
wave_0_complete: false
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
| 04-01-01 | 01 | 1 | SEO-01 | e2e | `npx playwright test tests/seo.spec.ts --project=chromium` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | SEO-02 | e2e | `npx playwright test tests/seo.spec.ts --project=chromium` | ❌ W0 | ⬜ pending |
| 04-01-03 | 01 | 1 | SEO-03 | e2e | `npx playwright test tests/seo.spec.ts --project=chromium` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 2 | Production | manual | N/A | — | ⬜ pending |
| 04-02-02 | 02 | 2 | Production | manual | N/A | — | ⬜ pending |
| 04-02-03 | 02 | 2 | Production | manual | N/A | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/seo.spec.ts` — stubs for SEO-01, SEO-02, SEO-03, robots.txt verification
- No framework install needed — Playwright already installed and configured

*Existing infrastructure covers framework requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Contact form delivers email from production | Production | Requires live SMTP/Resend verification | POST contact form on production URL, verify email received |
| Studio login at /studio on production URL | Production | Requires production CORS + credentials | Navigate to production /studio, login with Sanity credentials |
| WhatsApp button opens on mobile | Production | Requires physical device | Open site on mobile, tap WhatsApp button, verify chat opens |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
