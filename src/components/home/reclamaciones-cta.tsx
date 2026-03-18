import Link from 'next/link'

export function ReclamacionesCta() {
  return (
    <section className="py-12 px-4 bg-brand-bg">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-brand-text/70 mb-4">
          De acuerdo con la normativa vigente, ponemos a tu disposicion nuestro Libro de Reclamaciones virtual.
        </p>
        <Link
          href="/libro-de-reclamaciones"
          className="bg-brand-red text-white font-semibold px-6 py-3 rounded-md inline-block hover:bg-brand-red/90 transition-colors"
        >
          Libro de Reclamaciones
        </Link>
      </div>
    </section>
  )
}
