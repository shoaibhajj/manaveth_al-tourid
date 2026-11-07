import 'server-only'
import { draftMode } from 'next/headers'
import { allArticles } from '../content/articles-data'
import { products as fallbackProducts } from '../content/products'
import { defaultCatalogProducts } from '../content/catalog-data'
import { sanityFetch } from './live'
import {
  articleBySlugDraftQuery,
  articleBySlugQuery,
  productBySlugDraftQuery,
  productBySlugQuery,
  serviceBySlugDraftQuery,
  serviceBySlugQuery,
} from './queries'

export type DetailDocument = Record<string, any> | null

async function fetchDetail(query: string, draftQuery: string, slug: string): Promise<DetailDocument> {
  if (!sanityFetch) return null
  try {
    const { isEnabled } = await draftMode()
    const targetQuery = isEnabled ? draftQuery : query
    const { data } = await sanityFetch({ query: targetQuery, params: { slug } })
    return (data as DetailDocument) ?? null
  } catch {
    const { data } = await sanityFetch({ query, params: { slug } })
    return (data as DetailDocument) ?? null
  }
}

export const getProductBySlug = async (slug: string) => {
  const fromSanity = await fetchDetail(productBySlugQuery, productBySlugDraftQuery, slug)
  if (fromSanity) return fromSanity

  const fromDefault = fallbackProducts.find((p) => p.slug === slug || p.id === slug)
  if (fromDefault) return fromDefault

  const cleanSlug = slug.toLowerCase().trim()
  const fromCatalog = defaultCatalogProducts.find(
    (p) =>
      p.id.toLowerCase() === cleanSlug ||
      (p.sku && p.sku.toLowerCase() === cleanSlug) ||
      (p.sku && p.sku.toLowerCase().replace(/[^\w]/g, '-') === cleanSlug)
  )
  if (fromCatalog) {
    return {
      _id: fromCatalog.id,
      name: fromCatalog.name,
      slug: { current: fromCatalog.sku || fromCatalog.id },
      description: fromCatalog.description,
      longDescription: fromCatalog.description,
      origin: fromCatalog.origin,
      packaging: fromCatalog.packaging,
      storage: fromCatalog.storage,
      certifications: fromCatalog.certifications,
      usage: fromCatalog.usage,
      image: fromCatalog.image,
    }
  }
  return null
}

export const getServiceBySlug = (slug: string) => fetchDetail(serviceBySlugQuery, serviceBySlugDraftQuery, slug)
export const getArticleBySlug = async (slug: string) => {
  const fromSanity = await fetchDetail(articleBySlugQuery, articleBySlugDraftQuery, slug)
  if (fromSanity) return fromSanity
  const fallback = allArticles.find((a) => a.slug.current === slug)
  return (fallback as unknown as DetailDocument) ?? null
}
