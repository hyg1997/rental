import { CheckCircle, Shield, Users } from 'lucide-react'

export default function NosotrosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-brand-text mb-8">
        Sobre Testing Calibrations S.A.C.
      </h1>

      <div className="space-y-6">
        <p className="leading-relaxed text-brand-text/80">
          Testing Calibrations S.A.C. es una empresa especializada en calibracion, verificacion y
          reparacion de equipos de medicion. Con mas de 10 anos de experiencia, brindamos servicios
          de alta calidad a empresas de diversos sectores industriales.
        </p>

        <p className="leading-relaxed text-brand-text/80">
          Nuestra mision es garantizar la precision y confiabilidad de los equipos de medicion de
          nuestros clientes, contribuyendo a la calidad de sus procesos y productos.
        </p>

        <p className="leading-relaxed text-brand-text/80">
          Ser la empresa lider en servicios de calibracion y metrologia en el Peru, reconocida por
          la excelencia de nuestro equipo tecnico y la satisfaccion de nuestros clientes.
        </p>
      </div>

      <h2 className="text-xl font-bold text-brand-text mt-12 mb-6">Nuestros Valores</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-surface p-6 rounded-lg">
          <CheckCircle className="text-brand-red mb-4" size={32} />
          <h3 className="text-lg font-bold text-brand-text">Precision</h3>
          <p className="text-sm text-brand-text/60 mt-2">
            Nos comprometemos con la maxima exactitud en cada medicion, garantizando resultados
            confiables para nuestros clientes.
          </p>
        </div>

        <div className="bg-brand-surface p-6 rounded-lg">
          <Shield className="text-brand-red mb-4" size={32} />
          <h3 className="text-lg font-bold text-brand-text">Integridad</h3>
          <p className="text-sm text-brand-text/60 mt-2">
            Actuamos con transparencia y honestidad en cada interaccion, construyendo relaciones de
            confianza con nuestros clientes y socios.
          </p>
        </div>

        <div className="bg-brand-surface p-6 rounded-lg">
          <Users className="text-brand-red mb-4" size={32} />
          <h3 className="text-lg font-bold text-brand-text">Compromiso</h3>
          <p className="text-sm text-brand-text/60 mt-2">
            Dedicamos nuestro esfuerzo a superar las expectativas de nuestros clientes, ofreciendo
            un servicio excepcional en cada proyecto.
          </p>
        </div>
      </div>
    </div>
  )
}
