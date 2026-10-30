import type { MetadataRoute } from 'next'
import { localePath, locales, publicPaths } from '@/lib/i18n'
import { getSiteUrl } from '@/lib/site-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = await getSiteUrl()
  const urlFor = (path: string, locale: (typeof locales)[number]) => `${base}${localePath(path, locale)}`

  return publicPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: urlFor(path, locale),
      alternates: {
        languages: { ar: urlFor(path, 'ar'), en: urlFor(path, 'en'), 'x-default': urlFor(path, 'ar') },
      },
    })),
  )
}
