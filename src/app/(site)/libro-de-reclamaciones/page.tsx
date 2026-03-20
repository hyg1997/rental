import { ReclamoForm } from '@/components/forms/reclamo-form'

export default function LibroReclamacionesPage() {
  return (
    <div className="pt-28">
      <section className="gradient-blue py-16 px-[8%] text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-[Outfit,sans-serif] text-4xl lg:text-5xl font-extrabold">
            Libro de Reclamaciones
          </h1>
        </div>
      </section>

      <section className="py-16 px-[8%] bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="bg-tc-surface border border-tc-border rounded-[20px] p-6 mb-10">
            <p className="text-sm text-tc-text-light">
              De conformidad con el Código de Protección y Defensa del Consumidor
              (Ley N° 29571), ponemos a disposición el presente Libro de
              Reclamaciones.
            </p>
          </div>

          <ReclamoForm />
        </div>
      </section>
    </div>
  )
}
