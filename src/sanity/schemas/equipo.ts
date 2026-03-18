import { defineField, defineType } from 'sanity'

export const equipo = defineType({
  name: 'equipo',
  title: 'Equipo',
  type: 'document',
  fields: [
    defineField({ name: 'nombre', title: 'Nombre', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'nombre' }, validation: r => r.required() }),
    defineField({ name: 'tipo', title: 'Tipo', type: 'string',
      options: { list: [{ title: 'Calibración', value: 'calibracion' }, { title: 'Venta', value: 'venta' }] },
      validation: r => r.required()
    }),
    defineField({ name: 'categoria', title: 'Categoría', type: 'string' }),
    defineField({ name: 'marca', title: 'Marca', type: 'string' }),
    defineField({ name: 'modelo', title: 'Modelo', type: 'string' }),
    defineField({ name: 'descripcion', title: 'Descripción', type: 'text' }),
    defineField({ name: 'especificaciones', title: 'Especificaciones', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'imagenes', title: 'Imágenes', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'estado', title: 'Estado', type: 'string',
      options: { list: [{ title: 'Disponible', value: 'disponible' }, { title: 'No disponible', value: 'no_disponible' }] }
    }),
    defineField({ name: 'destacado', title: 'Destacado en Homepage', type: 'boolean', initialValue: false }),
  ],
})
