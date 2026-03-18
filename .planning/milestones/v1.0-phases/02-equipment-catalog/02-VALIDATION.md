---
phase: 2
slug: equipment-catalog
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (E2E smoke) — already installed and configured |
| **Config file** | `playwright.config.ts` — exists with chromium + mobile-360 projects |
| **Quick run command** | `npx playwright test tests/equipos.spec.ts --project=chromium` |
| **Full suite command** | `npx playwright test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npx playwright test tests/equipos.spec.ts --project=chromium`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | EQUIP-01 | smoke | `npx playwright test tests/equipos.spec.ts -g "equipment list" --project=chromium` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | EQUIP-01 | smoke | `npx playwright test tests/equipos.spec.ts -g "filter calibracion" --project=chromium` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | EQUIP-02 | smoke | `npx playwright test tests/equipos.spec.ts -g "search filter" --project=chromium` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | EQUIP-03 | smoke | `npx playwright test tests/equipos.spec.ts -g "detail page" --project=chromium` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 1 | EQUIP-04 | smoke | `npx playwright test tests/equipos.spec.ts -g "whatsapp cta" --project=chromium` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/equipos.spec.ts` — smoke tests covering EQUIP-01 through EQUIP-04
- [ ] Placeholder equipo documents in Sanity (or mock/fixture) so smoke tests have data to render

*Existing infrastructure covers framework install — Playwright already configured from Phase 1.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Image placeholder renders when no images exist | EQUIP-03 | Visual rendering check | Navigate to /equipos/[slug] with equipo that has empty imagenes array; verify gray placeholder appears instead of broken image |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
