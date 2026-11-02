import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { batch1Articles } from '@/lib/content/articles-data'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const key = url.searchParams.get('key')
  if (key !== 'mnaveth2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSanityConfigured) {
    return NextResponse.json({ error: 'Sanity is not configured' }, { status: 500 })
  }

  const token =
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_API_READ_TOKEN_2 ||
    process.env.SANITY_API_READ_TOKEN

  if (!token) {
    return NextResponse.json({ error: 'Write token not found in environment' }, { status: 500 })
  }

  const client = createClient({
    projectId: sanityEnv.projectId,
    dataset: sanityEnv.dataset,
    apiVersion: sanityEnv.apiVersion,
    useCdn: false,
    token,
  })

  const results: any[] = []
  for (const article of batch1Articles) {
    try {
      const doc = await client.createOrReplace(article as any)
      results.push({ id: doc._id, slug: article.slug.current, status: 'synced' })
    } catch (err: any) {
      results.push({ id: article._id, slug: article.slug.current, status: 'error', message: err.message })
    }
  }

  return NextResponse.json({
    success: true,
    total: batch1Articles.length,
    results,
  })
}

export async function POST(request: Request) {
  return GET(request)
}
