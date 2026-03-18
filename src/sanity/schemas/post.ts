import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Artículo de Blog',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titulo' }, validation: r => r.required() }),
    defineField({ name: 'extracto', title: 'Extracto', type: 'text', rows: 3 }),
    defineField({ name: 'imagen', title: 'Imagen Principal', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'contenido', title: 'Contenido', type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'autor', title: 'Autor', type: 'string' }),
    defineField({ name: 'categoria', title: 'Categoría', type: 'string' }),
    defineField({ name: 'fechaPublicacion', title: 'Fecha de Publicación', type: 'datetime' }),
  ],
})
