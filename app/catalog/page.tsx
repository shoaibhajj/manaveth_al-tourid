import type { Metadata } from 'next'
import { getContent } from '@/lib/sanity/get-content'
import { getLocale } from '@/lib/locale-server'
import { getSiteUrl } from '@/lib/site-url'
import { localePath } from '@/lib/i18n'
import { CatalogView } from '@/components/catalog/catalog-view'
import { defaultCatalogProducts, catalogCategories } from '@/lib/content/catalog-data'
import { isSanityConfigured } from '@/sanity/env'
import { JsonLd } from '@/components/json-ld'
import { buildMetadata } from '@/lib/seo/build-metadata'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const isAr = locale === 'ar'

  const title = isAr
    ? 'كتالوج وقائمة الأصناف التموينية | شركة منافذ التوريد'
    : 'Wholesale Foodservice Product Catalog | Mnaveth ALTourid'

  const description = isAr
    ? 'تصفح قائمة الأصناف التموينية والغذائية المعتمدة لشركة منافذ التوريد: لحوم مجمدة، أرز بسمتي هندي، زيوت طعام فندقية، معلبات، وتمور للمطاعم والفنادق.'
    : 'Browse the certified wholesale food products menu of Mnaveth ALTourid: frozen meats, basmati rice, frying oils, canned goods, and dates for restaurants.'

  return buildMetadata({
    path: '/catalog',
    locale,
    title,
    description,
  })
}

export default async function CatalogPage() {
  const [content, locale, base] = await Promise.all([getContent(), getLocale(), getSiteUrl()])
  const sanityProducts = content?.products || []
  const isAr = locale === 'ar'

  // F1: Sanity is the SINGLE source of truth when configured.
  let productsToUse = []

  if (isSanityConfigured && sanityProducts.length > 0) {
    productsToUse = sanityProducts.map((p, idx) => {
      const catId = p.categoryId || 'meat-poultry'
      const foundCategory = catalogCategories.find((c) => c.id === catId || `category-${c.id}` === catId)
      const categoryName = foundCategory?.name || { ar: 'أصناف تموينية', en: 'Foodservice Staples' }

      return {
        id: p.id,
        slug: p.slug || p.id,
        sku: p.sku || `MNV-${idx + 101}`,
        name: p.name,
        categoryId: foundCategory?.id || 'meat-poultry',
        categoryName,
        description: p.description,
        origin: p.origin || undefined,
        packaging: p.packaging || undefined,
        storage: p.storage || undefined,
        certifications: p.certifications || undefined,
        usage: p.usage,
        tempType: (p.storage?.ar?.includes('مجمد') || p.storage?.ar?.includes('-18')
          ? 'frozen'
          : p.storage?.ar?.includes('مبرد')
            ? 'chilled'
            : 'ambient') as any,
        image: p.image || undefined,
        order: p.order ?? idx,
        featured: p.featured,
        updatedAt: p.updatedAt,
      }
    })
  } else if (!isSanityConfigured) {
    productsToUse = defaultCatalogProducts.map((p) => ({
      ...p,
      slug: p.slug || p.sku || p.id,
    }))
  }

  // F3: ItemList Schema for indexed catalog products
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isAr ? 'قائمة الأصناف والمنتجات التموينية' : 'Wholesale Foodservice Products Catalog',
    description: isAr
      ? 'الدليل المعتمد للأصناف والمواد الغذائية التموينية لكبرى المطاعم والفنادق'
      : 'Certified wholesale foodservice catalog for hotels and restaurants',
    numberOfItems: productsToUse.length,
    itemListElement: productsToUse.map((product, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: isAr ? product.name.ar : product.name.en || product.name.ar,
      url: `${base}${localePath(`/products/${product.slug || product.id}`, locale)}`,
    })),
  }

  return (
    <div className="pt-16 md:pt-20">
      <JsonLd graph={itemListSchema} />
      <CatalogView
        initialProducts={productsToUse}
        catalogConfig={content?.catalogPage}
      />
    </div>
  )
}
