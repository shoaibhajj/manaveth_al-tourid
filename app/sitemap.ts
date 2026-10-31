import type { MetadataRoute } from 'next'
import { localePath, locales, publicPaths } from '@/lib/i18n'
import { getDetailSlugs } from '@/lib/sanity/articles'
import { getSiteUrl } from '@/lib/site-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [base, details] = await Promise.all([getSiteUrl(), getDetailSlugs()])
  const urlFor = (path: string, locale: (typeof locales)[number]) => `${base}${localePath(path, locale)}`
  const staticEntries = publicPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: urlFor(path, locale),
      alternates: {
        languages: { ar: urlFor(path, 'ar'), en: urlFor(path, 'en'), 'x-default': urlFor(path, 'ar') },
      },
    })),
  )
  const products = Array.isArray(details?.products) ? details.products : []
  const services = Array.isArray(details?.services) ? details.services : []
  const articles = Array.isArray(details?.articles) ? details.articles : []

  const dynamicEntries = [
    ...products.filter((p) => p?.slug).map((item) => ({ path: `/products/${item.slug}`, updatedAt: item.updatedAt })),
    ...services.filter((s) => s?.slug).map((item) => ({ path: `/services/${item.slug}`, updatedAt: item.updatedAt })),
    ...articles.filter((a) => a?.slug).map((item) => ({ path: `/blog/${item.slug}`, updatedAt: item.updatedAt })),
  ].flatMap(({ path, updatedAt }) =>
    locales.map((locale) => ({
      url: urlFor(path, locale),
      lastModified: updatedAt ? new Date(updatedAt) : undefined,
      alternates: {
        languages: { ar: urlFor(path, 'ar'), en: urlFor(path, 'en'), 'x-default': urlFor(path, 'ar') },
      },
    })),
  )
  return [...staticEntries, ...dynamicEntries]
}
