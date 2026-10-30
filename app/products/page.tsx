import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ProductsPageContent } from '@/components/products-page-content'
import { JsonLd } from '@/components/json-ld'
import { getLocale } from '@/lib/locale-server'
import { getContent } from '@/lib/sanity/get-content'
import { pageMetadata, productsGraph } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site-url'

export const generateMetadata = (): Promise<Metadata> => pageMetadata('products')

export default async function ProductsPage() {
  const [content, locale, base] = await Promise.all([getContent(), getLocale(), getSiteUrl()])
  const { site } = content
  return (
    <main>
      <JsonLd graph={productsGraph(content, locale, base)} />
      <PageHero
        eyebrow={site.productsPage.eyebrow}
        title={site.productsPage.title}
        subtitle={site.productsPage.subtitle}
      />
      <ProductsPageContent />
    </main>
  )
}
