import { defineQuery } from 'groq'

export const SITE_SEO_DEFAULTS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    defaultSeoTitle,
    defaultSeoDescription,
    defaultOgImage
  }
`)

export const POST_SEO_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    titulo,
    extracto,
    seoTitle,
    seoDescription,
    ogImage,
    imagen,
    fechaPublicacion,
    autor
  }
`)

export const EQUIPO_SEO_BY_SLUG_QUERY = defineQuery(`
  *[_type == "equipo" && slug.current == $slug][0]{
    nombre,
    descripcion,
    seoTitle,
    seoDescription,
    "imagen": imagenes[0],
    marca
  }
`)
