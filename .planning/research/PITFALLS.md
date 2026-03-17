# Pitfalls Research

**Domain:** Corporate website — Sanity CMS + Next.js on Hostinger VPS
**Researched:** 2026-03-17
**Confidence:** HIGH (deployment), HIGH (Sanity limits), MEDIUM (schema/ISR)

---

## Critical Pitfalls

### Pitfall 1: Deploying to Hostinger Shared Hosting Instead of VPS

**What goes wrong:**
The site is built, uploaded to Hostinger shared hosting (hPanel), and nothing works. API routes for the contact form return no response. The site might serve the homepage statically but all dynamic behavior is silently broken.

**Why it happens:**
Hostinger shared hosting runs Apache/LiteSpeed optimized for PHP and static files. It cannot run a persistent Node.js process. Without a running Node.js server, Next.js API routes, server-side rendering, and any server-side logic simply do not execute.

**How to avoid:**
Confirm Hostinger's plan is VPS (not shared). The project requires VPS to run `next start` via PM2. In `next.config.js`, do NOT set `output: 'export'` — that locks you into static-only mode, which breaks the contact form API route. Verify the Hostinger account has SSH access before starting development.

**Warning signs:**
- No SSH access to the server
- cPanel/hPanel shows a file manager but no terminal
- Hostinger plan is labeled "Business" or "Premium" (shared) rather than VPS

**Phase to address:** Phase 1 — Infrastructure Setup (verify hosting type before writing any code)

---

### Pitfall 2: Sanity Free Tier Bandwidth Hard Stop — No Graceful Degradation

**What goes wrong:**
The site goes live, gets indexed by Google, and image-heavy pages (equipment catalog) start serving traffic. When Sanity's free tier 10 GB bandwidth is exhausted, the Sanity CDN stops serving all assets. Images fail to load, content queries fail, and the site appears broken to visitors. There is no warning — it stops immediately.

**Why it happens:**
Sanity's Free plan has a hard cap with no overages. When bandwidth is consumed, public API/CDN access is blocked until the next billing cycle. The Sanity Studio remains usable but the live site stops working. Equipment catalog pages with multiple high-resolution images are the primary bandwidth consumers.

**How to avoid:**
- Use Sanity's image URL builder with explicit width, quality, and format parameters on every image. Never pass raw Sanity image references to `next/image` without transformation.
- Set `auto=format` on all image URLs to serve WebP/AVIF instead of raw JPEG/PNG.
- Set image quality to 75-80 (not 100) for catalog images.
- Use `useCdn: true` in Sanity client for read queries — this routes through Sanity's CDN cache and reduces API request count.
- Monitor usage in Sanity management dashboard monthly.
- If the site grows past 5 GB/month in images, upgrade to the Growth plan ($15/month) before hitting the cap.

**Warning signs:**
- Image-heavy equipment catalog pages with no width/quality constraints on Sanity URLs
- Raw `asset.url` used in `<img>` tags instead of transformed URLs
- No Sanity usage monitoring set up

**Phase to address:** Phase 2 — Sanity Schema and Content Modeling (enforce image transformation in the data access layer from the start)

---

### Pitfall 3: Next.js Image Optimization Double-Processing Sanity CDN Assets

**What goes wrong:**
`next/image` is configured to download images from Sanity CDN, re-process them through Next.js's built-in image optimizer, and serve them from the VPS. This creates two problems: (a) it consumes significant VPS memory and CPU on a small Hostinger instance, and (b) it bypasses Sanity CDN's global edge caching, serving images from a single Peru-region VPS to all visitors.

**Why it happens:**
The default `next/image` behavior routes images through Next.js's optimizer. Developers add `cdn.sanity.io` to `next.config.js` `images.domains` and use `next/image` thinking optimization happens automatically. It does — but via the VPS, not Sanity's CDN.

**How to avoid:**
Use a custom `loader` for `next/image` that generates Sanity CDN URLs with transformation parameters. The `next-sanity-image` package (v6+) handles this correctly. This tells `next/image` to use Sanity's CDN as the image transformation layer, not the VPS.

```js
// next.config.js
images: {
  loader: 'custom',
  loaderFile: './lib/sanity-image-loader.js',
}
```

Alternatively, configure `remotePatterns` to point to `cdn.sanity.io` and use the `@sanity/image-url` builder to pre-generate properly-sized URLs — then pass those URLs to a regular `<img>` tag with `loading="lazy"`.

**Warning signs:**
- High VPS memory/CPU usage correlating with page loads
- Sanity bandwidth not decreasing despite "optimization"
- Images served from your VPS domain instead of `cdn.sanity.io`

**Phase to address:** Phase 2 — Sanity + Next.js Integration (establish image handling pattern before building any pages)

---

### Pitfall 4: Contact Form API Route Silently Fails Due to Missing SMTP Config

**What goes wrong:**
The contact form appears to submit successfully (no error shown), but emails never arrive. The form works in local development with a test SMTP service but fails in production because the environment variables are not set on the VPS.

**Why it happens:**
`.env.local` is in `.gitignore` (correct) and never deployed to the server. The developer builds the app on the VPS without setting environment variables, and Nodemailer either fails silently or throws an unhandled error that Next.js swallows into a 500 response.

**How to avoid:**
- Create a `/api/contact` route that explicitly returns a 500 with a message when SMTP credentials are missing (validate env vars at startup, not on first request).
- Use Hostinger's own SMTP (smtp.hostinger.com, port 587) — credentials match the email account in hPanel. This avoids Gmail OAuth complexity.
- Set environment variables directly on the VPS via SSH before building: `export SMTP_HOST=smtp.hostinger.com` or use a `.env` file (not `.env.local`) on the server.
- Test the contact form from the production domain before marking the feature complete.

**Warning signs:**
- No logging/alerting on failed form submissions
- Form returns a 200 status regardless of SMTP result
- PM2 logs not checked after deployment

**Phase to address:** Phase 3 — Contact Form Feature (verify email delivery as part of acceptance criteria, not as an afterthought)

---

### Pitfall 5: Sanity CORS Not Configured for Production Domain

**What goes wrong:**
Sanity Studio embedded in Next.js (`/studio` route) works perfectly in localhost but fails in production. Editors try to log in and get a CORS error or blank screen. Content changes cannot be saved.

**Why it happens:**
Sanity requires production domains to be explicitly whitelisted in the project's CORS settings at sanity.io/manage. By default, only `localhost:3000` is allowed. "Allow credentials" must also be checked, not just the domain.

**How to avoid:**
Before deploying, go to sanity.io/manage → project → API → CORS Origins. Add the production domain (e.g., `https://testingcalibrations.com`) with "Allow credentials" enabled. Also add `http://localhost:3000` for local development. Never use `*` as a wildcard in production — it allows any origin to read the project's data.

**Warning signs:**
- Testing only from localhost during development
- No checklist item for CORS in the deployment process
- Studio works locally but a brief test on production staging was skipped

**Phase to address:** Phase 4 — Deployment (CORS configuration is a deployment step, not a development step)

---

### Pitfall 6: Sanity Schema Arrays Inside Arrays Cause Editor to Silently Break

**What goes wrong:**
The equipment catalog schema uses a Portable Text field nested inside an array (page builder pattern). When editors try to add content inside that block, the Sanity Studio either crashes, saves incorrectly, or patches the wrong array index.

**Why it happens:**
Sanity's data store does not support arrays inside arrays. Portable Text is itself an array of blocks. Placing a `portable text` field directly inside a `type: 'array'` causes data corruption. Sanity Studio does not always validate this at schema-write time — it silently allows the structure and fails at runtime.

**How to avoid:**
Wrap any Portable Text field in an object type before placing it inside an array. Schema structure: `array of objects → object contains portableText field`. For this corporate site, avoid page builders entirely — use fixed schemas for each page type (homepage sections, equipment, blog posts). This project is small enough that fixed schemas are simpler and safer.

**Warning signs:**
- Sanity console warnings about nested arrays during studio boot
- Editor says "it sometimes saves, sometimes doesn't"
- Content inconsistently appears on the site after publishing

**Phase to address:** Phase 2 — Sanity Schema Design (review schema before populating content)

---

### Pitfall 7: Content Updates Not Visible on Live Site (ISR Cache Not Invalidating)

**What goes wrong:**
The editor publishes a new equipment item or edits a blog post in Sanity Studio. The live site continues showing the old content for hours or indefinitely. The editor loses trust in the CMS.

**Why it happens:**
Next.js ISR (Incremental Static Regeneration) caches pages for a configured duration. Without on-demand revalidation, pages only refresh after the `revalidate` interval elapses. Additionally, if `useCdn: true` is set in the Sanity client used during build, ISR revalidation may still pull stale data from Sanity's CDN cache.

**How to avoid:**
- Use Sanity webhooks + Next.js `revalidateTag` or `revalidatePath` API route to trigger cache invalidation on every Sanity publish event.
- Use `useCdn: false` in the Sanity client used inside API revalidation routes (so fresh data is fetched, not CDN-cached data).
- For this site's scale, a `revalidate: 60` (1 minute) as a fallback is acceptable — but the webhook-based approach is the correct pattern.
- Configure the Sanity webhook in sanity.io/manage pointing to `https://yourdomain.com/api/revalidate`.

**Warning signs:**
- No Sanity webhook configured pointing to the production site
- Using `useCdn: true` everywhere including build/revalidation clients
- Editor reports "I published but the site didn't change"

**Phase to address:** Phase 3 — CMS Integration & Revalidation (set up before content editing begins)

---

### Pitfall 8: VPS Runs Out of RAM During `next build`

**What goes wrong:**
The deployment pipeline runs `npm run build` on the Hostinger VPS. The build process is killed mid-way with an out-of-memory error or the server becomes unresponsive. The site is left in a broken state.

**Why it happens:**
Next.js build is memory-intensive. TypeScript compilation, image optimization, and static page generation all run concurrently. A VPS with 1 GB RAM is the minimum reported threshold; 2 GB is recommended for reliable builds of modern Next.js apps.

**How to avoid:**
- Build locally or in CI (GitHub Actions), then deploy only the build artifacts (`.next/` directory) to the VPS via `rsync` or Docker.
- If building on VPS, add a swap file (2 GB) as a safety net: `fallocate -l 2G /swapfile`.
- Check VPS RAM tier before committing to build-on-server workflow.
- Preferred approach: GitHub Actions builds on runners (free 7 GB RAM), artifacts deployed to VPS via SSH.

**Warning signs:**
- VPS plan is 1 GB RAM
- Build command is run directly on the server during deployment
- No swap file configured on the VPS

**Phase to address:** Phase 1 — Infrastructure Setup (choose deployment strategy before writing any deployment scripts)

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcode Spanish text in components instead of Sanity fields | Faster initial build | Client cannot edit that content; requires dev to update | Never — defeats the CMS purpose |
| Use raw `asset.url` for images (no transformation) | Simpler image code | Blows through Sanity bandwidth cap; slow loads | Never for production |
| Build directly on VPS instead of CI | No CI setup time | RAM kills, broken deployments, no rollback | Never after initial proof |
| Use `cache: 'no-store'` on all Sanity queries | Always fresh data | Sanity API request quota consumed fast; slow pages | Only in Studio preview/draft mode |
| Embed Sanity Studio at `/admin` in Next.js project | Single deployment | Studio bloats Next.js bundle; harder to separate later | Acceptable for MVP on this project |
| Skip Sanity webhook, rely only on `revalidate: 60` | No webhook complexity | Editors see stale content for up to 1 minute | Acceptable for MVP, but flag as tech debt |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Sanity + Next.js images | Using `images.domains` config with raw Sanity URLs | Use custom loader via `next-sanity-image` or `@sanity/image-url` builder with width/quality params |
| Hostinger SMTP + Nodemailer | Using Gmail OAuth (complex, credential rotation) | Use Hostinger's own SMTP: `smtp.hostinger.com`, port 587, credentials from hPanel email account |
| Sanity CORS + production deploy | Forgetting to add production domain with "Allow credentials" | Add domain to CORS list in sanity.io/manage before going live |
| PM2 + Next.js on VPS | Running `node server.js` directly (process dies on SSH exit) | Use `pm2 start npm --name "site" -- start` + `pm2 save` + `pm2 startup` |
| Nginx + Next.js | Not setting `proxy_http_version 1.1` (WebSockets/streaming broken) | Use standard Next.js reverse proxy config with upgrade headers |
| Sanity webhooks + ISR | Using CDN client for revalidation fetch (stale data) | Use `useCdn: false` in the revalidation API route's Sanity client |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Serving full-resolution equipment images from Sanity CDN | Slow catalog page loads; high Sanity bandwidth | Always apply width and quality transforms on Sanity image URLs | Immediately on first real images uploaded |
| Next.js image optimizer on VPS re-downloading Sanity assets | High CPU/memory on VPS; slow image responses | Use Sanity CDN as image transformer via custom loader | At ~100 concurrent users on a 2GB VPS |
| Fetching all equipment in a single GROQ query without pagination | Catalog page slow to render | Paginate: fetch 12-20 items per page with offset/limit in GROQ | At ~50+ equipment items |
| No lazy loading on homepage hero image | LCP score tanks | Use `priority` prop on hero image only; `loading="lazy"` on everything else | Immediately — visible in Core Web Vitals |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Exposing Sanity write token in frontend environment variables | Anyone can write/delete content | Only use `SANITY_API_TOKEN` (write token) in server-side code; use read-only token (or no token) for public queries |
| Contact form with no rate limiting or CAPTCHA | Spam submissions flood the inbox | Add simple honeypot field or use Cloudflare Turnstile (free); rate-limit the `/api/contact` route |
| Committing `.env` file with SMTP credentials to Git | Credential exposure | Use `.env.local` (gitignored) locally; set env vars on VPS via SSH directly |
| Sanity CORS set to `*` wildcard | Any origin can query the project's content | Whitelist only known domains in Sanity CORS settings |
| Nginx not configured with HTTPS | Data transmitted in plain text | Use Certbot (Let's Encrypt) for free SSL on the VPS — Hostinger VPS supports this |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| WhatsApp floating button overlaps mobile footer content | Mobile users cannot tap footer links or form submit buttons | Position button with enough bottom offset; test at 360px viewport width |
| Contact form has no loading state during submission | User double-submits; unclear if form worked | Disable submit button + show spinner on submit; show success/error message after response |
| Equipment catalog has no empty state message | If Sanity has no content yet, page is blank — looks broken | Add placeholder content or a "No items found" state from day one |
| Images without explicit dimensions cause layout shift | High Cumulative Layout Shift (CLS) score | Always provide `width` and `height` to `next/image`; use Sanity's image metadata for aspect ratio |
| Blog page with no posts shows a blank grid | Looks unfinished during content population phase | Add placeholder cards or a "Próximamente" message |

---

## "Looks Done But Isn't" Checklist

- [ ] **Contact form:** Test actual email delivery from production domain — not just "form submits without error"
- [ ] **Sanity Studio in production:** Log in and save a document from the production URL — CORS errors only appear in production
- [ ] **Image optimization:** Inspect network tab — images should come from `cdn.sanity.io` with transformation params, not from the VPS domain
- [ ] **ISR revalidation:** Publish a content change in Sanity and verify it appears on live site within configured interval
- [ ] **Mobile WhatsApp button:** Test at 360px width that it does not overlap form submit or footer navigation
- [ ] **SEO meta tags:** Check Open Graph with Facebook Sharing Debugger; check that title/description appear in Google Search Console preview
- [ ] **PM2 persistence:** Reboot the VPS and verify the site comes back up automatically without SSH intervention
- [ ] **Sitemap:** Verify `sitemap.xml` is accessible at the root domain and includes all page URLs
- [ ] **Environment variables on VPS:** SSH in and run `pm2 env 0` to confirm all env vars are present — not just locally

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Deployed to shared hosting instead of VPS | HIGH | Upgrade Hostinger plan to VPS; re-deploy from scratch; no data loss (content in Sanity) |
| Sanity bandwidth cap exceeded, site broken | LOW | Upgrade to Growth plan ($15/month) — service restored immediately |
| Contact form never sent emails (SMTP misconfigured) | MEDIUM | Set correct env vars on VPS; `pm2 restart all`; notify client of any missed leads via alternative channel |
| Content not updating (ISR not configured) | MEDIUM | Add webhook + revalidation API route; trigger manual rebuild via `pm2 restart` as immediate fix |
| Schema nested arrays corrupted content | HIGH | Refactor schema; write migration script to fix existing documents; test in Sanity dev dataset first |
| Build OOM kills on VPS | MEDIUM | Add swap file; build locally and push artifacts; or switch to GitHub Actions CI |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Shared hosting vs VPS confusion | Phase 1 — Infrastructure | SSH access confirmed; PM2 running; `next start` serves on port 3000 |
| Build OOM on VPS | Phase 1 — Infrastructure | Deployment workflow tested; swap file present or CI builds confirmed |
| Sanity CORS not configured | Phase 1 — Infrastructure (initial) + Phase 4 — Deploy (production domain) | Log in to Sanity Studio from production URL successfully |
| Sanity image bandwidth blow-out | Phase 2 — Sanity + Next.js Integration | Verify image URLs in network tab contain width/quality/format params |
| Next.js double-processing images | Phase 2 — Sanity + Next.js Integration | Images served from `cdn.sanity.io`, not VPS domain |
| Nested array schema corruption | Phase 2 — Sanity Schema Design | Run content population test; editor can add items without errors |
| Contact form SMTP silent failure | Phase 3 — Contact Form Feature | Email received from production domain during acceptance testing |
| ISR cache not invalidating | Phase 3 — CMS Integration | Publish change in Sanity; verify on live site within 60 seconds via webhook |
| Sanity free tier limits | Phase 2 (image optimization) + ongoing monitoring | Monthly dashboard check; image URL params enforced in code review |
| WhatsApp button overlaps mobile UI | Phase 3 — Frontend Build | Test at 360px viewport; no overlap with interactive elements |

---

## Sources

- [Sanity Technical Limits — Official Docs](https://www.sanity.io/docs/content-lake/technical-limits)
- [Sanity Plans and Payments — Official Docs](https://www.sanity.io/docs/platform-management/plans-and-payments)
- [Sanity CORS Configuration — Official Docs](https://www.sanity.io/docs/cors)
- [Next.js Static Exports Guide](https://nextjs.org/docs/app/guides/static-exports)
- [Next.js Self-Hosting Guide](https://nextjs.org/docs/app/guides/self-hosting)
- [How to Deploy Next.js to Hostinger VPS — ayyaztech.com (2025)](https://ayyaztech.com/blog/how-to-deploy-nextjs-to-hostinger-vps-complete-guide-2025)
- [Deploy Next.js on Hostinger — DEV Community](https://dev.to/oandersonmagalhaes/deploying-your-nextjs-project-on-hostinger-4gpm)
- [Next.js on Hostinger Shared Hosting — ThapaTechnical (2026)](https://www.thapatechnical.com/2026/02/how-to-deploy-nextjs-to-shared-hosting.html)
- [Sanity bandwidth exceeded — community discussion](https://www.sanity.io/answers/discussion-on-bandwidth-limits-and-overages-for-sanity-s-free-plan--)
- [Sanity CORS CORS error discussion](https://www.sanity.io/answers/cors-error-no-access-control-origin-header-is-present)
- [next-sanity-image plugin](https://www.sanity.io/plugins/next-sanity-image)
- [Practical image rendering guide for Sanity and Next.js — DEV Community](https://dev.to/fibonacid/practical-image-rendering-guide-for-sanity-and-nextjs-3gc7)
- [On-Demand ISR with Next.js and Sanity — finiam.com](https://blog.finiam.com/blog/on-demand-isr-with-next-js-and-sanity)
- [Sanity nested arrays issue — GitHub](https://github.com/sanity-io/sanity/issues/1418)
- [How to Design Flexible Sanity Schemas — Halo Lab](https://www.halo-lab.com/blog/creating-schema-in-sanity)
- [Next.js Send Email Tutorial — Mailtrap](https://mailtrap.io/blog/nextjs-send-email/)
- [Sanity high bandwidth for static site — community discussion](https://www.sanity.io/answers/high-bandwidth-usage-for-static-site-built-on-next-js--hosted-on-vercel--using-sanity-io-for-image-assets-)

---
*Pitfalls research for: Sanity CMS + Next.js corporate website on Hostinger VPS*
*Researched: 2026-03-17*
