import React, { useMemo, useState } from 'react'
import { evaluateSeo } from '@/lib/seo/engine/evaluate'
import { buildProductSeo } from '@/lib/seo/engine/generator'
import type { ProductDoc, SiteSeoContext } from '@/lib/seo/engine/types'

interface ProductSeoPaneProps {
  document: {
    displayed: Record<string, any>
    draft: Record<string, any> | null
    published: Record<string, any> | null
    historical: Record<string, any> | null
  }
}

export function ProductSeoPane(props: ProductSeoPaneProps) {
  const [activeLang, setActiveLang] = useState<'ar' | 'en'>('ar')
  const displayed = props.document.displayed || {}

  const productDoc = useMemo((): ProductDoc => {
    return {
      slug: displayed.slug?.current || displayed.slug || '',
      sku: displayed.sku || '',
      name: displayed.name || { ar: '', en: '' },
      description: displayed.description,
      longDescription: displayed.longDescription,
      productType: displayed.productType,
      category: displayed.category,
      brand: displayed.brand,
      originCountries: displayed.originCountries,
      serviceAreas: displayed.serviceAreas,
      sectors: displayed.sectors,
      certificates: displayed.certificates,
      cuts: displayed.cuts,
      packSizes: displayed.packSizes,
      storageState: displayed.storageState,
      moq: displayed.moq,
      availability: displayed.availability,
      image: displayed.image,
      seo: displayed.seo,
      origin: displayed.origin,
      packaging: displayed.packaging,
      storage: displayed.storage,
      grainType: displayed.grainType,
      certifications: displayed.certifications,
      usage: displayed.usage,
      visible: displayed.visible,
    }
  }, [displayed])

  const siteContext = useMemo((): SiteSeoContext => {
    return {
      baseUrl:
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mnaveth-altourid.com',
      brandName: {
        ar: 'شركة منافذ التوريد',
        en: 'Mnaveth ALTourid Trading Co.',
      },
    }
  }, [])

  // 1. Evaluate completeness
  const evaluation = useMemo(() => {
    return evaluateSeo(productDoc, activeLang)
  }, [productDoc, activeLang])

  // 2. Generate SEO preview
  const seoResult = useMemo(() => {
    return buildProductSeo(productDoc, activeLang, siteContext)
  }, [productDoc, siteContext, activeLang])

  const slug = productDoc.slug || 'product-slug'
  const isAr = activeLang === 'ar'
  const pageUrl = `${siteContext.baseUrl}${isAr ? '' : '/en'}/products/${slug}`

  return (
    <div
      style={{
        padding: '24px',
        maxWidth: '850px',
        margin: '0 auto',
        direction: isAr ? 'rtl' : 'ltr',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#1a1f2c',
      }}
    >
      {/* Header bar with Language Toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '12px',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
            {isAr ? 'لوحة تحكم وفحص SEO وفهرسة المنتج' : 'Product SEO & Indexability Inspector'}
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
            {isAr
              ? 'معاينة مباشرة للظهور في محركات البحث وفحص مطابقة شروط الفهرسة التلقائية'
              : 'Real-time Google search snippet preview and indexability completeness audit'}
          </p>
        </div>

        {/* Language switch */}
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveLang('ar')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px',
              background: activeLang === 'ar' ? '#1b4332' : 'transparent',
              color: activeLang === 'ar' ? '#ffffff' : '#475569',
            }}
          >
            العربية (ar)
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px',
              background: activeLang === 'en' ? '#1b4332' : 'transparent',
              color: activeLang === 'en' ? '#ffffff' : '#475569',
            }}
          >
            English (en)
          </button>
        </div>
      </div>

      {/* Indexability Status Banner */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: '12px',
          marginBottom: '24px',
          background: evaluation.isIndexable ? '#f0fdf4' : '#fffbeb',
          border: `1px solid ${evaluation.isIndexable ? '#86efac' : '#fde68a'}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>{evaluation.isIndexable ? '✅' : '⚠️'}</span>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '14px',
                  color: evaluation.isIndexable ? '#166534' : '#92400e',
                }}
              >
                {evaluation.isIndexable
                  ? isAr
                    ? 'المنتج مكتمل ومؤهل للفهرسة في جوجل (Indexable)'
                    : 'Product meets quality threshold and is Indexable in Google'
                  : isAr
                    ? 'المنتج يحمل وسم (noindex) ويُستبعد من الخريطة مؤقتاً'
                    : 'Product receives (noindex) and is excluded from sitemaps'}
              </span>
            </div>
            <p style={{ margin: '6px 0 0 26px', fontSize: '12px', color: evaluation.isIndexable ? '#15803d' : '#b45309' }}>
              {evaluation.isIndexable
                ? isAr
                  ? 'تم استيفاء كافة الشروط الأساسية (الاسم، الوصف، الصورة، التصنيف، والمواصفات التفصيلية).'
                  : 'All mandatory fields and specifications are satisfied.'
                : isAr
                  ? 'لحماية الموقع من الصفحات الضعيفة (Thin Content)، يجب استكمال الحقول الناقصة أدناه قبل فهرسته.'
                  : 'To protect site ranking against thin content, missing fields below must be filled.'}
            </p>
          </div>

          {/* Quality Score Meter */}
          <div style={{ textAlign: isAr ? 'left' : 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
              {isAr ? 'درجة الجودة والاكتمال' : 'Data Quality Score'}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: evaluation.score >= 80 ? '#15803d' : '#d97706' }}>
              {evaluation.score} <span style={{ fontSize: '12px', fontWeight: 500 }}>/ 100</span>
            </div>
          </div>
        </div>

        {/* Missing fields alert */}
        {!evaluation.isIndexable && evaluation.missingFields.length > 0 && (
          <div
            style={{
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px dashed #fcd34d',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400e', marginBottom: '6px' }}>
              {isAr ? '📌 الحقول والمواصفات المطلوب استكمالها:' : '📌 Missing fields required to qualify:'}
            </div>
            <ul style={{ margin: 0, paddingInlineStart: '20px', fontSize: '12px', color: '#78350f' }}>
              {evaluation.missingFields.map((field, idx) => (
                <li key={idx} style={{ marginBottom: '3px' }}>
                  {field}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Google SERP Preview Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>
            {isAr ? '🔍 معاينة الظهور في نتائج بحث جوجل (Google SERP)' : '🔍 Google Search Snippet Preview'}
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {isAr ? 'كما يراها الباحث في نتائج البحث' : 'Visual representation of search result'}
          </span>
        </div>

        {/* Simulated Google Card */}
        <div
          style={{
            background: '#ffffff',
            padding: '14px 16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontFamily: 'arial, sans-serif',
            direction: isAr ? 'rtl' : 'ltr',
          }}
        >
          {/* Favicon + Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#1b4332',
                color: '#d4af37',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
              }}
            >
              M
            </div>
            <div style={{ fontSize: '12px', color: '#202124', lineHeight: 1.3 }}>
              <span style={{ fontWeight: 600 }}>mnaveth-altourid.com</span>
              <span style={{ color: '#5f6368', margin: '0 4px' }}>›</span>
              <span style={{ color: '#5f6368' }}>products</span>
              <span style={{ color: '#5f6368', margin: '0 4px' }}>›</span>
              <span style={{ color: '#5f6368' }}>{slug}</span>
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '18px',
              color: '#1a0dab',
              fontWeight: 500,
              cursor: 'pointer',
              lineHeight: 1.3,
              marginBottom: '4px',
            }}
          >
            {seoResult.title}
          </div>

          {/* Snippet */}
          <div style={{ fontSize: '13px', color: '#4d5156', lineHeight: 1.5 }}>
            {seoResult.description}
          </div>
        </div>

        {/* Character counts & override status */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            fontSize: '11px',
            color: '#64748b',
          }}
        >
          <div>
            {isAr ? 'طول العنوان:' : 'Title length:'}{' '}
            <strong style={{ color: seoResult.title.length > 65 ? '#dc2626' : '#166534' }}>
              {seoResult.title.length} {isAr ? 'حرف (المثالي ~60)' : 'chars (~60 ideal)'}
            </strong>
            {' | '}
            {isAr ? 'طول الوصف:' : 'Desc length:'}{' '}
            <strong style={{ color: seoResult.description.length > 165 ? '#dc2626' : '#166534' }}>
              {seoResult.description.length} {isAr ? 'حرف (المثالي ~155)' : 'chars (~155 ideal)'}
            </strong>
          </div>
          <div>
            {productDoc.seo?.title?.[activeLang] ? (
              <span style={{ color: '#2563eb', fontWeight: 700 }}>
                {isAr ? '⚡ تم تطبيق تجاوز يدوي للعنوان' : '⚡ Manual SEO Title override active'}
              </span>
            ) : (
              <span style={{ color: '#166534', fontWeight: 600 }}>
                {isAr ? '⚙️ مولّد تلقائي من حقول المنتج' : '⚙️ Purely auto-generated from fields'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Auto-Generated FAQs Section */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '10px' }}>
          {isAr ? '❓ الأسئلة الشائعة المولدة تلقائياً (Auto FAQs)' : '❓ Auto-Generated FAQs'}
        </div>
        <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#64748b' }}>
          {isAr
            ? 'تُبنى الأسئلة فقط من الحقول المعبأة فعلياً (الحد الأدنى، التعبئة، التخزين، مناطق التوريد) ولا يتم اختلاق أي بيانات.'
            : 'Generated strictly from verified filled fields (MOQ, packaging, storage, supply areas).'}
        </p>

        {seoResult.autoFaqs.length === 0 ? (
          <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
            {isAr ? 'لا توجد أسئلة شائعة مولدة لعدم كفاية بيانات الحقول.' : 'No auto FAQs generated due to insufficient specs.'}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {seoResult.autoFaqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '3px' }}>
                  {faq.question}
                </div>
                <div style={{ fontSize: '11px', color: '#475569' }}>{faq.answer}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Actions & Links */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '16px 20px',
          borderRadius: '12px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
            {isAr ? 'رابط المنتج المباشر:' : 'Direct Product URL:'}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', wordBreak: 'break-all' }}>
            {pageUrl}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#1b4332',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            <span>🌐 {isAr ? 'فتح صفحة المنتج' : 'Open Product Page'}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
