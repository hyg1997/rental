import { defineField, defineType } from 'sanity'

export const banner = defineType({
  name: 'banner',
  title: 'Banner Hero',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: r => r.required() }),
    defineField({ name: 'subtitulo', title: 'Subtítulo', type: 'string' }),
    defineField({ name: 'imagen', title: 'Imagen de Fondo', type: 'image', options: { hotspot: true }, validation: r => r.required() }),
    defineField({ name: 'ctaTexto', title: 'Texto del Botón CTA', type: 'string' }),
    defineField({ name: 'ctaUrl', title: 'URL del CTA', type: 'string' }),
    defineField({ name: 'orden', title: 'Orden', type: 'number', initialValue: 0 }),
    defineField({ name: 'activo', title: 'Activo', type: 'boolean', initialValue: true }),
  ],
})
