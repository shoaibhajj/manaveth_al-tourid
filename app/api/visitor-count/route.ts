import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'

export const dynamic = 'force-dynamic'
const documentId = 'visitorCounter'

function publicClient() {
  return createClient({
    projectId: sanityEnv.projectId ?? '',
    dataset: sanityEnv.dataset ?? '',
    apiVersion: sanityEnv.apiVersion,
    useCdn: false,
  })
}

async function getSettings(client: ReturnType<typeof createClient>) {
  try {
    return await client.fetch<{ totalVisits?: number; displayOffset?: number; enabled?: boolean } | null>(
      '*[_id == $id][0]{totalVisits, displayOffset, enabled}',
      { id: documentId },
    )
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  if (!isSanityConfigured) return NextResponse.json({ count: 0, enabled: false }, { status: 503 })

  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  if (origin && host) {
    try {
      const originHost = new URL(origin).host
      if (originHost !== host) {
        return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
    }
  }

  const client = publicClient()
  const cookie = request.headers.get('cookie') ?? ''
  const alreadyCounted = /(?:^|;\s*)site_visit_counted=1(?:;|$)/.test(cookie)
  const token = process.env.SANITY_API_WRITE_TOKEN
  let settings = await getSettings(client)

  let visitUpdated = false
  if (!alreadyCounted && token) {
    try {
      const writer = client.withConfig({ token, useCdn: false })
      await writer.createIfNotExists({
        _id: documentId,
        _type: 'visitorCounter',
        totalVisits: 0,
        displayOffset: 0,
        enabled: true,
      })
      await writer.patch(documentId).inc({ totalVisits: 1 }).commit()
      settings = await getSettings(client)
      visitUpdated = true
    } catch (error) {
      console.error('Failed to increment visitor counter:', error)
    }
  }

  const count = Math.max(0, Number(settings?.totalVisits ?? 0) + Number(settings?.displayOffset ?? 0))
  const headers = new Headers()
  if (visitUpdated) {
    headers.append(
      'Set-Cookie',
      `site_visit_counted=1; Path=/; Max-Age=1800; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
    )
  }
  return NextResponse.json({ count, enabled: settings?.enabled !== false }, { headers })
}
