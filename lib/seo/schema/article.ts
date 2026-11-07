import type { Locale } from '@/lib/i18n'
import { compact, t, absoluteUrl } from './helpers'

export function buildArticleSchema(article: any, locale: Locale, base: string) {
  const isAr = locale === 'ar'
  const slug = article.slug?.current || article.slug || ''
  const articleUrl = `${base}${isAr ? '' : '/en'}/blog/${slug}`
  const coverImage = article.coverImage?.assetUrl || article.coverImage?.ar?.assetUrl

  // Task P5: Organization by default for corporate/editorial authors, Person only for verified expert individual
  const isIndividualExpert = Boolean(article.author?.isPerson || article.author?.jobTitle)
  const author = isIndividualExpert
    ? compact({
        '@type': 'Person',
        name: article.author?.name || (isAr ? 'خبير التموين الغذائي' : 'Foodservice Procurement Specialist'),
        jobTitle: article.author?.jobTitle,
      })
    : {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: isAr ? 'شركة منافذ التوريد للتجارة' : 'Mnaveth ALTourid Trading Co.',
        url: base,
      }

  return compact({
    '@type': 'Article',
    '@id': `${articleUrl}#article`,
    url: articleUrl,
    headline: t(article.title, locale),
    description: t(article.excerpt, locale),
    datePublished: article.publishedAt || article._createdAt,
    dateModified: article._updatedAt || article.publishedAt,
    image: coverImage ? [absoluteUrl(coverImage, base)] : undefined,
    author,
    publisher: {
      '@type': 'Organization',
      '@id': `${base}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    about: Array.isArray(article.aboutEntities) && article.aboutEntities.length > 0
      ? article.aboutEntities.map((e: string) => ({ '@type': 'Thing', name: e }))
      : undefined,
    mentions: Array.isArray(article.mentionedEntities) && article.mentionedEntities.length > 0
      ? article.mentionedEntities.map((e: string) => ({ '@type': 'Thing', name: e }))
      : undefined,
    inLanguage: isAr ? 'ar-SA' : 'en-US',
  })
}
