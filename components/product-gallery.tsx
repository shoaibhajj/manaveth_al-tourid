'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Eye, ImageIcon } from 'lucide-react'

export type GalleryImage = {
  url: string
  alt?: string
}

type Props = {
  images: GalleryImage[]
  title: string
  locale?: 'ar' | 'en'
}

export function ProductGallery({ images, title, locale = 'ar' }: Props) {
  const isAr = locale === 'ar'
  const validImages = images.filter((img) => Boolean(img?.url))
  const [activeIndex, setActiveIndex] = useState(0)

  if (validImages.length === 0) {
    return (
      <div className="aspect-[4/3] w-full rounded-3xl bg-forest/5 border border-dashed border-forest/20 flex flex-col items-center justify-center text-forest/50 p-6 text-center">
        <ImageIcon className="size-12 mb-2 text-forest/30" />
        <span className="text-sm font-semibold">
          {isAr ? 'صورة المنتج قيد الاعتماد' : 'Product image pending verification'}
        </span>
      </div>
    )
  }

  const activeImage = validImages[activeIndex] || validImages[0]

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % validImages.length)
  }

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Showcase */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-forest/5 shadow-md border border-forest/10 group">
        <Image
          src={activeImage.url}
          alt={activeImage.alt || `${title} - ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Counter Badge */}
        {validImages.length > 1 && (
          <div className="absolute top-4 start-4 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
            <Eye className="size-3.5 text-gold" />
            <span>
              {activeIndex + 1} / {validImages.length}
            </span>
          </div>
        )}

        {/* Navigation Arrows for Multiple Images */}
        {validImages.length > 1 && (
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={prevImage}
              aria-label={isAr ? 'الصورة السابقة' : 'Previous image'}
              className="pointer-events-auto size-10 rounded-full bg-white/90 hover:bg-white text-forest-deep shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            >
              {isAr ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label={isAr ? 'الصورة التالية' : 'Next image'}
              className="pointer-events-auto size-10 rounded-full bg-white/90 hover:bg-white text-forest-deep shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            >
              {isAr ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails Row (if > 1 image) */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {validImages.map((img, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={img.url + idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`${title} ${idx + 1}`}
                className={`relative aspect-[4/3] w-20 sm:w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                  isActive
                    ? 'border-gold shadow-md ring-2 ring-gold/40 scale-105'
                    : 'border-forest/15 opacity-70 hover:opacity-100 hover:border-forest/40'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
