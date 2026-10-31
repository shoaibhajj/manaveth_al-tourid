import 'server-only'
import { defineQuery } from 'next-sanity'
import { sanityFetch } from './live'

const articleListQuery = defineQuery(`*[_type == "article" && visible != false && defined(slug.current)] | order(publishedAt desc){..., "slug": slug.current, "coverImage": coverImage{..., ar{..., "assetUrl": asset->url}, en{..., "assetUrl": asset->url}}}`)
const detailSitemapQuery = defineQuery(`{
  "products": *[_type == "product" && visible != false && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt},
  "services": *[_type == "service" && visible != false && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt},
  "articles": *[_type == "article" && visible != false && defined(slug.current)]{"slug": slug.current, "updatedAt": _updatedAt}
}`)

export async function getArticles(): Promise<Record<string, any>[]> {
  if (!sanityFetch) return []
  try {
    const { data } = await sanityFetch({ query: articleListQuery })
    return (data as Record<string, any>[]) ?? []
  } catch {
    return []
  }
}

export async function getDetailSlugs(): Promise<{ products: any[]; services: any[]; articles: any[] }> {
  if (!sanityFetch) return { products: [], services: [], articles: [] }
  try {
    const { data } = await sanityFetch({ query: detailSitemapQuery })
    const result = data as { products?: any[]; services?: any[]; articles?: any[] } | null
    return {
      products: Array.isArray(result?.products) ? result.products : [],
      services: Array.isArray(result?.services) ? result.services : [],
      articles: Array.isArray(result?.articles) ? result.articles : [],
    }
  } catch {
    return { products: [], services: [], articles: [] }
  }
}
