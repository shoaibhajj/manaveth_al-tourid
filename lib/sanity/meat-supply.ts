import { getLayoutContent } from './get-content'
import { sanityServerClient } from './server-client'
import {
  confirmedCitiesQuery,
  confirmedCityBySlugQuery,
  landingPageBySlugQuery,
} from './queries'
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
  let customLandingDoc: any = null
  let layoutContent: any = null
  let cityRecords: any[] = []

  try {
    layoutContent = await getLayoutContent()
  } catch {
    // fallback
  }

  if (sanityServerClient) {
    try {
      const [landingDoc, cities] = await Promise.all([
        sanityServerClient.fetch(landingPageBySlugQuery, { slug: 'meat-supply' }),
        sanityServerClient.fetch(confirmedCitiesQuery),
      ])
      customLandingDoc = landingDoc
      cityRecords = Array.isArray(cities) ? cities : []
    } catch {
      // Keep the general page usable if Sanity is unavailable.
    }
  }
  if (!cityRecords.length) {
    cityRecords = Object.entries(VERIFIED_CITIES).map(([slug, city]) => ({
      slug,
      name: { ar: city.ar.name, en: city.en.name },
    }))
  }

  return {
    customDoc: customLandingDoc,
    products: [] as MeatProductRow[],
    sectors: ['restaurants', 'hotels', 'catering'] as const,
    cities: cityRecords.map((city) => ({
      slug: city.slug || city.slug?.current,
      name: typeof city.name === 'string' ? city.name : city.name?.[locale] || city.name?.ar || city.name?.en || '',
    })),
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
  return VERIFIED_CITIES[slug]?.[locale] ?? null
}

export async function getConfirmedCityData(slug: string, locale: Locale): Promise<CityLandingData | null> {
  if (sanityServerClient) {
    try {
      const city = await sanityServerClient.fetch(confirmedCityBySlugQuery, { slug })
      if (city) {
        const text = (value: any) => typeof value === 'string' ? value : value?.[locale] || value?.ar || value?.en || ''
        return {
          slug: city.slug,
          name: text(city.name),
          region: text(city.region),
          coveredDistricts: text(city.coveredDistricts),
          deliveryTime: text(city.deliveryTime),
          minOrder: text(city.minOrder),
          pickupPoint: text(city.pickupPoint),
          coldChainFacility: text(city.coldChainFacility),
          faqs: Array.isArray(city.faqs)
            ? city.faqs.map((faq: any) => ({ question: text(faq.question), answer: text(faq.answer) }))
            : [],
        }
      }
    } catch {
      // Keep existing city routes available until a complete, confirmed Sanity record is published.
    }
  }
  return getCityData(slug, locale)
}
