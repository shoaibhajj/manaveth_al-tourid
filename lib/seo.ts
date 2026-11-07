import 'server-only'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { localePath, locales, type Locale } from './i18n'
import type { SiteContent } from './content/model'
import { getLocale } from './locale-server'
import { getContent } from './sanity/get-content'
import { imageUrl } from './sanity/image'
import { getSiteUrl, isIndexableEnvironment } from './site-url'

import { buildMetadata } from './seo/build-metadata'

export type SeoPage = 'home' | 'products' | 'branches'

const pagePaths: Record<SeoPage, string> = { home: '/', products: '/products', branches: '/branches' }

const absolute = (value: string | undefined, base: string) => (value ? new URL(value, base).toString() : undefined)

/** Title, description, canonical, language alternates and share image for one public page, read from the SEO documents. */
export async function pageMetadata(page: SeoPage): Promise<Metadata> {
  const [locale, content, base] = await Promise.all([getLocale(), getContent(), getSiteUrl()])
  const entry = content.seo[page]
  const path = pagePaths[page]
  const title = entry.title[locale]
  const description = entry.description[locale]
  const image = absolute(entry.shareImage, base)

  return buildMetadata({
    path,
    locale,
    title,
    description,
    image,
  })
}

const compact = <T extends Record<string, unknown>>(value: T) =>
  Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined && v !== '' && v !== null))

/** Organization and WebSite data built only from fields that exist in the content. */
export function organizationGraph(content: SiteContent, locale: Locale, base: string) {
  const home = `${base}${localePath('/', locale)}`
  const social = content.contact.social.map((item) => item.url).filter(Boolean)

  const branchStores = (content.branches || []).map((branch) => {
    const isDawadmi = branch.name.ar.includes('الدوادمي')
    const isJeddah = branch.name.ar.includes('جدة')
    const cityAr = isDawadmi ? 'الدوادمي' : isJeddah ? 'جدة' : 'الرياض'
    const cityEn = isDawadmi ? 'Al Dawadmi' : isJeddah ? 'Jeddah' : 'Riyadh'
    const geo = isDawadmi
      ? { '@type': 'GeoCoordinates', latitude: 24.5071, longitude: 44.3924 }
      : isJeddah
        ? { '@type': 'GeoCoordinates', latitude: 21.5433, longitude: 39.1728 }
        : { '@type': 'GeoCoordinates', latitude: 24.5822, longitude: 46.7725 }

    return compact({
      '@type': ['WholesaleStore', 'FoodEstablishment'],
      '@id': `${base}/#branch-${branch.id}`,
      name: `${content.site.brand.name[locale]} - ${branch.name[locale]}`,
      legalName: 'شركة منافذ التوريد للتجارة',
      url: `${base}${localePath('/branches', locale)}#branch-${branch.id}`,
      image: absolute(branch.image, base),
      telephone: branch.phone || content.contact.phone || '+966509971699',
      email: branch.email || content.contact.email,
      priceRange: '$',
      currenciesAccepted: 'SAR',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer',
      address: {
        '@type': 'PostalAddress',
        streetAddress: branch.address[locale],
        addressLocality: locale === 'ar' ? cityAr : cityEn,
        addressRegion: isJeddah ? (locale === 'ar' ? 'منطقة مكة المكرمة' : 'Makkah Province') : (locale === 'ar' ? 'منطقة الرياض' : 'Riyadh Province'),
        addressCountry: 'SA',
      },
      geo,
      areaServed: isJeddah
        ? ['Jeddah', 'Makkah', 'Madinah', 'Saudi Arabia']
        : ['Riyadh', 'Central Province', 'Saudi Arabia'],
      hasMap: branch.mapUrl || undefined,
      sameAs: [branch.mapUrl, branch.reviewUrl, ...social].filter(Boolean),
      parentOrganization: { '@id': `${base}/#organization` },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '08:00',
          closes: '18:00',
        },
      ],
    })
  })

  return [
    compact({
      '@type': 'Organization',
      '@id': `${base}/#organization`,
      name: content.site.brand.name[locale],
      legalName: 'شركة منافذ التوريد للتجارة',
      foundingDate: '2004',
      identifier: (content.site as any).brand?.commercialRegistration || '1116011768',
      taxID: (content.site as any).brand?.taxId || undefined,
      vatID: (content.site as any).brand?.taxId ? `VAT ${(content.site as any).brand.taxId}` : undefined,
      knowsAbout: [
        'Food Supply Chains',
        'Frozen Meat Wholesale',
        'Basmati Rice Distribution',
        'Cooking Oil Supply',
        'Cold Chain Logistics',
        'Hospitality Catering Supply',
        'Saudi Vision 2030 Food Security',
      ],
      url: home,
      logo: absolute(content.site.brand.logo, base),
      description: content.seo.home.description[locale],
      telephone: content.contact.phone || '+966509971699',
      email: content.contact.email || 'info@mnafeth.com',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+966509971699',
          contactType: 'sales',
          areaServed: 'SA',
          availableLanguage: ['Arabic', 'English'],
        },
      ],
      sameAs: social.length > 0 ? social : undefined,
    }),
    {
      '@type': 'WebSite',
      '@id': `${base}/#website`,
      name: content.site.brand.name[locale],
      url: home,
      inLanguage: locale,
      publisher: { '@id': `${base}/#organization` },
    },
    ...branchStores,
  ]
}

/** Product entries without prices or ratings; only items that have a name, description and image qualify. */
export function productsGraph(content: SiteContent, locale: Locale, base: string) {
  return content.products
    .filter((product) => product.name[locale] && product.description[locale] && product.image)
    .map((product) =>
      compact({
        '@type': 'Product',
        name: product.name[locale],
        description: product.description[locale],
        image: absolute(product.image, base),
        inLanguage: locale,
        url: `${base}${localePath('/products', locale)}`,
        brand: { '@type': 'Brand', name: content.site.brand.name[locale] },
      }),
    )
}

/** Single product detail schema */
export function productDetailGraph(product: Record<string, any>, locale: Locale, base: string, siteName = 'منافذ التوريد') {
  const name = product.name?.[locale] || product.name?.ar || product.name?.en || ''
  const description = product.longDescription?.[locale] || product.description?.[locale] || ''
  const path = `/products/${product.slug}`
  const image = imageUrl(product.image, 1200)
  const price = product.showPrice !== false && typeof product.price?.amount === 'number' ? product.price.amount : undefined

  return [
    compact({
      '@type': 'Product',
      name,
      description,
      image: image ? absolute(image, base) : undefined,
      url: `${base}${localePath(path, locale)}`,
      brand: { '@type': 'Brand', name: siteName },
      offers: price
        ? {
            '@type': 'Offer',
            price,
            priceCurrency: 'SAR',
            availability: 'https://schema.org/InStock',
          }
        : undefined,
    }),
  ]
}

/** Single article detail schema */
export function articleDetailGraph(article: Record<string, any>, locale: Locale, base: string, siteName = 'منافذ التوريد') {
  const headline = article.title?.[locale] || article.title?.ar || article.title?.en || ''
  const description = article.excerpt?.[locale] || article.excerpt?.ar || article.excerpt?.en || ''
  const path = `/blog/${article.slug}`
  const image = imageUrl(article.coverImage, 1200)

  return [
    compact({
      '@type': 'Article',
      headline,
      description,
      image: image ? absolute(image, base) : undefined,
      datePublished: article.publishedAt,
      dateModified: article._updatedAt || article.publishedAt,
      url: `${base}${localePath(path, locale)}`,
      publisher: {
        '@type': 'Organization',
        name: siteName,
        url: base,
      },
      author: article.author ? { '@type': 'Person', name: article.author } : undefined,
    }),
  ]
}

/** Single service detail schema */
export function serviceDetailGraph(service: Record<string, any>, locale: Locale, base: string, siteName = 'منافذ التوريد') {
  const name = service.name?.[locale] || service.name?.ar || service.name?.en || ''
  const description = service.longDescription?.[locale] || service.description?.[locale] || ''
  const path = `/services/${service.slug}`
  const image = imageUrl(service.image, 1200)

  return [
    compact({
      '@type': 'Service',
      name,
      description,
      image: image ? absolute(image, base) : undefined,
      url: `${base}${localePath(path, locale)}`,
      provider: {
        '@type': 'Organization',
        name: siteName,
        url: base,
      },
    }),
  ]
}

export const allLocales = locales
