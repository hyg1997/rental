import Link from 'next/link'

export function ReclamacionesCta() {
  return (
    <section className="py-16 px-[8%] bg-tc-surface">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-tc-text-light mb-6 text-lg">
          De acuerdo con la normativa vigente, ponemos a tu disposición nuestro Libro de
          Reclamaciones virtual.
        </p>
        <Link
          href="/libro-de-reclamaciones"
          className="bg-tc-accent text-white font-extrabold px-8 py-4 rounded-full inline-block hover:bg-tc-accent-dark hover:scale-105 transition-all shadow-[0_10px_20px_rgba(230,126,34,0.2)]"
        >
          Libro de Reclamaciones
        </Link>
      </div>
    </section>
  )
}
