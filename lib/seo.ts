import 'server-only'
import type { Metadata } from 'next'
import { localePath, locales, type Locale } from './i18n'
import type { SiteContent } from './content/model'
import { getContent } from './sanity/get-content'
import { getSiteUrl } from './site-url'
import { buildMetadata } from './seo/build-metadata'
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
  buildBranchSchema,
  buildProductSchema,
  buildServiceSchema,
  buildArticleSchema,
  buildBreadcrumbSchema,
  compact,
} from './seo/schema'

export type SeoPage = 'home' | 'products' | 'branches'

const pagePaths: Record<SeoPage, string> = { home: '/', products: '/products', branches: '/branches' }

const absolute = (value: string | undefined, base: string) => (value ? new URL(value, base).toString() : undefined)

/** Title, description, canonical, language alternates and share image for one public page, read from the SEO documents. */
export async function pageMetadata(page: SeoPage, locale: Locale = 'ar'): Promise<Metadata> {
  const [content, base] = await Promise.all([getContent(), getSiteUrl()])
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

/** Organization, WebSite, and physical branches linked via unified @id (G1, G2) */
export function organizationGraph(content: SiteContent, locale: Locale, base: string) {
  const org = buildOrganizationSchema(content.site, locale, base)
  const website = buildWebsiteSchema(base, locale)

  const branchStores = (content.branches || []).map((branch) =>
    buildBranchSchema(branch, locale, base)
  )

  return [org, website, ...branchStores]
}

/** Product catalog entries */
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
      })
    )
}

/** Single product detail schema with Brand, SKU, Offer and Breadcrumbs (G1) */
export function productDetailGraph(
  product: Record<string, any>,
  locale: Locale,
  base: string,
  _siteName = 'منافذ التوريد'
) {
  const productSchema = buildProductSchema(product, locale, base)
  const name = product.name?.[locale] || product.name?.ar || product.name?.en || ''
  const slug = product.slug || product.id
  const productUrl = `${base}${localePath(`/products/${slug}`, locale)}`

  const breadcrumbs = buildBreadcrumbSchema(
    [
      { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: '/' },
      { name: locale === 'ar' ? 'المنتجات' : 'Products', url: '/products' },
      { name, url: `/products/${slug}` },
    ],
    base
  )

  return [
    productSchema,
    {
      ...breadcrumbs,
      '@id': `${productUrl}#breadcrumbs`,
    },
  ]
}

/** Single article detail schema (G1) */
export function articleDetailGraph(
  article: Record<string, any>,
  locale: Locale,
  base: string,
  _siteName = 'منافذ التوريد'
) {
  return [buildArticleSchema(article, locale, base)]
}

/** Single service detail schema (G1) */
export function serviceDetailGraph(
  service: Record<string, any>,
  locale: Locale,
  base: string,
  _siteName = 'منافذ التوريد'
) {
  return [buildServiceSchema(service, locale, base)]
}

export const allLocales = locales
