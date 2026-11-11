import type { Metadata } from 'next'
import { getContent } from '@/lib/sanity/get-content'
import { getSiteUrl } from '@/lib/site-url'
import { defaultLocale, isLocale, localePath, type Locale } from '@/lib/i18n'
import { CatalogView } from '@/components/catalog/catalog-view'
import { defaultCatalogProducts, catalogCategories } from '@/lib/content/catalog-data'
import { isSanityConfigured } from '@/sanity/env'
import { JsonLd } from '@/components/json-ld'
import { buildMetadata } from '@/lib/seo/build-metadata'

// Keep known launch specialties visible until the live Sanity records are migrated
// to the explicit catalog flag. Other meat and poultry items stay out of this section.
const legacyCoreSpecialtySlugs = new Set([
  'frozen-liver-classic',
  'frozen-liver-johny-gold',
  'frozen-brain',
  'frozen-tongue',
  'frozen-ribs-wagstaff',
])

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
  const isAr = locale === 'ar'
  const content = await getContent()

  const title = content.catalogPage?.seo?.title[locale] || (isAr
    ? 'كتالوج وقائمة الأصناف التموينية | شركة منافذ التوريد'
    : 'Wholesale Foodservice Product Catalog | Mnaveth ALTourid')

  const description = content.catalogPage?.seo?.description[locale] || (isAr
    ? 'تصفح قائمة الأصناف التموينية والغذائية المعتمدة لشركة منافذ التوريد: لحوم مجمدة، أرز بسمتي هندي، زيوت طعام فندقية، معلبات، وتمور للمطاعم والفنادق.'
    : 'Browse the certified wholesale food products menu of Mnaveth ALTourid: frozen meats, basmati rice, frying oils, canned goods, and dates for restaurants.')

  return buildMetadata({
    path: '/catalog',
    locale,
    title,
    description,
    image: content.catalogPage?.seo?.shareImage,
  })
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const [content, base] = await Promise.all([getContent(), getSiteUrl()])
  const sanityProducts = content?.products || []
  const isAr = locale === 'ar'
  const categories = content.catalogCategories?.length ? content.catalogCategories : catalogCategories

  // F1: Sanity is the SINGLE source of truth when configured.
  let productsToUse = []

  if (isSanityConfigured && sanityProducts.length > 0) {
    productsToUse = sanityProducts.map((p, idx) => {
      const catId = p.categoryId || 'meat-poultry'
      const foundCategory = categories.find((c) => c.id === catId || `category-${c.id}` === catId)
      const categoryName = foundCategory?.name || { ar: 'أصناف تموينية', en: 'Foodservice Staples' }

      return {
        id: p.id,
        slug: p.slug || p.id,
        sku: p.sku || `MNV-${idx + 101}`,
        name: p.name,
        categoryId: foundCategory?.id || 'meat-poultry',
        categoryName,
        description: p.description,
        origin: p.origin || { ar: 'غير محدد', en: 'Not specified' },
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
        gallery: p.gallery || undefined,
        isCoreSpecialty: p.isCoreSpecialty === true || legacyCoreSpecialtySlugs.has(p.slug || ''),
        order: p.order ?? idx,
        featured: p.featured,
        updatedAt: p.updatedAt,
      }
    })
  } else {
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
    <div className="pt-28 md:pt-36">
      <JsonLd schema={itemListSchema} />
      <CatalogView
        products={productsToUse}
        categories={categories}
        catalogMeta={content.catalogPage}
      />
    </div>
  )
}
