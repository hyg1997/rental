import { defineQuery } from 'groq'

export const FEATURED_EQUIPOS_QUERY = defineQuery(`
  *[_type == "equipo" && destacado == true] | order(_createdAt desc) [0..5] {
    _id, nombre, "slug": slug.current, tipo, categoria, marca, modelo, estado, "imagenPrincipal": imagenes[0]
  }
`)
