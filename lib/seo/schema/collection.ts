import type { Locale } from '@/lib/i18n'
import { compact, absoluteUrl } from './helpers'

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[],
  base: string
) {
  return compact({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url, base),
    })),
  })
}

export function buildItemListSchema(
  title: string,
  description: string,
  items: { name: string; url: string; image?: string }[],
  base: string
) {
  return compact({
    '@type': 'ItemList',
    name: title,
    description: description || undefined,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) =>
      compact({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.url, base),
        image: item.image ? absoluteUrl(item.image, base) : undefined,
      })
    ),
  })
}
