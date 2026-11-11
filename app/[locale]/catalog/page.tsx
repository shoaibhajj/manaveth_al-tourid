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
    ? 'توريد كبدة كلاسيك وجوني جولد ومخ ولسان وريش بالجملة في السعودية | منافذ التوريد'
    : 'Wholesale Classic & Johny Gold Liver, Brain, Tongue and Ribs in Saudi Arabia | Mnaveth ALTourid')

  const description = content.catalogPage?.seo?.description[locale] || (isAr
    ? 'كتالوج شركة منافذ التوريد التجارية لتوريد اللحوم بالجملة في المملكة العربية السعودية: كبدة كلاسيك، كبدة جوني جولد، مخ، لسان وريش للمنشآت والمطاعم.'
    : 'Explore Mnaveth ALTourid’s wholesale meat catalog in Saudi Arabia: Classic and Johny Gold liver, brain, tongue, and ribs for restaurants and commercial kitchens.')
  const keywords = content.catalogPage?.keywords?.map((phrase) => phrase[locale]).filter(Boolean) || (isAr
    ? ['توريد لحوم بالجملة في السعودية', 'مورد لحوم للمطاعم', 'توريد لحوم الرياض', 'توريد لحوم جدة', 'توريد لحوم مكة', 'كبدة كلاسيك بالجملة', 'كبدة جوني جولد بالجملة', 'توريد مخ ولسان وريش للمطاعم']
    : ['wholesale meat supply Saudi Arabia', 'restaurant meat supplier Saudi Arabia', 'meat supply Riyadh', 'meat supply Jeddah', 'meat supply Makkah', 'Classic liver wholesale', 'Johny Gold liver wholesale', 'wholesale brain tongue and ribs'])

  return buildMetadata({
    path: '/catalog',
    locale,
    title,
    description,
    image: content.catalogPage?.seo?.shareImage,
    keywords,
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
        packaging: p.packaging || { ar: '', en: '' },
        storage: p.storage || { ar: '', en: '' },
        certifications: p.certifications || { ar: '', en: '' },
        usage: p.usage,
        tempType: (p.storage?.ar?.includes('مجمد') || p.storage?.ar?.includes('-18')
          ? 'frozen'
          : p.storage?.ar?.includes('مبرد')
            ? 'chilled'
            : 'ambient') as any,
        image: p.image || '/images/hero.png',
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
  const focusedProducts = productsToUse.filter((product) => product.isCoreSpecialty)
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isAr ? 'كتالوج توريد اللحوم بالجملة في السعودية' : 'Wholesale Meat Supply Catalog in Saudi Arabia',
    description: isAr
      ? 'أصناف منافذ التوريد الرئيسية: كبدة كلاسيك، كبدة جوني جولد، مخ، لسان وريش.'
      : 'Mnaveth ALTourid’s focused wholesale specialties: Classic liver, Johny Gold liver, brain, tongue, and ribs.',
    numberOfItems: focusedProducts.length,
    itemListElement: focusedProducts.map((product, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: isAr ? product.name.ar : product.name.en || product.name.ar,
      url: `${base}${localePath(`/products/${product.slug || product.id}`, locale)}`,
    })),
  }

  return (
    <div className="pt-28 md:pt-36 print:pt-0">
      <JsonLd schema={itemListSchema} />
      <CatalogView
        products={productsToUse}
        catalogMeta={content.catalogPage}
      />
    </div>
  )
}
