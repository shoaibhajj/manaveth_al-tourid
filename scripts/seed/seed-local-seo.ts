import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const key = url.searchParams.get('key')
  const adminSecret = process.env.ADMIN_API_SECRET
  if (!adminSecret || key !== adminSecret) {
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

  // 3. Update seoHome Founding Year to 2004
  try {
    const seoHomeDoc = await client
      .patch('seoHome')
      .set({
        title: {
          _type: 'localizedString',
          ar: 'منافذ التوريد | شريكك الموثوق في توريد المواد الغذائية منذ 2004',
          en: 'Mnaveth ALTourid | Your trusted partner in food supply since 2004',
        },
      })
      .commit()
    results.push({ id: seoHomeDoc._id, status: 'updated' })
  } catch (err: any) {
    results.push({ id: 'seoHome', status: 'error', message: err.message })
  }

  // 4. Update siteSettings defaultSeo to 2004
  try {
    const siteSettingsDoc = await client
      .patch('siteSettings')
      .set({
        'defaultSeo.title': {
          _type: 'localizedString',
          ar: 'منافذ التوريد | شريكك الموثوق في توريد المواد الغذائية منذ 2004',
          en: 'Mnaveth ALTourid | Your trusted partner in food supply since 2004',
        },
        'defaultSeo.shareImage.alt': {
          _type: 'localizedString',
          ar: '**منافذ التوريد التجارية | Mnaveth ALTourid** منذ 2004، نمدّ أعمالكم بمنتجات غذائية عالية الجودة، وشراكات عالمية، وحلول توريد موثوقة تلبي تطلعات المطاعم والفنادق وتجار الجملة. **منافذ التوريد – توريد يُعتمد عليه منذ 2004.** 🌐 mnaveth-altourid.com',
          en: '**Mnaveth ALTourid | Commercial Trading** Since 2004, we have been delivering premium-quality food products through trusted global partnerships and reliable supply solutions, serving wholesalers, restaurants, and hotels. **Mnaveth ALTourid – Supply You Can Rely On Since 2004.** 🌐 mnaveth-altourid.com',
        },
      })
      .commit()
    results.push({ id: siteSettingsDoc._id, status: 'updated' })
  } catch (err: any) {
    results.push({ id: 'siteSettings', status: 'error', message: err.message })
  }

  return NextResponse.json({
    success: true,
    results,
  })
}
