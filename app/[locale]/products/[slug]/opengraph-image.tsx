import { ImageResponse } from 'next/og'
import { getProductBySlug } from '@/lib/sanity/details'
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
  const product = await getProductBySlug(slug)

  const productName = product?.name?.[locale] || product?.name?.ar || 'منتج غذائي معتمد'
  const productSku = product?.sku || 'MNV-FOOD'
  const brandName = isAr ? 'شركة منافذ التوريد للتجارة' : 'Mnaveth ALTourid Trading Co.'
  const categoryName = product?.category?.name?.[locale] || product?.category?.name?.ar || (isAr ? 'أصناف تموينية معتمدة' : 'Foodservice Staples')

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

        {/* Top Bar: Brand & Verification */}
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
            {categoryName}
          </div>
        </div>

        {/* Middle Content: Product Title & SKU */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: 'auto 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.1)',
                color: '#a7f3d0',
                fontSize: '14px',
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              SKU: {productSku}
            </span>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              {isAr ? '• توريد فندقي ومطاعم بالجملة' : '• Certified Foodservice Wholesale'}
            </span>
          </div>

          <div
            style={{
              fontSize: '48px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.2,
              maxHeight: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {productName}
          </div>
        </div>

        {/* Bottom Bar: Trust Indicators */}
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
            <span>✓ {isAr ? 'مطابق لاشتراطات SFDA' : 'SFDA Compliant'}</span>
            <span>✓ {isAr ? 'أسطول مبرد ومجمد' : 'Cold Chain Fleet'}</span>
            <span>✓ {isAr ? 'عقود توريد شهرية وسنوية' : 'Annual Supply Contracts'}</span>
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
