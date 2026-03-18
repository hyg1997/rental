# Phase 3: Content Pages and Contact - Research

**Researched:** 2026-03-17
**Domain:** Next.js 15 App Router, Sanity GROQ/Portable Text, Resend email, animated counters, hero carousel, libro de reclamaciones, blog with @portabletext/react
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOME-01 | Usuario ve hero banner rotativo con imágenes, texto y CTAs administrables desde Sanity | `banner` schema already exists; GROQ fetches all active banners ordered by `orden`; CSS-only or framer-motion carousel |
| HOME-02 | Usuario ve sección de servicios que describe qué hace la empresa | Static or Sanity-driven section; `pagina` or `siteSettings` can hold services content |
| HOME-03 | Usuario ve sección "Por qué elegirnos" con valores diferenciadores e íconos | Static content with lucide-react icons or Sanity-managed array |
| HOME-04 | Usuario ve grid de equipos destacados con link al catálogo | GROQ `*[_type == "equipo" && destacado == true]` with existing equipment components |
| HOME-05 | Usuario ve métricas de experiencia con contadores animados (clientes, proyectos, años, etc.) | Intersection Observer API + CSS counter animation; no library needed |
| HOME-06 | Usuario ve sección/enlace al libro de reclamaciones | CTA link to `/libro-de-reclamaciones`; schema already exists |
| INST-01 | Usuario puede ver página "Nosotros" con historia y valores de la empresa | `/nosotros` route; uses `pagina` schema OR static content; PortableText for rich content |
| INST-02 | Footer muestra datos de contacto, dirección, redes sociales y links de navegación | Footer component already exists and is wired to siteSettings — needs styling polish only |
| CONT-01 | Usuario puede enviar formulario de contacto/cotización que notifica por email | Next.js API route (`/api/contact`) + Resend SDK; VPS architecture confirmed |
| CONT-02 | Usuario puede abrir WhatsApp con mensaje predefinido desde botón flotante | WhatsAppButton component already exists and is wired — done |
| CONT-03 | Página de contacto muestra ubicación, teléfono, email y mapa | `/contacto` page; siteSettings data + Google Maps embed iframe |
| CONT-04 | Usuario puede enviar reclamo a través del libro de reclamaciones (formulario según normativa peruana) | `/libro-de-reclamaciones` route; `reclamo` schema already defined with all required fields |
| CONT-05 | Reclamos se guardan en Sanity y se envía email de notificación | Sanity write token + `client.create()` in API route; Resend for email notification |
| BLOG-01 | Usuario puede ver listado de artículos del blog con imagen, título y extracto | `/blog` page; GROQ `*[_type == "post"]` with `titulo`, `slug`, `extracto`, `imagen` fields |
| BLOG-02 | Usuario puede leer artículo completo con contenido rich text (Portable Text) | `/blog/[slug]` with `@portabletext/react`; `post.contenido` is already a Portable Text array |
| BLOG-03 | Artículos son administrables desde Sanity con categorías y autor | `post` schema already has `autor`, `categoria`, `fechaPublicacion` fields — complete |
</phase_requirements>

---

## Summary

Phase 3 completes the public-facing site. All Sanity schemas needed for this phase are already defined (banner, post, reclamo, pagina, siteSettings) — no schema changes required. The layout shell (Navbar, Footer, WhatsAppButton) is already wired to siteSettings. This phase is primarily about building UI pages and adding email delivery capability.

The two genuinely new technical problems are: (1) email sending via Resend from Next.js API routes, and (2) writing reclamo documents to Sanity from a public form (requires a write token with limited permissions). Everything else uses patterns established in Phases 1 and 2.

The hero banner carousel is the highest visual complexity item. Since `tw-animate-css` is already installed, CSS-only auto-play carousel is feasible without adding libraries. For animated counters (HOME-05), a lightweight Intersection Observer + CSS/JS counter approach avoids adding framer-motion to the bundle.

**Primary recommendation:** Add `resend` as the only new package. Use Next.js API routes for both contact form and reclamo submission. Keep hero carousel CSS-only or with a minimal headless approach. Avoid framer-motion — `tw-animate-css` covers transition needs.

---

## Standard Stack

### Core (no new packages except Resend)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @sanity/client | ^7.17.0 | GROQ queries (read) + document creation (write, reclamos) | Already installed; write capability via token |
| @portabletext/react | ^6.0.3 | Render blog post `contenido` Portable Text | Already installed; only correct way to render Sanity block content |
| groq | ^5.17.1 | defineQuery for type-safe queries | Already installed; confirmed pattern |
| resend | ^4.x | Transactional email from API routes | Official SDK, Vercel-ecosystem, 100 free emails/day |
| lucide-react | ^0.577.0 | Icons for services, valores, and social links | Already installed |
| next | 16.1.7 | App Router, API routes, Server Components | Already installed |

### New Package Required
| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| resend | ^4.x | Email delivery for contact form and reclamos | VPS architecture (confirmed Phase 1) enables server-side API routes; Resend is simpler than Nodemailer + SMTP setup; free tier handles v1 volume |

**Installation:**
```bash
npm install resend
```

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Resend | Nodemailer + Hostinger SMTP | Nodemailer requires SMTP credentials, port 587/465, TLS config — more moving parts; Resend is one SDK call |
| Resend | EmailJS (client-side) | EmailJS exposes API key in client bundle; Resend runs server-side in API route — correct for VPS |
| CSS-only carousel | Swiper.js / embla-carousel | Swiper adds ~30KB; embla adds ~10KB; for 3-5 banner slides, CSS auto-play with `animation` is sufficient and zero-bundle-cost |
| Intersection Observer (manual) | framer-motion `useInView` | framer-motion is ~100KB; Intersection Observer API is native and achieves same effect |
| Google Maps embed (iframe) | @react-google-maps/api | iframe embed requires no API key for basic display; `@react-google-maps/api` adds complexity and cost; static embed is sufficient for contact page |

---

## Architecture Patterns

### Recommended Project Structure Additions
```
src/
├── app/
│   ├── (site)/
│   │   ├── page.tsx                         # Homepage — replace placeholder; hero + sections
│   │   ├── nosotros/
│   │   │   └── page.tsx                     # INST-01 — company history/values
│   │   ├── contacto/
│   │   │   └── page.tsx                     # CONT-01, CONT-03 — form + map + contact data
│   │   ├── libro-de-reclamaciones/
│   │   │   └── page.tsx                     # CONT-04 — regulated complaint form
│   │   └── blog/
│   │       ├── page.tsx                     # BLOG-01 — post list
│   │       └── [slug]/
│   │           └── page.tsx                 # BLOG-02 — post detail with PortableText
│   └── api/
│       ├── contact/
│       │   └── route.ts                     # CONT-01 — POST handler; sends email via Resend
│       └── reclamo/
│           └── route.ts                     # CONT-05 — POST handler; saves to Sanity + sends email
├── components/
│   ├── home/
│   │   ├── hero-carousel.tsx                # HOME-01 — 'use client'; banner rotation
│   │   ├── services-section.tsx             # HOME-02 — server or static
│   │   ├── values-section.tsx               # HOME-03 — "Por qué elegirnos"
│   │   ├── featured-equipment.tsx           # HOME-04 — reuses EquipmentCard
│   │   ├── metrics-counter.tsx              # HOME-05 — 'use client'; Intersection Observer
│   │   └── reclamaciones-cta.tsx            # HOME-06 — link to /libro-de-reclamaciones
│   ├── blog/
│   │   ├── post-card.tsx                    # BLOG-01 — blog list item
│   │   └── portable-text-renderer.tsx       # BLOG-02 — custom components for PortableText
│   └── forms/
│       ├── contact-form.tsx                 # CONT-01 — 'use client'; form + submit logic
│       └── reclamo-form.tsx                 # CONT-04 — 'use client'; regulated fields
├── sanity/
│   └── queries/
│       ├── banners.ts                       # HOME-01 — active banners ordered by orden
│       ├── posts.ts                         # BLOG-01, BLOG-02, BLOG-03
│       └── home.ts                          # HOME-04 — featured equipos + home content
└── lib/
    └── resend.ts                            # Shared Resend client instance
```

### Pattern 1: Next.js API Route for Email (Resend)
**What:** A POST handler at `/api/contact` that reads form data from the request body and sends an email using the Resend SDK. The Resend API key is stored in an environment variable, never in client code.
**When to use:** All email sending — contact form (CONT-01) and reclamo notification (CONT-05).

```typescript
// src/app/api/contact/route.ts
// Source: https://resend.com/docs/send-with-nextjs
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { nombre, email, telefono, mensaje } = body

  // Basic validation
  if (!nombre || !email || !mensaje) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const { data, error } = await resend.emails.send({
    from: 'web@testingcalibrations.com.pe',  // must be verified domain in Resend
    to: ['contacto@testingcalibrations.com.pe'],
    subject: `Nueva consulta de ${nombre}`,
    html: `<p><strong>Nombre:</strong> ${nombre}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Teléfono:</strong> ${telefono ?? '—'}</p>
           <p><strong>Mensaje:</strong> ${mensaje}</p>`,
  })

  if (error) {
    return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data?.id })
}
```

### Pattern 2: Contact Form ('use client' + fetch)
**What:** Client component that manages form state with `useState`, submits via `fetch('/api/contact', ...)`, shows loading and success/error states. No `useFormState` or Server Actions required — keeps form portable.
**When to use:** `/contacto` page contact form and quote form.

```typescript
// src/components/forms/contact-form.tsx
'use client'
import { useState } from 'react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const formData = new FormData(e.currentTarget)
    const body = Object.fromEntries(formData)

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setStatus(res.ok ? 'success' : 'error')
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* fields using shadcn Input component */}
      {status === 'loading' && <p>Enviando...</p>}
      {status === 'success' && <p>Mensaje enviado. Nos pondremos en contacto pronto.</p>}
      {status === 'error' && <p>Error al enviar. Intenta nuevamente.</p>}
    </form>
  )
}
```

### Pattern 3: Reclamo Submission (Sanity Write + Email)
**What:** The `/api/reclamo` POST handler creates a document in Sanity using a write-capable client token, then sends an email notification. The write token must be stored in `SANITY_WRITE_TOKEN` env var (never `NEXT_PUBLIC_`).
**When to use:** CONT-04 + CONT-05 reclamo form submission.

```typescript
// src/app/api/reclamo/route.ts
import { createClient } from '@sanity/client'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

// Server-only client with write token — NOT the shared client.ts
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,  // NEVER NEXT_PUBLIC_
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const body = await request.json()

  // 1. Save to Sanity
  const doc = await writeClient.create({
    _type: 'reclamo',
    fechaReclamo: new Date().toISOString(),
    nombreConsumidor: body.nombreConsumidor,
    dniRuc: body.dniRuc,
    emailConsumidor: body.emailConsumidor,
    telefonoConsumidor: body.telefonoConsumidor,
    tipoReclamo: body.tipoReclamo,
    bienServicio: body.bienServicio,
    detalle: body.detalle,
    pedido: body.pedido,
    estado: 'pendiente',
  })

  // 2. Send email notification
  await resend.emails.send({
    from: 'web@testingcalibrations.com.pe',
    to: ['contacto@testingcalibrations.com.pe'],
    subject: `Nuevo reclamo de ${body.nombreConsumidor}`,
    html: `<p>Reclamo registrado en Sanity: ${doc._id}</p>
           <p>Tipo: ${body.tipoReclamo}</p>
           <p>Detalle: ${body.detalle}</p>`,
  })

  return NextResponse.json({ success: true, reclamoId: doc._id })
}
```

### Pattern 4: Hero Banner Carousel (CSS-only, Sanity-driven)
**What:** Server component fetches active banners from Sanity, passes array to a `'use client'` carousel component that rotates slides using `setInterval`. Uses CSS transitions for slide animation.
**When to use:** HOME-01 — hero section on homepage.

```typescript
// src/sanity/queries/banners.ts
import { defineQuery } from 'groq'

export const BANNERS_QUERY = defineQuery(`
  *[_type == "banner" && activo == true] | order(orden asc) {
    _id,
    titulo,
    subtitulo,
    "imagen": imagen,
    ctaTexto,
    ctaUrl
  }
`)
```

```typescript
// src/components/home/hero-carousel.tsx
'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/image-url'

interface Banner {
  _id: string
  titulo: string
  subtitulo?: string
  imagen: unknown  // SanityImageSource
  ctaTexto?: string
  ctaUrl?: string
}

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  if (!banners.length) return null

  const banner = banners[current]
  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {banner.imagen && (
        <Image
          src={urlFor(banner.imagen as Parameters<typeof urlFor>[0]).width(1920).height(1080).quality(80).auto('format').url()}
          alt={banner.titulo}
          fill
          priority
          className="object-cover transition-opacity duration-700"
        />
      )}
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-text">{banner.titulo}</h1>
        {banner.subtitulo && (
          <p className="mt-4 text-lg text-brand-text/80">{banner.subtitulo}</p>
        )}
        {banner.ctaTexto && banner.ctaUrl && (
          <a href={banner.ctaUrl} className="mt-8 inline-block bg-brand-red text-white font-semibold px-8 py-3 rounded-md">
            {banner.ctaTexto}
          </a>
        )}
      </div>
      {/* Dot indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-brand-red' : 'bg-white/50'}`}
            aria-label={`Banner ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
```

### Pattern 5: Animated Metrics Counter (Intersection Observer)
**What:** Client component that observes when it enters the viewport, then animates a number from 0 to the target value using `requestAnimationFrame`. No external library needed.
**When to use:** HOME-05 — experience metrics section.

```typescript
// src/components/home/metrics-counter.tsx
'use client'
import { useRef, useEffect, useState } from 'react'

interface CounterProps {
  target: number
  label: string
  suffix?: string
}

function Counter({ target, label, suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const duration = 2000
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            setCount(Math.floor(progress * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-center">
      <p className="text-5xl font-bold text-brand-yellow">{count}{suffix}</p>
      <p className="mt-2 text-brand-text/70">{label}</p>
    </div>
  )
}

export function MetricsSection() {
  return (
    <section className="py-16 px-4 bg-brand-surface">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <Counter target={200} suffix="+" label="Clientes atendidos" />
        <Counter target={500} suffix="+" label="Equipos calibrados" />
        <Counter target={10} suffix="+" label="Años de experiencia" />
        <Counter target={15} suffix="+" label="Tipos de equipos" />
      </div>
    </section>
  )
}
```

### Pattern 6: Blog List and Detail Pages
**What:** `/blog` is a server component that fetches all posts (lightweight projection). `/blog/[slug]` uses `generateStaticParams` and renders `contenido` with `@portabletext/react`.
**When to use:** BLOG-01, BLOG-02, BLOG-03.

```typescript
// src/sanity/queries/posts.ts
import { defineQuery } from 'groq'

export const POSTS_LIST_QUERY = defineQuery(`
  *[_type == "post"] | order(fechaPublicacion desc) {
    _id,
    titulo,
    "slug": slug.current,
    extracto,
    "imagen": imagen,
    autor,
    categoria,
    fechaPublicacion
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`)

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    titulo,
    "slug": slug.current,
    extracto,
    imagen,
    contenido,
    autor,
    categoria,
    fechaPublicacion
  }
`)
```

```tsx
// src/components/blog/portable-text-renderer.tsx
// Source: https://github.com/portabletext/react-portabletext
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/image-url'

const components = {
  types: {
    image: ({ value }: { value: unknown }) => (
      <div className="my-8">
        <Image
          src={urlFor(value as Parameters<typeof urlFor>[0]).width(800).quality(80).auto('format').url()}
          alt=""
          width={800}
          height={450}
          className="rounded-lg object-cover w-full"
        />
      </div>
    ),
  },
}

export function PortableTextRenderer({ value }: { value: unknown[] }) {
  return (
    <div className="prose prose-invert max-w-none text-brand-text leading-relaxed">
      <PortableText value={value} components={components} />
    </div>
  )
}
```

### Pattern 7: Featured Equipment Query (HOME-04)
**What:** GROQ query filtered by `destacado == true`, re-uses existing EquipmentCard component.
**When to use:** Homepage featured equipment section.

```typescript
// src/sanity/queries/home.ts
import { defineQuery } from 'groq'

export const FEATURED_EQUIPOS_QUERY = defineQuery(`
  *[_type == "equipo" && destacado == true] | order(_createdAt desc) [0..5] {
    _id,
    nombre,
    "slug": slug.current,
    tipo,
    categoria,
    marca,
    modelo,
    estado,
    "imagenPrincipal": imagenes[0]
  }
`)
```

### Pattern 8: Libro de Reclamaciones Form Fields
**What:** The reclamo form must include all fields required by Peruvian consumer protection regulations (Código de Protección y Defensa del Consumidor, Ley 29571). The `reclamo` schema already matches these fields.
**Required fields per Peruvian regulation:**
- Identificación del consumidor: nombre, DNI/RUC, domicilio, teléfono, email
- Tipo de reclamo: "queja" (disconformidad sin contraprestación) o "reclamo" (disconformidad con contraprestación)
- Identificación del bien o servicio reclamado
- Detalle del reclamo o queja
- Pedido del consumidor (qué solicita)

The existing `reclamo` schema covers all these fields. No schema changes needed.

### Anti-Patterns to Avoid
- **Using `NEXT_PUBLIC_SANITY_WRITE_TOKEN`:** Exposes write credentials in client bundle. The write token must be `SANITY_WRITE_TOKEN` (no `NEXT_PUBLIC_` prefix) and only accessed in API routes.
- **Sending email from a 'use client' component:** Email API keys exposed in client. All email sending must go through `/api/*` POST handlers.
- **Adding framer-motion for counter animation:** The library adds ~100KB for a problem solved with 20 lines of Intersection Observer + requestAnimationFrame.
- **Using `<img>` instead of `next/image` for banner backgrounds:** `next/image` with `fill` and `object-cover` is the correct pattern for full-bleed hero images with Sanity CDN.
- **Forgetting `priority` on the first hero banner image:** The hero image is above-the-fold; `priority` tells Next.js to preload it, avoiding LCP regression.
- **Using `pageContext` or layout context to pass siteSettings to deep pages:** Already established pattern — fetch `SITE_SETTINGS_QUERY` with `Promise.all` alongside page data when needed. Next.js deduplicates identical fetches within a render.
- **Rendering `contenido` (Portable Text) with `dangerouslySetInnerHTML`:** Never. Use `@portabletext/react`.
- **Not awaiting `params` in Next.js 15:** Pattern established in Phase 2 — `const { slug } = await params`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email delivery | Custom SMTP client or fetch to Gmail API | Resend SDK | SMTP setup on Hostinger VPS requires credentials, port config, TLS — Resend handles delivery, bounces, tracking with one API call |
| Portable Text rendering | Custom block-to-HTML mapper | @portabletext/react | Nested marks, lists, custom block types, inline objects — weeks of edge cases already solved |
| Sanity image CDN URLs | String concatenation of asset reference IDs | @sanity/image-url (already installed) | Handles hotspot, crop, format conversion, CDN query params |
| Counter animation | CSS-only counter or external library | Intersection Observer + requestAnimationFrame | Native APIs, zero bundle cost, full control over easing |
| Form validation | Manual regex or custom validation | Native HTML5 `required`/`type="email"` + server-side check | Browser handles basic UX; server always validates before processing |
| Google Maps embed | @react-google-maps/api | `<iframe>` Google Maps embed | No API key needed for display-only embed; zero JS overhead |

**Key insight:** Every hard problem in this phase (email, rich text, image URLs, write-to-Sanity) already has a purpose-built solution already installed or requiring only one new package (Resend).

---

## Common Pitfalls

### Pitfall 1: Sanity Write Token Exposed in Client
**What goes wrong:** Developer adds `NEXT_PUBLIC_SANITY_WRITE_TOKEN` — the token appears in the browser's JavaScript bundle. Any visitor can extract it and write arbitrary documents to Sanity.
**Why it happens:** `NEXT_PUBLIC_` prefix is required for client components, so developers sometimes apply it to write tokens by mistake.
**How to avoid:** Write token must be `SANITY_WRITE_TOKEN` (no prefix). Only accessible in API routes (`route.ts`) and Server Actions. Create a separate `writeClient` in the API route, never export it from `src/sanity/client.ts`.
**Warning signs:** `process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN` referenced outside of `route.ts`.

### Pitfall 2: Resend `from` Domain Not Verified
**What goes wrong:** Resend rejects emails with `Error: The "from" address does not have a verified domain`. Emails never arrive.
**Why it happens:** Resend requires DNS verification of the sending domain before accepting emails from it.
**How to avoid:** Either: (a) verify the client's domain in Resend dashboard and use `web@testingcalibrations.com.pe`, or (b) use `onboarding@resend.dev` for development/testing (sends to your own Resend account email only). Do not block Phase 3 on domain verification — use the `resend.dev` domain in dev.
**Warning signs:** `400 Bad Request` from Resend API with domain verification error.

### Pitfall 3: Hero Banner `fill` Image Without Positioned Parent
**What goes wrong:** `next/image` with `fill` renders with `position: absolute` and covers zero area if the parent doesn't have `position: relative` and an explicit height.
**Why it happens:** `fill` removes intrinsic dimensions from the image — it needs a positioned parent with defined dimensions.
**How to avoid:** Parent `<section>` must have `className="relative w-full h-[80vh]"` or similar. Add `overflow-hidden` to prevent image bleed.
**Warning signs:** Image appears invisible or covers entire page.

### Pitfall 4: reclamo Form Submitted Without Server-Side Validation
**What goes wrong:** Malformed data or XSS payloads stored in Sanity. Reclamo documents with empty `detalle` field (required field) created.
**Why it happens:** Client-side form validation can be bypassed with DevTools or direct API calls.
**How to avoid:** API route `/api/reclamo` must validate all required fields (nombreConsumidor, tipoReclamo, detalle minimum) before calling `writeClient.create()`. Return `400` for invalid input.
**Warning signs:** Sanity has reclamo documents with empty required fields.

### Pitfall 5: Blog `fechaPublicacion` Format
**What goes wrong:** `fechaPublicacion` is a Sanity `datetime` type — it returns an ISO 8601 string. `new Date(fechaPublicacion).toLocaleDateString()` with no locale arg uses browser locale (inconsistent across users).
**Why it happens:** Server-rendered dates use the server's locale; client-rendered dates use the user's browser locale — causes hydration mismatch warnings.
**How to avoid:** Use explicit locale: `new Date(fechaPublicacion).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })`. Or format server-side and pass as a string.
**Warning signs:** React hydration warning "Text content does not match server-rendered HTML."

### Pitfall 6: Homepage Fetch Waterfall
**What goes wrong:** The homepage fetches banners, featured equipos, and siteSettings sequentially — each awaiting the previous. Page takes 3x longer to render.
**Why it happens:** Sequential `await client.fetch(...)` calls in a server component block rendering until each resolves.
**How to avoid:** Use `Promise.all` for all independent fetches:
```typescript
const [banners, featuredEquipos, settings] = await Promise.all([
  client.fetch(BANNERS_QUERY),
  client.fetch(FEATURED_EQUIPOS_QUERY),
  client.fetch(SITE_SETTINGS_QUERY),  // cached from layout but cheap to re-fetch
])
```
**Warning signs:** Network tab shows sequential fetch timing instead of parallel.

### Pitfall 7: WhatsApp Pre-filled Message Not Encoded
**What goes wrong:** WhatsApp URL with spaces or special characters in the message breaks the link. `wa.me/51987654321?text=Hola, quiero información` fails silently or opens with no message.
**Why it happens:** URL query parameter values must be percent-encoded. This pitfall is documented in Phase 2 research and applies equally to the contact form WhatsApp CTA on the `/contacto` page.
**How to avoid:** Always `encodeURIComponent(message)` before appending to the WhatsApp URL. Already established in Phase 2.
**Warning signs:** WhatsApp opens but the message field is empty.

---

## Code Examples

### Environment Variables Required for Phase 3
```bash
# .env.local additions
RESEND_API_KEY=re_xxxxx                        # From Resend dashboard
SANITY_WRITE_TOKEN=sk...                       # From Sanity dashboard — API tokens — Editor or Write role
# (Existing vars)
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxx
NEXT_PUBLIC_SANITY_DATASET=production
```

### Resend Client (shared)
```typescript
// src/lib/resend.ts
import { Resend } from 'resend'
export const resend = new Resend(process.env.RESEND_API_KEY)
```

### Sanity Write Client (API routes only)
```typescript
// Used inside route.ts files — never exported to shared lib
import { createClient } from '@sanity/client'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})
```

### Homepage Server Component (parallel fetches)
```typescript
// src/app/(site)/page.tsx
import { client } from '@/sanity/client'
import { BANNERS_QUERY } from '@/sanity/queries/banners'
import { FEATURED_EQUIPOS_QUERY } from '@/sanity/queries/home'
import { HeroCarousel } from '@/components/home/hero-carousel'
import { FeaturedEquipment } from '@/components/home/featured-equipment'
// ... other section imports

export default async function HomePage() {
  const [banners, featuredEquipos] = await Promise.all([
    client.fetch(BANNERS_QUERY).catch(() => []),
    client.fetch(FEATURED_EQUIPOS_QUERY).catch(() => []),
  ])

  return (
    <>
      <HeroCarousel banners={banners} />
      {/* ServicesSection — static or Sanity-driven */}
      {/* ValuesSection — static */}
      <FeaturedEquipment equipos={featuredEquipos} />
      {/* MetricsSection — static numbers, animated client-side */}
      {/* ReclamacionesCTA — static link */}
    </>
  )
}
```

### Google Maps Iframe Embed
```tsx
// No API key required for display-only embed
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!..." // URL from Google Maps > Share > Embed
  width="100%"
  height="400"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Ubicación Testing Calibrations S.A.C."
/>
```

### Blog Detail Page (generateStaticParams pattern)
```typescript
// src/app/(site)/blog/[slug]/page.tsx
import { client } from '@/sanity/client'
import { POST_SLUGS_QUERY, POST_BY_SLUG_QUERY } from '@/sanity/queries/posts'
import { notFound } from 'next/navigation'
import { PortableTextRenderer } from '@/components/blog/portable-text-renderer'

export async function generateStaticParams() {
  const slugs = await client.fetch(POST_SLUGS_QUERY)
  return slugs.map((item: { slug: string }) => ({ slug: item.slug }))
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params  // CRITICAL: params is Promise in Next.js 15
  const post = await client.fetch(POST_BY_SLUG_QUERY, { slug })
  if (!post) notFound()

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-text">{post.titulo}</h1>
      {post.contenido && <PortableTextRenderer value={post.contenido} />}
    </article>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `params.slug` sync access | `const { slug } = await params` | Next.js 15 | Breaking change — established in Phase 2 |
| Nodemailer + SMTP | Resend SDK | 2023-present | Resend eliminates SMTP config, improves deliverability |
| EmailJS (client-side) | Resend in API route (server-side) | VPS decision (Phase 1) | Secrets stay server-side; no exposed API keys |
| `images.domains` in next.config | `images.remotePatterns` | Next.js 13 | Deprecated; established in Phase 2 |
| Custom scroll animation libraries | Intersection Observer API (native) | Browser support ~2020 | Zero bundle cost; supported in all modern browsers |
| `getStaticPaths` | `generateStaticParams` | Next.js 13 App Router | No `fallback` key; established in Phase 2 |

**Deprecated/outdated:**
- EmailJS for server-rendered Next.js apps: only appropriate for static export; use Resend instead
- `fetch` with raw GROQ string: use `defineQuery` from `groq` package for TypeGen compatibility

---

## Open Questions

1. **Resend domain verification**
   - What we know: Resend requires DNS verification of the `from` address domain before production emails send. The client's domain (testingcalibrations.com.pe or similar) is unknown.
   - What's unclear: Whether the client has DNS access to add Resend verification records; what the actual email address is.
   - Recommendation: Use `onboarding@resend.dev` as `from` address during development (delivers to Resend account owner only). Add a task note to swap to the verified domain address before production launch.

2. **Sanity write token not yet provisioned**
   - What we know: Only a read-only Sanity client exists. The `SANITY_WRITE_TOKEN` env var does not exist yet.
   - What's unclear: When the client will configure the real Sanity project (NEXT_PUBLIC_SANITY_PROJECT_ID is still placeholder).
   - Recommendation: The reclamo API route should handle the missing token gracefully and return a 503 with a clear message. Plan must include a task to document token provisioning steps in a comment.

3. **Homepage content: static or Sanity-driven for services/values sections**
   - What we know: The services section (HOME-02) and "Por qué elegirnos" (HOME-03) are not backed by a dedicated Sanity schema. The `pagina` schema exists but is generic.
   - What's unclear: Whether the client wants to edit these sections from Sanity or if static placeholder text is sufficient for v1.
   - Recommendation: For v1, hardcode placeholder content for HOME-02 and HOME-03 in JSX. The `siteSettings` schema could be extended with arrays for services/values if the client requests CMS control later. This avoids schema changes mid-phase.

4. **Google Maps embed URL**
   - What we know: The company address is in siteSettings but the specific Google Maps embed URL for their location is unknown (no real address provided yet).
   - What's unclear: Whether the client will provide their exact address for Maps or a placeholder is acceptable.
   - Recommendation: Use a placeholder Maps embed centered on Lima, Peru. Add a clear comment marking the iframe `src` as needing replacement with the real embed URL.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (E2E smoke) — already installed and configured |
| Config file | `playwright.config.ts` — exists at project root |
| Quick run command | `npx playwright test tests/content.spec.ts --project=chromium` |
| Full suite command | `npx playwright test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | Homepage has hero section with h1 visible | smoke | `npx playwright test tests/content.spec.ts -g "hero banner" --project=chromium` | Wave 0 |
| HOME-02 | Homepage has services section visible | smoke | `npx playwright test tests/content.spec.ts -g "services section" --project=chromium` | Wave 0 |
| HOME-03 | Homepage has "por que elegirnos" section | smoke | `npx playwright test tests/content.spec.ts -g "valores section" --project=chromium` | Wave 0 |
| HOME-04 | Homepage has featured equipment grid | smoke | `npx playwright test tests/content.spec.ts -g "featured equipment" --project=chromium` | Wave 0 |
| HOME-05 | Metrics section renders counter numbers | smoke | `npx playwright test tests/content.spec.ts -g "metrics" --project=chromium` | Wave 0 |
| HOME-06 | Homepage has link to /libro-de-reclamaciones | smoke | `npx playwright test tests/content.spec.ts -g "reclamaciones link" --project=chromium` | Wave 0 |
| INST-01 | /nosotros renders with content | smoke | `npx playwright test tests/content.spec.ts -g "nosotros page" --project=chromium` | Wave 0 |
| INST-02 | Footer shows email, address, navlinks | smoke | `npx playwright test tests/content.spec.ts -g "footer content" --project=chromium` | Wave 0 |
| CONT-01 | /contacto form submits and shows success message | smoke | `npx playwright test tests/content.spec.ts -g "contact form" --project=chromium` | Wave 0 |
| CONT-02 | WhatsApp button visible with correct href | smoke | `npx playwright test tests/content.spec.ts -g "whatsapp button" --project=chromium` | Wave 0 |
| CONT-03 | /contacto shows email, address, map embed | smoke | `npx playwright test tests/content.spec.ts -g "contacto page info" --project=chromium` | Wave 0 |
| CONT-04 | /libro-de-reclamaciones form has all required fields | smoke | `npx playwright test tests/content.spec.ts -g "reclamo form fields" --project=chromium` | Wave 0 |
| CONT-05 | Reclamo form submits and shows confirmation | smoke | `npx playwright test tests/content.spec.ts -g "reclamo submit" --project=chromium` | Wave 0 |
| BLOG-01 | /blog renders article cards with title and excerpt | smoke | `npx playwright test tests/content.spec.ts -g "blog list" --project=chromium` | Wave 0 |
| BLOG-02 | /blog/[slug] renders article title and content | smoke | `npx playwright test tests/content.spec.ts -g "blog detail" --project=chromium` | Wave 0 |
| BLOG-03 | Blog articles have categoria and autor visible | smoke | `npx playwright test tests/content.spec.ts -g "blog metadata" --project=chromium` | Wave 0 |

**Note on CONT-01 and CONT-05 testing:** The contact and reclamo form tests must mock the API routes or use a test-mode Resend API key to avoid sending real emails during test runs. Playwright can intercept the `/api/contact` and `/api/reclamo` network calls and return success responses.

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit` (type check, < 10 seconds)
- **Per wave merge:** `npx playwright test tests/content.spec.ts --project=chromium`
- **Phase gate:** `npx playwright test` (full suite including Phase 1 and 2 smoke) before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/content.spec.ts` — covers all HOME, INST, CONT, and BLOG requirements
- [ ] Placeholder post documents in Sanity (or accept empty list renders gracefully) for blog tests
- [ ] Placeholder banner documents for hero carousel tests

Note: `playwright.config.ts` exists from Phase 1. No framework install needed. New env vars (`RESEND_API_KEY`, `SANITY_WRITE_TOKEN`) need to be added to `.env.local` before API route tests can pass.

---

## Sources

### Primary (HIGH confidence)
- [Resend Next.js documentation](https://resend.com/docs/send-with-nextjs) — API route pattern, `from` domain requirement, SDK usage
- [Resend SDK GitHub](https://github.com/resend/resend-node) — confirmed `resend.emails.send()` method signature, error handling
- [Next.js App Router Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) — POST handler pattern, `NextRequest`/`NextResponse`
- [@portabletext/react GitHub](https://github.com/portabletext/react-portabletext) — `PortableText` component, custom `components` prop for image type
- [Sanity client.create() docs](https://www.sanity.io/docs/js-client#create-documents) — document creation with write token
- [MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) — `IntersectionObserver` constructor, `threshold` option

### Secondary (MEDIUM confidence)
- [Ley 29571 Código de Protección y Defensa del Consumidor (Peru)](https://www.indecopi.gob.pe/web/defensa-del-consumidor/libro-de-reclamaciones) — required reclamo form fields per Peruvian regulation; existing schema matches
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — pattern established in Phase 2; applies identically to `/blog/[slug]`
- [Resend free tier](https://resend.com/pricing) — 100 emails/day, 3,000/month on free plan — confirmed sufficient for v1 volume

### Tertiary (LOW confidence)
- None — all critical claims verified with official docs or established Phase 1/2 patterns

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages either already installed or one new verified package (Resend); no experimental choices
- Sanity schemas: HIGH — all 6 schemas already defined and match phase requirements exactly; no changes needed
- Email (Resend): HIGH — official Resend Next.js docs, API route pattern is standard
- Sanity write from API route: HIGH — official @sanity/client docs confirm `client.create()` with token
- Hero carousel (CSS/JS): HIGH — Intersection Observer and setInterval are standard browser APIs
- Counter animation: HIGH — Intersection Observer + requestAnimationFrame are well-documented native APIs
- Blog PortableText rendering: HIGH — @portabletext/react already installed and used in Phase 2
- Resend domain verification: MEDIUM — process documented on Resend site; actual domain/email unknown pending client input
- Google Maps embed: HIGH — no API key embed is a well-documented Google Maps feature

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable stack, 30 days)
