---
phase: 3
slug: content-pages-and-contact
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (E2E smoke) — already installed and configured |
| **Config file** | `playwright.config.ts` — exists at project root |
| **Quick run command** | `npx playwright test tests/content.spec.ts --project=chromium` |
| **Full suite command** | `npx playwright test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit` (~10s type check)
- **After every plan wave:** Run `npx playwright test tests/content.spec.ts --project=chromium`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | HOME-01 | smoke | `npx playwright test tests/content.spec.ts -g "hero banner" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | HOME-02 | smoke | `npx playwright test tests/content.spec.ts -g "services section" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-01-03 | 01 | 1 | HOME-03 | smoke | `npx playwright test tests/content.spec.ts -g "valores section" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-01-04 | 01 | 1 | HOME-04 | smoke | `npx playwright test tests/content.spec.ts -g "featured equipment" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-01-05 | 01 | 1 | HOME-05 | smoke | `npx playwright test tests/content.spec.ts -g "metrics" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-01-06 | 01 | 1 | HOME-06 | smoke | `npx playwright test tests/content.spec.ts -g "reclamaciones link" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 1 | INST-01 | smoke | `npx playwright test tests/content.spec.ts -g "nosotros page" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 1 | INST-02 | smoke | `npx playwright test tests/content.spec.ts -g "footer content" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 2 | CONT-01 | smoke | `npx playwright test tests/content.spec.ts -g "contact form" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-03-02 | 03 | 2 | CONT-02 | smoke | `npx playwright test tests/content.spec.ts -g "whatsapp button" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-03-03 | 03 | 2 | CONT-03 | smoke | `npx playwright test tests/content.spec.ts -g "contacto page info" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-03-04 | 03 | 2 | CONT-04 | smoke | `npx playwright test tests/content.spec.ts -g "reclamo form fields" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-03-05 | 03 | 2 | CONT-05 | smoke | `npx playwright test tests/content.spec.ts -g "reclamo submit" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-04-01 | 04 | 1 | BLOG-01 | smoke | `npx playwright test tests/content.spec.ts -g "blog list" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-04-02 | 04 | 1 | BLOG-02 | smoke | `npx playwright test tests/content.spec.ts -g "blog detail" --project=chromium` | ❌ W0 | ⬜ pending |
| 03-04-03 | 04 | 1 | BLOG-03 | smoke | `npx playwright test tests/content.spec.ts -g "blog metadata" --project=chromium` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/content.spec.ts` — stubs for all HOME, INST, CONT, and BLOG requirements
- [ ] Placeholder banner documents in Sanity (or accept empty list renders gracefully) for hero carousel tests
- [ ] Placeholder post documents in Sanity (or accept empty list renders gracefully) for blog tests

*Note: `playwright.config.ts` exists from Phase 1. No framework install needed. New env vars (`RESEND_API_KEY`, `SANITY_WRITE_TOKEN`) need to be added to `.env.local` before API route tests can pass.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Email received in inbox | CONT-01, CONT-05 | Resend delivery is external | Submit form, check Resend dashboard for delivery log |
| WhatsApp opens with pre-filled message | CONT-02 | External app interaction | Click WhatsApp button, verify WhatsApp opens with message text |
| Google Maps renders correctly | CONT-03 | Iframe content is cross-origin | Navigate to /contacto, visually verify map renders |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
