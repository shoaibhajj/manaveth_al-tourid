'use client'

import Image from 'next/image'
import Link from 'next/link'
import { telUrl } from '@/lib/content/contact'
import { useContent, useLocale } from './locale-provider'
import { VisitorCounter } from './visitor-counter'

const quickLinkIds = ['about', 'services', 'products', 'gallery', 'sectors', 'branches', 'blog']

export function SiteFooter() {
  const { t, localize, locale } = useLocale()
  const { site, contact, services, sections } = useContent()
  const quickLinks =
    site.footerLinks.length > 0
      ? site.footerLinks
      : site.nav
          .filter((item) => quickLinkIds.includes(item.id) && sections[item.id as keyof typeof sections] !== false)
          .map(({ label, href }) => ({ label, href }))
  const phoneHref = contact.phone ? telUrl(contact.phone) : undefined

  return (
    <footer className="border-t border-gold/20 bg-forest-deep text-cream/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src={site.brand.logo} alt="" width={56} height={56} className="size-14 rounded-full ring-1 ring-gold/40" />
            <span>
              <span className="block text-xl font-extrabold text-gold-gradient">{t(site.brand.name)}</span>
              <span className="block text-xs tracking-wider">{t(site.brand.subtitle)}</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/60">{t(site.footer.description)}</p>
        </div>

        <div>
          <h4 className="font-bold text-cream">{t(site.footer.quickLinks)}</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((item, i) => (
              <li key={i}>
                <Link href={localize(item.href)} className="transition-colors hover:text-gold">
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-cream">{t(site.footer.services)}</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.id}>
                <Link href={localize(service.href)} className="transition-colors hover:text-gold">
                  {t(service.title)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-cream">{t(site.footer.contact)}</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              {phoneHref ? (
                <a href={phoneHref} dir="ltr" className="inline-block transition-colors hover:text-gold">
                  {contact.phone}
                </a>
              ) : (
                <span className="text-cream/50">
                  {t(site.contact.phone)}: {t(site.ui.comingSoon)}
                </span>
              )}
            </li>
            <li>
              <a href={`mailto:${contact.email}`} dir="ltr" className="inline-block transition-colors hover:text-gold">
                {contact.email}
              </a>
            </li>
            <li>{t(contact.address)}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold/15 bg-forest-deep/90 py-6 text-sm backdrop-blur-sm">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-xs font-normal tracking-wide text-cream/60">
            © {new Date().getFullYear()} {t(site.footer.rights)}
          </p>
          <div className="order-first md:order-none md:absolute md:left-1/2 md:-translate-x-1/2">
            <VisitorCounter locale={locale} />
          </div>
          <a
            href="https://shoaib-haj-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            lang="en"
            dir="ltr"
            className="group inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-forest/40 px-3.5 py-1.5 text-xs font-medium text-cream/75 backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.25)]"
          >
            <span>Made by</span>
            <span className="font-bold text-gold transition-colors group-hover:text-gold-light">Shoaib Hajj</span>
            <span className="text-gold/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">
              ↗
            </span>
            <span className="sr-only"> ({t({ ar: 'يفتح في نافذة جديدة', en: 'opens in a new tab' })})</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
