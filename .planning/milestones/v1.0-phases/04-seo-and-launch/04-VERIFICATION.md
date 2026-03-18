---
phase: 04-seo-and-launch
verified: 2026-03-18T12:00:00Z
status: human_needed
score: 11/13 must-haves verified
re_verification: false
human_verification:
  - test: "Contact form delivers email from verified domain on production"
    expected: "Company receives email notification at contacto@testingcalibrations.com.pe from a verified sender (not sandbox)"
    why_human: "Requires production VPS with RESEND_FROM_EMAIL env var set and Resend domain verified — cannot test programmatically"
  - test: "Reclamo form delivers email on production"
    expected: "Company receives reclamo notification email after form submission at /libro-de-reclamaciones"
    why_human: "Same as above — requires live production environment with verified Resend domain"
  - test: "Sanity Studio login at /studio on the production URL"
    expected: "Studio loads and shows content after login without CORS errors"
    why_human: "Requires Sanity CORS origin for https://testingcalibrations.com.pe to be configured in manage.sanity.io — cannot verify without production deployment"
  - test: "WhatsApp floating button on real mobile device"
    expected: "Tapping the button opens WhatsApp with a pre-filled message"
    why_human: "Requires real mobile device on production URL — cannot verify programmatically"
  - test: "All 6 env vars present on production VPS"
    expected: "printenv shows NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SITE_URL, RESEND_API_KEY, RESEND_FROM_EMAIL, SANITY_WRITE_TOKEN"
    why_human: "Requires SSH access to production VPS — cannot verify from local codebase"
---

# Phase 4: SEO and Launch Verification Report

**Phase Goal:** The site is discoverable by search engines, properly represented when shared on social media, and live on the production domain with all production services confirmed working.
**Verified:** 2026-03-18T12:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth                                                                                                    | Status      | Evidence                                                                                              |
|----|----------------------------------------------------------------------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------|
| 1  | Sanity Studio shows SEO fields (seoTitle, seoDescription, ogImage) on post and equipo document types    | VERIFIED    | post.ts lines 22/30/39; equipo.ts lines 32/40; groups array at line 7 in both                        |
| 2  | Sanity Studio shows default SEO fields on siteSettings under an 'seo' group                             | VERIFIED    | site-settings.ts lines 14 (group def), 302/309/317 (fields)                                          |
| 3  | GET /sitemap.xml returns valid XML with static routes and dynamic slugs from Sanity                      | VERIFIED    | sitemap.ts: static routes /nosotros /equipos /blog /contacto + client.fetch for posts and equipos    |
| 4  | GET /robots.txt returns rules disallowing /studio and referencing /sitemap.xml                           | VERIFIED    | robots.ts: disallow ['/studio', '/studio/'], sitemap: `${BASE_URL}/sitemap.xml`                      |
| 5  | Root layout has metadataBase and title template configured                                               | VERIFIED    | layout.tsx line 12 (metadataBase), lines 13-16 (title.default + title.template)                      |
| 6  | Every public page has a unique title visible in the browser tab                                          | VERIFIED    | generateMetadata exported from all 7 pages; titles: 'Testing Calibrations S.A.C.', 'Nosotros', 'Contacto', 'Blog', 'Catalogo de Equipos', dynamic per-slug |
| 7  | Every public page has a meta description tag with meaningful content                                     | VERIFIED    | All 7 pages export description in generateMetadata return; dynamic pages use seoDescription ?? content fallback |
| 8  | Sharing any page URL on social media shows correct og:title and og:description                           | VERIFIED    | openGraph object present in all 7 generateMetadata exports; dynamic pages use urlFor().width(1200).height(630) |
| 9  | Blog post detail pages show the post's titulo as the title                                               | VERIFIED    | blog/[slug]/page.tsx: `title = post.seoTitle ?? post.titulo`; feeds into generateMetadata return     |
| 10 | Equipment detail pages show the equipo's nombre as the title                                             | VERIFIED    | equipos/[slug]/page.tsx: `title = equipo.seoTitle ?? equipo.nombre`; feeds into generateMetadata return |
| 11 | Contact form email uses configurable RESEND_FROM_EMAIL env var, not hardcoded onboarding@resend.dev     | VERIFIED    | contact/route.ts line 14: `process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'`                 |
| 12 | Reclamo form email uses the same configurable from address                                               | VERIFIED    | reclamo/route.ts line 47: `process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'`                 |
| 13 | All production services work end-to-end (email, Studio CORS, WhatsApp, env vars)                        | NEEDS HUMAN | Production verification deferred — VPS not yet set up at time of plan execution (acknowledged in 04-03-SUMMARY.md) |

**Score:** 12/13 truths verified (1 needs human)

### Required Artifacts

| Artifact                                          | Expected                                      | Status   | Details                                                          |
|---------------------------------------------------|-----------------------------------------------|----------|------------------------------------------------------------------|
| `src/sanity/schemas/post.ts`                      | SEO fields with seo group                     | VERIFIED | seoTitle (line 22), seoDescription (line 30), ogImage (line 39) |
| `src/sanity/schemas/equipo.ts`                    | SEO fields with seo group                     | VERIFIED | seoTitle (line 32), seoDescription (line 40)                     |
| `src/sanity/schemas/site-settings.ts`             | Default SEO fields and seo group              | VERIFIED | defaultSeoTitle/Description/OgImage, group: 'seo' at line 14    |
| `src/sanity/queries/seo.ts`                       | GROQ queries for SEO metadata                 | VERIFIED | All 3 exports: SITE_SEO_DEFAULTS_QUERY, POST_SEO_BY_SLUG_QUERY, EQUIPO_SEO_BY_SLUG_QUERY |
| `src/app/sitemap.ts`                              | Dynamic sitemap generation                    | VERIFIED | Exports default async function; fetches from Sanity; 5 static + dynamic routes |
| `src/app/robots.ts`                               | Robots.txt generation                         | VERIFIED | Exports default function; disallows /studio and /studio/; includes sitemap URL |
| `src/app/layout.tsx`                              | metadataBase and title template               | VERIFIED | metadataBase, title.default, title.template all present          |
| `src/app/(site)/page.tsx`                         | Homepage generateMetadata with OG tags        | VERIFIED | generateMetadata, SITE_SEO_DEFAULTS_QUERY, openGraph all present |
| `src/app/(site)/nosotros/page.tsx`                | Nosotros generateMetadata                     | VERIFIED | generateMetadata at line 12, title 'Nosotros', openGraph         |
| `src/app/(site)/contacto/page.tsx`                | Contacto generateMetadata                     | VERIFIED | generateMetadata at line 7, title 'Contacto', openGraph          |
| `src/app/(site)/blog/page.tsx`                    | Blog index generateMetadata                   | VERIFIED | generateMetadata at line 6, title 'Blog', openGraph              |
| `src/app/(site)/blog/[slug]/page.tsx`             | Blog detail dynamic generateMetadata          | VERIFIED | generateMetadata, POST_SEO_BY_SLUG_QUERY, await params, type:'article' |
| `src/app/(site)/equipos/page.tsx`                 | Equipos index generateMetadata                | VERIFIED | generateMetadata at line 6, title 'Catalogo de Equipos', openGraph |
| `src/app/(site)/equipos/[slug]/page.tsx`          | Equipo detail dynamic generateMetadata        | VERIFIED | generateMetadata, EQUIPO_SEO_BY_SLUG_QUERY, await params, openGraph |
| `src/app/api/contact/route.ts`                    | Contact email with configurable sender        | VERIFIED | process.env.RESEND_FROM_EMAIL at line 14                         |
| `src/app/api/reclamo/route.ts`                    | Reclamo email with configurable sender        | VERIFIED | process.env.RESEND_FROM_EMAIL at line 47                         |
| `tests/seo.spec.ts`                               | E2E tests for SEO-01, SEO-02, SEO-03          | VERIFIED | All test groups present: SEO-01, SEO-02, SEO-03, Robots.txt      |

### Key Link Verification

| From                                        | To                                     | Via                                      | Status   | Details                                                            |
|---------------------------------------------|----------------------------------------|------------------------------------------|----------|--------------------------------------------------------------------|
| `src/app/sitemap.ts`                        | `src/sanity/client.ts`                 | client.fetch for post and equipo slugs   | WIRED    | `client.fetch(SITEMAP_POSTS_QUERY)` and `client.fetch(SITEMAP_EQUIPOS_QUERY)` with `.catch(() => [])` |
| `src/sanity/queries/seo.ts`                 | `src/sanity/schemas/post.ts`           | GROQ projection includes seoTitle        | WIRED    | POST_SEO_BY_SLUG_QUERY projects seoTitle, seoDescription, ogImage  |
| `src/app/(site)/blog/[slug]/page.tsx`       | `src/sanity/queries/seo.ts`            | import POST_SEO_BY_SLUG_QUERY            | WIRED    | Line 4: `import { POST_SEO_BY_SLUG_QUERY } from '@/sanity/queries/seo'`; used in generateMetadata |
| `src/app/(site)/equipos/[slug]/page.tsx`    | `src/sanity/queries/seo.ts`            | import EQUIPO_SEO_BY_SLUG_QUERY          | WIRED    | Line 4: `import { EQUIPO_SEO_BY_SLUG_QUERY } from '@/sanity/queries/seo'`; used in generateMetadata |
| `src/app/(site)/page.tsx`                   | `src/sanity/queries/seo.ts`            | import SITE_SEO_DEFAULTS_QUERY           | WIRED    | Line 6: `import { SITE_SEO_DEFAULTS_QUERY } from '@/sanity/queries/seo'`; used in generateMetadata |
| `src/app/api/contact/route.ts`              | `process.env.RESEND_FROM_EMAIL`        | env var for sender address               | WIRED    | Line 14: `process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'` |
| `src/app/api/reclamo/route.ts`              | `process.env.RESEND_FROM_EMAIL`        | env var for sender address               | WIRED    | Line 47: `process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'` |

### Requirements Coverage

| Requirement | Source Plan  | Description                                                    | Status       | Evidence                                                                 |
|-------------|--------------|----------------------------------------------------------------|--------------|--------------------------------------------------------------------------|
| SEO-01      | 04-01, 04-02 | Cada página tiene meta tags (title, description) administrables desde Sanity | SATISFIED    | All 7 pages export generateMetadata; homepage fetches Sanity siteSettings; blog/equipo detail pages fetch per-document SEO fields |
| SEO-02      | 04-01, 04-02 | Open Graph tags para compartir en redes sociales               | SATISFIED    | openGraph object in all 7 generateMetadata returns; OG images via urlFor().width(1200).height(630); blog posts set type:'article' |
| SEO-03      | 04-01, 04-03 | Sitemap XML generado automáticamente                           | SATISFIED    | sitemap.ts generates XML with 5 static routes + dynamic post/equipo slugs from Sanity; robots.ts references it |

No orphaned requirements found — all three requirements claimed in plan frontmatter are accounted for and fulfilled.

### Anti-Patterns Found

| File                               | Line | Pattern                                              | Severity | Impact                                                                     |
|------------------------------------|------|------------------------------------------------------|----------|----------------------------------------------------------------------------|
| `src/app/api/contact/route.ts`     | 15   | `// TODO: Replace with real email` on `to:` field    | Info     | The value IS the real production email (contacto@testingcalibrations.com.pe); the comment is misleading but the code is correct. Pre-existing from prior phase. |
| `src/app/api/reclamo/route.ts`     | 48   | `// TODO: Replace with real email` on `to:` field    | Info     | Same as above — value is already the real production address. Pre-existing. |

No blocker anti-patterns. The remaining TODO comments reference the `to:` recipient address (which is already set to the production email), not the `from:` sender address (which was this phase's scope).

### Human Verification Required

The following 5 items require human verification on the production VPS once it is deployed. These were acknowledged as deferred in 04-03-SUMMARY.md ("production verification deferred until VPS ready").

#### 1. Production Email Delivery — Contact Form

**Test:** Navigate to https://testingcalibrations.com.pe/contacto, fill out the contact form with real data, submit.
**Expected:** The company email (contacto@testingcalibrations.com.pe) receives the notification. The sender shows the verified domain (e.g., noreply@testingcalibrations.com.pe), not the Resend sandbox. Email does not land in spam.
**Why human:** Requires live production VPS with RESEND_FROM_EMAIL env var set and Resend domain verified with DNS records.

#### 2. Production Email Delivery — Reclamo Form

**Test:** Navigate to https://testingcalibrations.com.pe/libro-de-reclamaciones, fill out the reclamo form, submit.
**Expected:** Company email receives the reclamo notification with verified sender address.
**Why human:** Same environment requirement as contact form.

#### 3. Sanity Studio CORS on Production

**Test:** Navigate to https://testingcalibrations.com.pe/studio in a browser. Attempt to log in with Sanity credentials.
**Expected:** Studio loads fully without CORS errors in the browser console. Content (posts, equipos, siteSettings) is visible after login.
**Why human:** Requires the CORS origin https://testingcalibrations.com.pe to be added with credentials in manage.sanity.io. Cannot verify without the production URL live.

#### 4. WhatsApp Button on Real Mobile Device

**Test:** Open https://testingcalibrations.com.pe on a real mobile device (iOS or Android). Locate the floating WhatsApp button. Tap it.
**Expected:** WhatsApp opens with a pre-filled message. The company WhatsApp number is correct.
**Why human:** Real mobile device on live production URL required. Deep-link behavior cannot be tested programmatically.

#### 5. Env Var Audit on Production VPS

**Test:** SSH into the production VPS and run: `printenv | grep -E "NEXT_PUBLIC_SANITY|RESEND|SANITY_WRITE"`
**Expected:** All 6 variables are present (values can be redacted): NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SITE_URL, RESEND_API_KEY, RESEND_FROM_EMAIL, SANITY_WRITE_TOKEN.
**Why human:** Requires SSH access to the production server.

### Automated Checks Passed

- TypeScript compilation: `npx tsc --noEmit` passes with no errors
- All 5 git commits referenced in SUMMARY files verified to exist in repository history (df811f1, f8d1cd8, 6be28f8, f420be5, 69480f0)
- /studio not present in sitemap.ts routes
- robots.ts disallows both /studio and /studio/
- No metadata constant conflicts — all pages use generateMetadata exclusively

### Summary

All automated verifications pass. The 11 code-level must-haves are fully implemented and wired:

- SEO infrastructure (Sanity schema fields, GROQ queries, sitemap.ts, robots.ts, layout metadataBase) is complete and substantive
- All 7 public pages export generateMetadata with title, description, and openGraph — dynamic pages pull from Sanity with content fallbacks
- Both API routes use RESEND_FROM_EMAIL env var with sandbox fallback — hardcoded sender addresses removed

The single unverified truth (production services end-to-end) depends on production infrastructure that was not available at execution time. This is a known and documented deferral in 04-03-SUMMARY.md, not a gap introduced by incomplete implementation. The code changes are production-ready — the deferred items are environment and external service configuration, not code.

---

_Verified: 2026-03-18T12:00:00Z_
_Verifier: Claude (gsd-verifier)_
