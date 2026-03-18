# Roadmap: Testing Calibrations S.A.C.

## Overview

Four phases build the site in strict dependency order. Phase 1 establishes the technical foundation (Next.js project, Sanity schemas, base layout) — nothing else can be built without it. Phase 2 delivers the equipment catalog, the site's primary product showcase and lead-generation engine. Phase 3 builds all content pages (homepage, about, blog, contact channels including libro de reclamaciones) using the patterns and schemas established in Phases 1-2. Phase 4 completes SEO integration and hardens the deployment for production handoff.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Next.js project, Sanity schemas, base layout, and CI/CD pipeline working end-to-end (completed 2026-03-18)
- [x] **Phase 2: Equipment Catalog** - Filterable catalog with detail pages and quote CTAs fully working (completed 2026-03-18)
- [ ] **Phase 3: Content Pages and Contact** - Homepage, About Us, blog, contact form, WhatsApp, and libro de reclamaciones
- [ ] **Phase 4: SEO and Launch** - Meta tags, Open Graph, sitemap, and site live on production domain

## Phase Details

### Phase 1: Foundation
**Goal**: The project scaffolding, Sanity CMS, and base layout are in place so every subsequent phase can build on a stable, typed, deployable foundation
**Depends on**: Nothing (first phase)
**Requirements**: CMS-01, CMS-02, CMS-03, UX-01, UX-02, UX-03
**Success Criteria** (what must be TRUE):
  1. Next.js 15 project runs locally and deploys to Hostinger without errors
  2. Sanity Studio is accessible at /studio and all content schemas (equipos, posts, banners, paginas, siteSettings, reclamos) are defined
  3. Every page in the site shares the same Navbar and Footer rendered from siteSettings data in Sanity
  4. Site renders correctly on a 360px mobile screen (hamburger menu works) and on desktop
  5. A placeholder page deployed to production confirms the CI/CD pipeline is functional end-to-end
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — Project scaffolding: Next.js 15, Tailwind v4 theme, shadcn/ui, Sanity client, Playwright test infra
- [ ] 01-02-PLAN.md — Sanity schemas: all 6 content types + Studio at /studio + siteSettings query
- [ ] 01-03-PLAN.md — Base layout: Navbar (hamburger), Footer (3-col), WhatsApp button, responsive at 360px

### Phase 2: Equipment Catalog
**Goal**: Visitors can browse all equipment, filter by type, search by name or brand, view full specs, and initiate a quote request — the site's core product showcase is fully functional
**Depends on**: Phase 1
**Requirements**: EQUIP-01, EQUIP-02, EQUIP-03, EQUIP-04
**Success Criteria** (what must be TRUE):
  1. Visitor can view the full equipment list at /equipos and filter it by type (calibramos / en venta) without a page reload
  2. Visitor can search equipment by name or brand and see results update in real time
  3. Visitor can open any equipment detail page and see its specifications, images, and availability status
  4. Visitor can request a quote from an equipment detail page — either via a contact form pre-filled with the equipment name or via WhatsApp with the equipment name in the pre-filled message
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md — Shared infrastructure: GROQ queries, image-url helper, next.config remotePatterns, shadcn Input/Badge, Playwright smoke tests
- [ ] 02-02-PLAN.md — Equipment list page: /equipos with filter tabs (Todos/Calibracion/En Venta), search by name/brand, responsive card grid
- [ ] 02-03-PLAN.md — Equipment detail page: /equipos/[slug] with generateStaticParams, specs (Portable Text), image, WhatsApp quote CTA

### Phase 3: Content Pages and Contact
**Goal**: The full site is browsable — visitors can understand who the company is, read the blog, contact the company through any channel, and file a formal complaint; the homepage drives all of these conversions
**Depends on**: Phase 2
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, INST-01, INST-02, CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, BLOG-01, BLOG-02, BLOG-03
**Success Criteria** (what must be TRUE):
  1. Visitor lands on the homepage and sees an animated hero banner, services section, "por que elegirnos" values, featured equipment grid, animated metrics counters, and a link to the libro de reclamaciones — all driven by Sanity content
  2. Visitor can navigate to /nosotros and read the company history and values; the footer on every page shows contact data, address, social links, and navigation
  3. Visitor can submit the contact/quote form from /contacto and the company receives an email notification; the WhatsApp floating button is present on every page and opens with a pre-filled message
  4. Visitor can navigate to the libro de reclamaciones, fill out the regulated form, submit it, and the company receives an email notification; the reclamo is saved in Sanity
  5. Visitor can browse the blog list at /blog, click an article, and read the full content rendered from Portable Text with Sanity-managed categories and author
**Plans**: 4 plans

Plans:
- [ ] 03-01-PLAN.md — Homepage: hero banner carousel, services section, values section, featured equipment grid, animated metrics, reclamaciones CTA
- [ ] 03-02-PLAN.md — Institutional pages: /nosotros page with company history and values, Footer enhanced with reclamaciones link
- [ ] 03-03-PLAN.md — Contact and complaints: /contacto page with form + map, /libro-de-reclamaciones with regulated form, Resend email API routes, Sanity reclamo persistence
- [ ] 03-04-PLAN.md — Blog: /blog list page with post cards, /blog/[slug] detail with Portable Text renderer and SSG

### Phase 4: SEO and Launch
**Goal**: The site is discoverable by search engines, properly represented when shared on social media, and live on the production domain with all production services confirmed working
**Depends on**: Phase 3
**Requirements**: SEO-01, SEO-02, SEO-03
**Success Criteria** (what must be TRUE):
  1. Every page has a unique title and meta description editable from Sanity Studio
  2. Sharing any page URL on WhatsApp or social media shows the correct Open Graph image, title, and description
  3. A valid sitemap.xml is accessible at the production domain root and includes all public routes
  4. The contact form successfully delivers an email from the production domain (not localhost), Sanity Studio login works at /studio on the production URL, and the WhatsApp button opens correctly on a real mobile device
**Plans**: TBD

Plans:
- [ ] 04-01: SEO integration — generateMetadata per page (title, description from Sanity), Open Graph tags, sitemap.ts or next-sitemap, robots.txt
- [ ] 04-02: Production launch — Sanity CORS configured for production domain, environment variables verified on server, contact form email delivery tested from production, full site smoke test

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete   | 2026-03-18 |
| 2. Equipment Catalog | 3/3 | Complete   | 2026-03-18 |
| 3. Content Pages and Contact | 0/4 | Not started | - |
| 4. SEO and Launch | 0/2 | Not started | - |
