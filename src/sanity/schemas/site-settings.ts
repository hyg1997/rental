import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del Sitio',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', title: 'Nombre del Sitio', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({ name: 'whatsappNumber', title: 'WhatsApp (con código país)', type: 'string' }),
    defineField({ name: 'email', title: 'Email de Contacto', type: 'string' }),
    defineField({ name: 'address', title: 'Dirección', type: 'string' }),
    defineField({ name: 'navLinks', title: 'Links de Navegación', type: 'array',
      of: [defineField({ name: 'navLink', type: 'object', fields: [
        defineField({ name: 'label', type: 'string' }),
        defineField({ name: 'href', type: 'string' }),
      ]})]
    }),
    defineField({ name: 'socialLinks', title: 'Redes Sociales', type: 'array',
      of: [defineField({ name: 'socialLink', type: 'object', fields: [
        defineField({ name: 'platform', type: 'string' }),
        defineField({ name: 'url', type: 'url' }),
      ]})]
    }),
    defineField({ name: 'footerText', title: 'Texto Footer', type: 'string' }),
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(({ __experimental_actions: ['update', 'publish'] }) as any),
})
