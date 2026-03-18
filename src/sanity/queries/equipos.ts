import { defineQuery } from 'groq'

// List page — lightweight projection for cards
export const EQUIPOS_LIST_QUERY = defineQuery(`
  *[_type == "equipo"] | order(_createdAt desc) {
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

// generateStaticParams — slugs only
export const EQUIPOS_SLUGS_QUERY = defineQuery(`
  *[_type == "equipo" && defined(slug.current)] {
    "slug": slug.current
  }
`)

// Detail page — full document
export const EQUIPO_BY_SLUG_QUERY = defineQuery(`
  *[_type == "equipo" && slug.current == $slug][0] {
    _id,
    nombre,
    "slug": slug.current,
    tipo,
    categoria,
    marca,
    modelo,
    descripcion,
    especificaciones,
    imagenes,
    estado,
    destacado
  }
`)
