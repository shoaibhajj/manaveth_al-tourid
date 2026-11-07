import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * E8: Enhanced Catalog Spreadsheet Template
 * Includes all E1-standard taxonomy and productType columns with sample catering items.
 */
export async function GET() {
  const headers = [
    'كود الصنف (SKU)',
    'اسم الصنف بالعربي',
    'Product Name (EN)',
    'نوع المنتج (Product Type)',
    'التصنيف بالعربي',
    'Category (EN)',
    'العلامة التجارية (Brand)',
    'بلد المنشأ',
    'التعبئة والتغليف',
    'درجة التخزين',
    'الحد الأدنى للطلب (MOQ)',
    'مناطق ومدن الخدمة',
    'الشهادات والاعتمادات',
    'الوصف والمواصفات',
    'رابط الصورة',
    'السعر التقديري',
  ]

  const sampleRows = [
    [
      'MNV-BF-01',
      'لحم بقري برازيلي مجمد توب سايد منزوع العظم',
      'Frozen Brazilian Beef Topside (Boneless)',
      'meat',
      'اللحوم والدواجن المجمدة',
      'Frozen Meat & Poultry',
      'سويفت (Swift)',
      'البرازيل',
      'كرتون 25 كجم (قوالب 5 كجم)',
      'مجمد (-18° مئوية)',
      '100 كجم',
      'الرياض، جدة، الدمام',
      'حلال معتمد · فحص SFDA',
      'قطعيات توب سايد ممتازة منزوعة الشحوم والعظم للشاورما والستيك والإسكالوب.',
      '/images/hero.png',
      '',
    ],
    [
      'MNV-RC-1121',
      'أرز بسمتي هندي مزة 1121 فاخر معتق سنتين',
      'Premium Indian 1121 Sella Basmati Rice',
      'rice',
      'الأرز والحبوب والبقوليات',
      'Rice, Grains & Pulses',
      'باب الهند (India Gate)',
      'الهند',
      'أكياس 40 كجم و 10 كجم',
      'جاف (أقل من 25° مئوية)',
      '20 كيس',
      'الرياض، مكة، المدينة',
      'مطابق SASO · فحص SFDA',
      'أرز بسمتي هندي ملكي معتق سنتين، حبة طويلة تتضاعف 2.5 مرة بعد الطهي.',
      '/images/hero.png',
      '118',
    ],
    [
      'MNV-OL-PL18',
      'زيت أولين النخيل للقلي الفندقي والتجاري',
      'Commercial Palm Olein Frying Oil (18L Tin)',
      'oil',
      'زيوت الطعام والدهون التموينية',
      'Cooking Oils & Shortenings',
      'أولايت (Olite)',
      'ماليزيا',
      'صفائح معدنية 18 لتر',
      'جاف في مكان بارد',
      '10 صفائح',
      'كافة مناطق المملكة',
      'معتمد SFDA · خالٍ من الدهون المهدرجة',
      'زيت قلي فندقي مكرر عالي الاستقرار، يتحمل القلي المتكرر لساعات طويلة.',
      '/images/hero.png',
      '',
    ],
  ]

  const escapeCsv = (str: string) => {
    if (!str) return '""'
    const clean = str.replace(/"/g, '""')
    return `"${clean}"`
  }

  const csvRows = [
    headers.map(escapeCsv).join(','),
    ...sampleRows.map((row) => row.map(escapeCsv).join(',')),
  ]

  // Add UTF-8 BOM so Excel opens Arabic characters natively
  const csvContent = '\uFEFF' + csvRows.join('\r\n')

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mnaveth_catalog_template_v2.csv"',
    },
  })
}
