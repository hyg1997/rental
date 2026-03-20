import { defineQuery } from 'groq'

export const HOMEPAGE_CONTENT_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    servicios[]{titulo, descripcion, icono, items[]},
    valores[]{titulo, descripcion, icono},
    metricas[]{valor, sufijo, etiqueta},
    aboutImage,
    aboutExperienceYears,
    proceso[]{titulo, descripcion, icono},
    nosotrosHistoria,
    nosotrosMision,
    nosotrosVision
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
