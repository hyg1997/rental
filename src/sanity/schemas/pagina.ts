import { defineField, defineType } from 'sanity'

export const pagina = defineType({
  name: 'pagina',
  title: 'Página',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titulo' }, validation: r => r.required() }),
    defineField({ name: 'contenido', title: 'Contenido', type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
  ],
})
