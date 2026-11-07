'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'
import { icons } from './icon-map'
import type { IconKey } from '@/lib/content/types'

export type CustomSectionData = {
  id: string
  internalName?: string
  title: { ar: string; en: string }
  eyebrow?: { ar: string; en: string }
  description?: { ar: string; en: string }
  layout?: 'cards' | 'mediaText' | 'banner'
  image?: string
  text?: { ar: string; en: string }
  buttonLabel?: { ar: string; en: string }
  buttonHref?: string
  cards?: Array<{
    id?: string
    title: { ar: string; en: string }
    text?: { ar: string; en: string }
    icon?: string
    image?: string
    href?: string
    ctaLabel?: { ar: string; en: string }
  }>
}

export function CustomSection({ section }: { section: CustomSectionData }) {
  const { t, locale } = useLocale()
  const layout = section.layout || 'cards'
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight

  if (layout === 'banner') {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-r from-forest-deep via-forest to-forest-deep p-8 md:p-14 shadow-2xl text-start">
            <div className="relative z-10 max-w-3xl space-y-4">
              {section.eyebrow && (
                <span className="inline-block rounded-full bg-gold/20 px-3.5 py-1 text-xs font-bold text-gold ring-1 ring-gold/30">
                  {t(section.eyebrow)}
                </span>
              )}
              <h2 className="text-3xl font-extrabold text-cream md:text-5xl leading-tight">
                {t(section.title)}
              </h2>
              {section.description && (
                <p className="text-base text-cream/80 md:text-lg leading-relaxed">
                  {t(section.description)}
                </p>
              )}
              {section.buttonLabel && (
                <div className="pt-4">
                  <Link
                    href={section.buttonHref || '/#contact'}
                    className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-extrabold text-forest-deep shadow-lg transition-transform hover:scale-105"
                  >
                    <span>{t(section.buttonLabel)}</span>
                    <Arrow className="size-4" />
                  </Link>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    )
  }

  if (layout === 'mediaText') {
    return (
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {section.image && (
              <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-lg">
                <Image src={section.image} alt={t(section.title)} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </Reveal>
            )}
            <Reveal className="space-y-5 text-start">
              {section.eyebrow && (
                <span className="text-xs font-bold uppercase tracking-wider text-gold">
                  {t(section.eyebrow)}
                </span>
              )}
              <h2 className="text-3xl font-extrabold text-forest md:text-4xl leading-snug">
                {t(section.title)}
              </h2>
              {section.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t(section.description)}
                </p>
              )}
              {section.text && (
                <p className="text-base text-foreground/80 leading-relaxed">
                  {t(section.text)}
                </p>
              )}
              {section.buttonLabel && (
                <div className="pt-2">
                  <Link
                    href={section.buttonHref || '/#contact'}
                    className="inline-flex items-center gap-2 rounded-xl bg-forest px-6 py-3.5 text-sm font-extrabold text-cream transition hover:bg-gold hover:text-forest-deep shadow-md"
                  >
                    <span>{t(section.buttonLabel)}</span>
                    <Arrow className="size-4" />
                  </Link>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    )
  }

  // Default: cards grid
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal className="mb-12 text-start">
          {section.eyebrow && (
            <p className="mb-2 text-lg font-bold text-gold">{t(section.eyebrow)}</p>
          )}
          <h2 className="text-balance text-3xl font-extrabold text-forest md:text-4xl">
            {t(section.title)}
          </h2>
          {section.description && (
            <p className="mt-3 text-lg text-muted-foreground max-w-3xl">
              {t(section.description)}
            </p>
          )}
        </Reveal>

        {section.cards && section.cards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.cards.map((card, idx) => {
              const Icon = card.icon && card.icon in icons ? icons[card.icon as IconKey] : null
              return (
                <Reveal
                  key={card.id || idx}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl text-start"
                >
                  <div>
                    {card.image && (
                      <div className="relative mb-5 aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
                        <Image src={card.image} alt={t(card.title)} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      {Icon && (
                        <span className="flex size-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
                          <Icon className="size-5" />
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-forest group-hover:text-gold transition-colors">
                        {t(card.title)}
                      </h3>
                    </div>
                    {card.text && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(card.text)}
                      </p>
                    )}
                  </div>

                  {card.ctaLabel && (
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <Link
                        href={card.href || '/#contact'}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gold group-hover:underline"
                      >
                        <span>{t(card.ctaLabel)}</span>
                        <Arrow className="size-3.5" />
                      </Link>
                    </div>
                  )}
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
