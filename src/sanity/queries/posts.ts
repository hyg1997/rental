import { defineQuery } from 'groq'

export const POSTS_LIST_QUERY = defineQuery(`
  *[_type == "post"] | order(fechaPublicacion desc) {
    _id, titulo, "slug": slug.current, extracto, "imagen": imagen,
    autor, categoria, fechaPublicacion
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] { "slug": slug.current }
`)

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id, titulo, "slug": slug.current, extracto, imagen, contenido,
    autor, categoria, fechaPublicacion
  }
`)
