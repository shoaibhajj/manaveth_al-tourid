'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Expand, Play, X } from 'lucide-react'
import type { GalleryItem } from '@/lib/content/gallery'
import { useContent, useLocale } from './locale-provider'
import { Reveal } from './reveal'

type LightboxMedia = Pick<GalleryItem, 'type' | 'src' | 'videoSrc' | 'alt'>

export function Gallery() {
  const { t } = useLocale()
  const { site, galleryItems: items, galleryCategories, galleryFeatured, showCategoryFilter } = useContent()
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState<LightboxMedia | null>(null)
  const visible = filter === 'all' ? items : items.filter((item) => item.category === filter)
  const { gallerySection, ui } = site
  const filters = showCategoryFilter ? [{ id: 'all', label: gallerySection.all }, ...galleryCategories] : []

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLightbox(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <section id="gallery" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <p className="mb-2 text-lg font-bold text-gold">{t(gallerySection.eyebrow)}</p>
          <h2 className="text-balance text-3xl font-extrabold text-forest md:text-4xl">{t(gallerySection.title)}</h2>
          <p className="mt-3 text-lg text-muted-foreground">{t(gallerySection.subtitle)}</p>
        </Reveal>

        {filters.length > 0 && (
        <div role="tablist" aria-label={t(gallerySection.tabsLabel)} className="mt-8 flex flex-wrap gap-2">
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
              <span className="relative">{t(f.label)}</span>
            </button>
          ))}
        </div>
        )}

        <div className="mt-8 grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4">
          <Reveal className="relative col-span-2 row-span-2 overflow-hidden rounded-2xl">
            <button
              type="button"
              onClick={() => setLightbox({ type: 'image', src: galleryFeatured.src, alt: galleryFeatured.alt })}
              className="group relative size-full"
              aria-label={`${t(ui.viewImage)}: ${t(galleryFeatured.alt)}`}
            >
              <Image
                src={galleryFeatured.src}
                alt={t(galleryFeatured.alt)}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/10 to-transparent" aria-hidden="true" />
              <span className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3 text-start">
                <span>
                  <span className="mb-1 inline-block rounded-full bg-gold px-3 py-0.5 text-xs font-bold text-forest-deep">
                    {t(galleryFeatured.badge)}
                  </span>
                  <span className="block text-lg font-bold text-cream">{t(galleryFeatured.caption)}</span>
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
                key={item.id}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setLightbox(item)}
                className="group relative overflow-hidden rounded-xl"
                aria-label={`${t(item.type === 'video' ? ui.playVideo : ui.viewImage)}: ${t(item.alt)}`}
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {item.type === 'video' && (
                  <>
                    <span className="absolute inset-0 bg-forest-deep/35" aria-hidden="true" />
                    <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                      <span className="flex size-14 items-center justify-center rounded-full bg-gold text-forest-deep shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Play className="size-6 fill-current rtl:-scale-x-100" />
                      </span>
                    </span>
                    <span className="absolute top-2 start-2 rounded-full bg-forest-deep/80 px-2.5 py-0.5 text-xs font-bold text-gold">
                      {t(ui.video)}
                    </span>
                  </>
                )}
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-forest-deep/80 to-transparent p-3 text-start opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-sm font-bold text-cream">{t(item.alt)}</span>
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
            aria-label={t(lightbox.alt)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-deep/95 p-4 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute top-5 end-5 flex size-11 items-center justify-center rounded-full border border-cream/30 text-cream hover:border-gold hover:text-gold"
              aria-label={t(ui.close)}
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
                {lightbox.type === 'video' && lightbox.videoSrc ? (
                  <video
                    src={lightbox.videoSrc}
                    poster={lightbox.src}
                    controls
                    autoPlay
                    playsInline
                    className="size-full bg-forest-deep object-contain"
                  />
                ) : (
                  <Image src={lightbox.src} alt={t(lightbox.alt)} fill sizes="90vw" className="object-contain" />
                )}
              </div>
              <figcaption className="mt-4 text-center text-lg font-bold text-cream">{t(lightbox.alt)}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
