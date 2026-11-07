import 'server-only'
import type { Metadata } from 'next'
import { localePath, type Locale } from '@/lib/i18n'
import { getSiteUrl, isIndexableEnvironment } from '@/lib/site-url'

export interface BuildMetadataParams {
  path: string
  locale: Locale
  title: string
  description: string
  image?: string
  isIndexable?: boolean
  type?: 'website' | 'article'
  keywords?: string[]
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}

/**
 * Unified metadata builder (F4):
 * Generates consistent, bulletproof metadata for all public routes:
 * - Proper canonical pointing to exact locale URL
 * - Mutual hreflang (ar, en, x-default)
 * - OpenGraph & Twitter with guaranteed 1200x630 share image
 * - Strict indexing controls (noindex on previews, local dev, or drafts)
 */
export async function buildMetadata({
  path,
  locale,
  title,
  description,
  image,
  isIndexable = true,
  type = 'website',
  keywords,
  publishedTime,
  modifiedTime,
  authors,
}: BuildMetadataParams): Promise<Metadata> {
  const base = await getSiteUrl()
  const isAr = locale === 'ar'
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  const canonicalUrl = `${base}${localePath(cleanPath, locale)}`
  const arUrl = `${base}${cleanPath}`
  const enUrl = `${base}/en${cleanPath}`

  // Default fallback branded image if not provided
  const shareImageUrl = image || `${base}/images/hero.png`
  const brandName = isAr ? 'شركة منافذ التوريد للتجارة' : 'Mnaveth ALTourid Trading Co.'

  const allowIndexing = isIndexable && isIndexableEnvironment()

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords && keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: arUrl,
        en: enUrl,
        'x-default': arUrl,
      },
    },
    openGraph: {
      type,
      title,
      description,
      url: canonicalUrl,
      siteName: brandName,
      locale: isAr ? 'ar_SA' : 'en_US',
      images: [
        {
          url: shareImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [shareImageUrl],
    },
    robots: allowIndexing
      ? {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        }
      : {
          index: false,
          follow: false,
        },
  }

  return metadata
}
