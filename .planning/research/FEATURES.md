# Feature Research

**Domain:** Corporate calibration services website — vehicular gas analyzers, B2B, Peru
**Researched:** 2026-03-17
**Confidence:** MEDIUM (industry patterns HIGH, Peru-specific nuances MEDIUM via WebSearch)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero banner with clear value proposition | First impression; B2B buyers decide within seconds whether to stay | LOW | Must state what the company does, who it serves, and the main CTA ("Solicitar cotización") |
| Services overview section | Visitors need to confirm the company does what they need | LOW | Card or icon layout listing calibration types and equipment sale; links to detail pages |
| Equipment catalog with filtering | Clients need to identify specific models they use; calibration companies always list equipment they support | MEDIUM | Two categories: "Equipos que calibramos" and "Equipos en venta"; filter by type or brand |
| Equipment detail page | Specs and compatibility info are required before any quote request | LOW | Model, specs, compatible standards (NTP, SENATI, MTC), status (in stock / service), CTA |
| Contact page with form | Standard expectation; form captures leads when WhatsApp isn't convenient | LOW | Name, company, phone, email, message; sends to company email via SMTP/API |
| WhatsApp floating button | WhatsApp is the dominant B2B contact channel in Peru; absence is jarring | LOW | Fixed position, pre-filled message, opens wa.me link; present on all pages |
| About Us page | B2B buyers research company credibility before purchasing; especially for regulated services | LOW | History, mission, team or founders, geographic coverage (Lima / national) |
| Mobile-responsive design | 60%+ of B2B research starts on mobile in Latin America | MEDIUM | Mobile-first layout; navigation collapses correctly; forms and CTAs work on small screens |
| Basic SEO (meta tags, OG, sitemap) | Local search ("calibración analizadores gases Lima") is primary discovery channel | LOW | Title/description per page, Open Graph for sharing, XML sitemap, robots.txt |
| Clear navigation | Users leave if they can't find what they need quickly | LOW | Max 5 items in nav; logical grouping: Servicios, Catálogo, Blog, Nosotros, Contacto |
| Company metrics / social proof | Calibration is a trust-sensitive service; numbers build confidence | LOW | Years of experience, number of clients, equipment brands supported, geographic reach |
| Quote request CTA throughout site | B2B conversion depends on reducing friction to initiate contact | LOW | Sticky CTA bar or repeated buttons at logical scroll points; leads to contact form or WhatsApp |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required to pass, but elevate trust and conversions.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Blog with regulatory/technical articles | Positions company as authority on Peruvian vehicle emissions regulation (Euro 4, MTC norms); improves SEO for long-tail queries | MEDIUM | Managed via Sanity CMS; articles on NTP norms, calibration frequency, new equipment; targets workshop owners searching for compliance guidance |
| Dual quote channels (form + WhatsApp) | Removes friction; different clients prefer different channels; maximizes conversion | LOW | Both paths lead to same outcome; WhatsApp preferred by small shops, email form by larger fleets and transport companies |
| CMS-driven content (Sanity) | Client can update equipment catalog, pricing, blog posts without developer; reduces maintenance cost long-term | HIGH | Sanity Studio for non-technical editors; structured content schemas for equipment and articles |
| Equipment spec sheets or downloadable PDFs | Technical buyers (plant managers, fleet operators) want to verify before calling | MEDIUM | PDF or inline spec table per equipment; can be added to Sanity schema as file upload field |
| Metrics/stats section (homepage) | Differentiates from competitors without visible track record; builds immediate credibility | LOW | "Más de X años de experiencia", "Y equipos calibrados", "Z marcas atendidas" — static or CMS-driven |
| Industry-specific client segments section | Helps each buyer type (taller, planta, flota) self-identify and understand relevance to them | LOW | Section or subsection per client type with their specific pain point addressed; guides to relevant services |
| Fast page load and Core Web Vitals compliance | Industrial clients in Peru often have slower connections; performance is trust signal | MEDIUM | Next.js SSG/ISR for catalog pages; image optimization via next/image; minimal JS bundle |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for this project at this stage.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Live chat widget (Intercom, Tawk, etc.) | Seems like a modern contact channel | Requires someone to monitor it in real time; abandoned chats damage trust more than no chat; adds JS weight; WhatsApp already covers this need | WhatsApp floating button with pre-filled message covers all real-time chat needs |
| E-commerce / online payment for calibration | Some clients want to pay directly online | Calibration is a regulated service requiring physical coordination; quotes vary by equipment count and condition; payment integration adds legal and tax complexity in Peru | Quote form or WhatsApp initiates the commercial process; payment handled offline |
| Multi-language (English) | Seems professional | Zero ROI for v1; target market is 100% Spanish-speaking; adds content duplication and CMS complexity | Ship Spanish only; add English only if export or international clients emerge |
| Client portal / login area | Enterprise clients sometimes request document download portals | Adds authentication complexity, session management, security requirements; no validated demand yet | Email calibration certificates directly to clients; offer WhatsApp as support channel |
| Real-time inventory or stock tracking | Feels like a useful e-commerce feature | Equipment catalog is a reference list, not a live warehouse; updates would need API integration; creates false expectation of availability | CMS-managed "estado" field (Disponible / Consultar disponibilidad) updated manually |
| Testimonials carousel with social proof | Standard recommendation | Hard to obtain at launch; fake or thin testimonials hurt trust; carousel UI has poor UX and accessibility | Static metrics section ("X años de experiencia", "Y clientes") is more credible at launch; add real testimonials when available |
| ISO certification badge | Builds credibility | Company explicitly does not hold ISO certifications currently; displaying fake/aspirational badges is deceptive | Highlight years of experience, brands supported, and regulatory compliance knowledge instead |
| Chatbot / AI assistant | Modern AI trend | Adds complexity; calibration queries require technical judgment; bad bot answers erode trust with technical buyers | Blog articles answer common pre-sale questions; WhatsApp connects to a human |

## Feature Dependencies

```
Equipment Catalog (list)
    └──requires──> Equipment Detail Page
                       └──requires──> Quote CTA / Contact Form
                                          └──requires──> Email delivery (SMTP or API)

Blog Article List
    └──requires──> Blog Article Detail
                       └──enhances──> SEO (meta, OG per article)

CMS (Sanity)
    └──enables──> Equipment Catalog (content)
    └──enables──> Blog (content)
    └──enables──> Homepage sections (hero copy, metrics, services)
    └──enables──> About Us (content)

WhatsApp Button
    └──independent──> (no dependencies; works standalone on all pages)

SEO (meta, sitemap)
    └──enhances──> All pages
    └──requires──> Static or SSG rendering (Next.js)

Mobile-Responsive Design
    └──applies to──> All features (foundational, not a separate phase)
```

### Dependency Notes

- **Equipment Detail requires Equipment Catalog:** Detail pages are only useful if the catalog list links to them; catalog must be built first.
- **CMS enables all content features:** Sanity schemas must be defined before catalog and blog can be populated; schema design is a foundational task.
- **Quote CTA requires Contact Form or WhatsApp:** At least one conversion path must exist before driving traffic to the site; both should be live at launch.
- **Blog enhances SEO:** Blog is not required for launch but multiplies SEO value significantly after a few months of content; it is a medium-term investment, not day-one critical.
- **WhatsApp is independent:** No technical dependency; can be added at any stage with minimal effort.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to go live and start capturing leads.

- [ ] Homepage (hero, services overview, metrics, featured equipment, CTA) — first impression and conversion entry point
- [ ] Equipment catalog (list + detail) — core product showcase; required for quotes to be specific
- [ ] Contact page with email form — captures leads from clients who prefer not to use WhatsApp
- [ ] WhatsApp floating button — highest-ROI contact channel for Peru; zero maintenance
- [ ] About Us page — trust signal; clients research the company before calling
- [ ] Mobile-responsive design — non-negotiable; majority of initial traffic will be mobile
- [ ] Basic SEO (meta tags, OG, XML sitemap) — required for local search discoverability
- [ ] CMS integration (Sanity) — enables client to manage content independently after handoff

### Add After Validation (v1.x)

Features to add once core site is live and traffic is established.

- [ ] Blog with initial 3-5 articles — add when client can commit to providing content; SEO value compounds over time
- [ ] Equipment PDF spec sheets — add when client provides real equipment photos and specs
- [ ] Industry-specific segment pages ("Para talleres", "Para plantas de revisión técnica") — add if analytics show segment drop-off

### Future Consideration (v2+)

Features to defer until there is validated demand.

- [ ] Client document portal (certificate downloads) — defer until clients explicitly request it and company has volume to justify it
- [ ] Online payment / e-commerce for equipment sale — defer until regulatory and tax complexity is understood
- [ ] English version — defer until international client demand is demonstrated

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| WhatsApp floating button | HIGH | LOW | P1 |
| Homepage hero + CTA | HIGH | LOW | P1 |
| Equipment catalog (list + detail) | HIGH | MEDIUM | P1 |
| Contact form with email delivery | HIGH | LOW | P1 |
| About Us page | MEDIUM | LOW | P1 |
| Mobile-responsive design | HIGH | MEDIUM | P1 |
| Basic SEO | HIGH | LOW | P1 |
| CMS (Sanity) content management | HIGH | HIGH | P1 |
| Metrics / social proof section | MEDIUM | LOW | P1 |
| Blog (articles) | MEDIUM | MEDIUM | P2 |
| Equipment spec sheet PDFs | MEDIUM | LOW | P2 |
| Industry segment pages | MEDIUM | MEDIUM | P2 |
| Client portal | LOW | HIGH | P3 |
| Online payment | LOW | HIGH | P3 |
| English language version | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

Based on Peruvian industrial services company websites observed (SIMCAL PERU, JS Industrial Peru, IDCERT, Valiometro, CarTools Peru):

| Feature | SIMCAL PERU | JS Industrial | Our Approach |
|---------|-------------|---------------|--------------|
| Homepage hero with CTA | Yes, generic | Yes, technical | Yes — industry-specific, conversion-focused |
| Services catalog | Yes, by product category | Yes, by sector | Yes — dual catalog (calibration service + equipment sale) |
| Contact form | Yes | Yes | Yes — plus WhatsApp (competitors vary) |
| WhatsApp button | Not visible | Not visible | Yes — differentiator for target audience (talleres, small fleets) |
| Blog / content | Minimal or none | None | Yes — regulatory content targets workshop owners |
| Mobile-first | Partial | Partial | Yes — mobile-first, fully responsive |
| CMS-driven content | Unknown | Unknown | Yes — Sanity allows client autonomy post-launch |
| About Us | Yes | Yes | Yes — with emphasis on experience and brands supported |
| Equipment detail pages | Yes | Yes | Yes — with specs and quote CTA per item |
| Certifications displayed | Some (ISO) | Some | No ISO badges (company doesn't hold them); emphasize experience instead |

## Sources

- B2B website design best practices: [Trajectory Web Design](https://www.trajectorywebdesign.com/blog/b2b-website-design-best-practices), [Blue Atlas Marketing](https://www.blueatlasmarketing.com/resources/b2b-website-design-best-practices/)
- Industrial website design patterns: [ColorWhistle Industrial Design](https://colorwhistle.com/industrial-website-design-inspiration/), [Fulmino Software — Top 11 Features](https://fulminoussoftware.com/top-11-features-every-manufacturing-website-should-have), [Windmill Strategy](https://www.windmillstrategy.com/best-manufacturing-websites-examples/)
- Calibration services websites reviewed: [Tektronix](https://www.tek.com/en/services/calibration-services), [Advanced Tech Systems](https://www.advancedtech.com/calibration/), [Cal-Cert](https://www.cal-cert.com/industries/manufacturing)
- Peru market competitors: [SIMCAL PERU](https://simcalperu.com/), [JS Industrial PERU](https://www.jsindustrial.com.pe/), [IDCERT](https://idcert.com.pe/), [Valiometro](https://valiometro.pe/), [CarTools Peru](https://cartoolsperu.com/)
- WhatsApp in Latin America: [Mobile Growth Association](https://mobilegrowthassociation.com/how-whatsapp-took-over-latin-america/)
- B2B Peru platform and conversion: [Red B2B Peru](https://redb2bperu.com/), [First Page Sage B2B conversion rates](https://firstpagesage.com/seo-blog/b2b-landing-page-conversion-rates/)
- Scope creep and anti-features: [Windmill Strategy — Feature Prioritization](https://www.windmillstrategy.com/how-to-prioritize-features-for-a-successful-industrial-b2b-marketing-website-redesign/)

---
*Feature research for: Corporate calibration services website — Testing Calibrations S.A.C.*
*Researched: 2026-03-17*
