import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

export const dynamic = 'force-dynamic'

/**
 * Sanity Webhook Revalidation Endpoint (D2):
 * Accepts signed POST requests from Sanity on document publish/update/delete.
 * Verifies HMAC signature using SANITY_WEBHOOK_SECRET.
 * Automatically invalidates targeted tags and cached paths across both Arabic and English.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Server webhook secret not configured' }, { status: 500 })
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME)
  if (!signature) {
    return NextResponse.json({ error: 'Missing webhook signature header' }, { status: 401 })
  }

  const body = await request.text()
  const isValid = await isValidSignature(body, signature, secret)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  try {
    const payload = JSON.parse(body)
    const { _type, slug } = payload
    const slugCurrent = typeof slug === 'string' ? slug : slug?.current

    const revalidated: string[] = []

    // 1. Invalidate global site content
    try {
      revalidateTag('site')
      revalidated.push('tag:site')
    } catch {}

    // 2. Document-specific tag and path revalidation
    if (_type === 'product') {
      try {
        revalidateTag('products')
        revalidated.push('tag:products')
        if (slugCurrent) {
          revalidateTag(`product:${slugCurrent}`)
          revalidated.push(`tag:product:${slugCurrent}`)
        }
        if (payload.categoryId) {
          revalidateTag(`category:${payload.categoryId}`)
          revalidated.push(`tag:category:${payload.categoryId}`)
        }
      } catch {}

      // Invalidate relevant pages
      try {
        revalidatePath('/')
        revalidatePath('/ar')
        revalidatePath('/en')
        revalidatePath('/catalog')
        revalidatePath('/ar/catalog')
        revalidatePath('/en/catalog')
        revalidatePath('/products')
        revalidatePath('/ar/products')
        revalidatePath('/en/products')
        if (slugCurrent) {
          revalidatePath(`/products/${slugCurrent}`)
          revalidatePath(`/ar/products/${slugCurrent}`)
          revalidatePath(`/en/products/${slugCurrent}`)
        }
        revalidatePath('/sitemap.xml')
        revalidated.push('paths:home,catalog,products,sitemap')
      } catch {}
    } else if (_type === 'service') {
      try {
        revalidateTag('services')
        revalidated.push('tag:services')
        if (slugCurrent) {
          revalidateTag(`service:${slugCurrent}`)
          revalidated.push(`tag:service:${slugCurrent}`)
        }
      } catch {}

      try {
        revalidatePath('/')
        revalidatePath('/ar')
        revalidatePath('/en')
        if (slugCurrent) {
          revalidatePath(`/services/${slugCurrent}`)
          revalidatePath(`/ar/services/${slugCurrent}`)
          revalidatePath(`/en/services/${slugCurrent}`)
        }
        revalidatePath('/sitemap.xml')
        revalidated.push('paths:home,services,sitemap')
      } catch {}
    } else if (_type === 'article') {
      try {
        revalidateTag('articles')
        revalidated.push('tag:articles')
        if (slugCurrent) {
          revalidateTag(`article:${slugCurrent}`)
          revalidated.push(`tag:article:${slugCurrent}`)
        }
      } catch {}

      try {
        revalidatePath('/')
        revalidatePath('/ar')
        revalidatePath('/en')
        revalidatePath('/blog')
        revalidatePath('/ar/blog')
        revalidatePath('/en/blog')
        if (slugCurrent) {
          revalidatePath(`/blog/${slugCurrent}`)
          revalidatePath(`/ar/blog/${slugCurrent}`)
          revalidatePath(`/en/blog/${slugCurrent}`)
        }
        revalidatePath('/sitemap.xml')
        revalidated.push('paths:home,blog,sitemap')
      } catch {}
    } else {
      // General layout / singleton changes
      try {
        revalidateTag('home')
        revalidateTag('sections')
        revalidatePath('/')
        revalidatePath('/ar')
        revalidatePath('/en')
        revalidatePath('/sitemap.xml')
        revalidated.push('paths:home,layout,sitemap')
      } catch {}
    }

    return NextResponse.json({
      success: true,
      type: _type,
      slug: slugCurrent || null,
      revalidated,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process webhook body' }, { status: 400 })
  }
}
