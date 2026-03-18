import { defineField, defineType, defineArrayMember } from 'sanity'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const siteSettingsBase = defineType({
  name: 'siteSettings',
  title: 'Configuración del Sitio',
  type: 'document',
  groups: [
    { name: 'general', title: 'Informacion General', default: true },
    { name: 'homepage', title: 'Pagina de Inicio' },
    { name: 'nosotros', title: 'Pagina Nosotros' },
    { name: 'contacto', title: 'Contacto y Redes' },
    { name: 'navegacion', title: 'Menu y Footer' },
    { name: 'seo', title: 'SEO por Defecto' },
  ],
  fields: [
    // General
    defineField({
      name: 'siteName',
      title: 'Nombre del Sitio',
      type: 'string',
      group: 'general',
      description: 'Nombre que aparece en el navegador y en el encabezado del sitio.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'general',
      description: 'Logo principal del sitio. Formatos recomendados: PNG o SVG con fondo transparente.',
    }),

    // Homepage sections
    defineField({
      name: 'servicios',
      title: 'Servicios',
      type: 'array',
      group: 'homepage',
      description: 'Tarjetas de la seccion "Nuestros Servicios" en la pagina de inicio.',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Servicio',
          fields: [
            defineField({
              name: 'titulo',
              title: 'Nombre del Servicio',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'descripcion',
              title: 'Descripcion',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'icono',
              title: 'Icono',
              type: 'string',
              description: 'Icono representativo del servicio.',
              options: {
                list: [
                  { title: 'Llave inglesa', value: 'wrench' },
                  { title: 'Check (verificacion)', value: 'check-circle' },
                  { title: 'Escudo', value: 'shield' },
                  { title: 'Engranaje', value: 'settings' },
                  { title: 'Rayo', value: 'zap' },
                ],
              },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'valores',
      title: 'Por que Elegirnos',
      type: 'array',
      group: 'homepage',
      description: 'Tarjetas de la seccion "Por que elegirnos?" en la pagina de inicio.',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Valor',
          fields: [
            defineField({
              name: 'titulo',
              title: 'Titulo',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'descripcion',
              title: 'Descripcion',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'icono',
              title: 'Icono',
              type: 'string',
              options: {
                list: [
                  { title: 'Premio / Trofeo', value: 'award' },
                  { title: 'Reloj', value: 'clock' },
                  { title: 'Personas / Equipo', value: 'users' },
                  { title: 'Escudo', value: 'shield' },
                  { title: 'Check', value: 'check-circle' },
                ],
              },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'metricas',
      title: 'Metricas de Experiencia',
      type: 'array',
      group: 'homepage',
      description: 'Numeros animados que aparecen en la seccion de estadisticas.',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Metrica',
          fields: [
            defineField({
              name: 'valor',
              title: 'Numero',
              type: 'number',
              validation: (r) => r.required(),
              description: 'El numero que se anima (sin el simbolo +). Ejemplo: 200',
            }),
            defineField({
              name: 'sufijo',
              title: 'Sufijo',
              type: 'string',
              description: 'Texto despues del numero. Ejemplo: "+" o "%"',
            }),
            defineField({
              name: 'etiqueta',
              title: 'Etiqueta',
              type: 'string',
              validation: (r) => r.required(),
              description: 'Descripcion debajo del numero. Ejemplo: "Clientes atendidos"',
            }),
          ],
        }),
      ],
    }),

    // Nosotros page
    defineField({
      name: 'nosotrosHistoria',
      title: 'Historia de la Empresa',
      type: 'text',
      rows: 5,
      group: 'nosotros',
      description: 'Parrafo de presentacion de la empresa en la pagina Nosotros.',
    }),
    defineField({
      name: 'nosotrosMision',
      title: 'Mision',
      type: 'text',
      rows: 3,
      group: 'nosotros',
    }),
    defineField({
      name: 'nosotrosVision',
      title: 'Vision',
      type: 'text',
      rows: 3,
      group: 'nosotros',
    }),
    defineField({
      name: 'nosotrosValores',
      title: 'Valores de la Empresa',
      type: 'array',
      group: 'nosotros',
      description: 'Tarjetas de valores en la pagina Nosotros.',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Valor',
          fields: [
            defineField({
              name: 'titulo',
              title: 'Nombre del Valor',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'descripcion',
              title: 'Descripcion',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'icono',
              title: 'Icono',
              type: 'string',
              options: {
                list: [
                  { title: 'Check / Precision', value: 'check-circle' },
                  { title: 'Escudo / Integridad', value: 'shield' },
                  { title: 'Personas / Compromiso', value: 'users' },
                ],
              },
            }),
          ],
        }),
      ],
    }),

    // Contacto
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp (con codigo pais)',
      type: 'string',
      group: 'contacto',
      description: 'Numero completo con codigo de pais. Ejemplo: 51987654321 (Peru = 51).',
    }),
    defineField({
      name: 'email',
      title: 'Email de Contacto',
      type: 'string',
      group: 'contacto',
      description: 'Email principal de contacto de la empresa.',
    }),
    defineField({
      name: 'address',
      title: 'Direccion',
      type: 'string',
      group: 'contacto',
      description: 'Direccion fisica de la oficina o laboratorio.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes Sociales',
      type: 'array',
      group: 'contacto',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Red Social',
              type: 'string',
              options: { list: ['Facebook', 'Instagram', 'LinkedIn', 'YouTube'] },
            }),
            defineField({
              name: 'url',
              title: 'URL del Perfil',
              type: 'url',
            }),
          ],
        }),
      ],
    }),

    // Navegacion
    defineField({
      name: 'navLinks',
      title: 'Links de Navegacion',
      type: 'array',
      group: 'navegacion',
      description: 'Elementos del menu principal. El orden aqui determina el orden en el menu.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Etiqueta',
              type: 'string',
              description: 'Texto visible en el menu. Ejemplo: "Nosotros"',
            }),
            defineField({
              name: 'href',
              title: 'Enlace',
              type: 'string',
              description: 'Ruta interna. Ejemplo: /nosotros',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Texto del Footer',
      type: 'string',
      group: 'navegacion',
      description: 'Texto de copyright. Ejemplo: "2025 Testing Calibrations S.A.C. Todos los derechos reservados."',
    }),

    // SEO Defaults
    defineField({
      name: 'defaultSeoTitle',
      title: 'Titulo SEO por Defecto',
      type: 'string',
      group: 'seo',
      description: 'Titulo que aparece en Google cuando una pagina no tiene titulo propio.',
    }),
    defineField({
      name: 'defaultSeoDescription',
      title: 'Descripcion SEO por Defecto',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Descripcion que aparece en Google cuando una pagina no tiene descripcion propia.',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Imagen OG por Defecto',
      type: 'image',
      group: 'seo',
      description: 'Imagen de reserva cuando la pagina no tiene imagen propia. 1200x630px.',
    }),
  ],
})

// Singleton: disable create/delete actions in Studio
// __experimental_actions is not in Sanity v3 types but is widely supported at runtime
export const siteSettings = Object.assign(siteSettingsBase, {
  __experimental_actions: ['update', 'publish'],
})
