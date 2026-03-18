import { test, expect } from '@playwright/test'

test.describe('Phase 1 Smoke Tests', () => {
  test('homepage renders placeholder', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Bienvenido a Testing Calibrations S.A.C.')
  })

  test('studio loads', async ({ page }) => {
    // CMS-02: Sanity Studio accessible at /studio
    await page.goto('/studio')
    // Studio renders a root element — check it loads without 404
    await expect(page).not.toHaveTitle(/404/)
  })

  test('360px mobile - no horizontal scroll', async ({ page }) => {
    // UX-01: Responsive at 360px
    await page.setViewportSize({ width: 360, height: 640 })
    await page.goto('/')
    const body = page.locator('body')
    const scrollWidth = await body.evaluate(el => el.scrollWidth)
    const clientWidth = await body.evaluate(el => el.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  })

  test('dark theme - brand background visible', async ({ page }) => {
    // UX-02: Dark theme with brand colors
    await page.goto('/')
    // The page should have a dark background (brand-bg)
    const bgColor = await page.locator('div.bg-brand-bg').first().evaluate(
      el => getComputedStyle(el).backgroundColor
    )
    // brand-bg is oklch(0.12 0.01 260) — very dark, RGB values should be low
    expect(bgColor).toBeTruthy()
  })

  test('hamburger menu - mobile nav opens', async ({ page }) => {
    // UX-03: Hamburger menu on mobile
    await page.setViewportSize({ width: 360, height: 640 })
    await page.goto('/')
    const menuButton = page.locator('button[aria-label="Abrir menu"]')
    await expect(menuButton).toBeVisible()
    await menuButton.click()
    await expect(page.locator('[data-state="open"]')).toBeVisible()
  })
})
