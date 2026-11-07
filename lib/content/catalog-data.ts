import type { Localized } from '../i18n'

export type TempType = 'frozen' | 'chilled' | 'ambient'

export type CatalogCategory = {
  id: string
  name: Localized
  icon: string
  description?: Localized
  order: number
}

export type CatalogProduct = {
  id: string
  sku: string
  name: Localized
  categoryId: string
  categoryName: Localized
  description: Localized
  origin: Localized
  packaging: Localized
  storage: Localized
  certifications: Localized
  usage?: Localized
  tempType: TempType
  image: string
  order: number
  featured?: boolean
  priceNote?: Localized
}

export const catalogCategories: CatalogCategory[] = [
  {
    id: 'meat-poultry',
    name: { ar: 'اللحوم والدواجن المجمدة', en: 'Frozen Meat & Poultry' },
    icon: 'beef',
    description: {
      ar: 'لحوم بقرية وضأن ودواجن كاملة ومقطعات معتمدة حلال ومطابقة لاشتراطات SFDA.',
      en: 'Halal certified frozen beef, mutton, and poultry cuts complying with SFDA.',
    },
    order: 1,
  },
  {
    id: 'rice-grains',
    name: { ar: 'الأرز والحبوب والبقوليات', en: 'Rice, Grains & Pulses' },
    icon: 'wheat',
    description: {
      ar: 'أرز بسمتي هندي معتق وحبوب فاخرة بعبوات تموينية ضخمة للمطاعم ومطابخ الإعاشة.',
      en: 'Aged Indian basmati and premium grains in catering sacks for restaurants.',
    },
    order: 2,
  },
  {
    id: 'oils-fats',
    name: { ar: 'زيوت الطعام والدهون التموينية', en: 'Cooking Oils & Shortenings' },
    icon: 'droplet',
    description: {
      ar: 'زيوت قلي ونخيل ودوار الشمس وصفائح 18 لتر بنقطة دخان مرتفعة للتشغيل التجاري المكثف.',
      en: 'Frying oils, palm olein, and sunflower tins (18L) engineered for heavy commercial kitchens.',
    },
    order: 3,
  },
  {
    id: 'canned-pastes',
    name: { ar: 'المعلبات وصلصات الطماطم', en: 'Canned Food & Tomato Paste' },
    icon: 'container',
    description: {
      ar: 'معجون طماطم مركز A10 وبقوليات معلبة جاهزة للاستخدام الفندقي ومطاعم الإفطار.',
      en: 'Concentrated tomato paste A10 and canned legumes ready for hotel buffets and kitchens.',
    },
    order: 4,
  },
  {
    id: 'frozen-veg',
    name: { ar: 'الخضروات والبطاطس المجمدة', en: 'Frozen Vegetables & Fries' },
    icon: 'salad',
    description: {
      ar: 'بطاطس نصف مقلية وخضار مشكل مجمد تجميداً صدمياً فائق الجودة.',
      en: 'Quick-frozen french fries and mixed vegetables with minimal thaw loss.',
    },
    order: 5,
  },
  {
    id: 'dates-hospitality',
    name: { ar: 'التمور والضيافة الفاخرة', en: 'Dates & Premium Hospitality' },
    icon: 'sparkles',
    description: {
      ar: 'أجود تمور القصيم والمدينة المنورة بتغليف فردي معقم لضيافة كبرى الفنادق والشركات.',
      en: 'Hand-picked royal dates in flow-wrap luxury packaging for hotels and corporate gifting.',
    },
    order: 6,
  },
  {
    id: 'packaging-supplies',
    name: { ar: 'مواد التعبئة والتغليف للمطاعم', en: 'Food Packaging & Disposables' },
    icon: 'package',
    description: {
      ar: 'علب حفظ وحلول تغليف حراري ومستلزمات توصيل الوجبات الغذائية بالجملة.',
      en: 'Microwave containers, thermal rolls, and takeaway packaging supplies for food chains.',
    },
    order: 7,
  },
]

export const defaultCatalogProducts: CatalogProduct[] = [
  // 1. Meat & Poultry
  {
    id: 'cat-beef-topside',
    sku: 'MNV-BF-01',
    name: { ar: 'لحم بقري برازيلي مجمد (توب سايد منزوع العظم)', en: 'Frozen Brazilian Beef Topside (Boneless)' },
    categoryId: 'meat-poultry',
    categoryName: { ar: 'اللحوم والدواجن المجمدة', en: 'Frozen Meat & Poultry' },
    description: {
      ar: 'قطعيات توب سايد بقرية ممتازة منزوعة الشحوم والعظم، نسيج ناعم متجانس مثالي لمطاعم الشاورما والإسكالوب وكباب اللحم الفاخر.',
      en: 'Premium lean boneless topside beef, ideal for shawarma cones, escalope, and gourmet steaks.',
    },
    origin: { ar: 'البرازيل (مسالخ معتمدة S.I.F)', en: 'Brazil (SIF Approved)' },
    packaging: { ar: 'كرتون رئيسي 25 كجم (قوالب مفرغة 4-6 كجم)', en: '25kg Master Carton (4-6kg vacuum packs)' },
    storage: { ar: 'تجميد صدمي عند -18° مئوية أو أقل', en: 'Deep frozen at -18°C or below' },
    certifications: { ar: '100% ذبح حلال معتمد · فحص هيئة الغذاء والدواء SFDA', en: '100% Halal Slaughtered · SFDA Inspected' },
    usage: { ar: 'مطاعم الشاورما، محلات البرجر، الفنادق، ومطابخ الإعاشة الكبرى.', en: 'Shawarma chains, burger joints, hotels, and central kitchens.' },
    tempType: 'frozen',
    image: '/images/g-produce.png',
    order: 1,
    featured: true,
  },
  {
    id: 'cat-beef-silver',
    sku: 'MNV-BF-02',
    name: { ar: 'لحم بقري مجمد مكعبات وطهي (سيلفر سايد)', en: 'Frozen Beef Silverside (Catering Cuts)' },
    categoryId: 'meat-poultry',
    categoryName: { ar: 'اللحوم والدواجن المجمدة', en: 'Frozen Meat & Poultry' },
    description: {
      ar: 'قطع سيلفر سايد عالية الجودة خالية من العروق الزائدة، مخصصة للطبخ واليخنات ومطاعم المندي والمضغوط والوجبات الجماعية.',
      en: 'Silverside boneless beef cuts with optimal grain structure for stews, Mandi, and bulk catering.',
    },
    origin: { ar: 'البرازيل / الهند', en: 'Brazil / India' },
    packaging: { ar: 'كرتون 20 كجم و 25 كجم مفرغ من الهواء', en: '20kg & 25kg vacuum sealed cartons' },
    storage: { ar: 'يُحفظ مجمداً عند -18° مئوية مع رقابة حرارية', en: 'Stored at -18°C under continuous monitoring' },
    certifications: { ar: 'شهادة ذبح إسلامي رسمية · ترخيص واردات SFDA', en: 'Official Halal Certificate · SFDA Import License' },
    usage: { ar: 'مطابخ الإعاشة، مطاعم الكبسة والمندي، وشركات التموين.', en: 'Catering kitchens, Kabsa & Mandi restaurants.' },
    tempType: 'frozen',
    image: '/images/g-boxes.png',
    order: 2,
  },
  {
    id: 'cat-beef-liver',
    sku: 'MNV-BF-03',
    name: { ar: 'كبدة بقرية برازيلية مجمدة فاخرة', en: 'Premium Brazilian Frozen Beef Liver' },
    categoryId: 'meat-poultry',
    categoryName: { ar: 'اللحوم والدواجن المجمدة', en: 'Frozen Meat & Poultry' },
    description: {
      ar: 'كبدة بقرية مجمدة سريعة الصدم خالية من المرارة والعروق، لون طبيعي متماسك دون فاقد سوائل عند التقطيع.',
      en: 'Blast-frozen beef liver, vein-free, consistent slicing texture with minimal thawing loss.',
    },
    origin: { ar: 'البرازيل (أكبر المسالخ المعتمدة)', en: 'Brazil (Certified S.I.F Plants)' },
    packaging: { ar: 'كرتون 10 كجم و 20 كجم (قوالب مغلفة)', en: '10kg & 20kg cartons (poly-wrapped blocks)' },
    storage: { ar: 'مستودعات تبريد مجمدة عند -18°م إلى -20°م', en: 'Cold storage at -18°C to -20°C' },
    certifications: { ar: 'شهادة فحص مخبري SFDA · شهادة ذبح حلال', en: 'SFDA Laboratory Tested · Halal Certified' },
    usage: { ar: 'مطاعم الكبدة المقلقلة، بوفيهات الإفطار، ومحلات السندويشات السريعة.', en: 'Breakfast diners, skillet stations, quick-service eateries.' },
    tempType: 'frozen',
    image: '/images/p-olive-oil.png',
    order: 3,
    featured: true,
  },
  {
    id: 'cat-chicken-breast',
    sku: 'MNV-CK-01',
    name: { ar: 'صدور دجاج مجمدة منزوعة العظم والجلد (فردية IQF)', en: 'IQF Frozen Boneless Skinless Chicken Breast' },
    categoryId: 'meat-poultry',
    categoryName: { ar: 'اللحوم والدواجن المجمدة', en: 'Frozen Meat & Poultry' },
    description: {
      ar: 'صدور دجاج مجمدة تجميداً فردياً IQF بدون ماء مضاف، نسبة تصافي مرتفعة ونسيج رطب طري للشوي والتتبيل الفوري.',
      en: 'Individually Quick Frozen (IQF) chicken fillets with zero water soaking, high cook yield for grilling.',
    },
    origin: { ar: 'البرازيل', en: 'Brazil' },
    packaging: { ar: 'كرتون 15 كجم (6 أكياس × 2.5 كجم)', en: '15kg Carton (6 bags × 2.5kg)' },
    storage: { ar: 'تجميد عند -18° مئوية بسلسلة تبريد متصلة', en: 'Deep frozen at -18°C unbroken cold chain' },
    certifications: { ar: 'ذبح حلال 100% · معتمد هيئة الغذاء والدواء', en: '100% Halal · SFDA Approved' },
    usage: { ar: 'مطاعم الشاورما، البرجر الصحي، الفنادق، ووجبات الدايت.', en: 'Chicken shawarma, diet meal prep, hotel buffets.' },
    tempType: 'frozen',
    image: '/images/service-food.png',
    order: 4,
    featured: true,
  },
  {
    id: 'cat-whole-chicken',
    sku: 'MNV-CK-02',
    name: { ar: 'دجاج مجمد كامل أوزان تجارية (1000غ - 1100غ)', en: 'Frozen Whole Chicken Griller (1000g - 1100g)' },
    categoryId: 'meat-poultry',
    categoryName: { ar: 'اللحوم والدواجن المجمدة', en: 'Frozen Meat & Poultry' },
    description: {
      ar: 'دجاج كامل منظف ومجمد صدمياً بأوزان متجانسة مثالية لمطاعم الشواية والكبسة ومطابخ الولائم.',
      en: 'Calibrated whole frozen chicken, perfectly sized for commercial rotisserie and Mandi ovens.',
    },
    origin: { ar: 'البرازيل / فرنسا', en: 'Brazil / France' },
    packaging: { ar: 'كرتون 10 حبات مغلفة فردياً (10 كجم - 11 كجم)', en: '10 birds individually poly-bagged per master carton' },
    storage: { ar: 'يُحفظ مجمداً عند -18° مئوية', en: 'Keep frozen at -18°C' },
    certifications: { ar: 'شهادة حلال إسلامية · مطابقة المواصفة السعودية SASO', en: 'Halal Certified · SASO Compliant' },
    usage: { ar: 'مطاعم الشواية، الفحم، ومطابخ الإعاشة للشركات.', en: 'Rotisserie, charcoal chicken, and corporate mess halls.' },
    tempType: 'frozen',
    image: '/images/g-produce.png',
    order: 5,
  },

  // 2. Rice, Grains & Pulses
  {
    id: 'cat-basmati-1121',
    sku: 'MNV-RC-1121',
    name: { ar: 'أرز بسمتي هندي مزة 1121 فاخر (معتق سنتين)', en: 'Premium Indian 1121 Sella Basmati Rice (2-Year Aged)' },
    categoryId: 'rice-grains',
    categoryName: { ar: 'الأرز والحبوب والبقوليات', en: 'Rice, Grains & Pulses' },
    description: {
      ar: 'أرز بسمتي هندي ملكي معتق سنتين، حبة طويلة تتضاعف 2.5 مرة بعد الطهي دون أي تعجن، مع ثبات الحبة في القدور الضخمة.',
      en: '2-year naturally aged 1121 Sella golden grain basmati with 2.5x cooking elongation, non-sticky texture.',
    },
    origin: { ar: 'الهند (إقليم البنجاب وهاريانا)', en: 'India (Punjab & Haryana)' },
    packaging: { ar: 'أكياس خيش وبولي بروبيلين مزدوجة 40 كجم و 10 كجم', en: '40kg & 10kg heavy-duty dual-layer woven sacks' },
    storage: { ar: 'مستودعات جافة مهواة بدرجة حرارة أقل من 25° مئوية', en: 'Ambient dry ventilated warehouse below 25°C' },
    certifications: { ar: 'مطابق SASO · فحص مخبري لخلو الشوائب ومطابقة SFDA', en: 'SASO Compliant · SFDA Inspected Zero-Impurity' },
    usage: { ar: 'مطاعم الكبسة، المندي، البخاري، والولائم والفنادق.', en: 'Commercial Kabsa, Mandi, Bukhari restaurants, and banquets.' },
    tempType: 'ambient',
    image: '/images/p-rice.png',
    order: 6,
    featured: true,
  },
  {
    id: 'cat-white-sella',
    sku: 'MNV-RC-W02',
    name: { ar: 'أرز سيلا أبيض حبة طويلة للتشغيل التجاري', en: 'Long Grain White Sella Rice (Commercial)' },
    categoryId: 'rice-grains',
    categoryName: { ar: 'الأرز والحبوب والبقوليات', en: 'Rice, Grains & Pulses' },
    description: {
      ar: 'أرز سيلا أبيض مخصص لمطابخ الإعاشة ذات السعة العالية، يعطي كمية وفيرة لكل كيس واقتصادي ومقاوم للحرارة المفرطة.',
      en: 'High-volume commercial white sella rice delivering maximum volume yield per bag for large-scale operations.',
    },
    origin: { ar: 'الهند / باكستان', en: 'India / Pakistan' },
    packaging: { ar: 'أكياس 40 كجم منسوجة ومقاومة للرطوبة', en: '40kg moisture-resistant poly sacks' },
    storage: { ar: 'مستودع جاف على طبليات مرتفعة عن الأرض', en: 'Palletized dry storage away from moisture' },
    certifications: { ar: 'شهادة جودة مطابقة المواصفة القياسية SFDA', en: 'SFDA Standard Grade Certificate' },
    usage: { ar: 'مطابخ مشاريع المقاولات، الإعاشة العسكرية والمدرسية.', en: 'Construction camp catering, institutional mess halls.' },
    tempType: 'ambient',
    image: '/images/p-rice.png',
    order: 7,
  },

  // 3. Oils & Fats
  {
    id: 'cat-palm-olein',
    sku: 'MNV-OL-PL18',
    name: { ar: 'زيت أولين النخيل للقلي التجاري (صفيحة 18 لتر)', en: 'Commercial Palm Olein Frying Oil (18L Tin)' },
    categoryId: 'oils-fats',
    categoryName: { ar: 'زيوت الطعام والدهون التموينية', en: 'Cooking Oils & Shortenings' },
    description: {
      ar: 'زيت قلي فندقي مكرر عالي الاستقرار، يتحمل درجات الحرارة العالية والقلي المتكرر لساعات طويلة دون تكون روائح أو دخان.',
      en: 'Refined high-stability palm olein with high smoke point, engineered for prolonged deep frying.',
    },
    origin: { ar: 'ماليزيا / المملكة العربية السعودية', en: 'Malaysia / Saudi Arabia' },
    packaging: { ar: 'صفائح معدنية محكمة 18 لتر صافي مع فوهة سكب', en: '18L net heavy metal tin with pouring spout' },
    storage: { ar: 'يُحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس', en: 'Store in cool dry space away from direct sun' },
    certifications: { ar: 'معتمد من هيئة الغذاء والدواء SFDA وخالٍ من الدهون المهدرجة صناعياً', en: 'SFDA Certified · Zero Trans Fat Formula' },
    usage: { ar: 'مطاعم البروستد والبطاطس المقرمشة، الفاست فود، والمخابز.', en: 'Broasted chicken, french fries, fast food chains.' },
    tempType: 'ambient',
    image: '/images/g-juice.png',
    order: 8,
    featured: true,
  },
  {
    id: 'cat-sunflower-oil',
    sku: 'MNV-OL-SN18',
    name: { ar: 'زيت دوار الشمس النقي للطهي (18 لتر / كرتون 4×5 لتر)', en: 'Pure Sunflower Cooking Oil (18L Tin / 4x5L Carton)' },
    categoryId: 'oils-fats',
    categoryName: { ar: 'زيوت الطعام والدهون التموينية', en: 'Cooking Oils & Shortenings' },
    description: {
      ar: 'زيت دوار شمس نقي 100% مكرر وخفيف على المعدة، غني بفيتامين E، مثالي لتحضير الأرز والإيدامات والصلصات والسلطات.',
      en: '100% pure refined sunflower oil, light texture, ideal for light sautéing, sauces, and hotel dining.',
    },
    origin: { ar: 'أوكرانيا / إسبانيا / تركيا', en: 'Spain / Turkey / Ukraine' },
    packaging: { ar: 'صفائح 18 لتر أو كرتون (4 جوالين × 5 لتر)', en: '18L Tin or Carton of (4 × 5L Jugs)' },
    storage: { ar: 'يُحفظ في درجة حرارة الغرفة أقل من 25°م', en: 'Store at ambient room temp below 25°C' },
    certifications: { ar: 'مطابق للمواصفات السعودية والخليجية GSO / SFDA', en: 'GSO & SFDA Standard Compliant' },
    usage: { ar: 'الفنادق الـ 5 نجوم، المطاعم الفاخرة، ومطابخ المستشفيات.', en: '5-star hotels, gourmet kitchens, hospital catering.' },
    tempType: 'ambient',
    image: '/images/p-olive-oil.png',
    order: 9,
  },

  // 4. Canned Food & Tomato Paste
  {
    id: 'cat-tomato-paste-a10',
    sku: 'MNV-CN-TM10',
    name: { ar: 'معجون طماطم نقي تركيز بريكس 28-30% عبوة فندقية A10', en: 'Pure Tomato Paste Brix 28-30% Catering Tin A10' },
    categoryId: 'canned-pastes',
    categoryName: { ar: 'المعلبات وصلصات الطماطم', en: 'Canned Food & Tomato Paste' },
    description: {
      ar: 'معجون طماطم طبيعي فائق التركيز واللون الأحمر الداكن بدون أي ملونات صناعية، يعطي كثافة ونكهة غنية لجميع الطبخات والشوربات.',
      en: 'High-density Brix 28-30% natural tomato paste, intense red color without artificial dyes, for rich gravies.',
    },
    origin: { ar: 'المملكة العربية السعودية / إيطاليا', en: 'Saudi Arabia / Italy' },
    packaging: { ar: 'كرتون 6 عبوات فندقية كبيرة A10 (وزن العبوة 3 كجم صافي)', en: 'Carton of 6 large A10 catering tins (3kg net each)' },
    storage: { ar: 'تخزين جاف في درجة حرارة معتدلة', en: 'Dry storage at ambient temperature' },
    certifications: { ar: 'مطابق SFDA و SASO مع صلاحية 24 شهراً', en: 'SFDA & SASO Compliant · 24-Month Shelf Life' },
    usage: { ar: 'مطاعم الكبسة، الإيدامات، مطابخ الفنادق، ومصانع الأغذية.', en: 'Kabsa restaurants, stews, central hotel commissaries.' },
    tempType: 'ambient',
    image: '/images/p-canned.png',
    order: 10,
    featured: true,
  },
  {
    id: 'cat-chickpeas-a10',
    sku: 'MNV-CN-CP10',
    name: { ar: 'حمص حب معلب درجة أولى عبوة تموينية ضخمة', en: 'Canned Premium Chickpeas Catering Tin A10' },
    categoryId: 'canned-pastes',
    categoryName: { ar: 'المعلبات وصلصات الطماطم', en: 'Canned Food & Tomato Paste' },
    description: {
      ar: 'حمص حب مسلوق متجانس الحبة وطري النواة، ممتاز لتحضير مقبلات الحمص بالطحينة، الفتة، والشوربات دون هدر أو وقت تجهيز.',
      en: 'Cooked uniform chickpeas with creamy core, ready for smooth hummus dips, salads, and Mediterranean dishes.',
    },
    origin: { ar: 'المملكة العربية السعودية / تركيا', en: 'Saudi Arabia / Turkey' },
    packaging: { ar: 'كرتون 6 علب A10 (3 كجم صافي للعلبة)', en: 'Carton of 6 × 3kg net A10 tins' },
    storage: { ar: 'يُحفظ في مكان جاف مهوى', en: 'Store in a cool ventilated dry storage' },
    certifications: { ar: 'ترخيص رسمي من هيئة الغذاء والدواء SFDA', en: 'Official SFDA Food License' },
    usage: { ar: 'محلات الحمص والفلافل، مطاعم المقبلات اللبنانية والشامية، وبوفيهات الفنادق.', en: 'Hummus & falafel shops, Lebanese restaurants, buffets.' },
    tempType: 'ambient',
    image: '/images/p-canned.png',
    order: 11,
  },
  {
    id: 'cat-fava-beans-a10',
    sku: 'MNV-CN-FB10',
    name: { ar: 'فول مدمس درجة أولى حبّة ممتلئة عبوة فندقية', en: 'Canned Fava Beans Catering Tin A10' },
    categoryId: 'canned-pastes',
    categoryName: { ar: 'المعلبات وصلصات الطماطم', en: 'Canned Food & Tomato Paste' },
    description: {
      ar: 'فول مدمس طري سهل الهرس بقشرة رقيقة ومذاق غني، مخصص لمطاعم الفول وبوفيهات الإفطار اليومية في الفنادق.',
      en: 'Soft-skin tender fava beans engineered for quick mashing and traditional Saudi breakfast dishes.',
    },
    origin: { ar: 'المملكة العربية السعودية / مصر', en: 'Saudi Arabia / Egypt' },
    packaging: { ar: 'كرتون 6 علب فندقية A10 (3 كجم صافي)', en: 'Carton of 6 × 3kg A10 tins' },
    storage: { ar: 'مستودعات جافة معتدلة', en: 'Ambient dry storage' },
    certifications: { ar: 'مطابق لاشتراطات السلامة الغذائية SFDA', en: 'SFDA Food Safety Compliant' },
    usage: { ar: 'مطاعم ومطابخ الإفطار الشعبي، بوفيهات الفنادق، ومقاصف الشركات.', en: 'Traditional breakfast diners, hotel breakfasts, cafeterias.' },
    tempType: 'ambient',
    image: '/images/p-canned.png',
    order: 12,
  },

  // 5. Frozen Vegetables & Fries
  {
    id: 'cat-french-fries-9mm',
    sku: 'MNV-FZ-FF09',
    name: { ar: 'بطاطس نصف مقلية مجمدة 9×9 ملم (كرتون 10 كجم)', en: 'Frozen French Fries 9x9mm (Carton 4x2.5kg)' },
    categoryId: 'frozen-veg',
    categoryName: { ar: 'الخضروات والبطاطس المجمدة', en: 'Frozen Vegetables & Fries' },
    description: {
      ar: 'أصابع بطاطس بلجيكية نصف مقلية تجميد صدمي سريع، قرمشة خارجية طويلة الأمد ونواة بطاطس طرية مع امتصاص قليل للزيت.',
      en: 'Grade-A Belgian par-fried potato sticks (9x9mm), extended crispiness retention with low oil absorption.',
    },
    origin: { ar: 'بلجيكا / هولندا', en: 'Belgium / Netherlands' },
    packaging: { ar: 'كرتون 10 كجم (4 أكياس × 2.5 كجم)', en: '10kg Master Carton (4 bags × 2.5kg)' },
    storage: { ar: 'تجميد عند -18° مئوية دون انقطاع', en: 'Store frozen at -18°C unbroken' },
    certifications: { ar: 'فحص مخبري SFDA · مطابقة للمواصفة الخليجية GSO', en: 'SFDA Inspected · GSO Standard Compliant' },
    usage: { ar: 'سلاسل البرجر، مطاعم الشاورما، الفاست فود، والفنادق.', en: 'Burger chains, shawarma shops, quick-serve restaurants.' },
    tempType: 'frozen',
    image: '/images/g-produce.png',
    order: 13,
    featured: true,
  },
  {
    id: 'cat-mixed-veg',
    sku: 'MNV-FZ-VG10',
    name: { ar: 'خضار مشكل مجمد وبازلاء حبات ممتازة (كرتون 10 كجم)', en: 'Frozen Mixed Vegetables & Green Peas (10kg Carton)' },
    categoryId: 'frozen-veg',
    categoryName: { ar: 'الخضروات والبطاطس المجمدة', en: 'Frozen Vegetables & Fries' },
    description: {
      ar: 'مزيج خضار متوازن من البازلاء الخضراء والجزر المقطع والذرة الحلوة والفاصوليا، مجمدة فور القطف للاحتفاظ بالفيتامينات والنضارة.',
      en: 'Color-balanced blend of peas, diced carrots, sweet corn, and green beans, blast frozen at peak harvest.',
    },
    origin: { ar: 'بلجيكا / مصر', en: 'Belgium / Egypt' },
    packaging: { ar: 'كرتون 10 كجم (10 أكياس × 1 كجم أو 4 × 2.5 كجم)', en: '10kg carton (10 × 1kg or 4 × 2.5kg bags)' },
    storage: { ar: 'تجميد مستمر عند -18° مئوية', en: 'Continuous freezing at -18°C' },
    certifications: { ar: 'شهادة جودة زراعية وخلو من المبيدات ومطابقة SFDA', en: 'Zero Chemical Residue · SFDA Clearance' },
    usage: { ar: 'مطابخ الأرز والبرياني، الإيدامات، بوفيهات الفنادق، ومطابخ المستشفيات.', en: 'Fried rice, stews, hospital meals, corporate canteens.' },
    tempType: 'frozen',
    image: '/images/g-boxes.png',
    order: 14,
  },

  // 6. Dates & Hospitality
  {
    id: 'cat-dates-sukkari',
    sku: 'MNV-DT-SK03',
    name: { ar: 'تمر سكري مفتل ملكي لضيافة الفنادق (تغليف فردي معقم)', en: 'Royal Sukkari Dates (Hygienic Individual Flow-Wrap)' },
    categoryId: 'dates-hospitality',
    categoryName: { ar: 'التمور والضيافة الفاخرة', en: 'Dates & Premium Hospitality' },
    description: {
      ar: 'أجود حبات التمر السكري المفتل الملكي من مزارع القصيم، منتقاة حبة حبة بتغليف فردي فاخر ومعقم يلبي متطلبات الاستقبال والضيافة الراقية.',
      en: 'Hand-sorted Grade-A royal golden Sukkari dates from Qassim, individually flow-wrapped for luxury hospitality.',
    },
    origin: { ar: 'المملكة العربية السعودية (مزارع القصيم المعتمدة)', en: 'Saudi Arabia (Qassim Selected Farms)' },
    packaging: { ar: 'كرتون 3 كجم و 5 كجم (حبات فردية مغلفة سيلوفان فاخر)', en: '3kg & 5kg Cartons (Individual hermetic flow-wraps)' },
    storage: { ar: 'تخزين مبرد متحكم بالرطوبة عند +4° مئوية', en: 'Climate-controlled chilled storage at +4°C' },
    certifications: { ar: 'علامة التمور السعودية · شهادة سلامة الغذاء SFDA', en: 'Saudi Dates Mark Certified · SFDA Registered' },
    usage: { ar: 'ردهات فنادق الـ 5 نجوم، طيران رجال الأعمال، ومجالس الإدارة بالشركات.', en: '5-star hotel lobbies, executive boardrooms, VIP lounges.' },
    tempType: 'chilled',
    image: '/images/p-dates.png',
    order: 15,
    featured: true,
  },
  {
    id: 'cat-dates-khalas',
    sku: 'MNV-DT-KH08',
    name: { ar: 'تمر خلاص الأحساء فاخر مكنوز (كرتون 8 كجم)', en: 'Premium Khalas Al-Ahsa Dates (8kg Master Carton)' },
    categoryId: 'dates-hospitality',
    categoryName: { ar: 'التمور والضيافة الفاخرة', en: 'Dates & Premium Hospitality' },
    description: {
      ar: 'خلاص الأحساء الفاخر حبة ذهبية مدبسة طبيعياً، مكنوز آلياً بتفريغ هواء للحفاظ على الطراوة والمذاق العسلي الأصيل.',
      en: 'Golden Al-Ahsa Khalas dates with natural date syrup glaze, vacuum-packed in hygienic commercial bricks.',
    },
    origin: { ar: 'المملكة العربية السعودية (واحة الأحساء)', en: 'Saudi Arabia (Al-Ahsa Oasis)' },
    packaging: { ar: 'كرتون 8 كجم (8 أكياس مفرغة × 1 كجم)', en: '8kg Master Carton (8 × 1kg vacuum bricks)' },
    storage: { ar: 'يُحفظ في مكان بارد وجاف أو مبرد عند 4°م إلى 10°م', en: 'Cool dry or chilled storage at 4°C to 10°C' },
    certifications: { ar: 'مطابق لمعايير الجودة والمواصفة السعودية للتمور', en: 'Saudi Date Quality Mark & SFDA Compliant' },
    usage: { ar: 'مقدمي خدمات الإعاشة في مواسم الحج والعمرة، الشركات، والمقاهي.', en: 'Hajj & Umrah catering, corporate gifts, traditional cafes.' },
    tempType: 'ambient',
    image: '/images/p-dates.png',
    order: 16,
  },

  // 7. Packaging Supplies
  {
    id: 'cat-food-containers',
    sku: 'MNV-PK-MC01',
    name: { ar: 'علب وحافظات وجبات ميكرويف سوداء بغطاء محكم (كرتون 500 حبة)', en: 'Heavy-Duty Black Microwave Meal Containers & Lids (500 Pcs)' },
    categoryId: 'packaging-supplies',
    categoryName: { ar: 'مواد التعبئة والتغليف للمطاعم', en: 'Food Packaging & Disposables' },
    description: {
      ar: 'حافظات وجبات من مادة البولي بروبيلين الآمنة غذائياً والمقاومة للحرارة والتسريب، ممتازة لمطاعم الدايت والوجبات الصحية وخدمات التوصيل.',
      en: 'BPA-free food grade PP meal containers with anti-leak snap lids, microwave and freezer safe for meal preps.',
    },
    origin: { ar: 'المملكة العربية السعودية (مصانع وطنية معتمدة)', en: 'Saudi Arabia (SFDA Licensed Plants)' },
    packaging: { ar: 'كرتون جملة 500 طقم (قاعدة + غطاء شفاف محكم)', en: 'Master Carton 500 Sets (Bases + Clear Snap Lids)' },
    storage: { ar: 'مستودعات جافة نظيفة بعيدة عن الغبار والحرارة', en: 'Clean ambient storage away from dust & heat' },
    certifications: { ar: 'شهادة ترخيص المواد الملامسة للغذاء من SFDA وخالية من BPA', en: 'SFDA Food Contact Approved · 100% BPA Free' },
    usage: { ar: 'مطاعم الوجبات الصحية، السحابية، وشركات التوصيل السريع.', en: 'Healthy meal prep brands, cloud kitchens, delivery chains.' },
    tempType: 'ambient',
    image: '/images/g-packing.png',
    order: 17,
  },
  {
    id: 'cat-thermal-rolls',
    sku: 'MNV-PK-TR02',
    name: { ar: 'رولات تغليف حراري وألمنيوم فندقي ثقيل للمطابخ', en: 'Heavy-Duty Commercial Aluminum Foil & Cling Film Rolls' },
    categoryId: 'packaging-supplies',
    categoryName: { ar: 'مواد التعبئة والتغليف للمطاعم', en: 'Food Packaging & Disposables' },
    description: {
      ar: 'رولات ألمنيوم سميكة مقاومة للتمزق مع نايلون تغليف غذائي عالي المرونة لحفظ وتغطية صواني الطعام في المطابخ المركزية والفنادق.',
      en: 'Heavy gauge tear-resistant aluminum foil and commercial cling film for high-heat cooking and food prep.',
    },
    origin: { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia' },
    packaging: { ar: 'كرتون 6 رولات فندقية عرض 45 سم بطول تجاري', en: 'Carton of 6 commercial rolls (45cm width)' },
    storage: { ar: 'يُحفظ في مكان جاف ومعتدل', en: 'Store in dry clean ambient room' },
    certifications: { ar: 'مطابق للمواصفات القياسية للأدوات الملامسة للغذاء', en: 'SASO & SFDA Food Contact Safe' },
    usage: { ar: 'مطابخ الشواء، المخابز، ومحطات إعداد الطعام المركزية.', en: 'BBQ pits, commercial bakeries, central banquet prep.' },
    tempType: 'ambient',
    image: '/images/warehouse-main.png',
    order: 18,
  },
]
