import { resend } from '@/lib/resend'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { nombre, email, telefono, mensaje } = body

  if (!nombre || !email || !mensaje) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
      to: ['contacto@testingcalibrations.com.pe'], // TODO: Replace with real email
      subject: `Nueva consulta de ${nombre}`,
      html: `<p><strong>Nombre:</strong> ${nombre}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Telefono:</strong> ${telefono ?? '—'}</p>
             <p><strong>Mensaje:</strong> ${mensaje}</p>`,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
