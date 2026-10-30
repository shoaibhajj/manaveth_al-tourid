import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ProductsPageContent } from '@/components/products-page-content'
import { site } from '@/lib/content/site'
import { getLocale } from '@/lib/locale-server'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return { title: site.metadata.productsTitle[locale], description: site.productsPage.subtitle[locale] }
}

export default function ProductsPage() {
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
