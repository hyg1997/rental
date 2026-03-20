'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const body = Object.fromEntries(new FormData(e.currentTarget))

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-green-500">
        Mensaje enviado. Nos pondremos en contacto a la brevedad.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="nombre" className="text-sm text-tc-text">
          Nombre completo
        </Label>
        <Input
          id="nombre"
          name="nombre"
          required
          className="bg-tc-surface border-tc-text/20"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email" className="text-sm text-tc-text">
          Correo electronico
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="bg-tc-surface border-tc-text/20"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="telefono" className="text-sm text-tc-text">
          Telefono
        </Label>
        <Input
          id="telefono"
          name="telefono"
          type="tel"
          className="bg-tc-surface border-tc-text/20"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="mensaje" className="text-sm text-tc-text">
          Mensaje
        </Label>
        <Textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          required
          className="bg-tc-surface border-tc-text/20"
        />
      </div>

      {status === 'error' && (
        <p className="text-destructive text-sm">
          No se pudo enviar el mensaje. Intentalo de nuevo o escribenos por WhatsApp.
        </p>
      )}

      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
      </Button>
    </form>
  )
}
