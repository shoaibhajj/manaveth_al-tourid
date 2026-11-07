import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'

export const dynamic = 'force-dynamic'

export const defaultSectionsList = [
  {
    _key: 'sec-hero',
    _type: 'homeSectionConfig',
    key: 'hero',
    enabled: true,
    title: { _type: 'localizedString', ar: 'الواجهة الرئيسية (Hero)', en: 'Hero Section' },
  },
  {
    _key: 'sec-about',
    _type: 'homeSectionConfig',
    key: 'about',
    enabled: true,
    title: { _type: 'localizedString', ar: 'من نحن (About)', en: 'About Us' },
  },
  {
    _key: 'sec-news',
    _type: 'homeSectionConfig',
    key: 'news',
    enabled: true,
    title: { _type: 'localizedString', ar: 'نبض الشركة وآخر الأخبار (Company News)', en: 'Company News & Milestones' },
  },
  {
    _key: 'sec-services',
    _type: 'homeSectionConfig',
    key: 'services',
    enabled: true,
    title: { _type: 'localizedString', ar: 'الخدمات واللوجستيات (Services)', en: 'Supply & Logistics Services' },
  },
  {
    _key: 'sec-featured',
    _type: 'homeSectionConfig',
    key: 'featuredProducts',
    enabled: true,
    title: { _type: 'localizedString', ar: 'المنتجات المميزة (Featured Products)', en: 'Featured Products' },
  },
  {
    _key: 'sec-gallery',
    _type: 'homeSectionConfig',
    key: 'gallery',
    enabled: true,
    title: { _type: 'localizedString', ar: 'معرض الأعمال التفاعلي (Gallery)', en: 'Interactive Gallery' },
  },
  {
    _key: 'sec-stats',
    _type: 'homeSectionConfig',
    key: 'stats',
    enabled: true,
    title: { _type: 'localizedString', ar: 'الإحصائيات والأرقام (Stats)', en: 'Key Figures & Statistics' },
  },
  {
    _key: 'sec-sectors',
    _type: 'homeSectionConfig',
    key: 'sectors',
    enabled: true,
    title: { _type: 'localizedString', ar: 'القطاعات المستهدفة (Sectors)', en: 'Target Sectors' },
  },
  {
    _key: 'sec-branches',
    _type: 'homeSectionConfig',
    key: 'branches',
    enabled: true,
    title: { _type: 'localizedString', ar: 'الفروع والمستودعات (Branches)', en: 'Branches & Warehouses' },
  },
  {
    _key: 'sec-contact',
    _type: 'homeSectionConfig',
    key: 'contact',
    enabled: true,
    title: { _type: 'localizedString', ar: 'تواصل معنا وطلب التوريد (Contact)', en: 'Contact & Procurement' },
  },
]

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

  try {
    const updated = await client
      .patch('homePage')
      .set({ sectionsList: defaultSectionsList })
      .commit()

    return NextResponse.json({
      success: true,
      message: 'homePage.sectionsList successfully populated with all 10 default sections in drag-and-drop order!',
      sectionsCount: updated.sectionsList?.length || defaultSectionsList.length,
      sections: updated.sectionsList,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
