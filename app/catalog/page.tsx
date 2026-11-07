import type { Metadata } from 'next'
import { getContent } from '@/lib/sanity/get-content'
import { getLocale } from '@/lib/locale-server'
import { CatalogView } from '@/components/catalog/catalog-view'
import { defaultCatalogProducts, catalogCategories } from '@/lib/content/catalog-data'
import { isSanityConfigured } from '@/sanity/env'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const isAr = locale === 'ar'

  return {
    title: isAr
      ? 'كتالوج وقائمة الأصناف التموينية | شركة منافذ التوريد'
      : 'Wholesale Foodservice Product Catalog | Mnaveth ALTourid',
    description: isAr
      ? 'تصفح قائمة الأصناف التموينية والغذائية المعتمدة لشركة منافذ التوريد: لحوم مجمدة، أرز بسمتي هندي، زيوت طعام فندقية، معلبات، وتمور للمطاعم والفنادق.'
      : 'Browse the wholesale food products menu of Mnaveth ALTourid: frozen meats, basmati rice, frying oils, canned goods, and dates for restaurants.',
    alternates: {
      canonical: '/catalog',
    },
    openGraph: {
      title: isAr
        ? 'كتالوج الأصناف والمنتجات التموينية | منافذ التوريد'
        : 'Wholesale Product Catalog | Mnaveth ALTourid',
      description: isAr
        ? 'دليل الأصناف التموينية المعتمدة لكبرى المطاعم والفنادق وشركات الإعاشة في المملكة العربية السعودية.'
        : 'Official catalog of wholesale foodservice ingredients for restaurants and hotels across Saudi Arabia.',
      url: 'https://www.mnaveth-altourid.com/catalog',
    },
  }
}

export default async function CatalogPage() {
  const content = await getContent()
  const sanityProducts = content?.products || []

  // F1: Sanity is the SINGLE source of truth when configured.
  // No length > 5 checks, no mixing with dummy products, and no fabricated claims.
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

  return (
    <div className="pt-16 md:pt-20">
      <CatalogView
        initialProducts={productsToUse}
        catalogConfig={content?.catalogPage}
      />
    </div>
  )
}
