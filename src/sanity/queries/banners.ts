import { defineQuery } from 'groq'

export const BANNERS_QUERY = defineQuery(`
  *[_type == "banner" && activo == true] | order(orden asc) {
    _id, titulo, subtitulo, "imagen": imagen, ctaTexto, ctaUrl
  }
`)
