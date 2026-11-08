import 'server-only'
import { defineQuery } from 'next-sanity'
import { allArticles } from '../content/articles-data'
import { products as fallbackProducts } from '../content/products'
import { services as fallbackServices } from '../content/services'
import { sanityFetch } from './live'

export function resolveArticleSlug(article: any): string {
  if (!article) return ''
  const s = article.slug
  if (typeof s === 'string' && s.trim() && s !== 'undefined') return s.trim()
  if (s && typeof s.current === 'string' && s.current.trim() && s.current !== 'undefined') return s.current.trim()
  if (typeof article._id === 'string' && article._id.trim()) {
    const cleanId = article._id.replace(/^drafts\./, '').replace(/^article-/, '')
    if (cleanId && cleanId !== 'undefined') return cleanId
  }
  return ''
}

function normalizeArticleItem(a: any): Record<string, any> {
  const slug = resolveArticleSlug(a)
  return {
    ...a,
    slug,
  }
}

const articleListQuery = defineQuery(`*[_type == "article" && visible != false && defined(slug.current)] | order(publishedAt desc){..., "slug": slug.current, "coverImage": coverImage{..., ar{..., "assetUrl": asset->url}, en{..., "assetUrl": asset->url}}}`)
const detailSitemapQuery = defineQuery(`{
  "products": *[_type == "product" && visible != false && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt},
  "services": *[_type == "service" && visible != false && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt},
  "articles": *[_type == "article" && visible != false && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt}
}`)

export async function getArticles(): Promise<Record<string, any>[]> {
  const fallbackList = allArticles
    .map(normalizeArticleItem)
    .filter((a) => a.slug && a.slug !== 'oli1' && a.slug !== 'undefined')

  if (!sanityFetch) return fallbackList
  try {
    const { data } = await sanityFetch({ query: articleListQuery, tags: ['articles'] })
    const list = ((data as Record<string, any>[]) ?? [])
      .map(normalizeArticleItem)
      .filter((a) => a.slug && a.slug !== 'oli1' && a.slug !== 'undefined')
    const existingSlugs = new Set(list.map((a) => a.slug))
    const missing = fallbackList.filter((a) => !existingSlugs.has(a.slug))
    return [...list, ...missing]
  } catch {
    return fallbackList
  }
}

export async function getDetailSlugs(): Promise<{ products: any[]; services: any[]; articles: any[] }> {
  const fallbackArticles = allArticles
    .map(normalizeArticleItem)
    .filter((a) => a.slug && a.slug !== 'oli1' && a.slug !== 'undefined')
    .map((a) => ({ slug: a.slug, updatedAt: a.publishedAt }))

  const fallbackProds = fallbackProducts.map((p) => ({ slug: p.slug || p.id, updatedAt: p.updatedAt }))
  const fallbackServs = fallbackServices.map((s) => ({ slug: s.id, updatedAt: undefined }))

  if (!sanityFetch) return { products: fallbackProds, services: fallbackServs, articles: fallbackArticles }
  try {
    const { data } = await sanityFetch({ query: detailSitemapQuery, tags: ['products', 'services', 'articles'] })
    const result = data as { products?: any[]; services?: any[]; articles?: any[] } | null
    const sanProducts = Array.isArray(result?.products) && result.products.length > 0 ? result.products : fallbackProds
    const sanServices = Array.isArray(result?.services) && result.services.length > 0 ? result.services : fallbackServs
    const sanArticles = (Array.isArray(result?.articles) ? result.articles : [])
      .map(normalizeArticleItem)
      .filter((a: any) => a?.slug && a.slug !== 'oli1' && a.slug !== 'undefined')
    const existingSlugs = new Set(sanArticles.map((a: any) => a?.slug))
    const missing = fallbackArticles.filter((a) => !existingSlugs.has(a.slug))
    return {
      products: sanProducts,
      services: sanServices,
      articles: [...sanArticles, ...missing],
    }
  } catch {
    return { products: fallbackProds, services: fallbackServs, articles: fallbackArticles }
  }
}
