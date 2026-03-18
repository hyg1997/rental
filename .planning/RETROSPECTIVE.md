# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-18
**Phases:** 5 | **Plans:** 17 | **Sessions:** ~5

### What Was Built
- Sitio web corporativo completo con 7 páginas públicas + Sanity Studio embebido
- Catálogo de equipos con filtrado, búsqueda y CTA de cotización via WhatsApp
- Sistema de contacto y reclamaciones con Resend email + persistencia Sanity
- Blog con Portable Text, categorías y autor
- SEO completo: meta tags dinámicos, Open Graph, sitemap.xml
- CMS 100% editable desde Studio en español con Structure Builder

### What Worked
- **Arquitectura de fases incrementales**: cada fase construyó sobre la anterior sin rework
- **siteSettings singleton pattern**: un solo documento Sanity con fieldGroups simplificó tanto el schema como las queries GROQ
- **Wave 0 testing pattern**: crear stubs de tests antes de implementar aseguró coverage desde el inicio
- **@sanity/client directo** en vez de next-sanity: evitó problemas conocidos (issue #1899)
- **Velocity alta**: 17 plans en 1 día, promedio ~7 min por plan

### What Was Inefficient
- **Audit reportó Phase 4 como no-existente** cuando ya estaba completada — la auditoría se corrió en un punto intermedio y no se actualizó
- **Tech debt acumulado en env vars**: SANITY_PROJECT_ID, RESEND_API_KEY, SANITY_WRITE_TOKEN todos como placeholder — deberían configurarse como gate de Phase 1
- **Tests de hamburguesa con assertions comentadas**: se perdió el valor del test al dejarlo como stub permanente

### Patterns Established
- GROQ queries en archivos dedicados (`src/sanity/queries/*.ts`) con defineQuery del package `groq`
- Fallback pattern: `.catch(() => null)` con contenido inline de respaldo para páginas que leen de Sanity
- Icon map pattern: `Record<string, LucideIcon>` con fallback para prevenir crashes por valores desconocidos
- SEO field groups en Sanity: tab "Contenido" por defecto, tab "SEO" solo cuando se necesita
- Layout server component fetches siteSettings una vez y pasa props — evita waterfall fetches

### Key Lessons
1. **Configurar env vars reales en Phase 1**, no dejarlos como placeholder — genera cascada de "config broken" en fases posteriores
2. **No comentar assertions en tests** — un test sin assertions da falsa confianza; mejor marcarlo como `.skip` o `todo`
3. **Correr auditoría después de completar todas las fases**, no durante — evita reportes obsoletos
4. **siteSettings singleton con fieldGroups** escala bien para sitios corporativos de tamaño medio

### Cost Observations
- Model mix: mayoritariamente Sonnet para ejecución, Opus para planning
- Sessions: ~5 sesiones
- Notable: velocidad de ejecución muy alta gracias a planes detallados y dependencias claras

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | ~5 | 5 | Primer milestone — proceso GSD establecido |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | 16+ stubs | Partial (nyquist non-compliant) | 2 (resend, @sanity/locale-es-es) |

### Top Lessons (Verified Across Milestones)

1. Env vars de servicios externos deben configurarse como prerequisito, no como tech debt
2. Tests con assertions reales > stubs vacíos que pasan trivialmente
