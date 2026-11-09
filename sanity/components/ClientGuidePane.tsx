import React, { useState } from 'react'

export function ClientGuidePane() {
  const [activeTab, setActiveTab] = useState<'products' | 'indexing' | 'images' | 'dosAndDonts'>('products')

  const containerStyle: React.CSSProperties = {
    padding: '32px 24px',
    maxWidth: '900px',
    margin: '0 auto',
    direction: 'rtl',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#0f172a',
    lineHeight: 1.6,
  }

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '10px 18px',
    border: 'none',
    borderBottom: isActive ? '3px solid #16a34a' : '3px solid transparent',
    background: 'none',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? '#16a34a' : '#64748b',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'all 0.15s ease',
  })

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    marginTop: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  }

  return (
    <div style={containerStyle}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: '#ffffff',
          padding: '28px',
          borderRadius: '16px',
          marginBottom: '24px',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '4px 10px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          دليل الاستخدام وإرشادات الـ SEO
        </span>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 800 }}>
          دليل إدارة الكتالوج ومحرك السيو الذكي
        </h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          نظام النشر الآلي لشركة منافذ التوريد: كيف تضمن تصدر منتجاتك في Google دون أي تعقيد برمجي.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0' }}>
        <button style={tabButtonStyle(activeTab === 'products')} onClick={() => setActiveTab('products')}>
          📦 إضافة وتعديل صنف
        </button>
        <button style={tabButtonStyle(activeTab === 'indexing')} onClick={() => setActiveTab('indexing')}>
          ⚡ معايير الفهرسة في Google
        </button>
        <button style={tabButtonStyle(activeTab === 'images')} onClick={() => setActiveTab('images')}>
          📸 مواصفات الصور
        </button>
        <button style={tabButtonStyle(activeTab === 'dosAndDonts')} onClick={() => setActiveTab('dosAndDonts')}>
          🚫 المحظورات والنصائح
        </button>
      </div>

      {/* Tab 1: Products */}
      {activeTab === 'products' && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#064e3b' }}>
            الخطوات الأساسية لنشر صنف جديد
          </h2>
          <ol style={{ paddingRight: '20px', margin: 0 }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>الاسم بالعربية والإنجليزية:</strong> اكتب الاسم التجاري الواضح (مثال: <em>لحم بقر برازيلي مجمد توب سايد</em>).
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>الرابط الدائم (Slug):</strong> اضغط على زر <strong>Generate</strong> ليتم توليده من الاسم الإنجليزي تلقائياً. تجنب استخدام أرقام الـ SKU كروابط.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>التصنيف ونوع المنتج:</strong> حدد التصنيف (مثل: اللحوم والدواجن، الأرز والحبوب) ونوع المنتج لضمان ربطه بصفحات التوريد والأقسام ذات الصلة.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>إظهار السعر أو إخفاؤه:</strong> في حال كانت الأسعار متغيرة يومياً، يمكنك إيقاف خيار "إظهار السعر"، وسيقوم النظام تلقائياً بتوجيه العميل لزر طلب عرض سعر عبر واتساب.
            </li>
          </ol>
        </div>
      )}

      {/* Tab 2: Indexing */}
      {activeTab === 'indexing' && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#064e3b' }}>
            كيف يقرر النظام اعتماد المنتج ونشره في محركات البحث؟
          </h2>
          <p style={{ fontSize: '14px', color: '#475569', marginBottom: '16px' }}>
            يستخدم موقعكم محرك <strong>evaluateSeo</strong> الذكي. لن يقوم النظام بنشر أي صفحة ناقصة في Google لحماية ترتيب الموقع من تصنيف الصفحات الفقيرة (Thin Content).
          </p>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderRight: '4px solid #16a34a' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 600 }}>
              قائمة شروط الفهرسة (يلزم استيفاؤها بالكامل):
            </h3>
            <ul style={{ margin: 0, paddingRight: '20px', fontSize: '14px', color: '#334155' }}>
              <li>اسم ووصف المنتج باللغة العربية.</li>
              <li>صورة فوتوغرافية حقيقية غير افتراضية.</li>
              <li>تحديد التصنيف ونوع المنتج.</li>
              <li><strong>3 مواصفات تشغيلية على الأقل:</strong> المنشأ، التعبئة/الكرتون، حالة التخزين، أو الحد الأدنى للطلب (MOQ).</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Images */}
      {activeTab === 'images' && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#064e3b' }}>
            معايير الصور لنتائج بحث Google الصور والشبكات
          </h2>
          <ul style={{ paddingRight: '20px', margin: 0 }}>
            <li style={{ marginBottom: '12px' }}>
              <strong>الدقة والحجم:</strong> يفضل استخدام صور مربعة أو بنسبة 4:3 بدقة لا تقل عن 1000×1000 بكسل.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>ممنوع استخدام صور الهيرو كبديل:</strong> حظر النظام تماماً استخدام صورة واجهة الموقع كصورة للمنتجات. الصنف الذي لا يملك صورة حقيقية سيظل موسوماً بـ <code>noindex</code> تلقائياً حتى رفع صورته.
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong>النص البديل (Alt Text):</strong> احرص على كتابة وصف للصورة مثل: <em>كرتون لحم بقر مجمد برازيلي 20 كجم لتموين المطاعم</em>.
            </li>
          </ul>
        </div>
      )}

      {/* Tab 4: Dos & Don'ts */}
      {activeTab === 'dosAndDonts' && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#064e3b' }}>
            نصائح ومحظورات هامة لحماية ترتيب الموقع
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px' }}>
              <strong style={{ color: '#991b1b' }}>❌ تجنب نسخ الأوصاف بين المنتجات:</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7f1d1d' }}>
                محركات البحث تعاقب المحتوى المكرر (Duplicate Content). اكتب لكل صنف مميزاته الحقيقية.
              </p>
            </div>
            <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px' }}>
              <strong style={{ color: '#991b1b' }}>❌ تجنب تغيير الرابط (Slug) بعد نشره:</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7f1d1d' }}>
                تغيير الرابط يسبب أخطاء 404 للزوار. إذا لزم التغيير، يجب طلب إضافة تحويل 301 لحفظ الزيارات.
              </p>
            </div>
            <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '8px' }}>
              <strong style={{ color: '#166534' }}>✅ اعتمد على شاشة "معاينة SEO والفهرسة":</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#14532d' }}>
                راجع التبويب بجانب كل منتج، وتأكد من حصوله على نسبة اكتمال 100% والعلامة الخضراء قبل اعتماده.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
