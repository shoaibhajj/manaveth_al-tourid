import 'server-only'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { localePath, locales, type Locale } from './i18n'
import type { SiteContent } from './content/model'
import { getLocale } from './locale-server'
import { getContent } from './sanity/get-content'
import { imageUrl } from './sanity/image'
import { getSiteUrl, isIndexableEnvironment } from './site-url'

export type SeoPage = 'home' | 'products' | 'branches'

const pagePaths: Record<SeoPage, string> = { home: '/', products: '/products', branches: '/branches' }

const absolute = (value: string | undefined, base: string) => (value ? new URL(value, base).toString() : undefined)

/** Title, description, canonical, language alternates and share image for one public page, read from the SEO documents. */
export async function pageMetadata(page: SeoPage): Promise<Metadata> {
  const [locale, content, base, draft] = await Promise.all([getLocale(), getContent(), getSiteUrl(), draftMode()])
  const entry = content.seo[page]
  const path = pagePaths[page]
  const urlFor = (target: Locale) => `${base}${localePath(path, target)}`
  const title = entry.title[locale]
  const description = entry.description[locale]
  const image = absolute(entry.shareImage, base)

  return {
    title,
    description,
    alternates: {
      canonical: urlFor(locale),
      languages: { ar: urlFor('ar'), en: urlFor('en'), 'x-default': urlFor('ar') },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: urlFor(locale),
      siteName: content.site.brand.name[locale],
      images: image ? [image] : undefined,
    },
    robots: draft.isEnabled || !isIndexableEnvironment() ? { index: false, follow: false } : undefined,
  }
}

const compact = <T extends Record<string, unknown>>(value: T) =>
  Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined && v !== '' && v !== null))

/** Organization and WebSite data built only from fields that exist in the content. */
export function organizationGraph(content: SiteContent, locale: Locale, base: string) {
  const home = `${base}${localePath('/', locale)}`
  const social = content.contact.social.map((item) => item.url).filter(Boolean)

  return [
    compact({
      '@type': 'Organization',
      '@id': `${base}/#organization`,
      name: content.site.brand.name[locale],
      url: home,
      logo: absolute(content.site.brand.logo, base),
      description: content.seo.home.description[locale],
      telephone: content.contact.phone,
      email: content.contact.email,
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
