import { createClient } from '@sanity/client'
import { resend } from '@/lib/resend'
import { NextRequest, NextResponse } from 'next/server'

// Write client — server-only, NEVER export to shared modules
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

export async function POST(request: NextRequest) {
  if (!process.env.SANITY_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Servicio no disponible. Token de escritura no configurado.' },
      { status: 503 }
    )
  }

  const body = await request.json()
  const { nombreConsumidor, dniRuc, emailConsumidor, telefonoConsumidor, tipoReclamo, bienServicio, detalle, pedido } = body

  // Server-side validation of required fields
  if (!nombreConsumidor || !tipoReclamo || !detalle) {
    return NextResponse.json({ error: 'Campos requeridos: nombreConsumidor, tipoReclamo, detalle' }, { status: 400 })
  }

  try {
    const doc = await writeClient.create({
      _type: 'reclamo',
      fechaReclamo: new Date().toISOString(),
      nombreConsumidor,
      dniRuc: dniRuc ?? '',
      emailConsumidor: emailConsumidor ?? '',
      telefonoConsumidor: telefonoConsumidor ?? '',
      tipoReclamo,
      bienServicio: bienServicio ?? '',
      detalle,
      pedido: pedido ?? '',
      estado: 'pendiente',
    })

    // Send email notification (non-blocking — don't fail the response if email fails)
    await resend.emails.send({
      from: 'onboarding@resend.dev', // TODO: Replace with verified domain
      to: ['contacto@testingcalibrations.com.pe'], // TODO: Replace with real email
      subject: `Nuevo reclamo de ${nombreConsumidor}`,
      html: `<p>Reclamo registrado en Sanity con ID: ${doc._id}</p>
             <p><strong>Tipo:</strong> ${tipoReclamo}</p>
             <p><strong>Consumidor:</strong> ${nombreConsumidor}</p>
             <p><strong>Detalle:</strong> ${detalle}</p>`,
    }).catch(err => console.error('Reclamo email notification failed:', err))

    return NextResponse.json({ success: true, reclamoId: doc._id })
  } catch (err) {
    console.error('Reclamo API error:', err)
    return NextResponse.json({ error: 'Error al registrar el reclamo' }, { status: 500 })
  }
}
