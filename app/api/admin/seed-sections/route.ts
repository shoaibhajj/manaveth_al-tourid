import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'
import { defaultSectionsList } from '@/lib/content/default-sections'

export const dynamic = 'force-dynamic'

export { defaultSectionsList }

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
