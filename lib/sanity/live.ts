import 'server-only'
import { createClient } from 'next-sanity'
import { defineLive } from 'next-sanity/live'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'

const serverToken =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_READ_TOKEN_2 ||
  process.env.SANITY_API_READ_TOKEN

const browserToken = process.env.SANITY_API_READ_TOKEN_2 || process.env.SANITY_API_READ_TOKEN || false

const client = isSanityConfigured
  ? createClient({
      projectId: sanityEnv.projectId,
      dataset: sanityEnv.dataset,
      apiVersion: sanityEnv.apiVersion,
      useCdn: true,
      perspective: 'published',
      stega: { studioUrl: '/studio' },
    })
  : null

const live = client
  ? defineLive({
      client,
      // On the server, draft queries use serverToken.
      // browserToken only receives a read token or false so write tokens are never exposed in the browser.
      serverToken: serverToken || false,
      browserToken,
    })
  : null

export const sanityFetch = live?.sanityFetch ?? null
export const SanityLive = live?.SanityLive ?? null
export const hasDraftToken = Boolean(serverToken)
