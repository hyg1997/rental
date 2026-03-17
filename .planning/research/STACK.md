# Stack Research

**Domain:** Corporate services website with headless CMS (Sanity + Next.js)
**Researched:** 2026-03-17
**Confidence:** HIGH (core stack), MEDIUM (Hostinger deployment specifics)

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x (latest) | Frontend framework, SSR/SSG/ISR | App Router is now stable, React 19 support, superior SEO with server rendering, built-in image optimization, Incremental Static Regeneration for CMS-driven content |
| React | 19.x | UI library (peer of Next.js 15) | Required by Next.js 15 App Router; Server Components reduce client JS bundle |
| TypeScript | 5.x | Type safety | `next.config.ts` now natively supported; catches Sanity schema/query type mismatches early |
| Sanity Studio | 3.x / 5.x latest | Headless CMS | Free tier (3 users, generous CDN), flexible schema, real-time GROQ queries, embeds inside Next.js at `/studio` route |
| next-sanity | 9.x (latest) | Sanity toolkit for Next.js | Official integration: client setup, Live Content API, Visual Editing, webhook helpers; maintained by Sanity team |
| @sanity/client | 6.x (latest) | Low-level Sanity API client | Used when you need direct queries outside next-sanity abstractions |
| Tailwind CSS | 4.x | Utility-first CSS | CSS-first config (no tailwind.config.js), OKLCH colors, minimal setup, dark mode support, perfect for custom corporate designs |
| shadcn/ui | latest (Tailwind v4 branch) | Accessible component primitives | Copy-paste components (not a dependency), fully updated for Tailwind v4 + React 19, shadcn CLI handles theming |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-hook-form | ^7.x | Form state management | Contact/quotation forms; minimal re-renders, works with Server Actions |
| zod | ^3.x | Schema validation (TypeScript-first) | Validate form inputs client + server side with same schema; integrates via `zodResolver` |
| @hookform/resolvers | ^3.x | Bridge between RHF and Zod | Required when using Zod with react-hook-form |
| resend | ^3.x (or latest) | Transactional email | Sending contact form emails; 3,000 emails/month free tier; developer-friendly, React Email templates supported |
| groq | ^3.x | GROQ query language | Import `defineQuery` and `groq` from here when using static export workaround to avoid `next-sanity` Server Actions import |
| next-sanity/live | (subpath of next-sanity) | Live Content API (ISR revalidation) | Import from `next-sanity/live` subpath — required for `output: 'export'` compatibility |
| @sanity/image-url | ^1.x | Sanity image URL builder | Generating optimized image URLs from Sanity asset references |
| lucide-react | ^0.4xx | Icon library | Default icon set for shadcn/ui; consistent, tree-shakeable SVG icons |
| sonner | ^1.x | Toast notifications | Form submission feedback; lightweight, works with shadcn/ui |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint 9 | Linting | Natively supported by Next.js 15; use flat config format (`eslint.config.js`) |
| Prettier | Code formatting | Pair with `prettier-plugin-tailwindcss` to auto-sort Tailwind classes |
| `prettier-plugin-tailwindcss` | Tailwind class sorting | Automatically sorts utility classes in JSX; avoids team debates |
| Turbopack (dev only) | Fast dev server | `next dev --turbo` is stable in Next.js 15; up to 76% faster startup |
| Sanity CLI | Schema management, type generation | Run `sanity typegen generate` to generate TypeScript types from GROQ queries |
| `@sanity/codegen` / TypeGen | Type-safe GROQ | Generates types from queries so CMS data is fully typed end-to-end |

---

## Installation

```bash
# Scaffold Next.js 15 with TypeScript + Tailwind + App Router
npx create-next-app@latest testing-calibrations --typescript --tailwind --eslint --app --src-dir

# Sanity: add studio + client
npx sanity@latest init --env .env.local
npm install next-sanity @sanity/client @sanity/image-url groq

# UI components (shadcn/ui — Tailwind v4 compatible)
npx shadcn@latest init

# Form handling + validation
npm install react-hook-form @hookform/resolvers zod

# Email (contact form)
npm install resend

# Notifications
npm install sonner lucide-react

# Dev dependencies
npm install -D prettier prettier-plugin-tailwindcss
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Tailwind CSS v4 | Tailwind CSS v3 | Only if your design system is already built on v3 config files and you can't migrate; v4 is the current standard |
| shadcn/ui | Radix UI directly | If you need full control over every component without copy-paste — adds overhead, not worth it for a corporate brochureware site |
| shadcn/ui | MUI / Chakra UI | If building an admin-heavy app; these are bloated for a corporate marketing site |
| Resend | Nodemailer + SMTP | Nodemailer requires an always-running server and SMTP credentials; Resend has a REST API that works in serverless and edge functions |
| Resend | EmailJS | EmailJS exposes credentials on the frontend; Resend is server-side only (secure) |
| Next.js ISR + Node.js on Hostinger | Static export (`output: 'export'`) | Static export works on shared hosting but breaks Server Actions and next-sanity Live Content API; only use if Hostinger plan doesn't support Node.js |
| react-hook-form + Zod | Server-only validation | Both for client + server validation with the same schema via `zodResolver`; eliminates duplication |
| App Router | Pages Router | Pages Router is in maintenance mode; App Router is the present and future of Next.js |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `output: 'export'` (static export) on Hostinger shared hosting | next-sanity imports Server Actions internally, causing build failure: "Server Actions are not supported with static export". Known open issue #1899. Workarounds are brittle. | Use Hostinger's Node.js Web Apps Hosting (Business plan or above) and deploy as a standard Node.js app with `next start` |
| Sanity v4 Studio | Requires React 18 specifically; v5 is current and requires React 19 (aligned with Next.js 15 App Router) | Install `sanity@latest` which gives v5 |
| Styled-components / Emotion (CSS-in-JS) | Not compatible with React Server Components without special config; increases bundle size | Tailwind CSS v4 (zero runtime) |
| `getServerSideProps` (Pages Router SSR) | Pages Router pattern; not available in App Router | Server Components with `fetch` or `createClient` from `next-sanity` |
| Axios for API calls | Unnecessary abstraction; native `fetch` is fully supported in Next.js with extended caching options | Native `fetch` with Next.js cache options |
| `useCdn: true` in Sanity client when using ISR | Sanity CDN and Next.js ISR can serve stale data in conflict; CDN may return old content after ISR revalidation | Set `useCdn: false` when using ISR; use `useCdn: true` only for fully static builds |
| EmailJS | Exposes API keys on the client-side | Resend via a Next.js Server Action or Route Handler |

---

## Stack Patterns by Variant

**If Hostinger plan supports Node.js (Business or Cloud):**
- Deploy as a Node.js app with `next start`
- Use ISR (`revalidate` tag-based) with `next-sanity` webhooks for content freshness
- Set `useCdn: false` in Sanity client
- Set up a revalidation Route Handler (`/api/revalidate`) triggered by Sanity webhook

**If stuck on Hostinger shared hosting (no Node.js):**
- Use `output: 'export'` with manual workarounds: import `defineQuery`/`groq` from the `groq` package directly, `createClient` from `@sanity/client` — avoid importing from `next-sanity` main entry
- Import live features from `next-sanity/live` subpath only
- Lose Server Actions, ISR, and Sanity Visual Editing — significant DX regression
- Rebuild must be triggered manually or via CI/CD webhook when Sanity content changes
- **Recommendation: Strongly push for Node.js-capable plan**

**For the Sanity Studio route:**
- Embed Sanity Studio at `app/studio/[[...tool]]/page.tsx` using `next-sanity`
- Protect it with Sanity's built-in auth (login required) — no extra auth logic needed for v1
- Run studio on the same domain: `example.com/studio`

---

## Deployment: Hostinger Node.js Web Apps

Hostinger officially maintains `github.com/hostinger/deploy-nextjs` — a Next.js starter with deployment guide.

**Deployment steps:**
1. Push project to GitHub
2. In Hostinger hPanel → Websites → Node.js Apps → Import Git Repository
3. Hostinger auto-detects Next.js build settings
4. Add environment variables in Hostinger app settings (never commit `.env.local`)
5. Click Deploy — Hostinger runs `npm install && npm run build && npm start`

**Environment variables needed on Hostinger:**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_READ_TOKEN=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Node.js versions supported by Hostinger:** 18.x, 20.x, 22.x, 24.x — use 20.x (LTS) for stability.

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| next@15.x | react@19.x, react-dom@19.x | App Router requires React 19; Pages Router supports React 18 too |
| sanity@5.x (Studio) | react@19.x | v5 released Dec 2025, requires React 19.2+ |
| next-sanity@9.x | next@15.x, sanity@3.x+ | Check `next-sanity/MIGRATE-v7-to-v8.md` if upgrading from v7 |
| tailwindcss@4.x | postcss@8.x | CSS-first config; no `tailwind.config.js` needed |
| shadcn/ui (latest) | tailwindcss@4.x, react@19.x | All components updated for Tailwind v4 + React 19 (forwardRefs removed) |
| react-hook-form@7.x | react@18.x, react@19.x | Compatible with both React 18 and 19 |
| zod@3.x | (standalone) | Zod v4 is in development — stick with v3 for now, it's stable and well-supported |
| resend@3.x | Node.js 18+ | Works in Next.js Server Actions and Route Handlers |

---

## Critical Deployment Decision

The most important stack decision for this project is **which Hostinger plan to use**:

- **Shared hosting only** → forced to use `output: 'export'` → loses ISR, Server Actions, Sanity Live Content, and next-sanity main integration. High friction, brittle.
- **Business or Cloud hosting (Node.js support)** → full Next.js 15 capabilities, deploy with `next start`, ISR works, all next-sanity features available.

**Recommendation: Confirm Hostinger plan supports Node.js Web Apps before starting.** If the client has a shared hosting plan only, the roadmap must account for CI/CD-triggered static rebuilds on every Sanity content update, which adds complexity.

---

## Sources

- [Next.js 15 official release blog](https://nextjs.org/blog/next-15) — Next.js 15 features, async request APIs, caching changes, React 19 support (HIGH confidence)
- [Sanity Studio v5 announcement](https://www.sanity.io/blog/sanity-studio-v5) — v5 React 19 requirement, release timeline (HIGH confidence)
- [next-sanity GitHub](https://github.com/sanity-io/next-sanity) — official integration toolkit, static export issue #1899, subpath exports workaround (HIGH confidence)
- [Hostinger deploy-nextjs official repo](https://github.com/hostinger/deploy-nextjs) — deployment guide maintained by Hostinger (HIGH confidence)
- [Hostinger Node.js hosting](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/) — supported Node.js versions, deployment process (HIGH confidence)
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) — Tailwind v4 + React 19 component updates (HIGH confidence)
- [Resend Next.js integration](https://resend.com/docs/send-with-nextjs) — free tier limits, SDK usage (HIGH confidence)
- [WebSearch: next-sanity static export issue](https://github.com/sanity-io/next-sanity/issues/1899) — known incompatibility between next-sanity and `output: 'export'` (HIGH confidence, open GitHub issue)
- [WebSearch: Sanity ISR + useCdn guidance](https://www.sanity.io/answers/understanding-getstaticprops-and-preview-mode-for-a-next-js-sanity-site) — useCdn false when using ISR (MEDIUM confidence)

---

*Stack research for: Corporate services website (Sanity CMS + Next.js + Hostinger)*
*Researched: 2026-03-17*
