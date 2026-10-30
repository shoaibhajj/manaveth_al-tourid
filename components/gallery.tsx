'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Expand, X } from 'lucide-react'
import { Reveal } from './reveal'

type Category = 'products' | 'warehouses' | 'packing' | 'transport'

const filters: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'products', label: 'المنتجات' },
  { id: 'warehouses', label: 'المستودعات' },
  { id: 'packing', label: 'التعبئة والتغليف' },
  { id: 'transport', label: 'النقل والتوصيل' },
]

const items: { src: string; alt: string; category: Category }[] = [
  { src: '/images/g-produce.png', alt: 'صناديق خضار وفواكه طازجة', category: 'products' },
  { src: '/images/g-warehouse.png', alt: 'رافعة شوكية داخل المستودع', category: 'warehouses' },
  { src: '/images/g-boxes.png', alt: 'كراتين مرتبة على منصات', category: 'warehouses' },
  { src: '/images/g-truck.png', alt: 'شاحنة منافذ التوريد في ساحة الحاويات', category: 'transport' },
  { src: '/images/g-juice.png', alt: 'عبوات عصير وزيت مغلفة', category: 'products' },
  { src: '/images/g-packing.png', alt: 'فريق العمل يغلف الطرود', category: 'packing' },
  { src: '/images/service-land.png', alt: 'شاحنة على الطريق', category: 'transport' },
  { src: '/images/about.png', alt: 'مراجعة المخزون بالمستودع', category: 'packing' },
]

export function Gallery() {
  const [filter, setFilter] = useState<'all' | Category>('all')
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  const visible = filter === 'all' ? items : items.filter((item) => item.category === filter)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLightbox(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <section id="gallery" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="mb-2 text-lg font-bold text-gold">معرض الأعمال</p>
            <h2 className="text-balance text-3xl font-extrabold text-forest md:text-4xl">
              {'من المصدر إلى وجهتك ... في كل خطوة'}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">شاهد جانبًا من عملياتنا ومنتجاتنا المفيدة</p>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href="#gallery"
              className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-bold text-forest transition-colors hover:border-gold"
            >
              مشاهدة جميع الصور
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        <div role="tablist" aria-label="تصنيفات المعرض" className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              type="button"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`relative rounded-lg px-5 py-2 text-sm font-bold transition-colors ${
                filter === f.id ? 'text-cream' : 'bg-card text-forest ring-1 ring-border hover:ring-gold'
              }`}
            >
              {filter === f.id && (
                <motion.span layoutId="gallery-pill" className="absolute inset-0 rounded-lg bg-forest" />
              )}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4">
          <Reveal className="relative col-span-2 row-span-2 overflow-hidden rounded-2xl">
            <button
              type="button"
              onClick={() => setLightbox({ src: '/images/hero.png', alt: 'رحلة المنتج من بلد المورد حتى وصوله إلى وجهتك' })}
              className="group relative size-full"
            >
              <Image
                src="/images/hero.png"
                alt="رحلة المنتج من بلد المورد حتى وصوله إلى وجهتك"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/10 to-transparent" aria-hidden="true" />
              <span className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3 text-start">
                <span>
                  <span className="mb-1 inline-block rounded-full bg-gold px-3 py-0.5 text-xs font-bold text-forest-deep">
                    رحلة المنتج
                  </span>
                  <span className="block text-lg font-bold text-cream">من بلد المورد حتى وصوله إلى وجهتك</span>
                </span>
                <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-cream text-cream">
                  <span className="absolute inset-0 animate-ping rounded-full border border-gold" aria-hidden="true" />
                  <Expand className="size-5" aria-hidden="true" />
                </span>
              </span>
            </button>
          </Reveal>

          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <motion.button
                layout
                key={item.src}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setLightbox(item)}
                className="group relative overflow-hidden rounded-xl"
                aria-label={`عرض الصورة: ${item.alt}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-forest-deep/80 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-sm font-bold text-cream">{item.alt}</span>
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-deep/95 p-4 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute top-5 left-5 flex size-11 items-center justify-center rounded-full border border-cream/30 text-cream hover:border-gold hover:text-gold"
              aria-label="إغلاق"
            >
              <X className="size-5" />
            </button>
            <motion.figure
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                <Image src={lightbox.src} alt={lightbox.alt} fill sizes="90vw" className="object-contain" />
              </div>
              <figcaption className="mt-4 text-center text-lg font-bold text-cream">{lightbox.alt}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
