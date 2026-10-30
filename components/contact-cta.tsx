'use client'

import Image from 'next/image'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { contact, telUrl, whatsappUrl } from '@/lib/content/contact'
import { getBranches, getMapLinkUrl } from '@/lib/content/branches'
import { site } from '@/lib/content/site'
import { ActionLink } from './action-link'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'

export function ContactCta() {
  const { t } = useLocale()
  const primaryBranch = getBranches()[0]
  const quote = contact.whatsapp.quote
  const orders = contact.whatsapp.orders
  const labels = site.contact

  const infoRows = [
    {
      icon: Phone,
      label: labels.phone,
      value: contact.phone || t(site.ui.comingSoon),
      href: contact.phone ? telUrl(contact.phone) : undefined,
      ltr: Boolean(contact.phone),
    },
    { icon: Mail, label: labels.email, value: contact.email, href: `mailto:${contact.email}`, ltr: true },
    {
      icon: MapPin,
      label: labels.address,
      value: t(contact.address),
      href: primaryBranch ? getMapLinkUrl(primaryBranch.mapQuery) : undefined,
      ltr: false,
    },
  ]

  return (
    <section id="contact" className="relative isolate overflow-hidden bg-forest-deep py-20 md:py-28">
      <Image src={site.brand.ctaImage} alt="" fill sizes="100vw" className="-z-20 animate-ken-burns object-cover" />
      <div
        className="absolute inset-0 -z-10 from-forest-deep/95 via-forest-deep/80 to-forest-deep/40 rtl:bg-gradient-to-l ltr:bg-gradient-to-r"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:px-6 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <h2 className="text-balance text-3xl font-extrabold leading-tight text-cream md:text-5xl">
            {t(labels.titleStart)} <span className="text-gold-gradient">{t(labels.titleHighlight)}</span>
          </h2>
          <p className="mt-4 max-w-xl text-pretty text-lg text-cream/80">{t(labels.text)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink
              href={whatsappUrl(quote.number, t(quote.message))}
              external
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-gold-gradient px-6 py-3.5 font-bold text-forest-deep shadow-lg shadow-gold/25 transition-transform"
              activeClassName="hover:-translate-y-0.5"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              {t(quote.label)}
            </ActionLink>
            <ActionLink
              href={whatsappUrl(orders.number, t(orders.message))}
              external
              className="inline-flex items-center gap-2 rounded-lg border border-cream/40 px-6 py-3.5 font-bold text-cream transition-colors"
              activeClassName="hover:border-gold hover:text-gold"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              {t(orders.label)}
            </ActionLink>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <ul className="space-y-3 rounded-2xl border border-gold/30 bg-forest-deep/70 p-6 backdrop-blur-md">
            {infoRows.map(({ icon: Icon, label, value, href, ltr }) => {
              const content = (
                <>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-cream/60">{t(label)}</span>
                    <span
                      className={`block break-words font-bold ${href ? 'text-cream' : 'text-cream/60'}`}
                      dir={ltr ? 'ltr' : undefined}
                    >
                      {value}
                    </span>
                  </span>
                </>
              )
              const rowClass = 'flex items-center gap-4 rounded-xl p-3 transition-colors'
              return (
                <li key={label.en}>
                  {href ? (
                    <a
                      href={href}
                      className={`${rowClass} hover:bg-white/5`}
                      {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className={rowClass}>{content}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
