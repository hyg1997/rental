# Project Research Summary

**Project:** Testing Calibrations S.A.C. — Corporate Website
**Domain:** B2B corporate services website — vehicular gas analyzer calibration, Peru market
**Researched:** 2026-03-17
**Confidence:** HIGH (stack core), MEDIUM-HIGH (architecture), MEDIUM (Peru-specific features)

## Executive Summary

Testing Calibrations S.A.C. needs a B2B corporate services website targeting workshop owners, fleet operators, and vehicle inspection plants in Peru. The product is a lead-generation and credibility site, not an e-commerce or SaaS product. Research consistently points to a Sanity CMS + Next.js 15 stack as the optimal choice: Sanity enables client autonomy post-handoff, Next.js provides superior SEO through server rendering, and together they form a mature, well-documented integration. The site's informational nature means a static export deployed to Hostinger shared hosting is architecturally sufficient and simplest to operate — provided the architecture accounts for the known next-sanity static export incompatibility (import from `groq` and `@sanity/client` directly, not from `next-sanity`).

The recommended approach is to treat the deployment hosting decision as the single most important pre-development decision. If the client has Hostinger shared hosting, use `output: 'export'` with a CI/CD-triggered rebuild workflow; if they have Hostinger Business or VPS, deploy with `next start` and gain ISR, webhooks, and Server Actions. Either path is valid but they diverge early and cannot be switched mid-project without significant rework. Build order follows clear architectural dependencies: Sanity schemas must exist before content can be fetched, the base layout before any page, and all pages before SEO/sitemap generation.

Key risks center on three areas: (1) hosting plan confusion causing deployment failure, (2) Sanity CDN bandwidth exhaustion from unoptimized equipment catalog images, and (3) the WhatsApp-as-primary-contact-channel expectation in Peru being missed. All three are entirely preventable with upfront decisions. The Peru B2B market strongly favors WhatsApp over contact forms, making the floating button a higher-priority conversion element than the contact form itself. Competitors in the local market (SIMCAL PERU, JS Industrial) do not have WhatsApp integration or CMS-driven content — both are genuine differentiators for v1.

## Key Findings

### Recommended Stack

The recommended stack centers on Next.js 15 (App Router, React 19) with Sanity Studio v5, Tailwind CSS v4, and shadcn/ui. This combination is well-supported, actively maintained, and specifically suited to a corporate brochureware site with CMS-driven content. TypeScript is required throughout — Sanity TypeGen generates types from GROQ queries, eliminating a class of runtime errors. For forms: react-hook-form + Zod + Resend (or EmailJS for static export) handles contact form delivery. The stack decision branches on hosting: Node.js-capable hosting enables Resend via Server Actions; static-only shared hosting requires EmailJS (client-side, less secure) or Formspree as alternatives.

**Core technologies:**
- **Next.js 15 (App Router):** Frontend framework with SSG/ISR — superior SEO, server components reduce JS bundle, built-in image optimization
- **Sanity Studio v5:** Headless CMS — free tier, GROQ queries, real-time content API, client-editable after handoff
- **Tailwind CSS v4:** Styling — CSS-first config, zero runtime, dark mode, suited for custom corporate designs
- **shadcn/ui:** UI components — accessible, copy-paste (not a dependency), Tailwind v4 + React 19 compatible
- **react-hook-form + Zod:** Form handling — same validation schema client and server-side, minimal re-renders
- **Resend (Node.js) or EmailJS (static):** Email delivery — Resend is preferred (server-side, secure); EmailJS only if stuck on shared hosting
- **TypeScript 5.x + Sanity TypeGen:** Type safety — GROQ queries generate TypeScript types end-to-end

**Critical version constraint:** next-sanity imports Server Actions internally; importing from `next-sanity` in a `output: 'export'` project causes build failure (issue #1899). Use `groq` package for `defineQuery`, `@sanity/client` for the client. This is a known open issue, not a version problem.

### Expected Features

The MVP must focus entirely on lead generation and credibility. WhatsApp is the dominant B2B contact channel in Peru — competitors do not have it; we do. Equipment catalog with dual categorization (calibration services vs. equipment for sale) is the core product showcase and the primary reason visitors return.

**Must have (table stakes):**
- Homepage with hero, value proposition, services overview, metrics, featured equipment, CTA
- Equipment catalog (list + detail) with category filter (calibramos / en venta)
- Contact page with email form (name, company, phone, email, message)
- WhatsApp floating button — pre-filled message, all pages, fixed position
- About Us page — years of experience, brands supported, geographic coverage
- Mobile-responsive design — majority of B2B research in Latin America starts on mobile
- Basic SEO — meta tags, Open Graph, XML sitemap, robots.txt
- CMS integration (Sanity) — client must be able to update content after handoff

**Should have (competitive differentiators):**
- Blog with regulatory/technical content — targets "calibración analizadores Euro 4 Lima" long-tail queries; positions as authority
- Industry segment sections — "Para talleres", "Para plantas de revisión técnica", "Para flotas" self-identification
- Equipment PDF spec sheets — technical buyers want to verify before calling

**Defer (v2+):**
- Client document portal (certificate downloads) — no validated demand
- Online payment — legal/tax complexity in Peru, calibration requires physical coordination
- English language version — zero ROI until international clients emerge
- Live chat widget, chatbot, testimonials carousel — all anti-features for this stage

### Architecture Approach

The architecture is a static-first or hybrid Next.js site with Sanity as the content backend. Pages fetch all data at build time via GROQ queries; dynamic routes use `generateStaticParams` to enumerate slugs. Client components are limited to interactive elements only (contact form, WhatsApp button). The Sanity Studio is either embedded at `/studio` (Node.js hosting) or hosted at sanity.io/manage (static export). A `siteSettings` singleton document stores all global contact data (WhatsApp number, email, address) — the client updates it in Sanity, never in code.

**Major components:**
1. **Sanity Content Layer** — Studio + Content Lake; schemas for `siteSettings`, `equipment`, `post`, `page`; all content editing happens here
2. **Next.js App Router pages** — RSC pages fetch GROQ data at build time; render to HTML; `sections/` components receive typed props from pages
3. **Sanity client + query layer** — `lib/sanity/client.ts` + `lib/sanity/queries/*.ts`; all GROQ defined here with `defineQuery` from `groq` package
4. **Hosting + CI/CD** — Hostinger (shared or VPS); GitHub Actions triggers rebuild on Sanity publish webhook; FTP or SSH for artifact deployment
5. **Email delivery** — Resend via Server Action (Node.js) or EmailJS (static); environment variables set on VPS/CI, never in code

**Key patterns:**
- `generateStaticParams` for all dynamic routes (`/equipos/[slug]`, `/blog/[slug]`)
- Pages fetch data; sections receive props — no section fetches its own data
- `siteSettings` singleton fetched once in root layout, passed as props to Navbar/Footer/WhatsAppButton
- Image URLs always transformed via `@sanity/image-url` with width/quality/format params — never raw `asset.url`

### Critical Pitfalls

1. **Hosting plan confusion** — confirm Hostinger plan supports Node.js (VPS) before writing code; if shared hosting, architecture must use `output: 'export'` with EmailJS and manual rebuild workflow; these diverge at project start, not mid-build
2. **next-sanity static export incompatibility** — never import from `next-sanity` main entry in a static export project; use `groq` package for `defineQuery` and `@sanity/client` for client; issue #1899 is open and unfixed
3. **Sanity image bandwidth exhaustion** — Sanity free tier has a 10 GB hard cap with no grace period; always apply width/quality/format transformation on every image URL; never use raw `asset.url`; use `useCdn: true` for read queries to leverage CDN caching
4. **Sanity CORS not configured for production** — add production domain with "Allow credentials" to sanity.io/manage CORS settings before going live; Studio login fails silently in production if this is skipped
5. **Hardcoded business data** — all contact data (WhatsApp number, email, address) must live in `siteSettings` Sanity document, not in JSX; client must be able to update without developer involvement — this is the entire point of the CMS
6. **Contact form silent failure** — SMTP/email env vars not set on server; validate env vars at startup and return explicit 500 when missing; test actual email delivery from production domain as an acceptance criterion
7. **VPS OOM during build** — `next build` requires ~2 GB RAM; build in GitHub Actions (7 GB free), deploy only artifacts to VPS via SSH; do not run build on a 1 GB VPS

## Implications for Roadmap

Based on research, the build order follows hard architectural dependencies. Sanity schemas must exist before any data fetching; base layout before any page; all content pages before SEO generation. The hosting decision gates everything and must be made before Phase 1 starts.

### Phase 1: Infrastructure and Foundation

**Rationale:** Hosting decision, project scaffolding, and Sanity schemas must be established before any feature development begins. These are not reversible decisions — switching hosting paths or schema structure mid-project is high-cost.
**Delivers:** Running Next.js 15 project on confirmed hosting plan, Sanity project created with all schemas defined, base layout (Navbar, Footer, WhatsAppButton) rendering, deployment pipeline working end-to-end (even if deploying a placeholder page)
**Addresses:** Table stakes — project structure, CMS foundation, mobile-responsive layout shell
**Avoids:** Hosting confusion pitfall (decide VPS vs shared before writing code), nested schema array pitfall (review schema design before populating content), build OOM pitfall (establish CI/CD build workflow now)
**Research flag:** LOW — well-documented patterns; no phase-level research needed; follow ARCHITECTURE.md project structure exactly

### Phase 2: Equipment Catalog (Core Product Showcase)

**Rationale:** Equipment catalog is the primary reason visitors come and the primary driver of quote requests. It depends on Phase 1 schemas and layout. Blog depends on catalog (same pattern), so catalog comes first. Image handling patterns established here protect against bandwidth pitfalls on every subsequent page.
**Delivers:** Equipment list page (`/equipos`) with category filter (client-side JS, no server needed), equipment detail pages (`/equipos/[slug]`) with specs and quote CTA, Sanity-managed equipment documents, image optimization pattern established
**Addresses:** Equipment catalog (P1), equipment detail (P1), equipment spec sheets (P2 stretch), featured equipment on homepage
**Avoids:** Sanity image bandwidth pitfall (enforce `@sanity/image-url` transforms from the start), double-processing images pitfall (custom loader or `@sanity/image-url` approach decided here), missing empty-state pitfall (add placeholder content before populating Sanity)
**Research flag:** LOW — standard Next.js SSG + Sanity GROQ pattern; well-documented

### Phase 3: Homepage and Static Pages

**Rationale:** Homepage requires the most cross-cutting data (siteSettings, featured equipment, services) and benefits from catalog being done first so `featuredEquipment` query has real data to pull from. About Us and Contact pages are simpler but share layout patterns established here.
**Delivers:** Full homepage (hero, services grid, metrics bar, featured equipment, CTA sections), About Us page (`/nosotros`), Contact page (`/contacto`) with working email form and WhatsApp button, WhatsApp floating button on all pages
**Addresses:** Homepage hero + CTA (P1), About Us (P1), contact form + email delivery (P1), WhatsApp button (P1), metrics/social proof (P1), dual quote channels
**Avoids:** Contact form silent failure pitfall (test email delivery from production as acceptance criterion), WhatsApp button mobile overlap pitfall (test at 360px), hardcoded business data pitfall (all contact info from siteSettings)
**Research flag:** LOW for layout/pages; MEDIUM for email delivery — confirm hosting path (Resend via Server Action vs EmailJS) and test in production environment

### Phase 4: Blog and SEO

**Rationale:** Blog is a P2 feature that enhances SEO but is not required for launch. It follows the same SSG pattern as equipment pages. SEO (sitemap, meta tags) requires all pages to exist, making it the final integration step before launch.
**Delivers:** Blog list page (`/blog`), blog post detail pages (`/blog/[slug]`) with Portable Text renderer, XML sitemap at root, per-page meta tags and Open Graph, robots.txt, initial 3-5 blog articles on regulatory content (Euro 4, MTC norms, calibration frequency)
**Addresses:** Blog with regulatory content (P2), basic SEO (P1), long-tail search discoverability
**Avoids:** Blog empty-state pitfall (add placeholder "Proximamente" state), missing sitemap pitfall (sitemap.xml must include all routes)
**Research flag:** LOW — standard Next.js `generateMetadata`, `next-sitemap` or built-in `sitemap.ts`; Portable Text rendering with `@portabletext/react` is well-documented

### Phase 5: Deployment and Production Hardening

**Rationale:** Deployment is a distinct phase because several production-only concerns (CORS, PM2, environment variables, SSL) cannot be validated until the full site runs on the production domain. These are not afterthoughts — they are acceptance criteria.
**Delivers:** Full site live on production domain, Sanity CORS configured for production URL, all environment variables set on VPS, PM2 running with `pm2 startup` for auto-restart, GitHub Actions workflow deploying on push, Sanity webhook triggering rebuild on content publish, SSL certificate active
**Addresses:** Production readiness, content update workflow for client, post-handoff autonomy
**Avoids:** Sanity CORS production failure, contact form env var silent failure, PM2 persistence failure on reboot, content not updating (ISR/webhook not configured)
**Research flag:** MEDIUM — Hostinger VPS + PM2 + Next.js deployment has sparse official documentation; follow PITFALLS.md integration gotchas table; test "Looks Done But Isn't" checklist before marking complete

### Phase Ordering Rationale

- **Schema-first:** Sanity schemas are a foundational dependency; no page can be built until schema types are defined and data can be fetched — this forces Phase 1 to include schema design
- **Core before periphery:** Equipment catalog is the product; homepage references it; blog extends it — this determines Phases 2-4 ordering
- **Static-first architecture:** All pages use `generateStaticParams` + RSC build-time fetch; this pattern is established in Phase 2 and applied uniformly — no page breaks from this pattern
- **Production as a phase:** Deployment is not "just pushing files"; CORS, PM2, webhooks, and SSL are non-trivial on Hostinger VPS and need dedicated time

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 5 (Deployment):** Hostinger VPS + PM2 + GitHub Actions FTP/SSH workflow has limited official documentation; PITFALLS.md covers known gotchas but implementation details may need validation against actual Hostinger VPS environment
- **Phase 3 (Email delivery):** The hosting path decision (Resend vs EmailJS) determines implementation; if client is on shared hosting, EmailJS credential security and free tier limits (200/month) need validation against expected form volume

Phases with standard patterns (skip research-phase):
- **Phase 1 (Infrastructure):** Next.js 15 + Sanity project setup is well-documented; follow STACK.md installation commands exactly
- **Phase 2 (Equipment Catalog):** Standard Next.js SSG + Sanity GROQ pattern; ARCHITECTURE.md code examples are production-ready
- **Phase 4 (Blog + SEO):** Portable Text rendering and Next.js metadata API are fully documented with official examples

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official sources for all major libraries; version compatibility confirmed; known incompatibilities documented (next-sanity static export issue #1899) |
| Features | MEDIUM | Industry patterns HIGH confidence; Peru-specific WhatsApp dominance MEDIUM (community sources, not official market data); competitor analysis based on direct site review |
| Architecture | MEDIUM-HIGH | Core pattern (SSG + Sanity + generateStaticParams) is well-documented; Hostinger VPS deployment has a known documentation gap; static export workaround pattern is confirmed via open GitHub issue |
| Pitfalls | HIGH | All critical pitfalls sourced from official docs, open GitHub issues, or confirmed community reports; recovery strategies validated against known fix paths |

**Overall confidence:** HIGH for core decisions; MEDIUM for Hostinger-specific deployment details

### Gaps to Address

- **Hosting plan confirmation:** The entire architecture branches on whether client has shared or VPS Hostinger hosting. This must be confirmed before Phase 1 starts — it is the single highest-impact unknown.
- **Email volume estimate:** Free tier limits vary (Resend: 3,000/month; EmailJS: 200/month; Formspree: 50/month). Estimate expected contact form submissions to choose the right provider.
- **Equipment catalog size:** GROQ pagination strategy recommended at 50+ items. If client has fewer than 20 equipment items, simpler flat query is sufficient; if 50+, pagination must be built into Phase 2.
- **Blog content commitment:** Blog is P2 and requires the client to provide content. If client cannot commit to 3-5 initial articles, defer blog entirely to v1.x and do not build the blog phase for v1.
- **Image assets readiness:** Sanity catalog pages need real equipment photos. If client has no digital photos, Phase 2 must use placeholder images until assets are provided — do not block development on this.

## Sources

### Primary (HIGH confidence)
- [Next.js 15 official release blog](https://nextjs.org/blog/next-15) — App Router, React 19, caching, ISR changes
- [Sanity Studio v5 announcement](https://www.sanity.io/blog/sanity-studio-v5) — React 19 requirement, release timeline
- [next-sanity GitHub + issue #1899](https://github.com/sanity-io/next-sanity/issues/1899) — static export incompatibility, confirmed open
- [Hostinger deploy-nextjs official repo](https://github.com/hostinger/deploy-nextjs) — deployment guide maintained by Hostinger
- [Sanity Technical Limits — Official Docs](https://www.sanity.io/docs/content-lake/technical-limits) — free tier bandwidth cap, hard stop behavior
- [Sanity CORS Configuration — Official Docs](https://www.sanity.io/docs/cors) — production domain whitelisting requirement
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — Tailwind v4 + React 19 component compatibility
- [Resend Next.js integration](https://resend.com/docs/send-with-nextjs) — free tier limits, SDK usage

### Secondary (MEDIUM confidence)
- [B2B website design best practices — Trajectory Web Design, Blue Atlas Marketing](https://www.trajectorywebdesign.com/blog/b2b-website-design-best-practices) — table stakes feature patterns
- [Industrial website design — ColorWhistle, Windmill Strategy, Fulmino Software](https://colorwhistle.com/industrial-website-design-inspiration/) — manufacturing/industrial site patterns
- Peru market competitors: [SIMCAL PERU](https://simcalperu.com/), [JS Industrial PERU](https://www.jsindustrial.com.pe/), [IDCERT](https://idcert.com.pe/), [Valiometro](https://valiometro.pe/), [CarTools Peru](https://cartoolsperu.com/) — direct competitor review
- [WhatsApp dominance in Latin America — Mobile Growth Association](https://mobilegrowthassociation.com/how-whatsapp-took-over-latin-america/) — Peru B2B communication channel preference
- [Deploy Next.js on Hostinger — DEV Community, ayyaztech.com](https://dev.to/oandersonmagalhaes/deploying-your-nextjs-project-on-hostinger-4gpm) — VPS deployment workflow
- [On-Demand ISR with Next.js and Sanity — finiam.com](https://blog.finiam.com/blog/on-demand-isr-with-next-js-and-sanity) — webhook + revalidation pattern

### Tertiary (LOW confidence)
- [Sanity bandwidth exceeded community discussion](https://www.sanity.io/answers/discussion-on-bandwidth-limits-and-overages-for-sanity-s-free-plan--) — bandwidth cap behavior details (community, not official)
- [Sanity nested arrays issue — GitHub](https://github.com/sanity-io/sanity/issues/1418) — schema corruption behavior (old issue, behavior may differ in v5)

---
*Research completed: 2026-03-17*
*Ready for roadmap: yes*
