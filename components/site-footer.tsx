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
          <p className="mt-5 max-w-sm leading-relaxed">{t(site.footer.description)}</p>
        </div>

        <nav aria-label={t(site.footer.quickLinks)}>
          <h2 className="mb-4 font-bold text-cream">{t(site.footer.quickLinks)}</h2>
          <ul className="space-y-2.5">
            {quickLinks.map((link, i) => (
              <li key={`${link.href}-${i}`}>
                <Link href={localize(link.href)} className="transition-colors hover:text-gold">
                  {t(link.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t(site.footer.services)}>
          <h2 className="mb-4 font-bold text-cream">{t(site.footer.services)}</h2>
          <ul className="space-y-2.5">
            {services.map((service) => (
              <li key={service.id}>
                <Link href={localize('/#services')} className="transition-colors hover:text-gold">
                  {t(service.title)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-bold text-cream">{t(site.footer.contact)}</h2>
          <ul className="space-y-2.5">
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
      <div className="border-t border-cream/10 py-5 text-sm">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 md:min-h-10 md:flex-row md:justify-between md:px-6">
          <p>
            © {new Date().getFullYear()} {t(site.footer.rights)}
          </p>
          <span className="order-2 md:absolute md:left-1/2 md:order-none md:-translate-x-1/2"><VisitorCounter locale={locale} /></span>
          <a
            href="https://shoaib-haj-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            lang="en"
            dir="ltr"
            className="transition-colors hover:text-gold"
          >
            Made by Shoaib Hajj
            <span className="sr-only"> ({t({ ar: 'يفتح في نافذة جديدة', en: 'opens in a new tab' })})</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
