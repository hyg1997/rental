import Image from 'next/image'
import { urlFor } from '@/lib/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { Crosshair, Eye } from 'lucide-react'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200'

interface AboutSectionProps {
  historia: string
  mision: string
  vision: string
  aboutImage?: unknown
  experienceYears?: number
}

export function AboutSection({
  historia,
  mision,
  vision,
  aboutImage,
  experienceYears,
}: AboutSectionProps) {
  const years = experienceYears ?? 15
  const imageSrc = aboutImage
    ? urlFor(aboutImage as SanityImageSource).width(1200).height(800).quality(80).auto('format').url()
    : FALLBACK_IMAGE

  return (
    <section className="py-24 lg:py-32 px-[8%] bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
        {/* Image column */}
        <div className="relative">
          <Image
            src={imageSrc}
            alt="Laboratorio Técnico"
            width={1200}
            height={800}
            className="w-full rounded-[40px] shadow-premium object-cover"
          />
          <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-tc-accent p-8 lg:p-10 rounded-[30px] text-white text-center shadow-lg">
            <h4 className="text-4xl lg:text-5xl font-extrabold leading-none">
              +{years}
            </h4>
            <p className="text-sm mt-1">
              Años de
              <br />
              Experiencia
            </p>
          </div>
        </div>

        {/* Text column */}
        <div>
          <span className="text-tc-accent font-extrabold tracking-[2px] text-sm uppercase">
            SOBRE NOSOTROS
          </span>
          <h2 className="font-[Outfit,sans-serif] text-3xl lg:text-4xl font-extrabold text-tc-primary mt-4 mb-6">
            Líderes en Calibración de Analizadores de Gases
          </h2>
          <p className="text-tc-text leading-relaxed mb-8">{historia}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="text-tc-primary font-bold mb-2 flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-tc-accent" />
                Misión
              </h4>
              <p className="text-sm text-tc-text/80">{mision}</p>
            </div>
            <div>
              <h4 className="text-tc-primary font-bold mb-2 flex items-center gap-2">
                <Eye className="w-5 h-5 text-tc-accent" />
                Visión
              </h4>
              <p className="text-sm text-tc-text/80">{vision}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
