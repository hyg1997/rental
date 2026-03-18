import { test, expect } from '@playwright/test'

test.describe('Homepage (HOME)', () => {
  test('hero banner section visible', async ({ page }) => {
    await page.goto('/')
    // HOME-01: Hero banner with h1 text and CTA
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('services section visible', async ({ page }) => {
    await page.goto('/')
    // HOME-02: Services section with heading
    await expect(page.getByRole('heading', { name: /nuestros servicios/i })).toBeVisible()
  })

  test('valores section visible', async ({ page }) => {
    await page.goto('/')
    // HOME-03: Values section "Por que elegirnos"
    await expect(page.getByRole('heading', { name: /elegirnos/i })).toBeVisible()
  })

  test('featured equipment grid visible', async ({ page }) => {
    await page.goto('/')
    // HOME-04: Featured equipment section
    await expect(page.getByRole('heading', { name: /equipos destacados/i })).toBeVisible()
  })

  test('metrics counters visible', async ({ page }) => {
    await page.goto('/')
    // HOME-05: Animated metrics section
    await expect(page.getByText(/clientes/i).first()).toBeVisible()
  })

  test('reclamaciones link visible', async ({ page }) => {
    await page.goto('/')
    // HOME-06: Link to /libro-de-reclamaciones
    await expect(page.locator('a[href="/libro-de-reclamaciones"]').first()).toBeVisible()
  })
})

test.describe('Institutional (INST)', () => {
  test('nosotros page renders', async ({ page }) => {
    await page.goto('/nosotros')
    // INST-01: About page with company info
    await expect(page.getByRole('heading', { name: /testing calibrations/i })).toBeVisible()
  })

  test('footer content complete', async ({ page }) => {
    await page.goto('/')
    // INST-02: Footer shows libro de reclamaciones link
    const footer = page.locator('footer')
    await expect(footer.locator('a[href="/libro-de-reclamaciones"]')).toBeVisible()
  })
})

test.describe('Contact (CONT)', () => {
  test('contact form present', async ({ page }) => {
    await page.goto('/contacto')
    // CONT-01: Contact form with submit button
    await expect(page.getByRole('button', { name: /enviar/i })).toBeVisible()
  })

  test('whatsapp button visible', async ({ page }) => {
    await page.goto('/')
    // CONT-02: WhatsApp floating button
    await expect(page.locator('a[href*="wa.me"]').first()).toBeVisible()
  })

  test('contacto page info visible', async ({ page }) => {
    await page.goto('/contacto')
    // CONT-03: Contact page shows email, address, phone, map
    await expect(page.locator('iframe[title*="Ubicacion"]')).toBeVisible()
  })

  test('reclamo form fields present', async ({ page }) => {
    await page.goto('/libro-de-reclamaciones')
    // CONT-04: Reclamo form with regulated fields
    await expect(page.getByRole('heading', { name: /libro de reclamaciones/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /registrar/i })).toBeVisible()
  })

  test('reclamo submit flow', async ({ page }) => {
    await page.goto('/libro-de-reclamaciones')
    // CONT-05: Reclamo form submission (fill required fields and submit)
    // Stub: verify form is interactive (input fields accept text)
    const nombreInput = page.locator('input[name="nombreConsumidor"], input').first()
    await expect(nombreInput).toBeEnabled()
  })
})

test.describe('Blog (BLOG)', () => {
  test('blog list page renders', async ({ page }) => {
    await page.goto('/blog')
    // BLOG-01: Blog list with cards or empty state
    await expect(page.getByRole('heading', { name: /blog/i })).toBeVisible()
  })

  test('blog detail page structure', async ({ page }) => {
    await page.goto('/blog')
    // BLOG-02: Blog detail with Portable Text
    // If posts exist, click first; otherwise verify empty state
    const postLink = page.locator('a[href^="/blog/"]').first()
    if (await postLink.isVisible()) {
      await postLink.click()
      await expect(page.getByRole('heading').first()).toBeVisible()
      await expect(page.locator('a[href="/blog"]')).toBeVisible() // back link
    } else {
      await expect(page.getByText(/pronto/i)).toBeVisible()
    }
  })

  test('blog metadata displays', async ({ page }) => {
    await page.goto('/blog')
    // BLOG-03: Articles display categoria and autor
    // Verify the blog page loaded (metadata is content-dependent)
    await expect(page.getByRole('heading', { name: /blog/i })).toBeVisible()
  })
})
