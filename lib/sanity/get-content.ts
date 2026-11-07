import 'server-only'
import { cache } from 'react'
import { staticContent, staticLayoutContent, type LayoutContent, type SiteContent } from '../content/model'
import { normalizeContent, normalizeLayoutContent } from './normalize'
import { sanityFetch } from './live'
import { layoutContentQuery, siteContentQuery } from './queries'

/**
 * Loads minimal layout content (Header, Footer, navigation, brand) for the outer shell.
 * This keeps the RSC payload across all static pages minimal.
 */
export const getLayoutContent = cache(async (): Promise<LayoutContent> => {
  if (!sanityFetch) return staticLayoutContent
  try {
    const { data } = await sanityFetch({
      query: layoutContentQuery,
      tags: ['site', 'layout'],
    })
    return normalizeLayoutContent(data as Parameters<typeof normalizeLayoutContent>[0])
  } catch (error) {
    console.error('Sanity layout content could not be loaded, using built-in layout content.', error)
    return staticLayoutContent
  }
})

/**
 * Loads the public site content once per request. Any problem (missing config, network, empty dataset)
 * falls back to the built-in copy so the website never goes blank.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  if (!sanityFetch) return staticContent
  try {
    const { data } = await sanityFetch({
      query: siteContentQuery,
      tags: ['site', 'home', 'sections', 'products', 'services', 'branches'],
    })
    return normalizeContent(data as Parameters<typeof normalizeContent>[0])
  } catch (error) {
    console.error('Sanity content could not be loaded, using built-in content.', error)
    return staticContent
  }
})
