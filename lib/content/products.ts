import type { Localized } from '../i18n'
import { visibleSorted } from './types'

export type PriceTier = {
  label: Localized
  amount: number
}

export type Product = {
  id: string
  name: Localized
  description: Localized
  slug?: string
  sku?: string
  categoryId?: string
  categoryName?: Localized
  longDescription?: Localized
  origin?: Localized
  aging?: Localized
  grainType?: Localized
  packaging?: Localized
  storage?: Localized
  certifications?: Localized
  usage?: Localized
  targetPhrases?: Localized[]
  seo?: {
    title?: Localized
    description?: Localized
    shareImage?: any
  }
  image: string
  alt: Localized
  /** Single price. Omit it, together with `tiers`, to show "price on request". */
  price?: { amount: number; unit: Localized }
  /** Quantity based prices, shown instead of the single price when present. */
  tiers?: { unit: Localized; items: PriceTier[] }
  featured?: boolean
  order: number
  visible?: boolean
}

export const currency: Localized = { ar: 'ر.س', en: 'SAR' }

export const products: Product[] = [
  {
    id: 'basmati-rice',
    slug: 'basmati-rice',
    name: { ar: 'أرز بسمتي هندي فاخر (1121 مزة)', en: 'Premium Indian Basmati Rice (1121 Sella)' },
    description: {
      ar: 'أرز بسمتي هندي معتق سنتين، حبة طويلة فائقة التمدد ومقاومة للتكسر، مخصص للمطاعم ومطابخ الإعاشة.',
      en: 'Two-year aged Indian Basmati rice, extra-long grain with superior cooking elongation for commercial kitchens.',
    },
    longDescription: {
      ar: 'يعد أرز بسمتي 1121 مزة الخيار الأول لمطاعم الكبسة، المندي، والبرياني في السعودية. يتميز بقدرة امتصاص استثنائية للمرق والتوابل دون أي تعجن، مع تضاعف طول الحبة بعد الطهي ليعطي مظهراً نثرياً فاخراً.',
      en: 'Grade-A 1121 Sella Basmati rice sourced directly from Punjab and Haryana mills, delivering unmatched consistency and volume yield in high-capacity restaurant pots.',
    },
    origin: { ar: 'الهند (بنجاب وهاريانا)', en: 'India (Punjab & Haryana)' },
    aging: { ar: 'معتق طبيعياً لمدة سنتين (2 Years Aged)', en: 'Naturally aged for 2 years' },
    grainType: { ar: 'أرز بسمتي 1121 مزة ذهبية طويلة الحبة (تمدد 2.5X)', en: '1121 Sella Golden Long Grain (2.5x elongation)' },
    packaging: { ar: 'أكياس خيش وبولي بروبيلين مزدوجة 40 كجم و 10 كجم', en: 'Double-woven 40 kg & 10 kg bags' },
    storage: { ar: 'يُحفظ في مكان جاف ومهوى بدرجة حرارة أقل من 25° مئوية ورطوبة معتدلة.', en: 'Store in a cool, ventilated, dry ambient warehouse below 25°C.' },
    certifications: { ar: 'مطابق للمواصفة القياسية السعودية (SASO)، شهادة فحص الجودة وخلو من الشوائب ومطابقة SFDA.', en: 'SASO compliant, SFDA inspected, non-GMO, zero impurities certification.' },
    usage: { ar: 'مطاعم الكبسة والمندي والبخاري، الفنادق، مطابخ الإعاشة المركزية، وشركات التموين.', en: 'Commercial Kabsa and Mandi restaurants, hotel banquets, and central catering kitchens.' },
    seo: {
      title: { ar: 'أرز بسمتي هندي فاخر بالجملة للشركات والمطاعم في الرياض وجدة | منافذ التوريد', en: 'Premium Indian Basmati Rice Wholesale for Restaurants & Companies | Mnaveeh' },
      description: { ar: 'توريد أرز بسمتي هندي مزة 1121 بالجملة للمطاعم ومطابخ الإعاشة في الرياض وجدة: معتق سنتين، حبة طويلة فائقة التمدد، أكياس 40 كجم و 10 كجم بأفضل أسعار التوريد.', en: 'Bulk Indian 1121 Sella Basmati rice supplier in Saudi Arabia: 2-year aged, extra-long grain elongation, 40kg & 10kg bags for commercial restaurants and catering.' },
    },
    image: '/images/p-rice.png',
    alt: { ar: 'أكياس أرز بسمتي مع مغرفة خشبية من الأرز', en: 'Sacks of basmati rice with a wooden scoop of rice' },
    price: { amount: 118, unit: { ar: 'للكيس', en: 'per sack' } },
    featured: true,
    order: 1,
  },
  {
    id: 'frozen-meat',
    slug: 'frozen-meat',
    name: { ar: 'لحوم مجمدة بالجملة (لحم بقري وضأن)', en: 'Wholesale Frozen Meat (Beef & Mutton)' },
    description: {
      ar: 'لحوم بقرية ولحوم ضأن مجمدة مختارة بعناية من البرازيل والهند، مذبوحة حلال ومطابقة لاشتراطات SFDA.',
      en: 'Carefully selected frozen beef and mutton from Brazil and India, 100% Halal certified and SFDA compliant.',
    },
    longDescription: {
      ar: 'نوفر قطعيات اللحوم المجمدة المتنوعة منزوعة العظم للمطاعم ومطابخ الإعاشة المركزية: توب سايد، سيلفر سايد، مكعبات كباب، ومفروم عالي الجودة بنسب دهن منضبطة وتجميد صدمي سريع يحافظ على طراوة النسيج.',
      en: 'Comprehensive range of frozen boneless beef cuts and mutton cuts for restaurants and institutions, offering optimal moisture retention and certified Halal slaughter.',
    },
    origin: { ar: 'البرازيل والهند (مسالخ ومراعي معتمدة رسمياً)', en: 'Brazil & India (Officially approved abattoirs)' },
    aging: { ar: 'تجميد صدمي فوري بعد الذبح (Blast Frozen at -35°C)', en: 'Blast frozen immediately post-slaughter at -35°C' },
    grainType: { ar: 'قطعيات بقر منزوعة العظم (توب سايد، سيلفر سايد، مكعبات، مفروم)', en: 'Boneless beef cuts (Topside, Silverside, Minced, Diced)' },
    packaging: { ar: 'كراتين أصلية مغلفة ومفرغة من الهواء أوزان 20 كجم و 25 كجم', en: 'Vacuum-packed 20 kg & 25 kg master cartons' },
    storage: { ar: 'يُحفظ مجمداً عند -18° مئوية أو أقل مع مراقبة حرارية مستمرة لسلسلة التبريد.', en: 'Keep deep frozen at -18°C or below under continuous cold chain monitoring.' },
    certifications: { ar: 'شهادات ذبح حلال إسلامية معتمدة، شهادات صحية بيطرية رسمية، ومطابقة هيئة الغذاء والدواء SFDA.', en: '100% Halal slaughter certificate, official SFDA veterinary import clearance.' },
    usage: { ar: 'محلات الشاورما والبرجر، مطاعم المشاوي، مطابخ الإعاشة للشركات والجهات الحكومية.', en: 'Shawarma and burger chains, grill restaurants, workforce catering, and institutional kitchens.' },
    seo: {
      title: { ar: 'توريد لحوم مجمدة بالجملة للمطاعم في الرياض وجدة | منافذ التوريد', en: 'Wholesale Frozen Meat Supply for Commercial Restaurants in Riyadh & Jeddah | Mnaveeh' },
      description: { ar: 'مورد لحوم بقرية وضأن مجمدة بالجملة للمطاعم ومطابخ الإعاشة في السعودية: لحوم برازيلية وهندية معتمدة حلال، مجمدة عند -18°م، كراتين 20 كجم بأسعار جملة منافسة.', en: 'Commercial frozen beef and mutton distributor in Saudi Arabia: 100% Halal certified, blast frozen at -18°C, SFDA inspected 20kg cartons for kitchens.' },
    },
    image: '/images/g-produce.png',
    alt: { ar: 'لحوم مجمدة عالية الجودة للمطاعم', en: 'Wholesale frozen meat selection' },
    featured: true,
    order: 2,
  },
  {
    id: 'frozen-liver',
    slug: 'frozen-liver',
    name: { ar: 'كبدة بقرية مجمدة بالجملة', en: 'Wholesale Frozen Beef Liver' },
    description: {
      ar: 'كبدة بقرية برازيلية مجمدة منزوعة العروق، نسيج متماسك قليل السوائل الفاقدة، مفحوصة ومطابقة للمواصفات.',
      en: 'Premium Brazilian frozen beef liver, vein-free, firm texture with minimal thaw drip, fully SFDA certified.',
    },
    longDescription: {
      ar: 'الخيار المفضل لمطاعم الإفطار ومحلات سندويشات الكبدة المقلقلة في السعودية. تتميز بنكهة طبيعية غنية ولون أحمر داكن متناسق وسهولة التقطيع دون تفتت، ومحفوظة وفق أعلى معايير سلسلة التبريد.',
      en: 'The top choice for breakfast diners and liver sandwich restaurants in Saudi Arabia, offering consistent firm slicing, rich natural taste, and verified microbial clearance.',
    },
    origin: { ar: 'البرازيل (كبرى المسالخ المعتمدة فيدرالياً S.I.F)', en: 'Brazil (Federally inspected abattoirs - S.I.F)' },
    aging: { ar: 'تجميد سريع في المصنع مباشرة بعد الذبح', en: 'Blast frozen at processing facility directly after harvest' },
    grainType: { ar: 'كبدة بقرية كاملة منزوعة الأنسجة الليفية الزائدة', en: 'Whole beef liver, trimmed of excess connective tissue' },
    packaging: { ar: 'كراتين جملة 10 كجم و 20 كجم (قوالب داخلية مغلفة بولي إيثيلين)', en: '10 kg & 20 kg master cartons with poly-wrapped blocks' },
    storage: { ar: 'تخزين مبرد مجمد في مستودعات مرخصة عند -18° مئوية إلى -20° مئوية.', en: 'Deep frozen storage between -18°C and -20°C in licensed cold storage.' },
    certifications: { ar: 'شهادة فحص مخبري من مختبرات SFDA تثبت خلوها من المتبقيات، وشهادة ذبح حلال رسمية.', en: 'SFDA laboratory inspection clearance, zero chemical residue certification, Halal certificate.' },
    usage: { ar: 'مطاعم وبوفيهات الإفطار، مطاعم الكبدة المقلقلة والصاج، ومحلات السندويشات السريعة.', en: 'Breakfast buffets, traditional liver diners, skillet stations, and quick-service sandwich shops.' },
    seo: {
      title: { ar: 'جملة الكبدة المجمدة للمطاعم في الرياض وجدة | منافذ التوريد', en: 'Wholesale Frozen Beef Liver Suppliers in Riyadh & Jeddah | Mnaveeh' },
      description: { ar: 'مورد كبدة بقرية مجمدة بالجملة لمطاعم الإفطار والشاورما في السعودية: كبدة برازيلية منزوعة العروق، فحص مخبري معتمد SFDA، كراتين 10 و 20 كجم تسليم فوري.', en: 'Premium wholesale frozen beef liver for Saudi restaurants: Brazilian origin, laboratory tested, SFDA compliant, packaged in 10kg & 20kg master cartons.' },
    },
    image: '/images/p-olive-oil.png',
    alt: { ar: 'كبدة بقرية مجمدة عالية الجودة', en: 'Premium frozen beef liver' },
    featured: true,
    order: 3,
  },
  {
    id: 'canned-goods',
    slug: 'canned-goods',
    name: { ar: 'معلبات الطماطم والبقوليات بالجملة', en: 'Wholesale Canned Tomatoes & Legumes' },
    description: {
      ar: 'معجون طماطم بتركيز بريكس 28-30% وفول وحمص حب معلب بعبوات فندقية كبيرة A10 للمطاعم والمطابخ.',
      en: 'Brix 28-30% tomato paste, fava beans, and chickpeas in catering size A10 tins for commercial kitchens.',
    },
    longDescription: {
      ar: 'تشكيلة معلبات غذائية تلبي احتياجات التشغيل اليومي لمطاعم الإفطار والمطابخ المركزية والفنادق، بجودة طهي عالية وصلاحية طويلة وتوفير اقتصادي كبير في تكلفة المشتريات.',
      en: 'Commercial canned staples engineered for daily high-volume catering, ensuring zero preparation waste, long ambient shelf stability, and significant per-portion cost savings.',
    },
    origin: { ar: 'المملكة العربية السعودية وإيطاليا ومصر', en: 'Saudi Arabia, Italy & Egypt' },
    grainType: { ar: 'معجون طماطم نقي تركيز 28-30%، حمص حب درجة أولى، وفول مدمس', en: 'Pure tomato paste Brix 28-30%, premium chickpeas, and fava beans' },
    packaging: { ar: 'عبوات فندقية A10 (3 كجم و 4.5 كجم) وكراتين أحجام تجارية', en: 'Catering size A10 tins (3 kg & 4.5 kg) and commercial cartons' },
    storage: { ar: 'يُحفظ في مستودعات جافة معتدلة الحرارة بعيداً عن الرطوبة وأشعة الشمس.', en: 'Store in ambient, dry, ventilated storage away from direct sunlight.' },
    certifications: { ar: 'مطابق للمواصفات القياسية السعودية (SASO) وتراخيص الهيئة العامة للغذاء والدواء SFDA.', en: 'SASO quality standard certified and SFDA food facility registered.' },
    usage: { ar: 'المطاعم المركزية، الفنادق، مطابخ الإعاشة، ومحلات المأكولات السريعة والشعبية.', en: 'Central commissary kitchens, hotel banquets, institutional catering, and diners.' },
    seo: {
      title: { ar: 'معلبات طماطم وبقوليات بالجملة للمطاعم والفنادق | منافذ التوريد', en: 'Wholesale Canned Food & Tomato Paste for Restaurants & Hotels | Mnaveeh' },
      description: { ar: 'توريد معجون طماطم وفول وحمص حب معلب بالجملة في الرياض وجدة: عبوات فندقية كبيرة A10 وبرطمانات للمطاعم والمطابخ بأسعار تنافسية.', en: 'Institutional distributor of wholesale canned foods in Saudi Arabia: bulk tomato paste (Brix 28-30%), canned chickpeas, fava beans, and sweet corn.' },
    },
    image: '/images/p-canned.png',
    alt: { ar: 'علب معدنية وبرطمانات من معجون الطماطم والحمص', en: 'Cans and jars of tomato paste and chickpeas' },
    price: { amount: 64, unit: { ar: 'للكرتون', en: 'per carton' } },
    order: 4,
  },
  {
    id: 'premium-dates',
    slug: 'premium-dates',
    name: { ar: 'تمور فاخرة لقطاع الضيافة والشركات', en: 'Premium Dates for Hospitality & Corporate' },
    description: {
      ar: 'تمور سكري وخلاص وعجوة فاخرة لضيافة الفنادق والشركات والجهات الحكومية بتغليف فردي معقم وكراتين.',
      en: 'Luxury Sukkari, Khalas, and Ajwa dates for hotel lobbies, corporate gifting, and official hospitality.',
    },
    longDescription: {
      ar: 'أجود محاصيل مزارع القصيم والأحساء والمدينة المنورة المنتقاة يدوياً بعناية، نقدمها بحلول تغليف فردي راقٍ يلبي متطلبات الفنادق الفاخرة والطيران ومجالس الإدارة، بالإضافة إلى كراتين الجملة المبردة.',
      en: 'Hand-picked Grade-A dates from premier Qassim and Madinah farms, available in elegant single flow-wrapped pieces and bulk refrigerated cartons for premier hospitality.',
    },
    origin: { ar: 'المملكة العربية السعودية (القصيم، الأحساء، المدينة المنورة)', en: 'Saudi Arabia (Qassim, Al-Ahsa, Madinah)' },
    grainType: { ar: 'سكري مفتل ملكي، خلاص فاخر، وعجوة المدينة درجة أولى', en: 'Royal Sukkari, Premium Khalas, and Madinah Ajwa Grade 1' },
    packaging: { ar: 'تغليف فردي معقم (Flow-Wrap) وعلب فاخرة وكراتين 3 كجم و 5 كجم', en: 'Hygienic individual flow-wraps, luxury boxes, and 3kg & 5kg cartons' },
    storage: { ar: 'تخزين مبرد متحكم بالرطوبة عند درجة حرارة 4° مئوية للحفاظ على الطراوة.', en: 'Climate-controlled chilled storage at 4°C to preserve freshness and moisture.' },
    certifications: { ar: 'شهادة علامة التمور السعودية، مطابقة اشتراطات سلامة الغذاء SFDA.', en: 'Saudi Dates Mark certified, SFDA registered facility inspection.' },
    usage: { ar: 'ضيافة فنادق الـ 5 نجوم، الخطوط الجوية، غرف الاجتماعات بالشركات، والهدايا المؤسسية.', en: '5-star hotel lobbies, executive boardrooms, airline catering, and corporate gifting.' },
    seo: {
      title: { ar: 'توريد تمور فاخرة جملة للفنادق والشركات في السعودية | منافذ التوريد', en: 'Premium Bulk Dates Wholesale for Saudi Hotels & Corporate | Mnaveeh' },
      description: { ar: 'مورد تمور سكري وخلاص وعجوة فاخرة بالجملة لقطاع الضيافة والفنادق والشركات في الرياض وجدة: تغليف فردي راقٍ وكراتين مبردة بأسعار منافسة.', en: 'Wholesale distributor of premium Saudi dates for luxury hotels, airlines, and corporate events: Sukkari, Khalas, and Ajwa in elegant individual and bulk packaging.' },
    },
    image: '/images/p-dates.png',
    alt: { ar: 'علبة خشبية مفتوحة من التمر المجدول والسكري', en: 'An open wooden box of premium Saudi dates' },
    order: 5,
  },
  {
    id: 'natural-juice',
    slug: 'natural-juice',
    name: { ar: 'عصائر وزيوت طعام تجارية', en: 'Commercial Juices & Foodservice Oils' },
    description: {
      ar: 'عصائر معبأة وزيوت قلي نباتية بعبوات تجارية كبيرة 18 لتراً للمطاعم ومصانع الأغذية.',
      en: 'Packaged juices and commercial 18L frying oils for restaurant chains and food processors.',
    },
    origin: { ar: 'المملكة العربية السعودية وماليزيا', en: 'Saudi Arabia & Malaysia' },
    packaging: { ar: 'صفائح معدنية 18 لتراً وكراتين عبوات متنوعة', en: '18L metal tins and assorted beverage cartons' },
    storage: { ar: 'يُحفظ في مكان جاف وبارد بعيداً عن الحرارة المباشرة.', en: 'Store in a cool dry area away from direct heat.' },
    certifications: { ar: 'مطابق للمواصفات القياسية السعودية (SASO) واعتمادات SFDA.', en: 'SASO and SFDA certified food quality.' },
    usage: { ar: 'المطاعم السريعة، المقاهي، محلات التجزئة، ومطابخ التموين.', en: 'Quick service restaurants, cafes, retail, and catering kitchens.' },
    seo: {
      title: { ar: 'توريد زيوت طعام وقلي بالجملة للمطاعم في الرياض وجدة | منافذ التوريد', en: 'Commercial Cooking & Frying Oil Wholesale Supply Saudi Arabia | Mnaveeh' },
      description: { ar: 'أسعار صفائح زيت القلي بالجملة للمطاعم في الرياض وجدة: زيت دوار الشمس وزيت أولين النخيل عبوات 18 لتراً بجودة عالية ونقطة دخان مرتفعة.', en: 'Bulk commercial frying oil distributor in Saudi Arabia: 18L tins of palm olein and sunflower oil for fast food chains and catering kitchens.' },
    },
    image: '/images/g-juice.png',
    alt: { ar: 'عبوات عصير وزيت مغلفة', en: 'Packaged bottles of juice and oil' },
    tiers: {
      unit: { ar: 'سعر الكرتون', en: 'Price per carton' },
      items: [
        { label: { ar: '10 كراتين', en: '10 cartons' }, amount: 96 },
        { label: { ar: '30 كرتونًا فأكثر', en: '30 cartons or more' }, amount: 88 },
      ],
    },
    order: 6,
  },
]

export const getProducts = () => visibleSorted(products)
export const getFeaturedProducts = () => getProducts().filter((product) => product.featured)
