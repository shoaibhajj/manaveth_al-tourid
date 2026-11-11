import 'server-only'
import { createClient } from 'next-sanity'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'

/** Direct published-perspective Sanity client for static params and server-only GROQ queries. */
export const sanityServerClient = isSanityConfigured
  ? createClient({
      projectId: sanityEnv.projectId!,
      dataset: sanityEnv.dataset!,
      apiVersion: sanityEnv.apiVersion,
      useCdn: false,
      perspective: 'published',
      token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    })
  : null
