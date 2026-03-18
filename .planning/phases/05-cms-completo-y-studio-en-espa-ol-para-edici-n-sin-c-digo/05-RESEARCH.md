# Phase 5: CMS completo y Studio en español para edición sin código - Research

**Researched:** 2026-03-17
**Domain:** Sanity v3 Studio — schema design, localization, UX for non-technical editors
**Confidence:** HIGH

## Summary

Phase 5 makes the Sanity CMS truly complete. Right now, three homepage sections (services, values, metrics) and the entire `/nosotros` page are hardcoded in React components — a non-technical user cannot change any of that content without code. The fix is two-pronged: (1) add new fields or schemas to capture the missing content in Sanity, and (2) wire the front-end components to read from Sanity instead of JSX literals.

The second axis is Studio UX. The existing `sanity.config.ts` uses out-of-the-box `structureTool()` with no custom sidebar, no field groups, no descriptions, and no Spanish UI. A non-technical user opening Studio today would see schema fields labeled in camelCase English with no guidance. This phase adds the `@sanity/locale-es-es` plugin to translate the Studio chrome to Spanish, enriches every schema field with Spanish `title` and `description` properties, adds `fieldGroups` (tabs) to complex schemas, and configures the Structure Builder to show human-readable section names.

The project decision to use `@sanity/client` directly (not `next-sanity` main entry) remains in force. All new GROQ queries follow the existing pattern in `src/sanity/queries/`.

**Primary recommendation:** Extend `siteSettings` singleton with array fields for services and values; create a new `homepageConfig` or extend `siteSettings` for metrics; connect components to Sanity; configure Studio with Spanish locale plugin and custom Structure Builder with fieldGroups on every schema.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `sanity` (already installed) | v3 (current) | Schema definitions, Studio runtime | Core CMS |
| `@sanity/client` (already installed) | ^7.17.0 | Data fetching — use directly, never `next-sanity` main entry | Project decision: avoids issue #1899 |
| `@sanity/locale-es-es` | latest (^1.x) | Translates Studio UI chrome to Spanish | Official Sanity locale plugin; community-maintained |
| `groq` (already installed via next-sanity) | — | `defineQuery` helper for typed GROQ | Project pattern, all queries use this |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next-sanity` (already installed) | ^12.1.2 | Provides `VisualEditing`, etc. — NOT imported in data fetching files | Only needed if Live Preview is added later |

**No new runtime dependencies needed for the front-end.** The only new package is `@sanity/locale-es-es` for the Studio.

**Installation:**
```bash
npm install @sanity/locale-es-es
```

---

## Architecture Patterns

### Recommended Project Structure (changes only)

```
src/
├── sanity/
│   ├── sanity.config.ts          # Add esESLocale() + structureTool({ structure })
│   ├── structure.ts              # NEW — custom Structure Builder resolver
│   └── schemas/
│       ├── site-settings.ts      # EXTEND — add servicios[], valores[], metricas[]
│       └── nosotros.ts           # NEW (or extend pagina) — about page content
├── components/
│   └── home/
│       ├── services-section.tsx  # MODIFY — accept props, fetch from Sanity
│       ├── values-section.tsx    # MODIFY — accept props, fetch from Sanity
│       └── metrics-counter.tsx   # MODIFY — accept props, fetch from Sanity
└── app/
    └── (site)/
        ├── page.tsx              # MODIFY — pass Sanity data to all sections
        └── nosotros/page.tsx     # MODIFY — fetch from Sanity
```

### Pattern 1: Extend siteSettings singleton with content arrays

**What:** Add `servicios`, `valores`, and `metricas` as array-of-object fields to the existing `siteSettings` singleton. This keeps all homepage content in a single Sanity document, which is ideal for a small company site. The client edits one document instead of navigating multiple content types.

**When to use:** When content is structural/configuration-level (not independently publishable documents).

**Example — adding to siteSettings schema:**
```typescript
// src/sanity/schemas/site-settings.ts
defineField({
  name: 'servicios',
  title: 'Servicios',
  description: 'Lista de servicios mostrados en la sección "Nuestros Servicios" de la página de inicio.',
  type: 'array',
  group: 'contenido',
  of: [
    defineArrayMember({
      type: 'object',
      title: 'Servicio',
      fields: [
        defineField({ name: 'titulo', title: 'Título del Servicio', type: 'string', validation: r => r.required(), description: 'Nombre breve del servicio, por ejemplo: "Calibración de Equipos"' }),
        defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 3, description: 'Párrafo corto explicando el servicio (máximo 3 líneas)' }),
        defineField({ name: 'icono', title: 'Ícono', type: 'string', description: 'Nombre del ícono de Lucide, por ejemplo: wrench, check-circle, shield', options: { list: ['wrench','check-circle','shield','settings','tool','zap'] } }),
      ],
    }),
  ],
})
```

### Pattern 2: fieldGroups (tabs) in complex schemas

**What:** Group fields into logical tabs using the `groups` + `group` properties. Sanity v3 supports this natively in any `document` or `object` type. Groups are purely a Studio UI feature — they do NOT change the data structure or GROQ output.

**When to use:** Any schema with more than ~6 fields. Especially siteSettings, which will grow large.

**Example:**
```typescript
// Source: https://www.sanity.io/docs/studio/field-groups
const siteSettingsBase = defineType({
  name: 'siteSettings',
  title: 'Configuración del Sitio',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'contenido', title: 'Contenido Homepage' },
    { name: 'contacto', title: 'Contacto y Redes' },
    { name: 'navegacion', title: 'Navegación' },
  ],
  fields: [
    defineField({ name: 'siteName', title: 'Nombre del Sitio', type: 'string', group: 'general' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', group: 'general' }),
    defineField({ name: 'servicios', title: 'Servicios', type: 'array', group: 'contenido', of: [...] }),
    defineField({ name: 'valores', title: 'Valores (Por qué elegirnos)', type: 'array', group: 'contenido', of: [...] }),
    defineField({ name: 'metricas', title: 'Métricas', type: 'array', group: 'contenido', of: [...] }),
    defineField({ name: 'whatsappNumber', title: 'WhatsApp (con código país)', type: 'string', group: 'contacto' }),
    defineField({ name: 'email', title: 'Email de Contacto', type: 'string', group: 'contacto' }),
    defineField({ name: 'address', title: 'Dirección', type: 'string', group: 'contacto' }),
    defineField({ name: 'socialLinks', title: 'Redes Sociales', type: 'array', group: 'contacto', of: [...] }),
    defineField({ name: 'navLinks', title: 'Links de Navegación', type: 'array', group: 'navegacion', of: [...] }),
    defineField({ name: 'footerText', title: 'Texto Footer', type: 'string', group: 'navegacion' }),
  ],
})
```

### Pattern 3: Spanish Studio UI via locale plugin

**What:** Install `@sanity/locale-es-es` and add `esESLocale()` to `plugins` array in `sanity.config.ts`. This translates the Studio chrome (menus, buttons, toast messages, validation messages, field labels for built-in types) to Spanish. User-defined `title` and `description` values in schemas are already in whatever language you write them.

**When to use:** Always for this project — the client has no technical staff.

**Example:**
```typescript
// Source: https://www.sanity.io/docs/studio/localizing-studio-ui
import { esESLocale } from '@sanity/locale-es-es'

export default defineConfig({
  name: 'testing-calibrations',
  title: 'Testing Calibrations S.A.C.',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  basePath: '/studio',
  plugins: [
    structureTool({ structure: myStructure }),
    visionTool(),
    esESLocale(),   // <-- add this
  ],
  schema: { types: schemaTypes },
})
```

### Pattern 4: Custom Structure Builder (sidebar organization)

**What:** Pass a `structure` resolver to `structureTool()` to give every content type a friendly Spanish label and group singletons above regular documents. This is the entry point non-technical users see first.

**When to use:** Always when you have singletons — without custom structure, siteSettings appears as a regular browsable list.

**Example:**
```typescript
// src/sanity/structure.ts
// Source: https://www.sanity.io/docs/studio/set-up-structure-builder-to-override-the-default-list-view
import { type StructureResolver } from 'sanity/structure'

export const myStructure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      // Singleton — appears as single-edit document, no list
      S.listItem()
        .title('Configuración General')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.divider(),
      S.documentTypeListItem('equipo').title('Equipos'),
      S.documentTypeListItem('banner').title('Banners Hero'),
      S.documentTypeListItem('post').title('Artículos del Blog'),
      S.documentTypeListItem('pagina').title('Páginas'),
      S.divider(),
      // Reclamos as read-only reference section
      S.documentTypeListItem('reclamo').title('Reclamos Recibidos'),
    ])
```

### Pattern 5: Nosotros page — content from Sanity

**What:** The `/nosotros` page is currently 100% hardcoded JSX. Two approaches exist:

- **Option A (recommended):** Add `nosotros` fields to `siteSettings` singleton (tabs: `acercaDe`, with subfields: `historia[]`, `mision`, `vision`, `valores[]`). No new document type. Consistent with the existing singleton pattern.
- **Option B:** Use the existing `pagina` schema with a reserved slug `nosotros` and render Portable Text. Simpler but less structured — harder for a non-technical user to find "the right" page.

**Recommended: Option A** because it surfaces content directly in "Configuración General" under a tab, making it obvious to the client where to edit. The `valores` field can share the same object shape as services (icon + title + description).

### Pattern 6: Fetching extended siteSettings fields in components

**What:** The homepage currently passes banners and featuredEquipos but NOT services/values/metrics. Update `page.tsx` to also fetch those from siteSettings GROQ query, then pass as props to each section component.

**Important:** Keep the single GROQ fetch pattern from `layout.tsx` in mind. For homepage-specific content, fetch in `page.tsx` (server component), NOT in layout. Layout already fetches siteSettings for nav/footer — avoid double-fetching by passing relevant data or making the homepage query include the needed fields.

**GROQ pattern for extended siteSettings:**
```typescript
// src/sanity/queries/site-settings.ts  — extend existing query
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    siteName, logo, whatsappNumber, email, address,
    navLinks[]{label, href},
    socialLinks[]{platform, url},
    footerText
  }
`)

// NEW separate homepage content query (homepage only)
export const HOMEPAGE_CONTENT_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    servicios[]{titulo, descripcion, icono},
    valores[]{titulo, descripcion, icono},
    metricas[]{valor, sufijo, etiqueta},
    nosotrosHistoria,
    nosotrosMision,
    nosotrosVision,
    nosotrosValores[]{titulo, descripcion, icono}
  }
`)
```

### Anti-Patterns to Avoid

- **Splitting site config into many document types:** Don't create separate `homepageSettings`, `aboutSettings`, `servicesSettings` documents. One `siteSettings` singleton with tabs is far easier for a non-technical user.
- **Nesting nosotros content in `pagina` schema with slug lookup:** Fragile — client could accidentally change the slug and break the route.
- **Importing from `next-sanity` main entry in data fetching files:** Project decision prohibits this (issue #1899). All data fetching uses `@sanity/client` directly.
- **Icon field as free-text string without guidance:** Lucide icon names are not obvious to non-technical users. Use `options.list` to constrain to a small approved set of icons. This prevents broken UI from typos.
- **Removing `__experimental_actions` from siteSettings:** The singleton must keep `['update', 'publish']` only. The custom Structure Builder renders it as a single edit document — removing document-level create/delete is still required.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Studio UI language | Custom translate wrappers | `@sanity/locale-es-es` plugin | Official Sanity locale system; covers all Studio chrome automatically |
| Sidebar organization | Manual HTML overlays | Structure Builder (`structureTool({ structure })`) | Native Sanity API; zero maintenance |
| Field tabs/grouping | Custom input components | `groups` + `group` on schema fields | Native Sanity v3 feature; no extra code |
| Singleton enforcement | Complex validation rules | `__experimental_actions` + Structure Builder `documentId` pattern | Established project pattern from Phase 1 |
| GROQ type safety | Manual TypeScript interfaces | `defineQuery` from `groq` package | Project pattern already in use |

---

## Common Pitfalls

### Pitfall 1: Double-fetching siteSettings
**What goes wrong:** `layout.tsx` already fetches `siteSettings` for nav/footer. If `page.tsx` also fetches the full `siteSettings` document for homepage content, the same document is fetched twice per request.
**Why it happens:** Two separate GROQ queries hitting the same document type without coordination.
**How to avoid:** Keep the layout query minimal (nav + footer fields only). Add a SEPARATE `HOMEPAGE_CONTENT_QUERY` in `page.tsx` that projects ONLY the homepage fields (servicios, valores, metricas, nosotros*). Next.js 15 caches `client.fetch()` calls per-request via the `fetch` cache, but explicit deduplication via separate projections is cleaner and cheaper in Sanity's query billing.
**Warning signs:** Two GROQ queries with identical `*[_type == "siteSettings"][0]` filters.

### Pitfall 2: fieldGroups on object type (not document type)
**What goes wrong:** Adding `groups` to a nested `defineArrayMember({ type: 'object' })` causes a TypeScript error because fieldGroups are only supported on `document` and top-level `object` schema types.
**Why it happens:** Confusing document-level grouping with array-item-level grouping.
**How to avoid:** Only add `groups` to the top-level `defineType({ type: 'document' })` or a standalone registered object type. Array member objects get their fields organized with `fieldsets` (collapsible grouping) instead of tabs.

### Pitfall 3: Icon names invisible to the non-technical user
**What goes wrong:** Services and values fields have an `icono` string field. The client enters "wrench" but types "ranch" and the icon silently fails to render.
**Why it happens:** Free-text string without validation or options list.
**How to avoid:** Use `options: { list: ['wrench', 'check-circle', 'shield', ...] }` with a fixed set of allowed icons. Match exactly the Lucide icon names already used in the existing hardcoded components. Consider `options: { layout: 'radio' }` for 3-5 options or `layout: 'dropdown'` for more.
**Warning signs:** Runtime `undefined` icon renders a blank space in the component.

### Pitfall 4: siteSettings singleton documentId mismatch
**What goes wrong:** Structure Builder sets `documentId('siteSettings')` but the actual document in Sanity dataset has a different `_id` (e.g., `drafts.siteSettings` or a random UUID from initial creation).
**Why it happens:** If the document was created before the singleton restriction was added, it may not have `_id: 'siteSettings'`.
**How to avoid:** When setting up Structure Builder, verify the existing document `_id`. The GROQ query `*[_type == "siteSettings"][0]` always finds it regardless of `_id`. The Structure Builder `documentId` must match the actual `_id` to open the correct document in the edit pane.
**Warning signs:** Studio opens an empty new document instead of the existing one.

### Pitfall 5: Nosotros page Portable Text vs structured fields
**What goes wrong:** Using a raw `array of block` field for company description makes it easy to write, but the front-end rendering requires `@portabletext/react` and the result is harder to style than discrete fields.
**Why it happens:** Treating all long-form content as Portable Text without considering the rendering cost.
**How to avoid:** For the nosotros page, use `type: 'text'` (plain text with newlines) for historia/mision/vision paragraphs and save Portable Text for blog posts only. Plain `text` renders as a `<p>` and is far simpler.

### Pitfall 6: `@sanity/locale-es-es` requires Studio v3.23.0+
**What goes wrong:** Installing the locale plugin on a Studio below v3.23.0 silently does nothing (or throws).
**Why it happens:** The Studio i18n API was introduced in v3.23.0.
**How to avoid:** Verify `sanity` package version before installing the locale plugin. Run `npm list sanity` — if below 3.23.0, run `npm install sanity@latest` first. The project currently uses `next-sanity ^12.1.2` which ships with a compatible Sanity version.
**Warning signs:** Studio UI remains in English after adding the plugin.

---

## Code Examples

### Complete extended siteSettings schema with fieldGroups
```typescript
// Source: Sanity v3 docs — https://www.sanity.io/docs/studio/field-groups
import { defineField, defineType, defineArrayMember } from 'sanity'

const siteSettingsBase = defineType({
  name: 'siteSettings',
  title: 'Configuración del Sitio',
  type: 'document',
  groups: [
    { name: 'general', title: 'Información General', default: true },
    { name: 'homepage', title: 'Página de Inicio' },
    { name: 'nosotros', title: 'Página Nosotros' },
    { name: 'contacto', title: 'Contacto y Redes' },
    { name: 'navegacion', title: 'Menú y Footer' },
  ],
  fields: [
    // General
    defineField({ name: 'siteName', title: 'Nombre del Sitio', type: 'string', group: 'general',
      description: 'Nombre que aparece en el navegador y en el encabezado del sitio.' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', group: 'general',
      description: 'Logo principal del sitio. Formatos recomendados: PNG o SVG con fondo transparente.' }),

    // Homepage sections
    defineField({
      name: 'servicios', title: 'Servicios', type: 'array', group: 'homepage',
      description: 'Tarjetas de la sección "Nuestros Servicios" en la página de inicio.',
      of: [defineArrayMember({
        type: 'object', title: 'Servicio',
        fields: [
          defineField({ name: 'titulo', title: 'Nombre del Servicio', type: 'string', validation: r => r.required() }),
          defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 3 }),
          defineField({ name: 'icono', title: 'Ícono', type: 'string',
            options: { list: [
              { title: 'Llave inglesa', value: 'wrench' },
              { title: 'Check (verificación)', value: 'check-circle' },
              { title: 'Escudo', value: 'shield' },
              { title: 'Engranaje', value: 'settings' },
              { title: 'Rayo', value: 'zap' },
            ]},
            description: 'Ícono representativo del servicio.'
          }),
        ],
      })],
    }),

    defineField({
      name: 'valores', title: 'Por qué Elegirnos', type: 'array', group: 'homepage',
      description: 'Tarjetas de la sección "¿Por qué elegirnos?" en la página de inicio.',
      of: [defineArrayMember({
        type: 'object', title: 'Valor',
        fields: [
          defineField({ name: 'titulo', title: 'Título', type: 'string', validation: r => r.required() }),
          defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 3 }),
          defineField({ name: 'icono', title: 'Ícono', type: 'string',
            options: { list: [
              { title: 'Premio / Trofeo', value: 'award' },
              { title: 'Reloj', value: 'clock' },
              { title: 'Personas / Equipo', value: 'users' },
              { title: 'Escudo', value: 'shield' },
              { title: 'Check', value: 'check-circle' },
            ]},
          }),
        ],
      })],
    }),

    defineField({
      name: 'metricas', title: 'Métricas de Experiencia', type: 'array', group: 'homepage',
      description: 'Números animados que aparecen en la sección de estadísticas (ej: 200+ clientes atendidos).',
      of: [defineArrayMember({
        type: 'object', title: 'Métrica',
        fields: [
          defineField({ name: 'valor', title: 'Número', type: 'number', validation: r => r.required(),
            description: 'El número que se anima (sin el símbolo +). Ejemplo: 200' }),
          defineField({ name: 'sufijo', title: 'Sufijo', type: 'string',
            description: 'Texto después del número. Ejemplo: "+" o "%"' }),
          defineField({ name: 'etiqueta', title: 'Etiqueta', type: 'string', validation: r => r.required(),
            description: 'Descripción debajo del número. Ejemplo: "Clientes atendidos"' }),
        ],
      })],
    }),

    // Nosotros page
    defineField({ name: 'nosotrosHistoria', title: 'Historia de la Empresa', type: 'text', rows: 5, group: 'nosotros',
      description: 'Párrafo de presentación de la empresa en la página Nosotros.' }),
    defineField({ name: 'nosotrosMision', title: 'Misión', type: 'text', rows: 3, group: 'nosotros' }),
    defineField({ name: 'nosotrosVision', title: 'Visión', type: 'text', rows: 3, group: 'nosotros' }),
    defineField({
      name: 'nosotrosValores', title: 'Valores de la Empresa', type: 'array', group: 'nosotros',
      description: 'Tarjetas de valores en la página Nosotros.',
      of: [defineArrayMember({
        type: 'object', title: 'Valor',
        fields: [
          defineField({ name: 'titulo', title: 'Nombre del Valor', type: 'string', validation: r => r.required() }),
          defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 3 }),
          defineField({ name: 'icono', title: 'Ícono', type: 'string',
            options: { list: [
              { title: 'Check / Precisión', value: 'check-circle' },
              { title: 'Escudo / Integridad', value: 'shield' },
              { title: 'Personas / Compromiso', value: 'users' },
            ]},
          }),
        ],
      })],
    }),

    // Contacto
    defineField({ name: 'whatsappNumber', title: 'WhatsApp (con código país)', type: 'string', group: 'contacto',
      description: 'Número completo con código de país. Ejemplo: 51987654321 (Perú = 51).' }),
    defineField({ name: 'email', title: 'Email de Contacto', type: 'string', group: 'contacto' }),
    defineField({ name: 'address', title: 'Dirección', type: 'string', group: 'contacto' }),
    defineField({ name: 'socialLinks', title: 'Redes Sociales', type: 'array', group: 'contacto',
      of: [defineArrayMember({ type: 'object', fields: [
        defineField({ name: 'platform', title: 'Red Social', type: 'string',
          options: { list: ['Facebook', 'Instagram', 'LinkedIn', 'YouTube'] } }),
        defineField({ name: 'url', title: 'URL del Perfil', type: 'url' }),
      ]})]
    }),

    // Navegación
    defineField({ name: 'navLinks', title: 'Links de Navegación', type: 'array', group: 'navegacion',
      description: 'Elementos del menú principal. El orden aquí determina el orden en el menú.',
      of: [defineArrayMember({ type: 'object', fields: [
        defineField({ name: 'label', title: 'Etiqueta', type: 'string', description: 'Texto visible en el menú. Ejemplo: "Nosotros"' }),
        defineField({ name: 'href', title: 'Enlace', type: 'string', description: 'Ruta interna. Ejemplo: /nosotros' }),
      ]})]
    }),
    defineField({ name: 'footerText', title: 'Texto del Footer', type: 'string', group: 'navegacion',
      description: 'Texto de copyright. Ejemplo: "© 2025 Testing Calibrations S.A.C. Todos los derechos reservados."' }),
  ],
})

export const siteSettings = Object.assign(siteSettingsBase, {
  __experimental_actions: ['update', 'publish'],
})
```

### GROQ query for homepage-specific content
```typescript
// src/sanity/queries/homepage.ts (NEW FILE)
import { defineQuery } from 'groq'

export const HOMEPAGE_CONTENT_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    servicios[]{titulo, descripcion, icono},
    valores[]{titulo, descripcion, icono},
    metricas[]{valor, sufijo, etiqueta}
  }
`)

export const NOSOTROS_CONTENT_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    nosotrosHistoria,
    nosotrosMision,
    nosotrosVision,
    nosotrosValores[]{titulo, descripcion, icono}
  }
`)
```

### Wiring a section component to accept Sanity data
```typescript
// src/components/home/services-section.tsx (MODIFIED)
interface Servicio { titulo: string; descripcion: string; icono: string }
interface ServicesSectionProps { servicios?: Servicio[] }

export function ServicesSection({ servicios = [] }: ServicesSectionProps) {
  // Render from props (Sanity data) with fallback to empty state
  // ...
}
```

### homepage page.tsx with Sanity fetch
```typescript
// src/app/(site)/page.tsx (MODIFIED)
export default async function HomePage() {
  const [banners, featuredEquipos, homepageContent] = await Promise.all([
    client.fetch(BANNERS_QUERY).catch(() => []),
    client.fetch(FEATURED_EQUIPOS_QUERY).catch(() => []),
    client.fetch(HOMEPAGE_CONTENT_QUERY).catch(() => null),
  ])

  return (
    <>
      <HeroCarousel banners={banners} />
      <ServicesSection servicios={homepageContent?.servicios ?? []} />
      <ValuesSection valores={homepageContent?.valores ?? []} />
      <FeaturedEquipment equipos={featuredEquipos} />
      <MetricsSection metricas={homepageContent?.metricas ?? []} />
      <ReclamacionesCta />
    </>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import { createClient } from 'next-sanity'` | `import { createClient } from '@sanity/client'` | Phase 1 (project decision) | Avoids issue #1899 transitive server action import |
| Default structureTool() — flat list of all types | `structureTool({ structure: customResolver })` | This phase | Non-technical users see organized sidebar instead of raw type names |
| No locale plugin — Studio UI in English | `esESLocale()` plugin | This phase | All Studio UI chrome in Spanish |
| Hardcoded JSX content in components | Props driven from Sanity GROQ fetch | This phase | Client can edit services, values, metrics, nosotros without developer |

**Deprecated/outdated in this project:**
- Hardcoded arrays in `ServicesSection`, `ValuesSection`, `MetricsSection` components: replaced with props
- Hardcoded paragraphs in `nosotros/page.tsx`: replaced with Sanity fetch

---

## Open Questions

1. **Should `reclamaciones` (reclamos) be editable or read-only in Studio?**
   - What we know: Reclamos are created by form submissions, not manually. The schema exists.
   - What's unclear: Does the client want to edit/delete reclamos from Studio, or only read them?
   - Recommendation: Surface them in the sidebar as "Reclamos Recibidos" (read-only in practice — no write CTA needed) via Structure Builder. Do NOT remove create/delete actions from `reclamo` type (unlike siteSettings) because admin may need to delete test submissions.

2. **Should services/values share a single reusable object type or be defined inline?**
   - What we know: Sanity supports both registered object types and inline array members.
   - What's unclear: Whether the planner wants a reusable `tarjeta` object type (register in `index.ts`) or inline definitions per field.
   - Recommendation: Inline definitions per field are simpler for this project size. A shared type would be over-engineering.

3. **Does the Sanity project ID need to be configured before testing this phase?**
   - What we know: `.env.local` must have a valid `NEXT_PUBLIC_SANITY_PROJECT_ID`. The `client.ts` uses a safe placeholder fallback.
   - What's unclear: Whether a real Sanity project exists or it's still the placeholder.
   - Recommendation: Phase 5 plans should include a setup step instructing the developer to create the Sanity project at sanity.io and update `.env.local`. Without a real project ID, data won't persist from Studio.

---

## Validation Architecture

nyquist_validation is enabled (key present in config.json).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright Test |
| Config file | `playwright.config.ts` |
| Quick run command | `npx playwright test tests/content.spec.ts --project chromium` |
| Full suite command | `npx playwright test` |

### Phase Requirements → Test Map

Phase 5 addresses CMS completeness (CMS-01) and Studio UX. Front-end behavior remains the same — content now comes from Sanity instead of being hardcoded, but the rendered HTML should be visually identical. Existing tests in `content.spec.ts` already verify the homepage sections render correctly.

| ID | Behavior | Test Type | Automated Command | File Exists? |
|----|----------|-----------|-------------------|-------------|
| CMS-01-a | Services section renders from Sanity data (not hardcoded) | smoke | `npx playwright test tests/content.spec.ts -g "services section" --project chromium` | ✅ (existing test covers render) |
| CMS-01-b | Values section renders from Sanity data | smoke | `npx playwright test tests/content.spec.ts -g "valores section" --project chromium` | ✅ |
| CMS-01-c | Metrics section renders from Sanity data | smoke | `npx playwright test tests/content.spec.ts -g "metrics counters" --project chromium` | ✅ |
| CMS-01-d | Nosotros page content renders (not hardcoded) | smoke | `npx playwright test tests/content.spec.ts -g "nosotros page" --project chromium` | ✅ |
| STUDIO-UX | Studio accessible at /studio with Spanish UI | manual | Navigate to http://localhost:3000/studio | manual-only — UI language not automatable headlessly |
| STUDIO-EDIT | Client can edit a service item and see change reflected on homepage | manual | manual-only — requires real Sanity project ID + dataset | manual-only |

**Note:** The core behavioral regression tests already exist in `content.spec.ts`. Phase 5 introduces no new public-facing pages — it migrates content sources. Playwright tests will catch regressions (e.g., empty array from Sanity instead of fallback rendering). The Studio UX improvements are manual-only.

### Sampling Rate
- **Per task commit:** `npx playwright test tests/content.spec.ts --project chromium`
- **Per wave merge:** `npx playwright test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/studio.spec.ts` — add a single smoke test that `GET /studio` returns 200 and renders the Studio shell (covers STUDIO-UX automated portion)

---

## Sources

### Primary (HIGH confidence)
- Sanity official docs — [Field Groups](https://www.sanity.io/docs/studio/field-groups) — fieldGroups syntax, group assignment
- Sanity official docs — [Localizing Studio UI](https://www.sanity.io/docs/studio/localizing-studio-ui) — `@sanity/locale-es-es` plugin installation
- Sanity official docs — [Singleton document guide](https://www.sanity.io/guides/singleton-document) — singleton pattern with Structure Builder
- Sanity official docs — [Structure Builder override](https://www.sanity.io/docs/studio/set-up-structure-builder-to-override-the-default-list-view) — custom sidebar resolver
- Sanity official docs — [Schema types](https://www.sanity.io/docs/studio/schema-types) — `title`, `description`, `hidden`, `readOnly` field properties
- Project codebase — `src/sanity/schemas/`, `src/components/home/`, `src/app/(site)/` — current hardcoded state

### Secondary (MEDIUM confidence)
- npm — `@sanity/locale-es-es` package page — Spanish locale plugin confirmed available (403 on direct fetch; confirmed via WebSearch against npm)
- WebSearch — `@sanity/locale-es-es` install pattern — `import { esESLocale } from '@sanity/locale-es-es'` and usage in plugins array

### Tertiary (LOW confidence)
- None — all critical claims are backed by official Sanity documentation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `@sanity/locale-es-es` confirmed on npm; all other packages already in project
- Architecture: HIGH — fieldGroups, Structure Builder, and singleton patterns verified against official Sanity v3 docs
- Pitfalls: HIGH — all pitfalls derived from code inspection of existing project files + official docs
- Validation: HIGH — Playwright config and tests inspected directly

**Research date:** 2026-03-17
**Valid until:** 2026-06-17 (Sanity v3 is stable; locale plugin follows same API)
