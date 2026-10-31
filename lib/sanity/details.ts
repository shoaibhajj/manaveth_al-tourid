import 'server-only'
import { draftMode } from 'next/headers'
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

export const getProductBySlug = (slug: string) => fetchDetail(productBySlugQuery, productBySlugDraftQuery, slug)
export const getServiceBySlug = (slug: string) => fetchDetail(serviceBySlugQuery, serviceBySlugDraftQuery, slug)
export const getArticleBySlug = (slug: string) => fetchDetail(articleBySlugQuery, articleBySlugDraftQuery, slug)
