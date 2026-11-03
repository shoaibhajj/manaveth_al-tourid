import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
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

  // 1. Update Riyadh Branch NAP
  try {
    const riyadhDoc = await client
      .patch('place-riyadh')
      .set({
        phone: '+966509971699',
        aspectRatio: '1/1',
        imagePosition: 'top',
        imageFit: 'cover',
        address: {
          _type: 'localizedText',
          ar: 'مكتب شركة منافذ التوريد التجارية، طريق الحائر، الدار البيضاء، الرياض 14519، المملكة العربية السعودية',
          en: 'Mnaveth ALTourid Trading Office, Al Hair Road, Al Dar Al Baida, Riyadh 14519, Saudi Arabia',
        },
        mapQuery: 'طريق الحائر، الدار البيضاء، الرياض 14519 المملكة العربية السعودية',
        mapUrl: 'https://maps.app.goo.gl/51haFKyZQLDaHPaC8',
        reviewUrl: 'https://maps.app.goo.gl/51haFKyZQLDaHPaC8',
      })
      .commit()
    results.push({ id: riyadhDoc._id, status: 'updated' })
  } catch (err: any) {
    results.push({ id: 'place-riyadh', status: 'error', message: err.message })
  }

  // 2. Update / Align Jeddah Branch NAP
  try {
    const jeddahDoc = await client
      .patch('place-jeddah')
      .set({
        name: {
          _type: 'localizedString',
          ar: 'فرع جدة والمنطقة الغربية',
          en: 'Jeddah & Western Province Branch',
        },
        phone: '+966509971699',
        aspectRatio: '16/9',
        imagePosition: 'top',
        imageFit: 'cover',
        address: {
          _type: 'localizedText',
          ar: 'جدة، المملكة العربية السعودية',
          en: 'Jeddah, Saudi Arabia',
        },
        mapQuery: 'Jeddah, Saudi Arabia',
        mapUrl: 'https://maps.google.com/?q=21.5433,39.1728',
        reviewUrl: 'https://maps.google.com/?q=21.5433,39.1728',
      })
      .commit()
    results.push({ id: jeddahDoc._id, status: 'updated' })
  } catch (err: any) {
    results.push({ id: 'place-jeddah', status: 'error', message: err.message })
  }

  return NextResponse.json({
    success: true,
    results,
  })
}
