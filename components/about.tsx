'use client'

import Image from 'next/image'
import { Award } from 'lucide-react'
import { DirArrow } from './dir-arrow'
import { icons } from './icon-map'
import { useContent, useLocale } from './locale-provider'
import { Reveal, RevealItem } from './reveal'

export function About() {
  const { t } = useLocale()
  const { site } = useContent()
  const { about } = site

  return (
    <section id="about" className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
        <Reveal x={30} y={0} className="order-2 lg:order-1">
          <p className="mb-2 text-lg font-bold text-gold">{t(about.eyebrow)}</p>
          <h2 className="text-balance text-3xl font-extrabold leading-tight text-forest md:text-4xl">
            {t(about.title)}
          </h2>
          {about.paragraphs.map((paragraph, i) => (
            <p key={i} className="mt-5 text-pretty text-lg leading-loose text-muted-foreground">
              {t(paragraph)}
            </p>
          ))}

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {about.pillars.map(({ icon, title, text }, i) => {
              const Icon = icons[icon]
              return (
                <RevealItem
                  key={`${icon}-${i}`}
                  delay={0.1 * i}
                  className="group h-full rounded-xl border border-border bg-card p-4 text-center transition-[border-color,box-shadow] duration-300 hover:border-gold hover:shadow-xl hover:shadow-gold/10"
                >
                  <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-forest/5 text-forest transition-colors group-hover:bg-forest group-hover:text-gold">
                    <Icon className="size-6" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="font-bold text-forest">{t(title)}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(text)}</p>
                </RevealItem>
              )
            })}
          </ul>

          <a
            href="#services"
            className="group mt-8 inline-flex items-center gap-2 rounded-lg border-2 border-gold px-6 py-3 font-bold text-forest transition-colors hover:bg-gold"
          >
            {t(about.cta)}
            <DirArrow />
          </a>
        </Reveal>

        <Reveal x={-30} y={0} className="relative order-1 lg:order-2">
          <div className="absolute -inset-3 -z-10 rounded-3xl border-2 border-gold/30" aria-hidden="true" />
          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-forest/20">
            <Image
              src={site.brand.aboutImage}
              alt={t(about.imageAlt)}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 to-transparent" aria-hidden="true" />
          </div>
          <div className="absolute -bottom-6 start-6 flex animate-float items-center gap-4 rounded-2xl border border-gold/40 bg-forest-deep/90 px-6 py-4 shadow-xl backdrop-blur-md">
            <span className="flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Award className="size-8" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm text-cream/80">{t(about.badgeLabel)}</span>
              <span className="block text-4xl font-extrabold text-gold-gradient">{about.badgeValue}</span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
