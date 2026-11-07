import type { Metadata } from 'next'
import { getContent } from '@/lib/sanity/get-content'
import { getLocale } from '@/lib/locale-server'
import { CatalogView } from '@/components/catalog/catalog-view'
import { defaultCatalogProducts, catalogCategories } from '@/lib/content/catalog-data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const isAr = locale === 'ar'

  return {
    title: isAr
      ? 'كتالوج وقائمة الأصناف التموينية | شركة منافذ التوريد'
      : 'Wholesale Foodservice Product Catalog | Mnaveeh ALTourid',
    description: isAr
      ? 'تصفح قائمة الأصناف التموينية والغذائية المعتمدة لشركة منافذ التوريد: لحوم مجمدة، أرز بسمتي هندي، زيوت طعام فندقية، معلبات A10، وتمور للمطاعم والفنادق.'
      : 'Browse the certified wholesale food products menu of Mnaveeh ALTourid: frozen meats, basmati rice, frying oils, canned goods, and dates for restaurants.',
    alternates: {
      canonical: '/catalog',
    },
    openGraph: {
      title: isAr
        ? 'كتالوج الأصناف والمنتجات التموينية | منافذ التوريد'
        : 'Wholesale Product Catalog | Mnaveeh ALTourid',
      description: isAr
        ? 'دليل الأصناف التموينية المعتمدة لكبرى المطاعم والفنادق وشركات الإعاشة في المملكة العربية السعودية.'
        : 'Official certified catalog of wholesale foodservice ingredients for restaurants and hotels across Saudi Arabia.',
      url: 'https://www.mnaveth-altourid.com/catalog',
    },
  }
}

export default async function CatalogPage() {
  const content = await getContent()
  const sanityProducts = content?.products || []

  // Map Sanity products to CatalogProduct format if available
  const mappedSanityProducts = sanityProducts.map((p, idx) => {
    const catId = p.categoryId || 'meat-poultry'
    const foundCategory = catalogCategories.find((c) => c.id === catId || `category-${c.id}` === catId)
    const categoryName = foundCategory?.name || { ar: 'أصناف تموينية', en: 'Foodservice Staples' }

    return {
      id: p.id,
      slug: p.slug || p.sku || p.id,
      sku: p.sku || `MNV-${idx + 101}`,
      name: p.name,
      categoryId: foundCategory?.id || 'meat-poultry',
      categoryName,
      description: p.description,
      origin: p.origin || { ar: 'مستورد معتمد', en: 'Certified Import' },
      packaging: p.packaging || { ar: 'كراتين وأكياس جملة', en: 'Master Cartons & Sacks' },
      storage: p.storage || { ar: 'يُحفظ حسب المواصفات القياسية', en: 'Stored according to standards' },
      certifications: p.certifications || { ar: 'مطابق لاشتراطات SFDA', en: 'SFDA Compliant' },
      usage: p.usage,
      tempType: (p.storage?.ar?.includes('مجمد') || p.storage?.ar?.includes('-18') ? 'frozen' : p.storage?.ar?.includes('مبرد') ? 'chilled' : 'ambient') as any,
      image: p.image || '/images/hero.png',
      order: p.order ?? idx,
      featured: p.featured,
      updatedAt: p.updatedAt || (p as any)._updatedAt || (p as any)._createdAt,
    }
  })

  // If Sanity has products, use them; otherwise, use defaultCatalogProducts with slug
  const defaultsWithSlug = defaultCatalogProducts.map((p) => ({
    ...p,
    slug: p.slug || p.sku || p.id,
    updatedAt: p.updatedAt || '2026-11-07T12:00:00Z',
  }))

  const productsToUse =
    mappedSanityProducts.length > 5 ? mappedSanityProducts : defaultsWithSlug

  return (
    <div className="pt-16 md:pt-20">
      <CatalogView
        initialProducts={productsToUse}
        catalogConfig={content?.catalogPage}
      />
    </div>
  )
}
