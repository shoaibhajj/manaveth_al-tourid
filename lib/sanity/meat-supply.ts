import { getLayoutContent } from './get-content'
import { sanityFetch } from './live'
import {
  landingPageBySlugQuery,
  meatSupplyProductsQuery,
} from './queries'
import { products as fallbackProducts } from '../content/products'
import { type Locale } from '../i18n'
import {
  MeatProductRow,
  SectorLandingData,
  CityLandingData,
  SECTORS_CONTENT,
  VERIFIED_CITIES,
} from '../content/meat-supply-data'

export type { MeatProductRow, SectorLandingData, CityLandingData }
export { SECTORS_CONTENT, VERIFIED_CITIES }

export async function getMeatSupplyPageData(locale: Locale) {
  let sanityMeatProducts: any[] = []
  let customLandingDoc: any = null
  let layoutContent: any = null

  try {
    layoutContent = await getLayoutContent()
  } catch {
    // fallback
  }

  if (sanityFetch) {
    try {
      const [prodRes, landingRes] = await Promise.all([
        sanityFetch({ query: meatSupplyProductsQuery, tags: ['products'] }),
        sanityFetch({ query: landingPageBySlugQuery, params: { slug: 'meat-supply' }, tags: ['landingPages'] }),
      ])
      if (Array.isArray(prodRes?.data)) sanityMeatProducts = prodRes.data
      if (landingRes?.data) customLandingDoc = landingRes.data
    } catch {
      // safe fallback
    }
  }

  // Combine Sanity data with verified catalog seed
  const rawProducts =
    sanityMeatProducts.length > 0
      ? sanityMeatProducts
      : fallbackProducts.filter(
          (p) =>
            p.slug === 'frozen-meat' ||
            p.slug === 'frozen-liver' ||
            p.id === 'frozen-meat' ||
            p.id === 'frozen-liver'
        )

  const productsTable: MeatProductRow[] = rawProducts.map((p: any) => {
    const t = (v: any) => v?.[locale] || v?.ar || v?.en || ''
    return {
      id: p._id || p.id || p.slug,
      slug: p.slug?.current || p.slug || p.id,
      name: t(p.name),
      categoryName: t(p.category?.name) || (locale === 'ar' ? 'اللحوم والدواجن المجمدة' : 'Frozen Meat & Poultry'),
      origin: t(p.origin) || (locale === 'ar' ? 'البرازيل / الهند' : 'Brazil / India'),
      cutOrType: t(p.grainType) || t(p.cut) || (locale === 'ar' ? 'قطعيات بقر وضأن منزوعة العظم' : 'Boneless Primal Cuts'),
      packaging: t(p.packaging) || (locale === 'ar' ? 'كرتون 20 كجم مفرغ الهواء' : '20kg Vacuum Master Carton'),
      usage: t(p.usage) || (locale === 'ar' ? 'المطاعم والفنادق ومطابخ الإعاشة' : 'Restaurants & Commercial Catering'),
      storage: t(p.storage) || (locale === 'ar' ? 'مجمد عند -18° مئوية' : 'Frozen at -18°C'),
      certifications: t(p.certifications) || (locale === 'ar' ? 'حلال 100% · اعتماد الغذاء والدواء SFDA' : '100% Halal · SFDA Approved'),
      priceFormatted: p.price?.amount ? `${p.price.amount} ${t(p.price?.unit) || (locale === 'ar' ? 'ر.س' : 'SAR')}` : undefined,
      rawPrice: p.price?.amount,
    }
  })

  return {
    customDoc: customLandingDoc,
    products: productsTable,
    sectors: ['restaurants', 'hotels', 'catering'] as const,
    cities: Object.keys(VERIFIED_CITIES),
    contacts: {
      phone: layoutContent?.contact?.phone || '+966509971699',
      whatsapp: layoutContent?.contact?.whatsapp?.quote?.number || layoutContent?.contact?.whatsapp?.orders?.number || '966509971699',
      cr: '1116011768',
      legalName: locale === 'ar' ? 'شركة منافذ التوريد للتجارة' : 'Mnaveth ALTourid Trading Co.',
    },
  }
}

export function getSectorData(slug: string, locale: Locale): SectorLandingData | null {
  if (slug === 'restaurants' || slug === 'hotels' || slug === 'catering') {
    return SECTORS_CONTENT[slug][locale]
  }
  return null
}

export function getCityData(slug: string, locale: Locale): CityLandingData | null {
  const city = VERIFIED_CITIES[slug]
  if (city) {
    return city[locale]
  }
  return null
}
