import 'server-only'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { localePath, locales, type Locale } from './i18n'
import type { SiteContent } from './content/model'
import { getLocale } from './locale-server'
import { getContent } from './sanity/get-content'
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

export const allLocales = locales
