import { test, expect } from '@playwright/test'

test.describe('SEO-01: Meta tags on every page', () => {
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/nosotros', name: 'Nosotros' },
    { path: '/equipos', name: 'Equipos' },
    { path: '/blog', name: 'Blog' },
    { path: '/contacto', name: 'Contacto' },
  ]

  for (const page of pages) {
    test(`${page.name} has unique <title>`, async ({ page: p }) => {
      await p.goto(page.path)
      const title = await p.title()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(5)
    })

    test(`${page.name} has meta description`, async ({ page: p }) => {
      await p.goto(page.path)
      const description = await p.getAttribute('meta[name="description"]', 'content')
      expect(description).toBeTruthy()
    })
  }
})

test.describe('SEO-02: Open Graph tags', () => {
  test('Homepage has og:title and og:description', async ({ page }) => {
    await page.goto('/')
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content')
    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content')
    expect(ogTitle).toBeTruthy()
    expect(ogDescription).toBeTruthy()
  })
})

test.describe('SEO-03: Sitemap XML', () => {
  test('GET /sitemap.xml returns valid XML with public routes', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('<urlset')
    expect(body).toContain('/nosotros')
    expect(body).toContain('/equipos')
    expect(body).toContain('/blog')
    expect(body).toContain('/contacto')
    expect(body).not.toContain('/studio')
  })
})

test.describe('Robots.txt', () => {
  test('GET /robots.txt disallows /studio and includes sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('Disallow: /studio')
    expect(body).toContain('sitemap.xml')
  })
})
