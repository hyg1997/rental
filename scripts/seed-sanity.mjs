/**
 * Seed Sanity CMS with Testing Calibrations S.A.C. real company data.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<your-token> node scripts/seed-sanity.mjs
 */

import { createClient } from '@sanity/client'
import https from 'https'
import { createReadStream } from 'fs'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error('❌ Falta SANITY_WRITE_TOKEN. Ejecuta:')
  console.error('   SANITY_WRITE_TOKEN=<tu-token> node scripts/seed-sanity.mjs')
  process.exit(1)
}

const client = createClient({
  projectId: 'p1t6nymc',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function uploadImageFromUrl(url, filename) {
  const tmpPath = join(tmpdir(), filename)
  await new Promise((resolve, reject) => {
    const follow = (u) => {
      https.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          follow(res.headers.location)
          return
        }
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', async () => { await writeFile(tmpPath, Buffer.concat(chunks)); resolve() })
        res.on('error', reject)
      }).on('error', reject)
    }
    follow(url)
  })
  const asset = await client.assets.upload('image', createReadStream(tmpPath), { filename })
  await unlink(tmpPath).catch(() => {})
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function main() {
  console.log('🚀 Iniciando seed con datos reales de Testing Calibrations S.A.C.\n')

  // 1. Upload about image
  console.log('📷 Subiendo imagen "Sobre Nosotros"...')
  const aboutImage = await uploadImageFromUrl(
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
    'laboratorio-tecnico.jpg'
  )
  console.log('   ✓ Imagen subida\n')

  // 2. Update siteSettings
  console.log('⚙️  Actualizando Configuración del Sitio...')
  const existing = await client.fetch('*[_type == "siteSettings"][0]._id')

  const siteSettingsData = {
    _type: 'siteSettings',
    siteName: 'Testing Calibrations',

    // ── SERVICIOS ──
    servicios: [
      {
        _key: 'srv-gases',
        _type: 'object',
        titulo: 'Analizadores de Gases Vehiculares',
        descripcion: 'Calibración de alta precisión para el control de emisiones vehiculares y protección ambiental.',
        icono: 'flask',
        items: [
          'Analizador de Gases',
          'Opacímetro',
          'Detector de Gases',
          'Sonómetro',
        ],
      },
      {
        _key: 'srv-citv',
        _type: 'object',
        titulo: 'Equipos de Línea CITV',
        descripcion: 'Certificación de equipos críticos para Centros de Inspección Técnica Vehicular.',
        icono: 'gauge',
        items: [
          'Frenómetro de Rodillos',
          'Banco de Suspensión',
          'Alineador de Ruedas al Paso',
          'Detector de Holguras',
        ],
      },
      {
        _key: 'srv-instrumentacion',
        _type: 'object',
        titulo: 'Instrumentación Especial',
        descripcion: 'Equipamiento complementario bajo normativas internacionales de metrología.',
        icono: 'microscope',
        items: [
          'Regloscopio con Luxómetros',
          'Profundímetro',
          'Retro-reflectómetro',
          'Telurómetro',
          'Máquinas de Ensayo Uniaxial',
        ],
      },
    ],

    // ── VALORES ──
    valores: [
      {
        _key: 'val-imparcialidad',
        _type: 'object',
        titulo: 'Imparcialidad',
        descripcion: 'Actuamos con objetividad, evitando conflictos de interés que puedan afectar la confiabilidad de nuestros resultados.',
        icono: 'scale',
      },
      {
        _key: 'val-integridad',
        _type: 'object',
        titulo: 'Integridad',
        descripcion: 'Desarrollamos nuestras actividades con honestidad, transparencia y ética profesional.',
        icono: 'shield',
      },
      {
        _key: 'val-calidad',
        _type: 'object',
        titulo: 'Calidad',
        descripcion: 'Trabajamos bajo estándares técnicos que garantizan la confiabilidad y exactitud de nuestros servicios.',
        icono: 'star',
      },
      {
        _key: 'val-competencia',
        _type: 'object',
        titulo: 'Competencia Técnica',
        descripcion: 'Promovemos la capacitación continua de nuestro personal para asegurar servicios técnicamente competentes.',
        icono: 'graduation-cap',
      },
      {
        _key: 'val-compromiso',
        _type: 'object',
        titulo: 'Compromiso con el Cliente',
        descripcion: 'Buscamos satisfacer las necesidades de nuestros clientes mediante un servicio eficiente y confiable.',
        icono: 'heart-handshake',
      },
      {
        _key: 'val-mejora',
        _type: 'object',
        titulo: 'Mejora Continua',
        descripcion: 'Fortalecemos permanentemente nuestro sistema de gestión y nuestros procesos.',
        icono: 'trending-up',
      },
    ],

    // ── MÉTRICAS ──
    metricas: [
      { _key: 'met-clientes', _type: 'object', valor: 500, sufijo: '+', etiqueta: 'Clientes Satisfechos' },
      { _key: 'met-experiencia', _type: 'object', valor: 15, sufijo: '+', etiqueta: 'Años de Experiencia' },
      { _key: 'met-equipos', _type: 'object', valor: 1000, sufijo: '+', etiqueta: 'Equipos Calibrados' },
      { _key: 'met-empresas', _type: 'object', valor: 50, sufijo: '+', etiqueta: 'Empresas Atendidas' },
    ],

    // ── ABOUT SECTION ──
    aboutImage,
    aboutExperienceYears: 15,

    // ── PROCESO (Quejas) ──
    proceso: [
      { _key: 'proc-1', _type: 'object', titulo: 'Recepción', descripcion: 'Recepción de la queja por correo, teléfono o formulario web.', icono: 'pencil' },
      { _key: 'proc-2', _type: 'object', titulo: 'Registro', descripcion: 'Registro y evaluación de la queja recibida.', icono: 'clipboard-list' },
      { _key: 'proc-3', _type: 'object', titulo: 'Investigación', descripcion: 'Investigación del caso por personal competente.', icono: 'test-tube' },
      { _key: 'proc-4', _type: 'object', titulo: 'Acción', descripcion: 'Determinación de acciones correctivas si corresponde.', icono: 'refresh-cw' },
      { _key: 'proc-5', _type: 'object', titulo: 'Respuesta', descripcion: 'Comunicación de la respuesta al cliente.', icono: 'check-circle' },
      { _key: 'proc-6', _type: 'object', titulo: 'Cierre', descripcion: 'Seguimiento y cierre del caso.', icono: 'check-circle' },
    ],

    // ── NOSOTROS ──
    nosotrosHistoria:
      'Testing Calibrations S.A.C. es un laboratorio especializado en la calibración de analizadores de gases vehiculares, comprometido con la confiabilidad de las mediciones, la calidad técnica y el cumplimiento de los requisitos normativos aplicables.\n\nNuestro laboratorio se encuentra en proceso de acreditación como laboratorio de calibración ante el Instituto Nacional de Calidad (INACAL), implementando un sistema de gestión basado en la Norma NTP ISO/IEC 17025, lo que garantiza la competencia técnica, trazabilidad metrológica y la confiabilidad de los resultados emitidos.\n\nContamos con personal técnico capacitado, procedimientos estandarizados y equipos de referencia que aseguran resultados de calibración precisos, confiables y trazables.',
    nosotrosMision:
      'Brindar servicios de calibración de analizadores de gases vehiculares con altos estándares técnicos, garantizando exactitud, confiabilidad y trazabilidad metrológica, contribuyendo al control de emisiones y al cumplimiento de los requisitos regulatorios, mediante la aplicación de la NTP ISO/IEC 17025 y la mejora continua de nuestro sistema de gestión.',
    nosotrosVision:
      'Ser un laboratorio de calibración reconocido a nivel nacional, acreditado y referente en la confiabilidad de las mediciones de gases vehiculares, destacando por nuestra competencia técnica, imparcialidad, innovación y compromiso con la calidad y el medio ambiente.',
    nosotrosValores: [
      {
        _key: 'nval-imparcialidad',
        _type: 'object',
        titulo: 'Imparcialidad',
        descripcion: 'Actuamos con objetividad, evitando conflictos de interés que puedan afectar la confiabilidad de nuestros resultados.',
        icono: 'scale',
      },
      {
        _key: 'nval-integridad',
        _type: 'object',
        titulo: 'Integridad',
        descripcion: 'Desarrollamos nuestras actividades con honestidad, transparencia y ética profesional.',
        icono: 'shield',
      },
      {
        _key: 'nval-calidad',
        _type: 'object',
        titulo: 'Calidad',
        descripcion: 'Trabajamos bajo estándares técnicos que garantizan la confiabilidad y exactitud de nuestros servicios.',
        icono: 'star',
      },
      {
        _key: 'nval-competencia',
        _type: 'object',
        titulo: 'Competencia Técnica',
        descripcion: 'Promovemos la capacitación continua de nuestro personal para asegurar servicios técnicamente competentes.',
        icono: 'graduation-cap',
      },
      {
        _key: 'nval-compromiso',
        _type: 'object',
        titulo: 'Compromiso con el Cliente',
        descripcion: 'Buscamos satisfacer las necesidades de nuestros clientes mediante un servicio eficiente y confiable.',
        icono: 'heart-handshake',
      },
      {
        _key: 'nval-mejora',
        _type: 'object',
        titulo: 'Mejora Continua',
        descripcion: 'Fortalecemos permanentemente nuestro sistema de gestión y nuestros procesos.',
        icono: 'trending-up',
      },
    ],

    // ── CONTACTO ──
    whatsappNumber: '51978444224',
    email: 'servicios@testingcs.com',
    address: 'Predio Los Arenales Sub Lote B-1C, Oficina 101, Pimentel – Chiclayo - Lambayeque',
    socialLinks: [
      { _key: 'social-linkedin', _type: 'object', platform: 'LinkedIn', url: 'https://linkedin.com' },
      { _key: 'social-facebook', _type: 'object', platform: 'Facebook', url: 'https://facebook.com' },
    ],

    // ── NAVEGACIÓN ──
    navLinks: [
      { _key: 'nav-inicio', _type: 'object', label: 'Inicio', href: '/' },
      { _key: 'nav-nosotros', _type: 'object', label: 'Nosotros', href: '/nosotros' },
      { _key: 'nav-servicios', _type: 'object', label: 'Servicios', href: '/equipos' },
      { _key: 'nav-blog', _type: 'object', label: 'Blog', href: '/blog' },
      { _key: 'nav-contacto', _type: 'object', label: 'Contacto', href: '/contacto' },
    ],
    footerText:
      '© 2026 Testing Calibrations S.A.C. | Laboratorio en Proceso de Acreditación ante INACAL. Todos los derechos reservados.',

    // ── SEO ──
    defaultSeoTitle: 'Testing Calibrations S.A.C. | Ingeniería y Metrología de Precisión',
    defaultSeoDescription:
      'Laboratorio especializado en calibración de analizadores de gases vehiculares bajo la norma NTP ISO/IEC 17025. Trazabilidad metrológica, confiabilidad y calidad técnica en Chiclayo, Perú.',
  }

  if (existing) {
    await client.patch(existing).set(siteSettingsData).commit()
    console.log(`   ✓ siteSettings actualizado (${existing})\n`)
  } else {
    const doc = await client.create({ ...siteSettingsData, _id: 'siteSettings' })
    console.log(`   ✓ siteSettings creado (${doc._id})\n`)
  }

  // 3. Create hero banner
  console.log('🖼️  Actualizando banner hero...')
  const existingBanners = await client.fetch('*[_type == "banner"]._id')
  for (const id of existingBanners) {
    await client.delete(id)
  }

  await client.create({
    _type: 'banner',
    titulo: 'Ingeniería que garantiza|Resultados Exactos',
    subtitulo:
      'Laboratorio especializado en calibración de analizadores de gases vehiculares bajo la norma NTP ISO/IEC 17025. Aseguramos la confiabilidad en mediciones con trazabilidad metrológica.',
    ctaTexto: 'Explorar Servicios',
    ctaUrl: '/equipos',
    orden: 1,
    activo: true,
    imagen: aboutImage,
  })
  console.log('   ✓ Banner hero creado\n')

  console.log('✅ Seed completado con datos reales de la empresa!')
  console.log('   Verifica en Sanity Studio: /studio')
}

main().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
