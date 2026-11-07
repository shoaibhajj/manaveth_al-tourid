import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ProductsPageContent } from '@/components/products-page-content'
import { JsonLd } from '@/components/json-ld'
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n'
import { getContent } from '@/lib/sanity/get-content'
import { pageMetadata, productsGraph } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site-url'

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  return pageMetadata('products', locale)
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const [content, base] = await Promise.all([getContent(), getSiteUrl()])
  const { site, products } = content

  return (
    <main>
      <JsonLd graph={productsGraph(content, locale, base)} />
      <PageHero
        eyebrow={site.productsPage.eyebrow}
        title={site.productsPage.title}
        subtitle={site.productsPage.subtitle}
      />
      <ProductsPageContent products={products} productsPage={site.productsPage} />
    </main>
  )
}
