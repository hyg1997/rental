import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Artículo de Blog',
  type: 'document',
  groups: [
    { name: 'contenido', title: 'Contenido', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', group: 'contenido', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', group: 'contenido', options: { source: 'titulo' }, validation: r => r.required() }),
    defineField({ name: 'extracto', title: 'Extracto', type: 'text', rows: 3, group: 'contenido' }),
    defineField({ name: 'imagen', title: 'Imagen Principal', type: 'image', group: 'contenido', options: { hotspot: true } }),
    defineField({ name: 'contenido', title: 'Contenido', type: 'array', group: 'contenido', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'autor', title: 'Autor', type: 'string', group: 'contenido' }),
    defineField({ name: 'categoria', title: 'Categoría', type: 'string', group: 'contenido' }),
    defineField({ name: 'fechaPublicacion', title: 'Fecha de Publicación', type: 'datetime', group: 'contenido' }),
    // SEO fields
    defineField({
      name: 'seoTitle',
      title: 'Titulo SEO',
      type: 'string',
      group: 'seo',
      description: 'Titulo que aparece en Google. Si esta vacio, se usa el titulo del articulo.',
      validation: r => r.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Descripcion SEO',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Descripcion que aparece en Google (max 160 caracteres).',
      validation: r => r.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen para Redes Sociales',
      type: 'image',
      group: 'seo',
      description: 'Imagen que se muestra al compartir en WhatsApp, Facebook, etc. Tamano ideal: 1200x630px.',
    }),
  ],
})
