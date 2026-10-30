import type { MetadataRoute } from 'next'
import { getSiteUrl, isIndexableEnvironment } from '@/lib/site-url'

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!isIndexableEnvironment()) return { rules: { userAgent: '*', disallow: '/' } }

  const base = await getSiteUrl()
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] },
    sitemap: `${base}/sitemap.xml`,
  }
}
