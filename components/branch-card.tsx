'use client'

import Image from 'next/image'
import { ExternalLink, Mail, MapPin, Phone, UserRound, type LucideIcon } from 'lucide-react'
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
  const { t } = useLocale()
  const { site } = useContent()
  const text = value ? (
    <span dir={ltr ? 'ltr' : undefined} className={ltr ? 'inline-block text-start' : undefined}>
      {value}
    </span>
  ) : (
    <span className="text-muted-foreground/70">{t(site.ui.comingSoon)}</span>
  )

  return (
    <li className="flex items-start gap-3 text-sm">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-forest/5 text-forest">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {href && value ? (
          <a href={href} className="break-words font-medium text-forest transition-colors hover:text-gold">
            {text}
          </a>
        ) : (
          <p className="break-words font-medium text-forest">{text}</p>
        )}
      </div>
    </li>
  )
}

export function BranchCard({ place }: { place: Place }) {
  const { t } = useLocale()
  const { site, showMaps } = useContent()

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[border-color,box-shadow] duration-500 hover:border-gold hover:shadow-xl hover:shadow-gold/10">
      <div className="relative aspect-[16/9] w-full bg-secondary">
        <Image
          src={place.image}
          alt={t(place.imageAlt)}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <span className="absolute start-3 top-3 rounded-md bg-forest-deep/85 px-3 py-1 text-xs font-bold text-gold backdrop-blur-sm">
          {t(place.kind === 'branch' ? site.ui.branch : site.ui.warehouse)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <h3 className="text-lg font-extrabold text-forest">{t(place.name)}</h3>

        <ul className="space-y-3">
          <InfoRow icon={MapPin} label={t(site.contact.address)} value={t(place.address)} />
          <InfoRow
            icon={Phone}
            label={t(site.contact.phone)}
            value={place.phone}
            href={telUrl(place.phone)}
            ltr
          />
          {place.email && (
            <InfoRow icon={Mail} label={t(site.contact.email)} value={place.email} href={`mailto:${place.email}`} ltr />
          )}
          {place.manager && (
            <>
              <InfoRow icon={UserRound} label={t(site.ui.manager)} value={t(place.manager.name)} />
              <InfoRow
                icon={Phone}
                label={t(site.ui.managerPhone)}
                value={place.manager.phone}
                href={telUrl(place.manager.phone)}
                ltr
              />
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
          <a
            href={getMapLinkUrl(place.mapQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gold px-4 py-2.5 text-sm font-bold text-forest transition-colors hover:bg-gold"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            {t(site.ui.openInMaps)}
          </a>
        </div>
      </div>
    </article>
  )
}
