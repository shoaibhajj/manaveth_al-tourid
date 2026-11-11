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
  /** Explicitly included in the catalog's primary specialty section. */
  isCoreSpecialty?: boolean
  seo?: {
    title?: Localized
    description?: Localized
    shareImage?: any
  }
  image: string
  gallery?: string[]
  alt: Localized
  /** Single price. Omit it, together with `tiers`, to show "price on request". */
  price?: { amount: number; unit: Localized }
  /** Quantity based prices, shown instead of the single price when present. */
  tiers?: { unit: Localized; items: PriceTier[] }
  featured?: boolean
  order: number
  visible?: boolean
  updatedAt?: string
}

export const currency: Localized = { ar: 'ر.س', en: 'SAR' }

export const products: Product[] = [
  {
    id: 'frozen-liver',
    slug: 'frozen-liver',
    name: { ar: 'كبدة ضأن مجمدة - كلاسيك توماس فودز أسترالي', en: 'Thomas Foods Classic Australian Frozen Ovine Liver' },
    description: {
      ar: 'كبدة ضأن أسترالية مجمدة ومفرغة من الهواء (Thomas Foods Classic)، نسيج متماسك ونكهة طبيعية، مذبوحة حلال 100% ومطابقة لاشتراطات SFDA.',
      en: 'Premium Australian vacuum-packed frozen ovine liver (Thomas Foods Classic), firm texture, Halal certified, and SFDA compliant.',
    },
    longDescription: {
      ar: 'الصنف الأول المفضل لمطاعم الإفطار ومحلات الكبدة المقلقلة والصاج في السعودية. كبدة ضأن أسترالية أصلية من مزارع ومسالخ توماس فودز (Est 53) بتغليف فاكيوم محكم يحمي النسيج من حروق التجميد ويمنع فقدان السوائل عند التقطيع.',
      en: 'The top choice for breakfast diners and traditional skillet liver restaurants across Saudi Arabia. Authentic Australian ovine liver from Thomas Foods International (Est 53) in vacuum packaging.',
    },
    origin: { ar: 'أستراليا (Thomas Foods International - Est 53)', en: 'Australia (Thomas Foods International - Est 53)' },
    aging: { ar: 'تجميد فوري سريع بعد الذبح والتفريغ من الهواء', en: 'Blast frozen at -18°C post vacuum packing' },
    grainType: { ar: 'كبدة ضأن كاملة مجمدة في كيس فاكيوم معقم', en: 'Vacuum-packed whole ovine liver' },
    packaging: { ar: 'كرتون أصلية مبطنة بعازل أزرق تحتوي قطع مغلفة فردياً', en: 'Master carton with blue liner and individual vacuum packs' },
    storage: { ar: 'يُحفظ مجمداً عند -18° مئوية بسلسلة تبريد متصلة', en: 'Keep frozen at -18°C under continuous cold chain' },
    certifications: { ar: 'ذبح حلال إسلامي 100% · معتمد هيئة الغذاء والدواء SFDA', en: '100% Halal Slaughter · SFDA Approved' },
    usage: { ar: 'مطاعم الكبدة، بوفيهات الإفطار، محلات السندويشات والمطابخ التجارية.', en: 'Liver restaurants, breakfast buffets, and commercial kitchens.' },
    seo: {
      title: { ar: 'توريد كبدة كلاسيك جملة للمطاعم في الرياض | منافذ التوريد', en: 'Wholesale Thomas Foods Classic Liver Supplier Saudi Arabia | Mnaveth ALTourid' },
      description: { ar: 'مورد كبدة ضأن أسترالي كلاسيك (Thomas Foods) مجمدة بالجملة لمطاعم الكبدة والإفطار بالرياض: تغليف فاكيوم، اعتماد SFDA، كراتين جملة وتسليم مبرد.', en: 'Commercial wholesale distributor of Thomas Foods Classic frozen ovine liver in Saudi Arabia: Halal certified, SFDA inspected.' },
    },
    image: '/images/products/thomas-classic-liver-box.jpg',
    gallery: [
      '/images/products/thomas-classic-liver-box.jpg',
      '/images/products/thomas-classic-liver-pack.jpg',
      '/images/products/thomas-classic-liver-carton.jpg',
    ],
    alt: { ar: 'كرتون كبدة كلاسيك توماس فودز أسترالي وقطعة الكبدة المفرغة من الهواء', en: 'Thomas Foods Classic liver carton and vacuum pack' },
    featured: true,
    order: 1,
  },
  {
    id: 'frozen-ribs-wagstaff',
    slug: 'frozen-ribs-wagstaff',
    name: { ar: 'ريش ضأن بالعظم مجمدة - واجستاف أسترالي (O-Rack Ribs)', en: 'Wagstaff Australian Bone-in Ovine Rack Ribs' },
    description: {
      ar: 'أضلاع وريش لحم ضأن أسترالي بالعظم عالية الجودة من مسالخ واجستاف المعتمدة، مغلفة بالفاكيوم ومجمدة عند -18°م.',
      en: 'Premium Australian bone-in ovine rack cuts from Wagstaff abattoirs (Est 46), vacuum packed and frozen at -18°C.',
    },
    longDescription: {
      ar: 'ريش ضأن بالعظم (Bone in Ovine "O-RCK" Rack) مستوردة مباشرة من أستراليا من شركة واجستاف (Wagstaff - Est 46). مثالية لمطاعم المشاوي الفاخرة، الفنادق، ومطابخ الولائم، مع تتبيل متجانس وطراوة فائقة بعد الطهي.',
      en: 'Authentic Australian bone-in ovine rack cuts from Wagstaff (Est 46 Cranbourne, Victoria). Ideal for upscale barbecue dining, hotels, and banquet operations.',
    },
    origin: { ar: 'أستراليا (Wagstaff Australia - Est 46)', en: 'Australia (Wagstaff Australia - Est 46)' },
    packaging: { ar: 'كرتون واجستاف أصلية بأربطة محكمة وقطع مفرغة من الهواء', en: 'Strapped master cartons with vacuum-sealed racks' },
    storage: { ar: 'يُحفظ مجمداً عند -18° مئوية مع رقابة حرارية', en: 'Keep frozen at -18°C under continuous temperature control' },
    certifications: { ar: 'ذبح طبقاً للشريعة الإسلامية حلال 100% · معتمد SFDA', en: '100% Halal Certified Slaughter · SFDA Approved' },
    usage: { ar: 'مطاعم المشاوي، مطاعم اللحوم الفاخرة، الفنادق، ومطابخ الولائم.', en: 'Fine dining grills, barbecue restaurants, and hotels.' },
    seo: {
      title: { ar: 'توريد ريش ضأن واجستاف أسترالي جملة للمطاعم | منافذ التوريد', en: 'Wagstaff Australian Ovine Ribs Wholesale Supply Saudi Arabia | Mnaveth ALTourid' },
      description: { ar: 'مورد ريش ضأن أسترالي بالعظم Wagstaff مجمدة بالجملة للمطاعم والفنادق: ذبح حلال 100%، كراتين أصلية مغلفة فاكيوم، تسليم مبرد فوري بالرياض.', en: 'Wholesale Wagstaff Australian bone-in ovine rack ribs for restaurants and hotels across Saudi Arabia.' },
    },
    image: '/images/products/wagstaff-ribs-label.jpg',
    gallery: [
      '/images/products/wagstaff-ribs-label.jpg',
      '/images/products/wagstaff-ribs-carton.jpg',
      '/images/products/wagstaff-box-australia.jpg',
    ],
    alt: { ar: 'ريش لحم ضأن بالعظم واجستاف أسترالي مع بطاقة المواصفات والكرتون', en: 'Wagstaff Australian bone-in ovine ribs pack and box' },
    featured: true,
    order: 2,
  },
  {
    id: 'frozen-liver-johny-gold',
    slug: 'frozen-liver-johny-gold',
    name: { ar: 'كبدة مجمدة - جوني جولد (Johny Gold)', en: 'Johny Gold Premium Frozen Liver' },
    description: {
      ar: 'كبدة ضأن مجمدة درجة أولى علامة جوني جولد الشهيرة، نسيج طازج ومذاق ممتاز تلبي تطلعات أرقى مطاعم الكبدة المقلقلة.',
      en: 'Premium Grade-A frozen ovine liver under the renowned Johny Gold brand, tender texture and superior taste.',
    },
    longDescription: {
      ar: 'تعد كبدة جوني جولد إحدى أبرز العلامات التجارية المعتمدة والمطلوبة بالاسم لدى طهاة الكبدة ومطاعم الإفطار في المملكة. تمتاز بنظافة القطعيات واللون المتجانس وقلة السوائل، مما يضمن أعلى نسبة تصافي وربحية للمطاعم.',
      en: 'Johny Gold liver is a benchmark brand trusted by executive chefs and liver diners in Saudi Arabia for consistent yield and rich flavor.',
    },
    origin: { ar: 'أستراليا / نيوزيلندا', en: 'Australia / New Zealand' },
    packaging: { ar: 'كراتين تجارية معتمدة وقطع فاكيوم مفرغة من الهواء', en: 'Commercial master cartons with vacuum pouches' },
    storage: { ar: 'يُحفظ مجمداً عند -18° مئوية', en: 'Deep frozen at -18°C' },
    certifications: { ar: 'ذبح إسلامي حلال 100% · مطابقة اشتراطات SFDA', en: '100% Halal Slaughter · SFDA Compliant' },
    usage: { ar: 'مطاعم الكبدة والوجبات الشعبية ومحلات السندويشات السريعة.', en: 'Breakfast diners, sandwich shops, and catering.' },
    seo: {
      title: { ar: 'توريد كبدة جوني جولد جملة للمطاعم بالرياض | منافذ التوريد', en: 'Johny Gold Frozen Liver Wholesale Supplier | Mnaveth ALTourid' },
      description: { ar: 'مورد كبدة جوني جولد مجمدة بالجملة لمطاعم الرياض والمملكة: كبدة ضأن درجة أولى، كراتين أصلية معتمدة SFDA بأسعار جملة تنافسية.', en: 'Wholesale Johny Gold frozen liver distributor in Saudi Arabia for restaurants and commissaries.' },
    },
    image: '/images/products/thomas-classic-liver-pack.jpg',
    gallery: [
      '/images/products/thomas-classic-liver-pack.jpg',
      '/images/products/thomas-classic-liver-box.jpg',
    ],
    alt: { ar: 'كبدة جوني جولد مجمدة جملة للمطاعم', en: 'Johny Gold premium frozen liver' },
    featured: true,
    order: 3,
  },
  {
    id: 'frozen-brain',
    slug: 'frozen-brain',
    name: { ar: 'مخ مجمد بالجملة للمطاعم (عجل / ضأن)', en: 'Wholesale Frozen Brain (Veal & Ovine)' },
    description: {
      ar: 'مخ عجل وضأن مجمد ومفرز بعناية بأعلى معايير النظافة والتعقيم، نسيج متماسك مثالي للمطاعم وبوفيهات المأكولات الشعبية.',
      en: 'Carefully sorted and blast-frozen veal and ovine brain for commercial restaurants and traditional eateries.',
    },
    longDescription: {
      ar: 'نوفر مخ العجل والضأن المجمد بالجملة لمطاعم الإفطار ومحلات السندويشات ومطابخ الولائم. يتميز بنظافة تامة وسرعة التجميد الصدمي التي تضمن بقاء القوام ناعماً ومتماسكاً بعد الطهي، خاضع لاشتراطات الرقابة الصحية وهيئة الغذاء والدواء.',
      en: 'Wholesale frozen brain sourced from certified facilities, blast frozen to preserve delicate texture and maximum culinary yield.',
    },
    origin: { ar: 'أستراليا / البرازيل / نيوزيلندا', en: 'Australia / Brazil / New Zealand' },
    packaging: { ar: 'كراتين مبردة مجمدة مبطنة بحماية مضاعفة', en: 'Secure insulated master cartons' },
    storage: { ar: 'يُحفظ مجمداً عند -18° مئوية أو أقل', en: 'Keep deep frozen at -18°C or below' },
    certifications: { ar: 'ذبح حلال 100% · تراخيص استيراد وتخزين SFDA', en: '100% Halal Certified · SFDA Licensed' },
    usage: { ar: 'مطاعم السندويشات والمقلقل ومحلات الإفطار والفنادق.', en: 'Breakfast diners, sandwich eateries, and hotel commissaries.' },
    seo: {
      title: { ar: 'توريد مخ مجمد جملة للمطاعم في الرياض | منافذ التوريد', en: 'Wholesale Frozen Brain Supplier in Saudi Arabia | Mnaveth ALTourid' },
      description: { ar: 'مورد مخ عجل وضأن مجمد بالجملة لكبرى المطاعم في الرياض والسعودية: نسيج متماسك ونظافة معتمدة SFDA وذبح حلال وتسليم مبرد.', en: 'Bulk supplier of frozen veal and ovine brain for restaurants and commercial kitchens in Saudi Arabia.' },
    },
    image: '/images/products/thomas-classic-liver-carton.jpg',
    gallery: [
      '/images/products/thomas-classic-liver-carton.jpg',
    ],
    alt: { ar: 'مخ مجمد بالجملة للمطاعم', en: 'Wholesale frozen brain for catering' },
    featured: true,
    order: 4,
  },
  {
    id: 'frozen-tongue',
    slug: 'frozen-tongue',
    name: { ar: 'لسان بقري / عجل مجمد بالجملة', en: 'Wholesale Frozen Beef & Veal Tongue' },
    description: {
      ar: 'ألسنة بقر وعجل مجمدة عالية الجودة منزوعة الزوائد، نسيج لحمي ممتاز ومذاق غني للمطاعم والمطابخ التجارية.',
      en: 'Premium frozen beef and veal tongues trimmed of excess fat, rich flavor and tender texture for foodservice.',
    },
    longDescription: {
      ar: 'لسان بقري وعجل مجمد مستورد من مسالخ معتمدة عالمياً، منظف ومنزوع الغدد والزوائد وجاهز للطهي والتقطيع الفندقي. يحظى بإقبال واسع في الفنادق ومطاعم المأكولات التراثية واللحوم الباردة.',
      en: 'Cleaned, Swiss-cut and trimmed frozen beef tongues blast frozen to maintain supreme tenderness and juiciness.',
    },
    origin: { ar: 'البرازيل / أستراليا', en: 'Brazil / Australia' },
    packaging: { ar: 'كراتين جملة 15 كجم و 20 كجم مفرغة من الهواء', en: '15kg & 20kg master cartons with vacuum packs' },
    storage: { ar: 'يُحفظ مجمداً عند -18° مئوية', en: 'Store frozen at -18°C' },
    certifications: { ar: 'شهادة ذبح حلال 100% · فحص مخبري SFDA', en: '100% Halal Slaughter · SFDA Inspected' },
    usage: { ar: 'مطاعم اللحوم، الفنادق، مطابخ الإعاشة، ومحلات السندويشات.', en: 'Specialty meat restaurants, hotels, and institutional caterers.' },
    seo: {
      title: { ar: 'توريد لسان بقري مجمد جملة للمطاعم في السعودية | منافذ التوريد', en: 'Wholesale Frozen Beef Tongue Suppliers | Mnaveth ALTourid' },
      description: { ar: 'مورد ألسنة بقر وعجل مجمدة بالجملة لمطاعم وفنادق السعودية: جودة لحم ممتازة، كراتين مغلفة فاكيوم واعتماد SFDA وتسليم مجدول.', en: 'Wholesale distributor of frozen beef and veal tongues for restaurants and hospitality in Saudi Arabia.' },
    },
    image: '/images/products/wagstaff-ribs-carton.jpg',
    gallery: [
      '/images/products/wagstaff-ribs-carton.jpg',
      '/images/products/wagstaff-box-australia.jpg',
    ],
    alt: { ar: 'لسان بقري مجمد بالجملة للمطاعم', en: 'Wholesale frozen beef tongue' },
    featured: true,
    order: 5,
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
      title: { ar: 'توريد لحوم مجمدة بالجملة للمطاعم في الرياض وجدة | منافذ التوريد', en: 'Wholesale Frozen Meat Supply for Commercial Restaurants in Riyadh & Jeddah | Mnaveth ALTourid' },
      description: { ar: 'مورد لحوم بقرية وضأن مجمدة بالجملة للمطاعم ومطابخ الإعاشة في السعودية: لحوم برازيلية وهندية معتمدة حلال، مجمدة عند -18°م، كراتين 20 كجم بأسعار جملة منافسة.', en: 'Commercial frozen beef and mutton distributor in Saudi Arabia: 100% Halal certified, blast frozen at -18°C, SFDA inspected 20kg cartons for kitchens.' },
    },
    image: '/images/g-produce.png',
    alt: { ar: 'لحوم مجمدة عالية الجودة للمطاعم', en: 'Wholesale frozen meat selection' },
    featured: true,
    order: 6,
  },
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
      title: { ar: 'أرز بسمتي هندي فاخر بالجملة للشركات والمطاعم في الرياض وجدة | منافذ التوريد', en: 'Premium Indian Basmati Rice Wholesale for Restaurants & Companies | Mnaveth ALTourid' },
      description: { ar: 'توريد أرز بسمتي هندي مزة 1121 بالجملة للمطاعم ومطابخ الإعاشة في الرياض وجدة: معتق سنتين، حبة طويلة فائقة التمدد، أكياس 40 كجم و 10 كجم بأفضل أسعار التوريد.', en: 'Bulk Indian 1121 Sella Basmati rice supplier in Saudi Arabia: 2-year aged, extra-long grain elongation, 40kg & 10kg bags for commercial restaurants and catering.' },
    },
    image: '/images/p-rice.png',
    alt: { ar: 'أكياس أرز بسمتي مع مغرفة خشبية من الأرز', en: 'Sacks of basmati rice with a wooden scoop of rice' },
    price: { amount: 118, unit: { ar: 'للكيس', en: 'per sack' } },
    featured: true,
    order: 7,
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
      title: { ar: 'معلبات طماطم وبقوليات بالجملة للمطاعم والفنادق | منافذ التوريد', en: 'Wholesale Canned Food & Tomato Paste for Restaurants & Hotels | Mnaveth ALTourid' },
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
      title: { ar: 'توريد تمور فاخرة جملة للفنادق والشركات في السعودية | منافذ التوريد', en: 'Premium Bulk Dates Wholesale for Saudi Hotels & Corporate | Mnaveth ALTourid' },
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
      title: { ar: 'توريد زيوت طعام وقلي بالجملة للمطاعم في الرياض وجدة | منافذ التوريد', en: 'Commercial Cooking & Frying Oil Wholesale Supply Saudi Arabia | Mnaveth ALTourid' },
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
