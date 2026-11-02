import 'server-only'
import { defineQuery } from 'next-sanity'
import { allArticles } from '../content/articles-data'
import { sanityFetch } from './live'

const articleListQuery = defineQuery(`*[_type == "article" && visible != false && defined(slug.current)] | order(publishedAt desc){..., "slug": slug.current, "coverImage": coverImage{..., ar{..., "assetUrl": asset->url}, en{..., "assetUrl": asset->url}}}`)
const detailSitemapQuery = defineQuery(`{
  "products": *[_type == "product" && visible != false && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt},
  "services": *[_type == "service" && visible != false && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt},
  "articles": *[_type == "article" && visible != false && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt}
}`)

export async function getArticles(): Promise<Record<string, any>[]> {
  if (!sanityFetch) return allArticles as unknown as Record<string, any>[]
  try {
    const { data } = await sanityFetch({ query: articleListQuery })
    const list = (data as Record<string, any>[]) ?? []
    const existingSlugs = new Set(list.map((a) => a.slug))
    const missing = (allArticles as unknown as Record<string, any>[]).filter((a) => !existingSlugs.has(a.slug?.current || a.slug))
    return [...list, ...missing]
  } catch {
    return allArticles as unknown as Record<string, any>[]
  }
}

export async function getDetailSlugs(): Promise<{ products: any[]; services: any[]; articles: any[] }> {
  const fallbackArticles = allArticles.map((a) => ({ slug: a.slug.current, updatedAt: a.publishedAt }))
  if (!sanityFetch) return { products: [], services: [], articles: fallbackArticles }
  try {
    const { data } = await sanityFetch({ query: detailSitemapQuery })
    const result = data as { products?: any[]; services?: any[]; articles?: any[] } | null
    const sanArticles = Array.isArray(result?.articles) ? result.articles : []
    const existingSlugs = new Set(sanArticles.map((a: any) => a?.slug))
    const missing = fallbackArticles.filter((a) => !existingSlugs.has(a.slug))
    return {
      products: Array.isArray(result?.products) ? result.products : [],
      services: Array.isArray(result?.services) ? result.services : [],
      articles: [...sanArticles, ...missing],
    }
  } catch {
    return { products: [], services: [], articles: fallbackArticles }
  }
}
