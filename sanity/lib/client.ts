import { createClient, type SanityClient } from 'next-sanity'
import { isSanityConfigured, sanityEnv } from '../env'

let client: SanityClient | undefined

/**
 * Read-only client for the Studio and for tooling.
 * It is created lazily so the project still builds before Sanity is configured.
 * Website pages must not import it until phase 3.
 */
export function getSanityClient(): SanityClient {
  if (!isSanityConfigured) {
    throw new Error(
      'Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET (see .env.example).',
    )
  }

  client ??= createClient({
    projectId: sanityEnv.projectId,
    dataset: sanityEnv.dataset,
    apiVersion: sanityEnv.apiVersion,
    useCdn: false,
  })

  return client
}
