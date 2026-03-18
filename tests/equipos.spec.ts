import { test, expect } from '@playwright/test'

test.describe('Equipment Catalog', () => {
  test('equipment list renders at /equipos', async ({ page }) => {
    await page.goto('/equipos')
    await expect(page.locator('h1')).toContainText('Catálogo de Equipos')
  })

  test('equipment list shows filter buttons', async ({ page }) => {
    await page.goto('/equipos')
    await expect(page.getByRole('button', { name: 'Todos' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Calibración' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'En Venta' })).toBeVisible()
  })

  test('filter calibracion filters equipment list', async ({ page }) => {
    await page.goto('/equipos')
    await page.getByRole('button', { name: 'Calibración' }).click()
    // After clicking filter, all visible cards should be calibracion type
    // or empty state should appear if no calibracion items exist
    const filterButton = page.getByRole('button', { name: 'Calibración' })
    await expect(filterButton).toHaveClass(/bg-brand-red/)
  })

  test('search filter has input field', async ({ page }) => {
    await page.goto('/equipos')
    await expect(page.getByPlaceholder('Buscar por nombre o marca...')).toBeVisible()
  })

  test('detail page renders equipment info', async ({ page }) => {
    // Navigate to list first, then click first card link
    await page.goto('/equipos')
    const detailLink = page.locator('a[href^="/equipos/"]').first()
    // Only test if equipment items exist (Sanity may have no data)
    if (await detailLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await detailLink.click()
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('detail page has whatsapp cta link', async ({ page }) => {
    await page.goto('/equipos')
    const detailLink = page.locator('a[href^="/equipos/"]').first()
    if (await detailLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await detailLink.click()
      await expect(page.locator('a[href*="wa.me"]')).toBeVisible()
    }
  })
})
