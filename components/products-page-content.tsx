'use client'

import Link from 'next/link'
import { MessageCircle, Layers } from 'lucide-react'
import { whatsappUrl } from '@/lib/content/contact'
import type { Product } from '@/lib/content/products'
import { catalogCategories } from '@/lib/content/catalog-data'
import { localePath } from '@/lib/i18n'
import { ActionLink } from './action-link'
import { useContent, useLocale } from './locale-provider'
import { ProductsGrid } from './products-grid'
import { Reveal } from './reveal'

export function ProductsPageContent({
  products: productsProp,
  productsPage: pageProp,
}: {
  products?: Product[]
  productsPage?: any
} = {}) {
  const { locale, t } = useLocale()
  const isAr = locale === 'ar'
  const { site, contact, products: contextProducts } = useContent()
  const products = productsProp ?? contextProducts ?? []
  const quote = contact.whatsapp.quote
  const productsPage = pageProp ?? site?.productsPage

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Category Navigation Pills (E6) */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-forest/60">
            <Layers className="size-3.5 text-gold" />
            <span>{isAr ? 'تصفح الأصناف حسب القسم:' : 'Browse items by category:'}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-xl bg-forest-deep px-3.5 py-1.5 text-xs font-bold text-cream">
              {isAr ? 'جميع الأصناف' : 'All Items'}
            </span>
            {catalogCategories.map((cat) => {
              const catName = isAr ? cat.name.ar : cat.name.en || cat.name.ar
              return (
                <Link
                  key={cat.id}
                  href={localePath(`/products/category/${cat.id}`, locale)}
                  className="rounded-xl border border-forest/15 bg-white px-3.5 py-1.5 text-xs font-bold text-forest-deep hover:border-gold hover:text-gold transition-colors"
                >
                  {catName}
                </Link>
              )
            })}
          </div>
        </div>

        <ProductsGrid products={products} />

        {productsPage && (
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
        )}
      </div>
    </section>
  )
}
