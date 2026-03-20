import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import Image from 'next/image'
import { urlFor } from '@/lib/image-url'
import type { SanityImageSource } from '@sanity/image-url'

const components = {
  types: {
    image: ({ value }: { value: SanityImageSource }) => (
      <div className="my-8">
        <Image
          src={urlFor(value).width(800).quality(80).auto('format').url()}
          alt=""
          width={800}
          height={450}
          className="rounded-lg object-cover w-full"
        />
      </div>
    ),
  },
}

export function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="prose max-w-none text-tc-text leading-relaxed">
      <PortableText value={value} components={components} />
    </div>
  )
}
