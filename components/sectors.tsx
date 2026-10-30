'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionHeading } from './reveal'

const sectors = [
  { title: 'الجهات الحكومية', image: '/images/s-government.png' },
  { title: 'المصانع الغذائية', image: '/images/s-factory.png' },
  { title: 'المطاعم والمقاهي', image: '/images/s-restaurant.png' },
  { title: 'الفنادق والضيافة', image: '/images/s-hotel.png' },
  { title: 'قطاع التجزئة', image: '/images/s-retail.png' },
  { title: 'المطابخ المركزية', image: '/images/service-hotels.png' },
]

export function Sectors() {
  const track = useRef<HTMLUListElement>(null)

  const scroll = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 280) + 16), behavior: 'smooth' })
  }

  return (
    <section id="sectors" className="bg-secondary/60 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading eyebrow="قطاعاتنا" title="القطاعات التي نخدمها" subtitle="نلبي احتياجات مجموعة واسعة من القطاعات" />

        <div className="relative mt-10">
          <button
            type="button"
            onClick={() => scroll(1)}
            className="absolute top-1/2 -right-2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest text-gold shadow-lg transition-transform hover:scale-110 md:flex"
            aria-label="السابق"
          >
            <ChevronRight className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="absolute top-1/2 -left-2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest text-gold shadow-lg transition-transform hover:scale-110 md:flex"
            aria-label="التالي"
          >
            <ChevronLeft className="size-5" />
          </button>

          <ul
            ref={track}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden"
          >
            {sectors.map((sector) => (
              <li
                key={sector.title}
                className="group w-[70%] shrink-0 snap-start overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:ring-gold sm:w-[45%] lg:w-[calc(20%-13px)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={sector.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20vw, 70vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="relative py-4 text-center font-bold text-forest">
                  {sector.title}
                  <span className="absolute inset-x-1/2 bottom-2 h-0.5 bg-gold transition-all duration-500 group-hover:inset-x-10" aria-hidden="true" />
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
