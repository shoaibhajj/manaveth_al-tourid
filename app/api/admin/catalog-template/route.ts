import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const format = url.searchParams.get('format') || 'xlsx'

  const sampleRows = [
    {
      'كود الصنف (SKU)': 'MNV-BF-01',
      'اسم الصنف بالعربي': 'لحم بقري برازيلي مجمد توب سايد منزوع العظم',
      'Product Name (EN)': 'Frozen Brazilian Beef Topside (Boneless)',
      'التصنيف بالعربي': 'اللحوم والدواجن المجمدة',
      'Category (EN)': 'Frozen Meat & Poultry',
      'بلد المنشأ': 'البرازيل (مسالخ معتمدة SIF)',
      'التعبئة والتغليف': 'كرتون رئيسي 25 كجم (قوالب مفرغة 4-6 كجم)',
      'درجة التخزين': 'تجميد صدمي -18° مئوية أو أقل',
      'الشهادات والاعتمادات': '100% ذبح حلال معتمد · فحص هيئة الغذاء والدواء SFDA',
      'الوصف والمواصفات': 'قطعيات توب سايد ممتازة منزوعة الشحوم والعظم، نسيج ناعم متجانس للشاورما والإسكالوب.',
      'رابط الصورة': '/images/g-produce.png',
      'السعر التقديري': '',
    },
    {
      'كود الصنف (SKU)': 'MNV-RC-1121',
      'اسم الصنف بالعربي': 'أرز بسمتي هندي مزة 1121 فاخر معتق سنتين',
      'Product Name (EN)': 'Premium Indian 1121 Sella Basmati Rice',
      'التصنيف بالعربي': 'الأرز والحبوب والبقوليات',
      'Category (EN)': 'Rice, Grains & Pulses',
      'بلد المنشأ': 'الهند (إقليم البنجاب وهاريانا)',
      'التعبئة والتغليف': 'أكياس خيش وبولي بروبيلين مزدوجة 40 كجم و 10 كجم',
      'درجة التخزين': 'مستودعات جافة مهواة بدرجة حرارة أقل من 25° مئوية',
      'الشهادات والاعتمادات': 'مطابق SASO · فحص مخبري ومطابقة SFDA',
      'الوصف والمواصفات': 'أرز بسمتي هندي ملكي معتق سنتين، حبة طويلة تتضاعف 2.5 مرة بعد الطهي دون أي تعجن.',
      'رابط الصورة': '/images/p-rice.png',
      'السعر التقديري': 118,
    },
    {
      'كود الصنف (SKU)': 'MNV-OL-PL18',
      'اسم الصنف بالعربي': 'زيت أولين النخيل للقلي الفندقي والتجاري',
      'Product Name (EN)': 'Commercial Palm Olein Frying Oil (18L Tin)',
      'التصنيف بالعربي': 'زيوت الطعام والدهون التموينية',
      'Category (EN)': 'Cooking Oils & Shortenings',
      'بلد المنشأ': 'ماليزيا / المملكة العربية السعودية',
      'التعبئة والتغليف': 'صفائح معدنية محكمة 18 لتر صافي مع فوهة سكب',
      'درجة التخزين': 'يُحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس',
      'الشهادات والاعتمادات': 'معتمد من SFDA وخالٍ من الدهون المهدرجة صناعياً',
      'الوصف والمواصفات': 'زيت قلي فندقي مكرر عالي الاستقرار، يتحمل القلي المتكرر لساعات طويلة دون تكون دخان.',
      'رابط الصورة': '/images/g-juice.png',
      'السعر التقديري': '',
    },
    {
      'كود الصنف (SKU)': 'MNV-CN-TM10',
      'اسم الصنف بالعربي': 'معجون طماطم نقي تركيز بريكس 28-30% عبوة فندقية A10',
      'Product Name (EN)': 'Pure Tomato Paste Brix 28-30% Catering Tin A10',
      'التصنيف بالعربي': 'المعلبات وصلصات الطماطم',
      'Category (EN)': 'Canned Food & Tomato Paste',
      'بلد المنشأ': 'المملكة العربية السعودية / إيطاليا',
      'التعبئة والتغليف': 'كرتون 6 عبوات فندقية كبيرة A10 (3 كجم صافي)',
      'درجة التخزين': 'تخزين جاف في درجة حرارة معتدلة',
      'الشهادات والاعتمادات': 'مطابق SFDA و SASO مع صلاحية 24 شهراً',
      'الوصف والمواصفات': 'معجون طماطم طبيعي فائق التركيز واللون الأحمر الداكن بدون أي ملونات صناعية.',
      'رابط الصورة': '/images/p-canned.png',
      'السعر التقديري': 64,
    },
    {
      'كود الصنف (SKU)': 'MNV-DT-SK03',
      'اسم الصنف بالعربي': 'تمر سكري مفتل ملكي لضيافة الفنادق تغليف فردي',
      'Product Name (EN)': 'Royal Sukkari Dates (Hygienic Individual Flow-Wrap)',
      'التصنيف بالعربي': 'التمور والضيافة الفاخرة',
      'Category (EN)': 'Dates & Premium Hospitality',
      'بلد المنشأ': 'المملكة العربية السعودية (مزارع القصيم)',
      'التعبئة والتغليف': 'كرتون 3 كجم و 5 كجم (حبات فردية مغلفة سيلوفان فاخر)',
      'درجة التخزين': 'تخزين مبرد متحكم بالرطوبة عند +4° مئوية',
      'الشهادات والاعتمادات': 'علامة التمور السعودية · شهادة سلامة الغذاء SFDA',
      'الوصف والمواصفات': 'أجود حبات التمر السكري المفتل الملكي، منتقاة حبة حبة بتغليف فردي معقم لضيافة الفنادق والشركات.',
      'رابط الصورة': '/images/p-dates.png',
      'السعر التقديري': '',
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(sampleRows)
  // Set generous column widths
  worksheet['!cols'] = [
    { wch: 16 }, // SKU
    { wch: 36 }, // Name AR
    { wch: 36 }, // Name EN
    { wch: 24 }, // Category AR
    { wch: 24 }, // Category EN
    { wch: 26 }, // Origin
    { wch: 34 }, // Packaging
    { wch: 30 }, // Storage
    { wch: 36 }, // Certifications
    { wch: 48 }, // Description
    { wch: 24 }, // Image
    { wch: 14 }, // Price
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'قائمة الأصناف التموينية')

  if (format === 'csv') {
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet)
    return new NextResponse(csvOutput, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="mnaveth_catalog_template.csv"',
      },
    })
  }

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

  return new NextResponse(excelBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="mnaveth_catalog_template.xlsx"',
    },
  })
}
