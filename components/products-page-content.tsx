'use client'

import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '@/lib/content/contact'
import { ActionLink } from './action-link'
import { useContent, useLocale } from './locale-provider'
import { ProductsGrid } from './products-grid'
import { Reveal } from './reveal'

export function ProductsPageContent() {
  const { t } = useLocale()
  const { site, contact, products } = useContent()
  const quote = contact.whatsapp.quote
  const { productsPage } = site

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <ProductsGrid products={products} />

        <Reveal className="mt-14 flex flex-col items-center gap-5 rounded-2xl bg-forest-deep px-6 py-10 text-center">
          <h2 className="text-2xl font-extrabold text-cream md:text-3xl">{t(productsPage.ctaTitle)}</h2>
          <p className="max-w-xl text-pretty text-cream/75">{t(productsPage.ctaText)}</p>
          <ActionLink
            href={whatsappUrl(quote.number, t(quote.message))}
            external
            className="inline-flex items-center gap-2 rounded-lg bg-gold-gradient px-7 py-3.5 font-bold text-forest-deep shadow-lg shadow-gold/25 transition-transform"
            activeClassName="hover:-translate-y-0.5"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            {t(quote.label)}
          </ActionLink>
        </Reveal>
      </div>
    </section>
  )
}
