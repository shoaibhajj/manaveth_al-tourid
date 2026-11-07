import { ImageResponse } from 'next/og'
import { catalogCategories } from '@/lib/content/catalog-data'
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug, locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const isAr = locale === 'ar'

  const category = catalogCategories.find((c) => c.id === slug)
  const categoryTitle = isAr
    ? category?.name.ar || 'قسم المنتجات التموينية'
    : category?.name.en || category?.name.ar || 'Wholesale Foodservice Category'
  const categoryDesc = isAr
    ? category?.description?.ar || 'دليل الأصناف التموينية المعتمدة لكبرى المطاعم والفنادق'
    : category?.description?.en || category?.description?.ar || 'Approved wholesale foodservice items'

  const brandName = isAr ? 'شركة منافذ التوريد للتجارة' : 'Mnaveth ALTourid Trading Co.'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #071e18 0%, #0d281e 50%, #16382b 100%)',
          color: '#ffffff',
          padding: '60px',
          direction: isAr ? 'rtl' : 'ltr',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Top Gold Border Accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #d4af37, #f3e5ab, #d4af37)',
          }}
        />

        {/* Top Bar: Brand */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#d4af37',
                color: '#071e18',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 900,
              }}
            >
              M
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#f3e5ab' }}>{brandName}</span>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                {isAr ? 'سجل تجاري: 1116011768 | الرياض - المملكة العربية السعودية' : 'CR: 1116011768 | Riyadh, Saudi Arabia'}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#d4af37',
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            {isAr ? 'كتالوج الأصناف المعتمدة' : 'Certified Food Catalog'}
          </div>
        </div>

        {/* Middle Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: 'auto 0' }}>
          <span style={{ fontSize: '16px', color: '#a7f3d0', fontWeight: 700 }}>
            {isAr ? 'الأصناف الغذائية والتموينية بالجملة' : 'Wholesale Foodservice Products'}
          </span>

          <div
            style={{
              fontSize: '52px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.2,
            }}
          >
            {categoryTitle}
          </div>

          <div
            style={{
              fontSize: '20px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.5,
              maxWidth: '900px',
            }}
          >
            {categoryDesc}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '24px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          <div style={{ display: 'flex', gap: '32px' }}>
            <span>✓ {isAr ? 'مستودعات مرخصة من هيئة الغذاء والدواء' : 'SFDA Licensed Warehouses'}</span>
            <span>✓ {isAr ? 'توصيل فوري لجميع مناطق المملكة' : 'Nationwide Fast Delivery'}</span>
          </div>

          <div style={{ color: '#d4af37', fontWeight: 800 }}>
            www.mnaveth-altourid.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
