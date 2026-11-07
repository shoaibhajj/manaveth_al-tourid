import { ImageResponse } from 'next/og'
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const isAr = locale === 'ar'

  const title = isAr
    ? 'توريد اللحوم المجمدة بالجملة في السعودية'
    : 'Wholesale Frozen Meat Supply in Saudi Arabia'
  const subtitle = isAr
    ? 'للمطاعم والفنادق ومطابخ الإعاشة · شهادات حلال · رقابة الغذاء والدواء SFDA'
    : 'Commercial foodservice, hotels & catering · 100% Halal · SFDA Inspected'
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
          background: 'linear-gradient(135deg, #091a13 0%, #112d22 50%, #1e4536 100%)',
          color: '#ffffff',
          padding: '60px',
          direction: isAr ? 'rtl' : 'ltr',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Accent Bar */}
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

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #d4af37, #aa8528)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#071e18',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              م
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#f3e5ab' }}>
                {brandName}
              </span>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                سجل تجاري 1116011768 · مستودعات مبردة مرخصة SFDA
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            سلسلة تبريد -18°م
          </div>
        </div>

        {/* Center Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1000px' }}>
          <h1
            style={{
              fontSize: '52px',
              fontWeight: 'bold',
              lineHeight: 1.2,
              color: '#ffffff',
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '24px',
              lineHeight: 1.4,
              color: '#cbd5e1',
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Footer badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ fontSize: '16px', color: '#f8fafc', fontWeight: '600' }}>
              🥩 لحم بقر وضأن وكبدة
            </span>
            <span style={{ fontSize: '16px', color: '#f8fafc', fontWeight: '600' }}>
              📍 الرياض · جدة · مكة المكرمة
            </span>
            <span style={{ fontSize: '16px', color: '#f8fafc', fontWeight: '600' }}>
              📦 كراتين جملة 20 و 25 كجم
            </span>
          </div>

          <span style={{ fontSize: '15px', color: '#d4af37', fontWeight: 'bold' }}>
            mnaveth.com/meat-supply
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
