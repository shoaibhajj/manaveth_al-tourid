import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ProductsPageContent } from '@/components/products-page-content'
import { getContent } from '@/lib/sanity/get-content'
import { getLocale } from '@/lib/locale-server'

export async function generateMetadata(): Promise<Metadata> {
  const [locale, { seo }] = await Promise.all([getLocale(), getContent()])
  return {
    title: seo.products.title[locale],
    description: seo.products.description[locale],
    openGraph: seo.products.shareImage ? { images: [seo.products.shareImage] } : undefined,
  }
}

export default async function ProductsPage() {
  const { site } = await getContent()
  return (
    <main>
      <PageHero
        eyebrow={site.productsPage.eyebrow}
        title={site.productsPage.title}
        subtitle={site.productsPage.subtitle}
      />
      <ProductsPageContent />
    </main>
  )
}
