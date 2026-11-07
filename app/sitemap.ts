import type { MetadataRoute } from 'next'
import { localePath, locales, publicPaths } from '@/lib/i18n'
import { getDetailSlugs } from '@/lib/sanity/articles'
import { getContent } from '@/lib/sanity/get-content'
import { getSiteUrl } from '@/lib/site-url'
import { evaluateSeo } from '@/lib/seo/engine/evaluate'
import { catalogCategories } from '@/lib/content/catalog-data'

export const dynamic = 'force-static'

/**
 * E4: Sitemaps generator with clean separation by section:
 * - /sitemap/pages.xml (Static public routes and service detail pages)
 * - /sitemap/products.xml (Only eligible, high-quality products passing evaluateSeo)
 * - /sitemap/categories.xml (Foodservice product categories)
 * - /sitemap/articles.xml (Published blog and industry articles)
 */
export async function generateSitemaps() {
  return [
    { id: 'pages' },
    { id: 'products' },
    { id: 'categories' },
    { id: 'articles' },
  ]
}

export default async function sitemap(props?: {
  id?: string | Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const resolvedId = props?.id ? await Promise.resolve(props.id) : undefined
  const [base, details, content] = await Promise.all([
    getSiteUrl(),
    getDetailSlugs(),
    getContent(),
  ])

  const urlFor = (path: string, locale: (typeof locales)[number]) =>
    `${base}${localePath(path, locale)}`

  const makeAlternates = (path: string) => ({
    languages: {
      ar: urlFor(path, 'ar'),
      en: urlFor(path, 'en'),
      'x-default': urlFor(path, 'ar'),
    },
  })

  // 1. Pages & Services Sitemap
  const buildPagesSitemap = (): MetadataRoute.Sitemap => {
    const staticEntries = publicPaths.flatMap((path) =>
      locales.map((locale) => ({
        url: urlFor(path, locale),
        alternates: makeAlternates(path),
      }))
    )

    const services = Array.isArray(details?.services) ? details.services : []
    const serviceEntries = services
      .filter((s) => s?.slug)
      .flatMap((s) => {
        const path = `/services/${s.slug}`
        return locales.map((locale) => ({
          url: urlFor(path, locale),
          lastModified: s.updatedAt ? new Date(s.updatedAt) : undefined,
          alternates: makeAlternates(path),
        }))
      })

    return [...staticEntries, ...serviceEntries]
  }

  // 2. Eligible Products Sitemap (E3/E4: strictly excludes deficient/noindex products)
  const buildProductsSitemap = (): MetadataRoute.Sitemap => {
    const allProducts = content?.products || []

    const eligibleProducts = allProducts.filter((product) => {
      if (!product || !product.slug) return false
      // Exclude hidden products
      if ((product as any).visible === false) return false

      // Verify SEO data completeness
      const evaluation = evaluateSeo(product as any, 'ar')
      return evaluation.isIndexable
    })

    return eligibleProducts.flatMap((product) => {
      const path = `/products/${product.slug}`
      const imageUrl = typeof product.image === 'string' ? product.image : undefined

      return locales.map((locale) => ({
        url: urlFor(path, locale),
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        images: imageUrl ? [imageUrl] : undefined,
        alternates: makeAlternates(path),
      }))
    })
  }

  // 3. Product Categories Sitemap
  const buildCategoriesSitemap = (): MetadataRoute.Sitemap => {
    return catalogCategories.flatMap((category) => {
      const path = `/products/category/${category.id}`
      return locales.map((locale) => ({
        url: urlFor(path, locale),
        alternates: makeAlternates(path),
      }))
    })
  }

  // 4. Articles Sitemap
  const buildArticlesSitemap = (): MetadataRoute.Sitemap => {
    const articles = Array.isArray(details?.articles) ? details.articles : []
    return articles
      .filter((a) => a?.slug)
      .flatMap((a) => {
        const path = `/blog/${a.slug}`
        return locales.map((locale) => ({
          url: urlFor(path, locale),
          lastModified: a.updatedAt ? new Date(a.updatedAt) : undefined,
          alternates: makeAlternates(path),
        }))
      })
  }

  if (resolvedId === 'pages') return buildPagesSitemap()
  if (resolvedId === 'products') return buildProductsSitemap()
  if (resolvedId === 'categories') return buildCategoriesSitemap()
  if (resolvedId === 'articles') return buildArticlesSitemap()

  // Fallback for default request without id: combine all sections
  return [
    ...buildPagesSitemap(),
    ...buildProductsSitemap(),
    ...buildCategoriesSitemap(),
    ...buildArticlesSitemap(),
  ]
}
