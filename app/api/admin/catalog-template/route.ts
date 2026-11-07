import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const headers = [
    'كود الصنف (SKU)',
    'اسم الصنف بالعربي',
    'Product Name (EN)',
    'التصنيف بالعربي',
    'Category (EN)',
    'بلد المنشأ',
    'التعبئة والتغليف',
    'درجة التخزين',
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
      'اللحوم والدواجن المجمدة',
      'Frozen Meat & Poultry',
      'البرازيل (مسالخ معتمدة SIF)',
      'كرتون رئيسي 25 كجم (قوالب مفرغة 4-6 كجم)',
      'تجميد صدمي -18° مئوية أو أقل',
      '100% ذبح حلال معتمد · فحص هيئة الغذاء والدواء SFDA',
      'قطعيات توب سايد ممتازة منزوعة الشحوم والعظم للشاورما والستيك والإسكالوب.',
      '/images/g-produce.png',
      '',
    ],
    [
      'MNV-RC-1121',
      'أرز بسمتي هندي مزة 1121 فاخر معتق سنتين',
      'Premium Indian 1121 Sella Basmati Rice',
      'الأرز والحبوب والبقوليات',
      'Rice, Grains & Pulses',
      'الهند (إقليم البنجاب وهاريانا)',
      'أكياس خيش وبولي بروبيلين مزدوجة 40 كجم و 10 كجم',
      'مستودعات جافة مهواة بدرجة حرارة أقل من 25° مئوية',
      'مطابق SASO · فحص مخبري ومطابقة SFDA',
      'أرز بسمتي هندي ملكي معتق سنتين، حبة طويلة تتضاعف 2.5 مرة بعد الطهي دون أي تعجن.',
      '/images/p-rice.png',
      '118',
    ],
    [
      'MNV-OL-PL18',
      'زيت أولين النخيل للقلي الفندقي والتجاري',
      'Commercial Palm Olein Frying Oil (18L Tin)',
      'زيوت الطعام والدهون التموينية',
      'Cooking Oils & Shortenings',
      'ماليزيا / المملكة العربية السعودية',
      'صفائح معدنية محكمة 18 لتر صافي مع فوهة سكب',
      'يُحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس',
      'معتمد من SFDA وخالٍ من الدهون المهدرجة صناعياً',
      'زيت قلي فندقي مكرر عالي الاستقرار، يتحمل القلي المتكرر لساعات طويلة دون تكون دخان.',
      '/images/g-juice.png',
      '',
    ],
    [
      'MNV-CN-TM10',
      'معجون طماطم نقي تركيز بريكس 28-30% عبوة فندقية A10',
      'Pure Tomato Paste Brix 28-30% Catering Tin A10',
      'المعلبات وصلصات الطماطم',
      'Canned Food & Tomato Paste',
      'المملكة العربية السعودية / إيطاليا',
      'كرتون 6 عبوات فندقية كبيرة A10 (3 كجم صافي)',
      'تخزين جاف في درجة حرارة معتدلة',
      'مطابق SFDA و SASO مع صلاحية 24 شهراً',
      'معجون طماطم طبيعي فائق التركيز واللون الأحمر الداكن بدون أي ملونات صناعية.',
      '/images/p-canned.png',
      '64',
    ],
    [
      'MNV-DT-SK03',
      'تمر سكري مفتل ملكي لضيافة الفنادق تغليف فردي',
      'Royal Sukkari Dates (Hygienic Individual Flow-Wrap)',
      'التمور والضيافة الفاخرة',
      'Dates & Premium Hospitality',
      'المملكة العربية السعودية (مزارع القصيم)',
      'كرتون 3 كجم و 5 كجم (حبات فردية مغلفة سيلوفان فاخر)',
      'تخزين مبرد متحكم بالرطوبة عند +4° مئوية',
      'علامة التمور السعودية · شهادة سلامة الغذاء SFDA',
      'أجود حبات التمر السكري المفتل الملكي، منتقاة حبة حبة بتغليف فردي معقم لضيافة الفنادق والشركات.',
      '/images/p-dates.png',
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
      'Content-Disposition': 'attachment; filename="mnaveth_catalog_template.csv"',
    },
  })
}
