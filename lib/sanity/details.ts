import 'server-only'
import { sanityFetch } from './live'
import { articleBySlugQuery, productBySlugQuery, serviceBySlugQuery } from './queries'

export type DetailDocument = Record<string, any> | null

async function fetchDetail(query: string, slug: string): Promise<DetailDocument> {
  if (!sanityFetch) return null
  const { data } = await sanityFetch({ query, params: { slug } })
  return (data as DetailDocument) ?? null
}

export const getProductBySlug = (slug: string) => fetchDetail(productBySlugQuery, slug)
export const getServiceBySlug = (slug: string) => fetchDetail(serviceBySlugQuery, slug)
export const getArticleBySlug = (slug: string) => fetchDetail(articleBySlugQuery, slug)
