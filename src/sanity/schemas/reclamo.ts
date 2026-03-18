import { defineField, defineType } from 'sanity'

export const reclamo = defineType({
  name: 'reclamo',
  title: 'Reclamo',
  type: 'document',
  fields: [
    defineField({ name: 'fechaReclamo', title: 'Fecha', type: 'datetime' }),
    defineField({ name: 'nombreConsumidor', title: 'Nombre del Consumidor', type: 'string', validation: r => r.required() }),
    defineField({ name: 'dniRuc', title: 'DNI / RUC', type: 'string' }),
    defineField({ name: 'emailConsumidor', title: 'Email', type: 'string' }),
    defineField({ name: 'telefonoConsumidor', title: 'Teléfono', type: 'string' }),
    defineField({ name: 'tipoReclamo', title: 'Tipo', type: 'string',
      options: { list: [{ title: 'Queja', value: 'queja' }, { title: 'Reclamo', value: 'reclamo' }] }
    }),
    defineField({ name: 'bienServicio', title: 'Bien / Servicio reclamado', type: 'text' }),
    defineField({ name: 'detalle', title: 'Detalle del reclamo', type: 'text', validation: r => r.required() }),
    defineField({ name: 'pedido', title: 'Pedido del consumidor', type: 'text' }),
    defineField({ name: 'estado', title: 'Estado', type: 'string',
      options: { list: [{ title: 'Pendiente', value: 'pendiente' }, { title: 'Resuelto', value: 'resuelto' }] },
      initialValue: 'pendiente'
    }),
  ],
})
