import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'
import { initialCompanyPosts } from '@/lib/content/company-news'

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
  for (let i = 0; i < initialCompanyPosts.length; i++) {
    const post = initialCompanyPosts[i]
    const doc = {
      _id: post.id,
      _type: 'companyPost',
      title: { _type: 'localizedString', ...post.title },
      slug: { _type: 'slug', current: post.slug },
      badge: { _type: 'localizedString', ...post.badge },
      badgeType: post.badgeType,
      pinned: Boolean(post.pinned),
      publishedAt: post.publishedAt,
      author: { _type: 'localizedString', ...post.author },
      excerpt: { _type: 'localizedText', ...post.excerpt },
      body: post.body.map((p) => ({ _type: 'localizedText', ...p })),
      highlights: (post.highlights || []).map((h) => ({ _type: 'localizedString', ...h })),
      initialLikes: post.initialLikes,
      visible: true,
      order: i,
      comments: post.initialComments.map((c) => ({
        _key: c.id,
        commentId: c.id,
        author: c.author,
        role: c.role || '',
        text: c.text,
        rating: c.rating || 5,
        date: c.date,
      })),
    }

    try {
      const res = await client.createOrReplace(doc)
      results.push({ id: res._id, title: post.title.ar, status: 'synced' })
    } catch (err: any) {
      results.push({ id: post.id, status: 'error', message: err.message })
    }
  }

  return NextResponse.json({
    success: true,
    total: initialCompanyPosts.length,
    results,
  })
}
