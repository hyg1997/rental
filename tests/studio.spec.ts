import { test, expect } from '@playwright/test'

test.describe('Sanity Studio', () => {
  test('studio route returns 200 and renders shell', async ({ page }) => {
    const response = await page.goto('/studio')
    expect(response?.status()).toBe(200)
    // Studio renders a root div with id="sanity" — wait for it
    await expect(page.locator('#sanity')).toBeVisible({ timeout: 10000 })
  })
})
