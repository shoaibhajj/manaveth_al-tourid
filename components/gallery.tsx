'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Expand, Play, X } from 'lucide-react'
import type { GalleryItem } from '@/lib/content/gallery'
import { useContent, useLocale } from './locale-provider'
import { Reveal } from './reveal'

type LightboxMedia = Pick<GalleryItem, 'type' | 'src' | 'videoSrc' | 'alt'>

const PAGE_SIZE = 8

export function Gallery({
  items: itemsProp,
  categories: categoriesProp,
  featured: featuredProp,
  showCategoryFilter: filterProp,
  gallerySection: sectionProp,
  ui: uiProp,
}: {
  items?: GalleryItem[]
  categories?: any[]
  featured?: any
  showCategoryFilter?: boolean
  gallerySection?: any
  ui?: any
} = {}) {
  const { t, locale } = useLocale()
  const {
    site,
    galleryItems: contextItems,
    galleryCategories: contextCats,
    galleryFeatured: contextFeatured,
    showCategoryFilter: contextFilter,
  } = useContent()
  const items = itemsProp ?? contextItems ?? []
  const galleryCategories = categoriesProp ?? contextCats ?? []
  const galleryFeatured = featuredProp ?? contextFeatured
  const showCategoryFilter = filterProp ?? contextFilter ?? true
  const gallerySection = sectionProp ?? site?.gallerySection
  const ui = uiProp ?? site?.ui
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [lightbox, setLightbox] = useState<LightboxMedia | null>(null)

  const visible = filter === 'all' ? items : items.filter((item) => item.category === filter)
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))

  // Ensure current page is valid when filter changes or items change
  const currentPage = Math.min(page, totalPages - 1)
  const canPrev = currentPage > 0
  const canNext = currentPage < totalPages - 1

  const pagedItems = visible.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
  const filters = showCategoryFilter ? [{ id: 'all', label: gallerySection.all }, ...galleryCategories] : []

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    setPage(0)
  }

  const handlePrev = () => {
    if (canPrev) setPage((p) => Math.max(0, p - 1))
  }

  const handleNext = () => {
    if (canNext) setPage((p) => Math.min(totalPages - 1, p + 1))
  }

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
            <p className="mb-2 text-lg font-bold text-gold">{t(gallerySection.eyebrow)}</p>
            <h2 className="text-balance text-3xl font-extrabold text-forest md:text-4xl">{t(gallerySection.title)}</h2>
            <p className="mt-3 text-lg text-muted-foreground">{t(gallerySection.subtitle)}</p>
          </Reveal>

          {/* Navigation Arrows & Pagination Info */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="text-xs font-semibold text-muted-foreground">
              {t({ ar: `صفحة ${currentPage + 1} من ${totalPages}`, en: `Page ${currentPage + 1} of ${totalPages}` })}
            </span>
            <div className="flex items-center gap-1.5">
              {/* Prev Button: In RTL, points right; in LTR, points left */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canPrev}
                aria-label={t({ ar: 'الصفحة السابقة', en: 'Previous Page' })}
                className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-forest shadow-sm transition-all hover:border-gold hover:bg-gold/10 hover:text-gold active:scale-95 disabled:pointer-events-none disabled:opacity-30 disabled:shadow-none"
              >
                {locale === 'ar' ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
              </button>

              {/* Next Button: In RTL, points left; in LTR, points right */}
              <button
                type="button"
                onClick={handleNext}
                disabled={!canNext}
                aria-label={t({ ar: 'الصفحة التالية', en: 'Next Page' })}
                className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-forest shadow-sm transition-all hover:border-gold hover:bg-gold/10 hover:text-gold active:scale-95 disabled:pointer-events-none disabled:opacity-30 disabled:shadow-none"
              >
                {locale === 'ar' ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
              </button>
            </div>
          </div>
        </div>

        {filters.length > 0 && (
          <div role="tablist" aria-label={t(gallerySection.tabsLabel)} className="mt-8 flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                role="tab"
                type="button"
                aria-selected={filter === f.id}
                onClick={() => handleFilterChange(f.id)}
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
          {/* Featured item shown on first page */}
          {currentPage === 0 && (
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
          )}

          <AnimatePresence mode="popLayout">
            {pagedItems.map((item) => (
              <motion.button
                layout
                key={item.id}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                onClick={() => setLightbox(item)}
                className="group relative overflow-hidden rounded-xl bg-forest-deep/10 ring-1 ring-border"
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

        {/* Bottom Pagination Bar when totalPages > 1 */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canPrev}
              aria-label={t({ ar: 'الصفحة السابقة', en: 'Previous Page' })}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-bold text-forest transition hover:border-gold hover:text-gold disabled:pointer-events-none disabled:opacity-30"
            >
              {locale === 'ar' ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
              <span>{t({ ar: 'السابق', en: 'Prev' })}</span>
            </button>

            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPage(idx)}
                  aria-label={t({ ar: `الانتقال إلى صفحة ${idx + 1}`, en: `Go to page ${idx + 1}` })}
                  className={`size-2.5 rounded-full transition-all ${
                    idx === currentPage ? 'w-6 bg-gold' : 'bg-forest/20 hover:bg-forest/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canNext}
              aria-label={t({ ar: 'الصفحة التالية', en: 'Next Page' })}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-bold text-forest transition hover:border-gold hover:text-gold disabled:pointer-events-none disabled:opacity-30"
            >
              <span>{t({ ar: 'التالي', en: 'Next' })}</span>
              {locale === 'ar' ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            </button>
          </div>
        )}
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
