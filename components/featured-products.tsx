'use client'

import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/content/products'
import { site } from '@/lib/content/site'
import { DirArrow } from './dir-arrow'
import { useLocale } from './locale-provider'
import { ProductsGrid } from './products-grid'
import { Reveal, SectionHeading } from './reveal'

export function FeaturedProducts() {
  const { t } = useLocale()
  const { productsSection } = site

  return (
    <section id="products" className="bg-secondary/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow={t(productsSection.eyebrow)}
          title={t(productsSection.title)}
          subtitle={t(productsSection.subtitle)}
        />
        <div className="mt-12">
          <ProductsGrid products={getFeaturedProducts().slice(0, 3)} />
        </div>
        <Reveal className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-lg border-2 border-gold px-7 py-3 font-bold text-forest transition-colors hover:bg-gold"
          >
            {t(productsSection.cta)}
            <DirArrow />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
