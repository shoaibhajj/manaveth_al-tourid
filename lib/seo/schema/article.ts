import type { Locale } from '@/lib/i18n'
import { compact, t, absoluteUrl } from './helpers'

export function buildArticleSchema(article: any, locale: Locale, base: string) {
  const isAr = locale === 'ar'
  const slug = article.slug?.current || article.slug || ''
  const articleUrl = `${base}${isAr ? '' : '/en'}/blog/${slug}`
  const coverImage = article.coverImage?.assetUrl || article.coverImage?.ar?.assetUrl

  const authorName =
    article.author?.name ||
    (isAr ? 'فريق التحرير - شركة منافذ التوريد' : 'Editorial Team - Mnaveth ALTourid')

  return compact({
    '@type': 'Article',
    '@id': `${articleUrl}#article`,
    url: articleUrl,
    headline: t(article.title, locale),
    description: t(article.excerpt, locale),
    datePublished: article.publishedAt || article._createdAt,
    dateModified: article._updatedAt || article.publishedAt,
    image: coverImage ? [absoluteUrl(coverImage, base)] : undefined,
    author: {
      '@type': 'Person',
      name: authorName,
    },
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
