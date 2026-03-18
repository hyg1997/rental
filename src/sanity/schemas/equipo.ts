import { defineField, defineType } from 'sanity'

export const equipo = defineType({
  name: 'equipo',
  title: 'Equipo',
  type: 'document',
  groups: [
    { name: 'info', title: 'Informacion', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'nombre', title: 'Nombre', type: 'string', group: 'info', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', group: 'info', options: { source: 'nombre' }, validation: r => r.required() }),
    defineField({ name: 'tipo', title: 'Tipo', type: 'string',
      group: 'info',
      options: { list: [{ title: 'Calibración', value: 'calibracion' }, { title: 'Venta', value: 'venta' }] },
      validation: r => r.required()
    }),
    defineField({ name: 'categoria', title: 'Categoría', type: 'string', group: 'info' }),
    defineField({ name: 'marca', title: 'Marca', type: 'string', group: 'info' }),
    defineField({ name: 'modelo', title: 'Modelo', type: 'string', group: 'info' }),
    defineField({ name: 'descripcion', title: 'Descripción', type: 'text', group: 'info' }),
    defineField({ name: 'especificaciones', title: 'Especificaciones', type: 'array', group: 'info', of: [{ type: 'block' }] }),
    defineField({ name: 'imagenes', title: 'Imágenes', type: 'array', group: 'info', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'estado', title: 'Estado', type: 'string',
      group: 'info',
      options: { list: [{ title: 'Disponible', value: 'disponible' }, { title: 'No disponible', value: 'no_disponible' }] }
    }),
    defineField({ name: 'destacado', title: 'Destacado en Homepage', type: 'boolean', group: 'info', initialValue: false }),
    // SEO fields
    defineField({
      name: 'seoTitle',
      title: 'Titulo SEO',
      type: 'string',
      group: 'seo',
      description: 'Titulo que aparece en Google. Si esta vacio, se usa el nombre del equipo.',
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
  ],
})
