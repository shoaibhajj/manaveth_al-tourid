import 'server-only'
import { allArticles } from '../content/articles-data'
import { products as fallbackProducts } from '../content/products'
import { services as fallbackServices } from '../content/services'
import { isSanityConfigured } from '@/sanity/env'
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

async function fetchDetail(query: string, draftQuery: string, slug: string, tags: string[] = []): Promise<DetailDocument> {
  if (!sanityFetch) return null
  try {
    const { data } = await sanityFetch({ query, params: { slug }, tags })
    return (data as DetailDocument) ?? null
  } catch {
    return null
  }
}

/**
 * F1: Sanity is the SINGLE source of truth for products.
 * If a product does not exist in Sanity (or is hidden/deleted), return null -> 404.
 * Fallback to static files only if Sanity is not configured at all.
 */
export const getProductBySlug = async (slug: string) => {
  const fromSanity = await fetchDetail(productBySlugQuery, productBySlugDraftQuery, slug, ['products', `product:${slug}`])
  if (fromSanity) return fromSanity

  if (isSanityConfigured) {
    return null
  }

  // Local offline development fallback only when no Sanity credentials exist
  const fromDefault = fallbackProducts.find((p) => p.slug === slug || p.id === slug)
  if (fromDefault) return fromDefault

  return null
}

export const getServiceBySlug = async (slug: string) => {
  const fromSanity = await fetchDetail(serviceBySlugQuery, serviceBySlugDraftQuery, slug, ['services', `service:${slug}`])
  if (fromSanity) return fromSanity
  if (isSanityConfigured) return null
  const fromDefault = fallbackServices.find((s) => s.id === slug)
  if (!fromDefault) return null
  return {
    ...fromDefault,
    name: fromDefault.title,
    description: fromDefault.text,
    longDescription: fromDefault.text,
  } as unknown as DetailDocument
}

export const getArticleBySlug = async (slug: string) => {
  if (slug === 'oli1') return null
  const fromSanity = await fetchDetail(articleBySlugQuery, articleBySlugDraftQuery, slug, ['articles', `article:${slug}`])
  if (fromSanity) return fromSanity
  if (isSanityConfigured) return null
  const fallback = allArticles.find((a) => a.slug.current === slug)
  return (fallback as unknown as DetailDocument) ?? null
}
