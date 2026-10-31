import { createClient } from 'next-sanity'
import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'

const token =
  process.env.SANITY_API_READ_TOKEN_2 ||
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_API_WRITE_TOKEN

const handler =
  isSanityConfigured && token
    ? defineEnableDraftMode({
        client: createClient({
          projectId: sanityEnv.projectId,
          dataset: sanityEnv.dataset,
          apiVersion: sanityEnv.apiVersion,
          useCdn: false,
          token,
        }),
      })
    : null

export async function GET(request: Request) {
  if (!handler) return new Response('Draft preview is not configured.', { status: 404 })
  return handler.GET(request as never)
}
