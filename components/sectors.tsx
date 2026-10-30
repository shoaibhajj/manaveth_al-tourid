'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DirArrow } from './dir-arrow'
import { useContent, useLocale } from './locale-provider'
import { SectionHeading } from './reveal'

export function Sectors() {
  const { t, dir, localize } = useLocale()
  const { site, sectors } = useContent()
  const track = useRef<HTMLUListElement>(null)
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight
  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft

  const scroll = (step: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    const sign = dir === 'rtl' ? -1 : 1
    el.scrollBy({ left: step * sign * ((card?.clientWidth ?? 280) + 16), behavior: 'smooth' })
  }

  return (
    <section id="sectors" className="bg-secondary/60 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow={t(site.sectorsSection.eyebrow)}
          title={t(site.sectorsSection.title)}
          subtitle={t(site.sectorsSection.subtitle)}
        />

        <div className="relative mt-10">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="absolute top-1/2 -start-2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest text-gold shadow-lg transition-transform hover:scale-110 md:flex"
            aria-label={t(site.ui.previous)}
          >
            <PrevIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="absolute top-1/2 -end-2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest text-gold shadow-lg transition-transform hover:scale-110 md:flex"
            aria-label={t(site.ui.next)}
          >
            <NextIcon className="size-5" />
          </button>

          <ul
            ref={track}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden"
          >
            {sectors.map((sector) => (
              <li
                key={sector.id}
                className="group flex w-[70%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:ring-gold sm:w-[45%] lg:w-[calc(20%-13px)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={sector.image}
                    alt={t(sector.alt)}
                    fill
                    sizes="(min-width: 1024px) 20vw, 70vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="font-bold text-forest">{t(sector.title)}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{t(sector.text)}</p>
                  <Link
                    href={localize(sector.href)}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-forest transition-colors hover:text-gold"
                  >
                    {t(sector.ctaLabel)}
                    <DirArrow className="size-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
