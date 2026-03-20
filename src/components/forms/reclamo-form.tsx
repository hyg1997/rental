'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ReclamoForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [tipoReclamo, setTipoReclamo] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const formData = Object.fromEntries(new FormData(e.currentTarget))
    const body = { ...formData, tipoReclamo }

    try {
      const res = await fetch('/api/reclamo', {
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
        Reclamo registrado. Recibiras una respuesta en un plazo maximo de 30 dias habiles segun la Ley 29571.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="nombreConsumidor" className="text-sm text-tc-text">
          Nombre completo del consumidor
        </Label>
        <Input
          id="nombreConsumidor"
          name="nombreConsumidor"
          required
          className="bg-tc-surface border-tc-text/20"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="dniRuc" className="text-sm text-tc-text">
          DNI / RUC
        </Label>
        <Input
          id="dniRuc"
          name="dniRuc"
          className="bg-tc-surface border-tc-text/20"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="emailConsumidor" className="text-sm text-tc-text">
          Correo electronico
        </Label>
        <Input
          id="emailConsumidor"
          name="emailConsumidor"
          type="email"
          className="bg-tc-surface border-tc-text/20"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="telefonoConsumidor" className="text-sm text-tc-text">
          Telefono
        </Label>
        <Input
          id="telefonoConsumidor"
          name="telefonoConsumidor"
          type="tel"
          className="bg-tc-surface border-tc-text/20"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-sm text-tc-text">Tipo</Label>
        <Select value={tipoReclamo} onValueChange={(val) => setTipoReclamo(val ?? '')} required>
          <SelectTrigger className="bg-tc-surface border-tc-text/20">
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reclamo">
              Reclamo (disconformidad con contraprestacion)
            </SelectItem>
            <SelectItem value="queja">
              Queja (disconformidad sin contraprestacion)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="bienServicio" className="text-sm text-tc-text">
          Bien o servicio reclamado
        </Label>
        <Textarea
          id="bienServicio"
          name="bienServicio"
          rows={2}
          className="bg-tc-surface border-tc-text/20"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="detalle" className="text-sm text-tc-text">
          Detalle del reclamo o queja
        </Label>
        <Textarea
          id="detalle"
          name="detalle"
          rows={4}
          required
          className="bg-tc-surface border-tc-text/20"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="pedido" className="text-sm text-tc-text">
          Pedido del consumidor
        </Label>
        <Textarea
          id="pedido"
          name="pedido"
          rows={2}
          className="bg-tc-surface border-tc-text/20"
        />
      </div>

      {status === 'error' && (
        <p className="text-destructive text-sm">
          No se pudo registrar el reclamo. Intentalo de nuevo.
        </p>
      )}

      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Registrando reclamo...' : 'Registrar reclamo'}
      </Button>
    </form>
  )
}
