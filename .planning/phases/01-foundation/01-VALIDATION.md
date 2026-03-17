---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (E2E smoke tests) + TypeScript compiler (type checking) |
| **Config file** | `playwright.config.ts` — Wave 0 creates it |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx playwright test` |
| **Estimated runtime** | ~15 seconds (tsc) + ~30 seconds (Playwright) |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npx playwright test tests/smoke.spec.ts`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | CMS-01 | smoke (manual) | — | manual only | ⬜ pending |
| 1-02-01 | 02 | 1 | CMS-02 | smoke | `npx playwright test tests/smoke.spec.ts -g "studio loads"` | ❌ W0 | ⬜ pending |
| 1-02-02 | 02 | 1 | CMS-03 | unit (TypeGen) | `npx tsc --noEmit` | implicit | ⬜ pending |
| 1-03-01 | 03 | 1 | UX-01 | smoke | `npx playwright test tests/smoke.spec.ts -g "360px mobile"` | ❌ W0 | ⬜ pending |
| 1-03-02 | 03 | 1 | UX-02 | smoke (visual) | `npx playwright test tests/smoke.spec.ts -g "dark theme"` | ❌ W0 | ⬜ pending |
| 1-03-03 | 03 | 1 | UX-03 | smoke | `npx playwright test tests/smoke.spec.ts -g "hamburger menu"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/smoke.spec.ts` — stubs for CMS-02, UX-01, UX-02, UX-03
- [ ] `playwright.config.ts` — Playwright configuration with 360px viewport project
- [ ] Framework install: `npm install -D @playwright/test && npx playwright install chromium`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Content editable via Studio | CMS-01 | Requires browser interaction with Studio UI | Open /studio, create test document, verify fields render |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
