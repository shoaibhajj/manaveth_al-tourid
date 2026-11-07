import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'
import { defaultSectionsList } from '@/lib/content/default-sections'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const key = url.searchParams.get('key')
  if (key !== 'mnaveth2026') {
    return new Response(
      `<!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head><meta charset="utf-8"/><title>غير مصرح</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:50px;">
          <h2>مفتاح الوصول غير صحيح</h2>
          <p>يرجى استخدام الرابط الصحيح لإعادة ضبط الأقسام.</p>
        </body>
      </html>`,
      { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    )
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
    // Patch published document
    await client
      .patch('homePage')
      .set({ sectionsList: defaultSectionsList })
      .commit()

    // Also patch draft document if it exists so there's no conflict
    try {
      await client
        .patch('drafts.homePage')
        .set({ sectionsList: defaultSectionsList })
        .commit()
    } catch {
      // Draft might not exist, ignore
    }

    const acceptsHtml = request.headers.get('accept')?.includes('text/html')
    if (acceptsHtml) {
      return new Response(
        `<!DOCTYPE html>
        <html dir="rtl" lang="ar">
          <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>تمت استعادة الأقسام بنجاح | منافذ التوريد</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; background: #071e18; color: #fbf8f2; text-align: center; padding: 40px 20px; }
              .card { max-width: 600px; margin: 40px auto; background: #0d2b24; border: 1px solid #d4af37; border-radius: 20px; padding: 35px 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
              h1 { color: #d4af37; font-size: 24px; margin-bottom: 15px; }
              p { color: #e2e8f0; line-height: 1.8; font-size: 15px; }
              .list { text-align: right; background: rgba(0,0,0,0.25); border-radius: 12px; padding: 15px 25px; margin: 25px 0; font-size: 13px; line-height: 2; }
              .btn { display: inline-block; background: #d4af37; color: #071e18; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin: 8px; transition: 0.2s; }
              .btn:hover { background: #e5c058; }
              .btn-outline { background: transparent; color: #d4af37; border: 1px solid #d4af37; }
              .btn-outline:hover { background: rgba(212,175,55,0.1); }
            </style>
          </head>
          <body>
            <div class="card">
              <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
              <h1>تمت استعادة الترتيب الافتراضي بنجاح!</h1>
              <p>تمت إعادة كافة أقسام الصفحة الرئيسية الـ 10 إلى ترتيبها وحالتها الأصلية مباشرة في Sanity والموقع.</p>
              <div class="list">
                1. الواجهة الرئيسية (Hero)<br/>
                2. من نحن (About)<br/>
                3. نبض الشركة وآخر الأخبار (Company News)<br/>
                4. الخدمات واللوجستيات (Services)<br/>
                5. المنتجات المميزة (Featured Products)<br/>
                6. معرض الأعمال التفاعلي (Gallery)<br/>
                7. الإحصائيات والأرقام (Stats)<br/>
                8. القطاعات المستهدفة (Sectors)<br/>
                9. الفروع والمستودعات (Branches)<br/>
                10. تواصل معنا وطلب التوريد (Contact)
              </div>
              <div>
                <a href="/studio" class="btn">العودة إلى Sanity Studio</a>
                <a href="/" class="btn btn-outline" target="_blank">مشاهدة الموقع</a>
              </div>
            </div>
          </body>
        </html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Sections order successfully reset to default!',
      sections: defaultSectionsList,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
