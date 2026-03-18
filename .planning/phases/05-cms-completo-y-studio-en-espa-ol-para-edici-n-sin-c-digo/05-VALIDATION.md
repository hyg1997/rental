---
phase: 5
slug: cms-completo-y-studio-en-espa-ol-para-edici-n-sin-c-digo
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright Test |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `npx playwright test tests/content.spec.ts --project chromium` |
| **Full suite command** | `npx playwright test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test tests/content.spec.ts --project chromium`
- **After every plan wave:** Run `npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | CMS-01-a | smoke | `npx playwright test tests/content.spec.ts -g "services section" --project chromium` | ✅ | ⬜ pending |
| 05-01-02 | 01 | 1 | CMS-01-b | smoke | `npx playwright test tests/content.spec.ts -g "valores section" --project chromium` | ✅ | ⬜ pending |
| 05-01-03 | 01 | 1 | CMS-01-c | smoke | `npx playwright test tests/content.spec.ts -g "metrics counters" --project chromium` | ✅ | ⬜ pending |
| 05-01-04 | 01 | 1 | CMS-01-d | smoke | `npx playwright test tests/content.spec.ts -g "nosotros page" --project chromium` | ✅ | ⬜ pending |
| 05-02-01 | 02 | 1 | STUDIO-UX | manual | Navigate to http://localhost:3000/studio | manual-only | ⬜ pending |
| 05-02-02 | 02 | 1 | STUDIO-EDIT | manual | manual-only — requires real Sanity project ID | manual-only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/studio.spec.ts` — smoke test that GET /studio returns 200 and renders Studio shell

*Existing infrastructure in `tests/content.spec.ts` covers all homepage section regression tests.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Studio UI in Spanish | STUDIO-UX | UI language verification requires visual inspection | Open /studio, verify menus and buttons are in Spanish |
| Edit content from Studio | STUDIO-EDIT | Requires real Sanity project ID and dataset | Edit a service item in Studio, refresh homepage, verify change appears |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
