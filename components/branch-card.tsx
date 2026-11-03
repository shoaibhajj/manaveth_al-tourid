'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ExternalLink, Mail, MapPin, Maximize2, Phone, Star, UserRound, X, type LucideIcon } from 'lucide-react'
import { getMapEmbedUrl, getMapLinkUrl, type Place } from '@/lib/content/branches'
import { telUrl } from '@/lib/content/contact'
import { useContent, useLocale } from './locale-provider'

type InfoRowProps = {
  icon: LucideIcon
  label: string
  value?: string
  href?: string
  ltr?: boolean
}

function InfoRow({ icon: Icon, label, value, href, ltr }: InfoRowProps) {
  if (!value) return null

  return (
    <li className="flex items-start gap-3 text-sm">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-forest/5 text-forest">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {href ? (
          <a href={href} className="break-words font-medium text-forest transition-colors hover:text-gold">
            <span dir={ltr ? 'ltr' : undefined} className={ltr ? 'inline-block text-start' : undefined}>
              {value}
            </span>
          </a>
        ) : (
          <p className="break-words font-medium text-forest">
            <span dir={ltr ? 'ltr' : undefined} className={ltr ? 'inline-block text-start' : undefined}>
              {value}
            </span>
          </p>
        )}
      </div>
    </li>
  )
}

export function BranchCard({ place }: { place: Place }) {
  const { t } = useLocale()
  const { site, contact, showMaps } = useContent()
  const [showLightbox, setShowLightbox] = useState(false)

  useEffect(() => {
    if (!showLightbox) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowLightbox(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showLightbox])

  const isContain = place.imageFit === 'contain'
  const isVideo = place.mediaType === 'video' && Boolean(place.videoUrl)
  const aspectClass =
    place.aspectRatio === '1/1'
      ? 'aspect-square'
      : place.aspectRatio === '4/3'
        ? 'aspect-[4/3]'
        : place.aspectRatio === '16/9'
          ? 'aspect-video'
          : place.aspectRatio === '16/10'
            ? 'aspect-[16/10]'
            : 'aspect-square'
  const positionStyle = place.hotspot
    ? `${Math.round(place.hotspot.x * 100)}% ${Math.round(place.hotspot.y * 100)}%`
    : place.imagePosition === 'center'
      ? 'center center'
      : place.imagePosition === 'bottom'
        ? 'center bottom'
        : 'center top'

  // Complete, robust contact information without any empty placeholders
  const branchPhone = place.phone || contact.phone || '+966509971699'
  const branchEmail = place.email || contact.email || 'info@mnafeth.com'
  
  // Resolve manager or operations management contact
  const isPlaceholderManager =
    !place.manager?.name ||
    t(place.manager.name) === 'اسم المسؤول' ||
    t(place.manager.name) === 'Manager name'
    
  const managerName = isPlaceholderManager
    ? (place.kind === 'warehouse' ? t({ ar: 'إدارة العمليات والتوريد المركزية', en: 'Central Operations & Logistics' }) : undefined)
    : t(place.manager!.name)
    
  const managerPhone = place.manager?.phone || (isPlaceholderManager ? branchPhone : undefined)
  const mapLink = place.mapUrl || getMapLinkUrl(place.mapQuery)

  return (
    <>
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[border-color,box-shadow] duration-500 hover:border-gold hover:shadow-xl hover:shadow-gold/10">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setShowLightbox(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setShowLightbox(true)
            }
          }}
          className={`group/img relative ${aspectClass} w-full cursor-pointer overflow-hidden bg-forest-deep/10`}
          aria-label={t({ ar: 'عرض وسائط ' + t(place.name), en: 'View media of ' + t(place.name) })}
        >
          {isVideo ? (
            <div className="relative size-full">
              <video
                src={place.videoUrl}
                poster={place.videoPoster || place.image}
                playsInline
                muted
                loop
                autoPlay
                preload="metadata"
                className={`size-full ${isContain ? 'object-contain' : 'object-cover'}`}
              />
            </div>
          ) : (
            <>
              {isContain && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30 blur-md scale-110"
                  style={{ backgroundImage: `url(${place.image})` }}
                  aria-hidden="true"
                />
              )}

              <Image
                src={place.image}
                alt={t(place.imageAlt)}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className={`transition-transform duration-700 group-hover/img:scale-105 ${
                  isContain ? 'object-contain' : 'object-cover'
                }`}
                style={{ objectPosition: positionStyle }}
              />

              <div
                className="absolute inset-0 bg-gradient-to-t from-forest-deep/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/img:opacity-100"
                aria-hidden="true"
              />
            </>
          )}

          <span className="absolute end-3 bottom-3 flex size-8 items-center justify-center rounded-md bg-forest-deep/85 text-cream/90 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-gold hover:text-forest-deep group-hover/img:opacity-100">
            <Maximize2 className="size-4" aria-hidden="true" />
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-extrabold text-forest">{t(place.name)}</h3>
            <span className="shrink-0 rounded-md bg-forest/10 px-2.5 py-1 text-xs font-bold text-forest">
              {t(place.kind === 'branch' ? site.ui.branch : site.ui.warehouse)}
            </span>
          </div>

          <ul className="space-y-3">
            <InfoRow icon={MapPin} label={t(site.contact.address)} value={t(place.address)} />
            <InfoRow
              icon={Phone}
              label={t(site.contact.phone)}
              value={branchPhone}
              href={telUrl(branchPhone)}
              ltr
            />
            {branchEmail && (
              <InfoRow icon={Mail} label={t(site.contact.email)} value={branchEmail} href={`mailto:${branchEmail}`} ltr />
            )}
            {managerName && (
              <>
                <InfoRow icon={UserRound} label={t(site.ui.manager)} value={managerName} />
                {managerPhone && (
                  <InfoRow
                    icon={Phone}
                    label={t(site.ui.managerPhone)}
                    value={managerPhone}
                    href={telUrl(managerPhone)}
                    ltr
                  />
                )}
              </>
            )}
          </ul>

          <div className="mt-auto flex flex-col gap-3">
            {showMaps && (
              <div className="h-28 w-full overflow-hidden rounded-lg border border-border bg-secondary">
                <iframe
                  src={getMapEmbedUrl(place.mapQuery)}
                  title={`${t(site.ui.mapOf)} ${t(place.name)}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="size-full border-0"
                />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gold/60 px-3 py-2 text-xs font-bold text-forest transition-colors hover:bg-gold hover:text-forest-deep"
              >
                <ExternalLink className="size-3.5" aria-hidden="true" />
                {t(site.ui.openInMaps)}
              </a>
              <a
                href={place.reviewUrl || place.mapUrl || mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gold/15 border border-gold/40 px-3 py-2 text-xs font-bold text-forest transition-colors hover:bg-gold hover:text-forest-deep"
              >
                <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />
                {t({ ar: 'قيّمنا على Google', en: 'Rate on Google' })}
              </a>
            </div>
          </div>
        </div>
      </article>

      {showLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(place.name)}
          onClick={() => setShowLightbox(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-deep/90 p-4 backdrop-blur-md"
        >
          <div
            className="relative flex max-h-[92vh] max-w-5xl flex-col overflow-hidden rounded-2xl border border-gold/30 bg-forest-deep shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLightbox(false)}
              className="absolute end-3 top-3 z-20 flex size-9 items-center justify-center rounded-full bg-forest-deep/80 text-cream transition-colors hover:bg-gold hover:text-forest-deep"
              aria-label={t({ ar: 'إغلاق', en: 'Close' })}
            >
              <X className="size-5" />
            </button>

            <div className="relative h-[70vh] w-[90vw] max-w-4xl flex items-center justify-center">
              {isVideo ? (
                <video
                  src={place.videoUrl}
                  poster={place.videoPoster || place.image}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[70vh] w-full object-contain"
                />
              ) : (
                <Image
                  src={place.image}
                  alt={t(place.imageAlt)}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              )}
            </div>

            <div className="border-t border-gold/15 bg-forest-deep/95 px-5 py-3 text-start">
              <span className="block text-base font-extrabold text-gold">{t(place.name)}</span>
              <span className="block text-xs text-cream/70 mt-0.5">{t(place.address)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
