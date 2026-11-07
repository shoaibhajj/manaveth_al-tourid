import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { isSanityConfigured, sanityEnv } from '@/sanity/env'

export const dynamic = 'force-dynamic'

const enrichedProducts = [
  {
    _id: 'product-basmati-rice',
    name: {
      _type: 'localizedString',
      ar: 'أرز بسمتي هندي فاخر (1121 مزة)',
      en: 'Premium Indian Basmati Rice (1121 Sella)',
    },
    slug: {
      _type: 'slug',
      current: 'basmati-rice',
    },
    description: {
      _type: 'localizedText',
      ar: 'أرز بسمتي هندي معتق سنتين، حبة طويلة فائقة التمدد ومقاومة للتكسر، مخصص للمطاعم ومطابخ الإعاشة.',
      en: 'Two-year aged Indian Basmati rice, extra-long grain with superior cooking elongation for commercial kitchens.',
    },
    longDescription: {
      _type: 'localizedText',
      ar: 'يعد أرز بسمتي 1121 مزة الخيار الأول لمطاعم الكبسة، المندي، والبرياني في السعودية. يتميز بقدرة امتصاص استثنائية للمرق والتوابل دون أي تعجن، مع تضاعف طول الحبة بعد الطهي ليعطي مظهراً نثرياً فاخراً.',
      en: 'Grade-A 1121 Sella Basmati rice sourced directly from Punjab and Haryana mills, delivering unmatched consistency and volume yield in high-capacity restaurant pots.',
    },
    origin: {
      _type: 'localizedString',
      ar: 'الهند (بنجاب وهاريانا)',
      en: 'India (Punjab & Haryana)',
    },
    aging: {
      _type: 'localizedString',
      ar: 'معتق طبيعياً لمدة سنتين (2 Years Aged)',
      en: 'Naturally aged for 2 years',
    },
    grainType: {
      _type: 'localizedString',
      ar: 'أرز بسمتي 1121 مزة ذهبية طويلة الحبة (تمدد 2.5X)',
      en: '1121 Sella Golden Long Grain (2.5x elongation)',
    },
    packaging: {
      _type: 'localizedString',
      ar: 'أكياس خيش وبولي بروبيلين مزدوجة 40 كجم و 10 كجم',
      en: 'Double-woven 40 kg & 10 kg bags',
    },
    storage: {
      _type: 'localizedText',
      ar: 'يُحفظ في مكان جاف ومهوى بدرجة حرارة أقل من 25° مئوية ورطوبة معتدلة بعيداً عن أشعة الشمس.',
      en: 'Store in a cool, ventilated, dry ambient warehouse below 25°C.',
    },
    certifications: {
      _type: 'localizedText',
      ar: 'مطابق للمواصفة القياسية السعودية (SASO)، شهادة فحص الجودة وخلو من الشوائب ومطابقة SFDA.',
      en: 'SASO compliant, SFDA inspected, non-GMO, zero impurities certification.',
    },
    usage: {
      _type: 'localizedText',
      ar: 'مطاعم الكبسة والمندي والبخاري، الفنادق، مطابخ الإعاشة المركزية، وشركات التموين الكبرى.',
      en: 'Commercial Kabsa and Mandi restaurants, hotel banquets, and central catering kitchens.',
    },
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'أرز بسمتي هندي فاخر بالجملة للشركات والمطاعم في الرياض وجدة | منافذ التوريد',
        en: 'Premium Indian Basmati Rice Wholesale for Restaurants & Companies | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'توريد أرز بسمتي هندي مزة 1121 بالجملة للمطاعم ومطابخ الإعاشة في الرياض وجدة: معتق سنتين، حبة طويلة فائقة التمدد، أكياس 40 كجم و 10 كجم بأفضل أسعار التوريد.',
        en: 'Bulk Indian 1121 Sella Basmati rice supplier in Saudi Arabia: 2-year aged, extra-long grain elongation, 40kg & 10kg bags for commercial restaurants and catering.',
      },
    },
  },
  {
    _id: 'product-fresh-produce',
    name: {
      _type: 'localizedString',
      ar: 'لحوم مجمدة بالجملة (لحم بقري وضأن)',
      en: 'Wholesale Frozen Meat (Beef & Mutton)',
    },
    slug: {
      _type: 'slug',
      current: 'frozen-meat',
    },
    description: {
      _type: 'localizedText',
      ar: 'لحوم بقرية ولحوم ضأن مجمدة مختارة بعناية من البرازيل والهند، مذبوحة حلال ومطابقة لاشتراطات SFDA.',
      en: 'Carefully selected frozen beef and mutton from Brazil and India, 100% Halal certified and SFDA compliant.',
    },
    longDescription: {
      _type: 'localizedText',
      ar: 'نوفر قطعيات اللحوم المجمدة المتنوعة منزوعة العظم للمطاعم ومطابخ الإعاشة المركزية: توب سايد، سيلفر سايد، مكعبات كباب، ومفروم عالي الجودة بنسب دهن منضبطة وتجميد صدمي سريع يحافظ على طراوة النسيج.',
      en: 'Comprehensive range of frozen boneless beef cuts and mutton cuts for restaurants and institutions, offering optimal moisture retention and certified Halal slaughter.',
    },
    origin: {
      _type: 'localizedString',
      ar: 'البرازيل والهند (مسالخ ومراعي معتمدة رسمياً)',
      en: 'Brazil & India (Officially approved abattoirs)',
    },
    aging: {
      _type: 'localizedString',
      ar: 'تجميد صدمي فوري بعد الذبح (Blast Frozen at -35°C)',
      en: 'Blast frozen immediately post-slaughter at -35°C',
    },
    grainType: {
      _type: 'localizedString',
      ar: 'قطعيات بقر منزوعة العظم (توب سايد، سيلفر سايد، مكعبات، مفروم)',
      en: 'Boneless beef cuts (Topside, Silverside, Minced, Diced)',
    },
    packaging: {
      _type: 'localizedString',
      ar: 'كراتين أصلية مغلفة ومفرغة من الهواء أوزان 20 كجم و 25 كجم',
      en: 'Vacuum-packed 20 kg & 25 kg master cartons',
    },
    storage: {
      _type: 'localizedText',
      ar: 'يُحفظ مجمداً عند -18° مئوية أو أقل مع مراقبة حرارية مستمرة لسلسلة التبريد.',
      en: 'Keep deep frozen at -18°C or below under continuous cold chain monitoring.',
    },
    certifications: {
      _type: 'localizedText',
      ar: 'شهادات ذبح حلال إسلامية معتمدة، شهادات صحية بيطرية رسمية، ومطابقة هيئة الغذاء والدواء SFDA.',
      en: '100% Halal slaughter certificate, official SFDA veterinary import clearance.',
    },
    usage: {
      _type: 'localizedText',
      ar: 'محلات الشاورما والبرجر، مطاعم المشاوي، مطابخ الإعاشة للشركات والجهات الحكومية.',
      en: 'Shawarma and burger chains, grill restaurants, workforce catering, and institutional kitchens.',
    },
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'توريد لحوم مجمدة بالجملة للمطاعم في الرياض وجدة | منافذ التوريد',
        en: 'Wholesale Frozen Meat Supply for Commercial Restaurants in Riyadh & Jeddah | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'مورد لحوم بقرية وضأن مجمدة بالجملة للمطاعم ومطابخ الإعاشة في السعودية: لحوم برازيلية وهندية معتمدة حلال، مجمدة عند -18°م، كراتين 20 كجم بأسعار جملة منافسة.',
        en: 'Commercial frozen beef and mutton distributor in Saudi Arabia: 100% Halal certified, blast frozen at -18°C, SFDA inspected 20kg cartons for kitchens.',
      },
    },
  },
  {
    _id: 'product-olive-oil',
    name: {
      _type: 'localizedString',
      ar: 'كبدة بقرية مجمدة بالجملة',
      en: 'Wholesale Frozen Beef Liver',
    },
    slug: {
      _type: 'slug',
      current: 'frozen-liver',
    },
    description: {
      _type: 'localizedText',
      ar: 'كبدة بقرية برازيلية مجمدة منزوعة العروق، نسيج متماسك قليل السوائل الفاقدة، مفحوصة ومطابقة للمواصفات.',
      en: 'Premium Brazilian frozen beef liver, vein-free, firm texture with minimal thaw drip, fully SFDA certified.',
    },
    longDescription: {
      _type: 'localizedText',
      ar: 'الخيار المفضل لمطاعم الإفطار ومحلات سندويشات الكبدة المقلقلة في السعودية. تتميز بنكهة طبيعية غنية ولون أحمر داكن متناسق وسهولة التقطيع دون تفتت، ومحفوظة وفق أعلى معايير سلسلة التبريد.',
      en: 'The top choice for breakfast diners and liver sandwich restaurants in Saudi Arabia, offering consistent firm slicing, rich natural taste, and verified microbial clearance.',
    },
    origin: {
      _type: 'localizedString',
      ar: 'البرازيل (كبرى المسالخ المعتمدة فيدرالياً S.I.F)',
      en: 'Brazil (Federally inspected abattoirs - S.I.F)',
    },
    aging: {
      _type: 'localizedString',
      ar: 'تجميد سريع في المصنع مباشرة بعد الذبح',
      en: 'Blast frozen at processing facility directly after harvest',
    },
    grainType: {
      _type: 'localizedString',
      ar: 'كبدة بقرية كاملة منزوعة الأنسجة الليفية الزائدة',
      en: 'Whole beef liver, trimmed of excess connective tissue',
    },
    packaging: {
      _type: 'localizedString',
      ar: 'كراتين جملة 10 كجم و 20 كجم (قوالب داخلية مغلفة بولي إيثيلين)',
      en: '10 kg & 20 kg master cartons with poly-wrapped blocks',
    },
    storage: {
      _type: 'localizedText',
      ar: 'تخزين مبرد مجمد في مستودعات مرخصة عند -18° مئوية إلى -20° مئوية.',
      en: 'Deep frozen storage between -18°C and -20°C in licensed cold storage.',
    },
    certifications: {
      _type: 'localizedText',
      ar: 'شهادة فحص مخبري من مختبرات SFDA تثبت خلوها من المتبقيات، وشهادة ذبح حلال رسمية.',
      en: 'SFDA laboratory inspection clearance, zero chemical residue certification, Halal certificate.',
    },
    usage: {
      _type: 'localizedText',
      ar: 'مطاعم وبوفيهات الإفطار، مطاعم الكبدة المقلقلة والصاج، ومحلات السندويشات السريعة.',
      en: 'Breakfast buffets, traditional liver diners, skillet stations, and quick-service sandwich shops.',
    },
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'جملة الكبدة المجمدة للمطاعم في الرياض وجدة | منافذ التوريد',
        en: 'Wholesale Frozen Beef Liver Suppliers in Riyadh & Jeddah | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'مورد كبدة بقرية مجمدة بالجملة لمطاعم الإفطار والشاورما في السعودية: كبدة برازيلية منزوعة العروق، فحص مخبري معتمد SFDA، كراتين 10 و 20 كجم تسليم فوري.',
        en: 'Premium wholesale frozen beef liver for Saudi restaurants: Brazilian origin, laboratory tested, SFDA compliant, packaged in 10kg & 20kg master cartons.',
      },
    },
  },
  {
    _id: 'product-canned-goods',
    name: {
      _type: 'localizedString',
      ar: 'معلبات الطماطم والبقوليات بالجملة',
      en: 'Wholesale Canned Tomatoes & Legumes',
    },
    slug: {
      _type: 'slug',
      current: 'canned-goods',
    },
    description: {
      _type: 'localizedText',
      ar: 'معجون طماطم بتركيز بريكس 28-30% وفول وحمص حب معلب بعبوات فندقية كبيرة A10 للمطاعم والمطابخ.',
      en: 'Brix 28-30% tomato paste, fava beans, and chickpeas in catering size A10 tins for commercial kitchens.',
    },
    longDescription: {
      _type: 'localizedText',
      ar: 'تشكيلة معلبات غذائية تلبي احتياجات التشغيل اليومي لمطاعم الإفطار والمطابخ المركزية والفنادق، بجودة طهي عالية وصلاحية طويلة وتوفير اقتصادي كبير في تكلفة المشتريات.',
      en: 'Commercial canned staples engineered for daily high-volume catering, ensuring zero preparation waste, long ambient shelf stability, and significant per-portion cost savings.',
    },
    origin: {
      _type: 'localizedString',
      ar: 'المملكة العربية السعودية وإيطاليا ومصر',
      en: 'Saudi Arabia, Italy & Egypt',
    },
    grainType: {
      _type: 'localizedString',
      ar: 'معجون طماطم نقي تركيز 28-30%، حمص حب درجة أولى، وفول مدمس',
      en: 'Pure tomato paste Brix 28-30%, premium chickpeas, and fava beans',
    },
    packaging: {
      _type: 'localizedString',
      ar: 'عبوات فندقية A10 (3 كجم و 4.5 كجم) وكراتين أحجام تجارية',
      en: 'Catering size A10 tins (3 kg & 4.5 kg) and commercial cartons',
    },
    storage: {
      _type: 'localizedText',
      ar: 'يُحفظ في مستودعات جافة معتدلة الحرارة بعيداً عن الرطوبة وأشعة الشمس.',
      en: 'Store in ambient, dry, ventilated storage away from direct sunlight.',
    },
    certifications: {
      _type: 'localizedText',
      ar: 'مطابق للمواصفات القياسية السعودية (SASO) وتراخيص الهيئة العامة للغذاء والدواء SFDA.',
      en: 'SASO quality standard certified and SFDA food facility registered.',
    },
    usage: {
      _type: 'localizedText',
      ar: 'المطاعم المركزية، الفنادق، مطابخ الإعاشة، ومحلات المأكولات السريعة والشعبية.',
      en: 'Central commissary kitchens, hotel banquets, institutional catering, and diners.',
    },
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'معلبات طماطم وبقوليات بالجملة للمطاعم والفنادق | منافذ التوريد',
        en: 'Wholesale Canned Food & Tomato Paste for Restaurants & Hotels | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'توريد معجون طماطم وفول وحمص حب معلب بالجملة في الرياض وجدة: عبوات فندقية كبيرة A10 وبرطمانات للمطاعم والمطابخ بأسعار تنافسية.',
        en: 'Institutional distributor of wholesale canned foods in Saudi Arabia: bulk tomato paste (Brix 28-30%), canned chickpeas, fava beans, and sweet corn.',
      },
    },
  },
  {
    _id: 'product-premium-dates',
    name: {
      _type: 'localizedString',
      ar: 'تمور فاخرة لقطاع الضيافة والشركات',
      en: 'Premium Dates for Hospitality & Corporate',
    },
    slug: {
      _type: 'slug',
      current: 'premium-dates',
    },
    description: {
      _type: 'localizedText',
      ar: 'تمور سكري وخلاص وعجوة فاخرة لضيافة الفنادق والشركات والجهات الحكومية بتغليف فردي معقم وكراتين.',
      en: 'Luxury Sukkari, Khalas, and Ajwa dates for hotel lobbies, corporate gifting, and official hospitality.',
    },
    longDescription: {
      _type: 'localizedText',
      ar: 'أجود محاصيل مزارع القصيم والأحساء والمدينة المنورة المنتقاة يدوياً بعناية، نقدمها بحلول تغليف فردي راقٍ يلبي متطلبات الفنادق الفاخرة والطيران ومجالس الإدارة، بالإضافة إلى كراتين الجملة المبردة.',
      en: 'Hand-picked Grade-A dates from premier Qassim and Madinah farms, available in elegant single flow-wrapped pieces and bulk refrigerated cartons for premier hospitality.',
    },
    origin: {
      _type: 'localizedString',
      ar: 'المملكة العربية السعودية (القصيم، الأحساء، المدينة المنورة)',
      en: 'Saudi Arabia (Qassim, Al-Ahsa, Madinah)',
    },
    grainType: {
      _type: 'localizedString',
      ar: 'سكري مفتل ملكي، خلاص فاخر، وعجوة المدينة درجة أولى',
      en: 'Royal Sukkari, Premium Khalas, and Madinah Ajwa Grade 1',
    },
    packaging: {
      _type: 'localizedString',
      ar: 'تغليف فردي معقم (Flow-Wrap) وعلب فاخرة وكراتين 3 كجم و 5 كجم',
      en: 'Hygienic individual flow-wraps, luxury boxes, and 3kg & 5kg cartons',
    },
    storage: {
      _type: 'localizedText',
      ar: 'تخزين مبرد متحكم بالرطوبة عند درجة حرارة 4° مئوية للحفاظ على الطراوة.',
      en: 'Climate-controlled chilled storage at 4°C to preserve freshness and moisture.',
    },
    certifications: {
      _type: 'localizedText',
      ar: 'شهادة علامة التمور السعودية، مطابقة اشتراطات سلامة الغذاء SFDA.',
      en: 'Saudi Dates Mark certified, SFDA registered facility inspection.',
    },
    usage: {
      _type: 'localizedText',
      ar: 'ضيافة فنادق الـ 5 نجوم، الخطوط الجوية، غرف الاجتماعات بالشركات، والهدايا المؤسسية.',
      en: '5-star hotel lobbies, executive boardrooms, airline catering, and corporate gifting.',
    },
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'توريد تمور فاخرة جملة للفنادق والشركات في السعودية | منافذ التوريد',
        en: 'Premium Bulk Dates Wholesale for Saudi Hotels & Corporate | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'مورد تمور سكري وخلاص وعجوة فاخرة بالجملة لقطاع الضيافة والفنادق والشركات في الرياض وجدة: تغليف فردي راقٍ وكراتين مبردة بأسعار منافسة.',
        en: 'Wholesale distributor of premium Saudi dates for luxury hotels, airlines, and corporate events: Sukkari, Khalas, and Ajwa in elegant individual and bulk packaging.',
      },
    },
  },
]

const enrichedServices = [
  {
    _id: 'service-food-supply',
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'توريد مواد غذائية بالجملة للمطاعم والفنادق في الرياض وجدة | منافذ التوريد',
        en: 'Bulk Food Supply for Restaurants & Hotels in Riyadh & Jeddah | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'حلول التوريد الغذائي المتكاملة لقطاع الأعمال B2B: أرز، زيوت، لحوم مجمدة، ومعلبات مع جداول تسليم يومية وفواتير ضريبية معتمدة.',
        en: 'Integrated B2B food supply solutions for commercial kitchens: rice, edible oils, frozen meats, and provisions with verified SLAs.',
      },
    },
  },
  {
    _id: 'service-restaurants-hotels',
    slug: {
      _type: 'slug',
      current: 'restaurants-hotels',
    },
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'إعاشة وتوريد المطاعم والفنادق في السعودية | منافذ التوريد',
        en: 'Restaurant & Hotel Food Supply and Catering in Saudi Arabia | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'شريكك المعتمد في تأمين سلاسل الإمداد لمطاعم وفنادق الرياض ومكة وجدة: عقود سنوية، أسعار ثابتة، وضمان الجودة 24/7.',
        en: 'Certified food supply and catering partner for hotels and restaurant groups in Saudi Arabia: annual contracts and 24/7 delivery.',
      },
    },
  },
  {
    _id: 'service-land-transport',
    slug: {
      _type: 'slug',
      current: 'land-transport',
    },
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'خدمات النقل البري المبرد والجاف للأغذية في السعودية | منافذ التوريد',
        en: 'Refrigerated & Dry Food Land Transport Logistics Saudi Arabia | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'أسطول شاحنات مبردة وجافة مجهزة بحساسات حرارية لتوصيل وتوزيع المواد الغذائية لكافة مدن المملكة بدقة وأمان.',
        en: 'Fleet of temperature-controlled refrigerated trucks with digital telematics for food distribution across Saudi Arabia.',
      },
    },
  },
  {
    _id: 'service-sea-import',
    slug: {
      _type: 'slug',
      current: 'sea-import',
    },
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'الاستيراد البحري للمواد الغذائية والمجمدات إلى السعودية | منافذ التوريد',
        en: 'Maritime Food Import & Cold Storage Logistics in Saudi Arabia | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'استيراد مباشر من كبرى الشركات العالمية في البرازيل والهند ومصر عبر الموانئ السعودية بأعلى معايير المطابقة لـ SFDA.',
        en: 'Direct maritime food import from global mills and packers in Brazil, India, and Egypt through major Saudi sea ports.',
      },
    },
  },
]

export async function GET(request: Request) {
  const url = new URL(request.url)
  const key = url.searchParams.get('key')
  const adminSecret = process.env.ADMIN_API_SECRET
  if (!adminSecret || key !== adminSecret) {
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

  const productResults: any[] = []
  for (const product of enrichedProducts) {
    try {
      const doc = await client.patch(product._id).set(product).commit()
      productResults.push({ id: doc._id, status: 'updated' })
    } catch (err: any) {
      productResults.push({ id: product._id, status: 'error', message: err.message })
    }
  }

  const serviceResults: any[] = []
  for (const service of enrichedServices) {
    try {
      const doc = await client.patch(service._id).set(service).commit()
      serviceResults.push({ id: doc._id, status: 'updated' })
    } catch (err: any) {
      serviceResults.push({ id: service._id, status: 'error', message: err.message })
    }
  }

  return NextResponse.json({
    success: true,
    productsUpdated: productResults,
    servicesUpdated: serviceResults,
  })
}
