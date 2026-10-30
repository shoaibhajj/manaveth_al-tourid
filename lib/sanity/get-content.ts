import 'server-only'
import { cache } from 'react'
import { staticContent, type SiteContent } from '../content/model'
import { normalizeContent } from './normalize'
import { sanityFetch } from './live'
import { siteContentQuery } from './queries'

/**
 * Loads the public site content once per request. Any problem (missing config, network, empty dataset)
 * falls back to the built-in copy so the website never goes blank.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  if (!sanityFetch) return staticContent
  try {
    const { data } = await sanityFetch({ query: siteContentQuery })
    return normalizeContent(data as Parameters<typeof normalizeContent>[0])
  } catch (error) {
    console.error('Sanity content could not be loaded, using built-in content.', error)
    return staticContent
  }
})
