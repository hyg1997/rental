import { ReclamoForm } from '@/components/forms/reclamo-form'

export default function LibroReclamacionesPage() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-brand-text mb-4">
        Libro de Reclamaciones
      </h1>

      <div className="bg-brand-surface border border-brand-text/20 rounded-lg p-4 mb-8">
        <p className="text-sm text-brand-text/70">
          De conformidad con el Codigo de Proteccion y Defensa del Consumidor
          (Ley N 29571), ponemos a disposicion el presente Libro de
          Reclamaciones.
        </p>
      </div>

      <ReclamoForm />
    </section>
  )
}
