'use client'

import Image from 'next/image'
import { site } from '@/lib/content/site'
import type { Localized } from '@/lib/i18n'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: Localized; title: Localized; subtitle: Localized }) {
  const { t } = useLocale()
  return (
    <section className="relative isolate overflow-hidden bg-forest-deep pt-32 pb-14 md:pt-40 md:pb-20">
      <Image src={site.brand.ctaImage} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-25" />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-deep/60 to-forest-deep"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-gold md:text-base">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            {t(eyebrow)}
          </p>
          <h1 className="text-balance text-3xl font-extrabold leading-tight text-cream md:text-5xl">{t(title)}</h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-cream/75">{t(subtitle)}</p>
        </Reveal>
      </div>
    </section>
  )
}
