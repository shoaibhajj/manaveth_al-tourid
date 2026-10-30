'use client'

import { ExternalLink, MapPin } from 'lucide-react'
import { getMapEmbedUrl, getMapLinkUrl, type Place } from '@/lib/content/branches'
import { site } from '@/lib/content/site'
import { useLocale } from './locale-provider'

export function BranchCard({ place }: { place: Place }) {
  const { t } = useLocale()

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[border-color,box-shadow] duration-500 hover:border-gold hover:shadow-xl hover:shadow-gold/10">
      <div className="flex items-start gap-4 p-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-forest/5 text-forest">
          <MapPin className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold text-gold">
            {t(place.kind === 'branch' ? site.ui.branch : site.ui.warehouse)}
          </p>
          <h3 className="font-bold text-forest">{t(place.name)}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(place.address)}</p>
        </div>
      </div>

      <div className="aspect-[16/10] w-full border-y border-border bg-secondary">
        <iframe
          src={getMapEmbedUrl(place.mapQuery)}
          title={`${t(site.ui.mapOf)} ${t(place.name)}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
        />
      </div>

      <div className="mt-auto p-5">
        <a
          href={getMapLinkUrl(place.mapQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold-gradient px-5 py-3 font-bold text-forest-deep transition-transform hover:-translate-y-0.5"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          {t(site.ui.openInMaps)}
        </a>
      </div>
    </article>
  )
}
