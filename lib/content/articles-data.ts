export type SanityBlock = {
  _key: string
  _type: 'block'
  style: 'normal' | 'h2' | 'h3' | 'blockquote'
  markDefs: { _key: string; _type: string; href?: string }[]
  children: { _key: string; _type: 'span'; marks: string[]; text: string }[]
}

export type ArticleData = {
  _id: string
  _type: 'article'
  title: { _type: 'localizedString'; ar: string; en: string }
  slug: { _type: 'slug'; current: string }
  excerpt: { _type: 'localizedText'; ar: string; en: string }
  coverImage: {
    _type: 'localizedImage'
    alt: { _type: 'localizedString'; ar: string; en: string }
    asset: { _ref: string; _type: 'reference' }
  }
  body: SanityBlock[]
  bodyEn: SanityBlock[]
  author: string
  publishedAt: string
  order: number
  visible: boolean
  seo: {
    _type: 'seo'
    title: { _type: 'localizedString'; ar: string; en: string }
    description: { _type: 'localizedText'; ar: string; en: string }
  }
}

const b = (text: string, key: string, style: 'normal' | 'h2' | 'h3' | 'blockquote' = 'normal'): SanityBlock => ({
  _key: key,
  _type: 'block',
  style,
  markDefs: [],
  children: [{ _key: `${key}-span`, _type: 'span', marks: [], text }],
})

export const batch1Articles: ArticleData[] = [
  {
    _id: 'article-food-supply-companies-restaurants-riyadh',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'دليل اختيار أفضل شركات توريد مواد غذائية للمطاعم في الرياض',
      en: 'Guide to Choosing the Best Food Supply Companies for Restaurants in Riyadh',
    },
    slug: {
      _type: 'slug',
      current: 'food-supply-companies-restaurants-riyadh',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'دليل عملي شامل لمديري المشتريات وملاك المطاعم في الرياض لاختيار مورد الأغذية المعتمد، ومعايير تقييم الجودة واستقرار سلاسل الإمداد واشتراطات هيئة الغذاء والدواء (SFDA).',
      en: 'A comprehensive practical guide for procurement managers and restaurant owners in Riyadh on selecting certified food suppliers, quality criteria, and supply chain stability.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'توريد المواد الغذائية للمطاعم والفنادق في الرياض - شركة منافذ التوريد',
        en: 'Food supplies for restaurants and hotels in Riyadh - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-63632c9db927ac23d070a0d358a8869be50592d6-1312x816-png',
        _type: 'reference',
      },
    },
    author: 'فريق سلاسل الإمداد | منافذ التوريد',
    publishedAt: '2026-11-01T08:00:00.000Z',
    order: 1,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'أفضل شركات توريد مواد غذائية للمطاعم في الرياض | منافذ التوريد',
        en: 'Best Food Supply Companies for Restaurants in Riyadh | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'تعرف على معايير اختيار شركات توريد الأغذية للمطاعم بالرياض: التوصيل المبرد، حلول التوريد الشامل، الامتثال لهيئة الغذاء والدواء، وثبات الأسعار.',
        en: 'Discover criteria for selecting food suppliers in Riyadh: refrigerated delivery, complete supply solutions, SFDA compliance, and price stability.',
      },
    },
    body: [
      b('أهمية اختيار مورد أغذية موثوق لنجاح المطاعم في العاصمة الرياض', 'p1-h2-1', 'h2'),
      b('تشهد العاصمة الرياض نمواً استثنائياً في قطاع الضيافة والمطاعم والمقاهي تماشياً مع مستهدفات رؤية المملكة 2030. وفي خضم هذا التنافس المحموم، لم تعد جودة الطهي وحدها كافية لنجاح المطعم، بل أصبحت كفاءة سلاسل الإمداد الغذائي هي المحرك الخفي لربحية المشروع واستمراريته.', 'p1-b1'),
      b('تأخر شحنة واحدة من اللحوم أو الأرز أو زيوت الطهي كفيل بتعطيل المطبخ خلال ساعات الذروة وخسارة ولاء العملاء. لذلك، يعد التعاقد مع مورد أغذية معتمد بالرياض استثماراً استراتيجياً في استقرار التشغيل.', 'p1-b2'),
      b('المعايير الخمسة الذهبية لتقييم شركات توريد الأغذية بالرياض', 'p1-h2-2', 'h2'),
      b('1. الالتزام بجداول التوصيل اليومية وأسطول النقل المبرد', 'p1-h3-1', 'h3'),
      b('يجب التأكد من امتلاك المورد أسطولاً مجهزاً بنظام التحكم بدرجات الحرارة (مبردة ومجمدة وجافة) ومربوطاً بأنظمة تتبع لحظية لضمان عدم تعرض المنتجات الحساسة لحرارة الجو أثناء التوصيل داخل أحياء الرياض.', 'p1-b3'),
      b('2. نموذج المورد الشامل (One-Stop Supplier)', 'p1-h3-2', 'h3'),
      b('التعامل مع مورد مركزي واحد يوفر السلع الأساسية، اللحوم، البقوليات، الزيوت، والمعلبات يسهم في تخفيض التكاليف الإدارية وفواتير الشحن بنسبة تصل إلى 25% مقارنة بالتشتت بين عشرات الموزعين الصغار.', 'p1-b4'),
      b('3. الامتثال لاشتراطات الهيئة العامة للغذاء والدواء (SFDA)', 'p1-h3-3', 'h3'),
      b('التأكد من أن جميع البضائع المستوردة مسجلة رسمياً بنظام الهيئة، ومرفق بها شهادات الفحص المخبري، وشهادات الذبح الحلال المعتمدة بالنسبة للحوم والدواجن.', 'p1-b5'),
      b('4. عقود توريد سنوية تضمن استقرار الأسعار', 'p1-h3-4', 'h3'),
      b('تقلبات أسعار السلع التموينية عالمياً قد تلتهم هوامش ربح المطعم. المورد المحترف يتيح آليات تثبيت الأسعار للسلع الاستراتيجية مثل الأرز والزيوت لعدة أشهر لحماية دراسة تكلفة الوجبات (Menu Costing).', 'p1-b6'),
      b('5. المرونة المالية وشروط السداد الميسرة', 'p1-h3-5', 'h3'),
      b('توافر خيارات دفع مرنة وتسهيلات ائتمانية مدروسة تدعم التدفقات النقدية الدورية للمطعم.', 'p1-b7'),
      b('لماذا تختار شركة منافذ التوريد شريكاً لمطعمك في الرياض؟', 'p1-h2-3', 'h2'),
      b('منذ عام 2004، تقدم شركة منافذ التوريد حلول إمداد غذائي متكاملة من مستودعاتها المركزية بالرياض. نوفر تشكيلة واسعة تشمل الأرز البسمتي الهندي الفاخر، اللحوم والكبدة المجمدة، التمور، وزيوت الطعام مع التزام تام بمطابقة المواصفات القياسية السعودية.', 'p1-b8'),
      b('«استقرار المطبخ التجاري يبدأ من موثوقية المستودع الذي يغذيه؛ والشريك اللوجستي الناجح هو حائط الصد الأول لحماية أرباحك.»', 'p1-q1', 'blockquote'),
    ],
    bodyEn: [
      b('The Vital Role of Reliable Food Suppliers for Riyadh Restaurants', 'p1en-h2-1', 'h2'),
      b('Riyadh is witnessing unprecedented growth in the hospitality and food service sectors. In this highly competitive environment, food quality and punctual supply chains are decisive factors for maintaining kitchen continuity and business profitability.', 'p1en-b1'),
      b('Five Essential Criteria for Selecting Food Supply Partners in Riyadh', 'p1en-h2-2', 'h2'),
      b('1. Temperature-Controlled Fleet and Punctual Delivery Schedules', 'p1en-h3-1', 'h3'),
      b('Ensure the supplier operates calibrated refrigerated and frozen transport vehicles equipped with real-time GPS tracking to safeguard food safety in harsh weather conditions.', 'p1en-b2'),
      b('2. One-Stop Comprehensive Supplier Model', 'p1en-h3-2', 'h3'),
      b('Partnering with a full-service food distributor providing basmati rice, cooking oils, proteins, and canned goods reduces logistics overhead by up to 25%.', 'p1en-b3'),
      b('3. Rigorous SFDA and Halal Compliance', 'p1en-h3-3', 'h3'),
      b('Verify that all imported consignments are registered with the Saudi Food and Drug Authority and backed by certified halal and laboratory test documentation.', 'p1en-b4'),
      b('Why Partner with Mnaveth ALTourid in Riyadh?', 'p1en-h2-3', 'h2'),
      b('Serving the Saudi market since 2004, Mnaveth ALTourid provides end-to-end commercial food supply solutions from its central warehouses in Riyadh.', 'p1en-b5'),
    ],
  },
  {
    _id: 'article-cloud-kitchens-food-supply-chains-saudi-arabia',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'سلاسل الإمداد الغذائي للمطابخ السحابية والمركزية في السعودية: التحديات والحلول',
      en: 'Food Supply Chains for Cloud & Central Kitchens in Saudi Arabia: Challenges and Solutions',
    },
    slug: {
      _type: 'slug',
      current: 'cloud-kitchens-food-supply-chains-saudi-arabia',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'استكشف كيف تدير المطابخ السحابية والمركزية في المملكة سلاسل التوريد بكفاءة، مع حلول تقليل الهدر وضمان سرعة التحضير وتوحيد معايير الجودة لعدة علامات تجارية.',
      en: 'Explore how cloud and central kitchens in Saudi Arabia optimize food procurement, eliminate waste, and maintain uniform culinary standards across multiple brands.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'تعبئة وتوزيع المواد الغذائية للمطابخ السحابية والمركزية بالمملكة',
        en: 'Food packaging and supply for cloud and central kitchens in Saudi Arabia',
      },
      asset: {
        _ref: 'image-53423e76c46ccfbee9cfdf3dea522e438a502dd5-1024x1024-png',
        _type: 'reference',
      },
    },
    author: 'إدارة العمليات اللوجستية | منافذ التوريد',
    publishedAt: '2026-11-01T09:30:00.000Z',
    order: 2,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'توريد المطابخ السحابية والمركزية في السعودية | منافذ التوريد',
        en: 'Cloud Kitchen Food Supply Solutions in Saudi Arabia | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'حلول توريد مخصصة للمطابخ السحابية والمركزية في الرياض وجدة: توريد بنظام JIT، عبوات تجارية اقتصادية، وضمان توحيد المذاق عبر الفروع.',
        en: 'Dedicated supply chain solutions for cloud and commissary kitchens in Saudi Arabia: JIT delivery, bulk foodservice packaging, and taste uniformity.',
      },
    },
    body: [
      b('طفرة المطابخ السحابية (Cloud Kitchens) ومتطلبات التوريد الحديثة', 'p2-h2-1', 'h2'),
      b('أصبحت المطابخ السحابية والمركزية أحد أسرع القطاعات نمواً في سوق الأغذية والمشروبات السعودي. تخدم هذه المنشآت علامات تجارية افتراضية متعددة من مساحة طهي واحدة، وتعتمد كلياً على سرعة تحضير وتوصيل الطلبات عبر التطبيقات الإلكترونية.', 'p2-b1'),
      b('هذا النموذج الفريد يتطلب ديناميكية توريد مختلفة جذرياً عن المطاعم التقليدية؛ فأي تأخير في وصول المكونات يترتب عليه توقف عدة علامات تجارية في آن واحد.', 'p2-b2'),
      b('أبرز تحديات التوريد التي تواجه المطابخ السحابية', 'p2-h2-2', 'h2'),
      b('1. محدودية مساحات التخزين وضرورة نظام (Just-In-Time)', 'p2-h3-1', 'h3'),
      b('معظم مساحة المطبخ السحابي مخصصة لمحطات الطهي، مما يجعل مساحات التخزين الجاف والمبرد محدودة. الحل يكمن في التوريد اليومي المتكرر بنظام Just-In-Time لتفادي تكدس المواد.', 'p2-b3'),
      b('2. معيارية المكونات وتوحيد المذاق (Consistency)', 'p2-h3-2', 'h3'),
      b('إدارة عدة علامات تجارية تتطلب مكونات قياسية موحدة (Standardized Specs) في الأرز، درجات قطعيات اللحوم، وتركيز معجون الطماطم للحفاظ على نفس تجربة العميل دائماً.', 'p2-b4'),
      b('3. تقليص الهدر الغذائي عبر العبوات المتخصصة', 'p2-h3-3', 'h3'),
      b('توفير المواد الغذائية بعبوات مخصصة للشيف والمطابخ المركزية (Foodservice Packaging) يقلل وقت الفتح والتحضير ويحد من الفاقد.', 'p2-b5'),
      b('حلول منافذ التوريد لقطاع المطابخ السحابية والمركزية', 'p2-h2-3', 'h2'),
      b('توفر شركة منافذ التوريد جداول توريد مرنة، وربطاً مباشراً لطلبات الشراء، وتأمين مخزون استراتيجي مخصص لكل عميل في مستودعاتنا لتلبية الارتفاع المفاجئ في حجم الطلبات خلال عطلات نهاية الأسبوع ومواسم الفعاليات.', 'p2-b6'),
    ],
    bodyEn: [
      b('The Rise of Cloud Kitchens in the Saudi Food Ecosystem', 'p2en-h2-1', 'h2'),
      b('Cloud and central commissary kitchens represent one of the fastest-growing segments in Saudi Arabia, preparing food for multiple virtual brands within optimized shared cooking spaces.', 'p2en-b1'),
      b('Core Procurement Challenges for Ghost Kitchens', 'p2en-h2-2', 'h2'),
      b('1. Minimal On-Site Storage Requiring JIT Deliveries', 'p2en-h3-1', 'h3'),
      b('Cloud kitchens allocate square footage to cooking lines rather than warehouse storage, necessitating accurate daily deliveries.', 'p2en-b2'),
      b('2. Ingredient Consistency Across Multiple Brands', 'p2en-h3-2', 'h3'),
      b('Consistent grain length, oil purity, and meat cuts are non-negotiable for repeatable guest experiences.', 'p2en-b3'),
    ],
  },
  {
    _id: 'article-wholesale-food-supplies-restaurants-jeddah',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'جملة المواد الغذائية للمطاعم في جدة: كيف تخفض تكاليف التوريد دون المساس بالجودة؟',
      en: 'Wholesale Food Supplies for Restaurants in Jeddah: Reducing Costs Without Compromising Quality',
    },
    slug: {
      _type: 'slug',
      current: 'wholesale-food-supplies-restaurants-jeddah',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'استراتيجيات مجربة لأصحاب مطاعم ومقاهي جدة للحصول على أفضل أسعار جملة للمواد الغذائية، وإدارة سلاسل الإمداد عبر ميناء جدة الإسلامي بكفاءة عالية.',
      en: 'Proven strategies for restaurant operators in Jeddah to access direct wholesale food pricing and capitalize on port logistics efficiency.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'مستودعات وتوريد المواد الغذائية بالجملة في جدة والمنطقة الغربية',
        en: 'Wholesale food warehouse and supply in Jeddah and the Western Region',
      },
      asset: {
        _ref: 'image-501b2f1789b17aa3d5227d0cf5539dabebcd6b66-1734x907-png',
        _type: 'reference',
      },
    },
    author: 'قطاع التوزيع الغربي | منافذ التوريد',
    publishedAt: '2026-11-01T11:00:00.000Z',
    order: 3,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'موردين مواد غذائية جملة للمطاعم في جدة | منافذ التوريد',
        en: 'Wholesale Food Suppliers for Restaurants in Jeddah | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'احصل على أسعار جملة تنافسية للمواد الغذائية في جدة ومكة: لحوم مجمدة، أرز بسمتي، معلبات، وزيوت طهي من المستورد مباشرة دون وسطاء.',
        en: 'Competitive wholesale food supplies for restaurants in Jeddah & Makkah: frozen meat, basmati rice, canned goods, and cooking oils directly from the importer.',
      },
    },
    body: [
      b('ديناميكية سوق المطاعم في جدة ومواسم الضيافة', 'p3-h2-1', 'h2'),
      b('تتمتع مدينة جدة بخصوصية فريدة؛ فهي بوابة الحرمين الشريفين ووجهة سياحية وتجارية رئيسية. تشهد المطاعم فيها تقلبات موسمية حادة ترتبط بمواسم الحج والعمرة وإجازات الصيف والفعاليات العالمية.', 'p3-b1'),
      b('هذه الحركة تتطلب سلاسل إمداد مرنة قادرة على تلبية مضاعفة الطلب في مواسم الذروة وتخفيض التكاليف التشغيلية في فترات الهدوء.', 'p3-b2'),
      b('استراتيجيات خفض تكلفة المواد الغذائية لمطاعم جدة', 'p3-h2-2', 'h2'),
      b('1. الشراء المباشر من المستوردين وتجاوز حلقات التوزيع الوسيطة', 'p3-h3-1', 'h3'),
      b('كل وسيط إضافي في حلقة التوزيع يضيف هامش ربح يتراوح بين 7% إلى 12%. الشراء المباشر من شركة استيراد وتوزيع يضمن الحصول على أسعار المنفذ الأساسية.', 'p3-b3'),
      b('2. الاستفادة من الموقع اللوجستي لميناء جدة الإسلامي', 'p3-h3-2', 'h3'),
      b('تستقبل جدة الحاويات الغذائية القادمة من آسيا وأمريكا اللاتينية مباشرة. الاستفادة من مستودعات الموردين القريبة من الميناء تقلل تكاليف الشحن البري الداخلي وتضمن وصول الشحنات فور فسحها الجمركي.', 'p3-b4'),
      b('3. تخطيط المشتريات الربع سنوية للمواد الجافة والمجمدة', 'p3-h3-3', 'h3'),
      b('تأمين تعاقدات الأرز، الزيوت، واللحوم المجمدة لفترة 3 إلى 6 أشهر يحمي مطبخك من تذبذبات أسعار السلع في الأسواق العالمية.', 'p3-b5'),
      b('تغطية شاملة لجدة والمنطقة الغربية مع منافذ التوريد', 'p3-h2-3', 'h2'),
      b('من خلال فروعنا وشبكتنا اللوجستية، نضمن لمطاعم وفنادق جدة ومكة والمدينة توريداً سلساً للبضائع الغذائية بأعلى مواصفات الجودة مع خدمة عملاء متفانية على مدار الساعة.', 'p3-b6'),
    ],
    bodyEn: [
      b('The Unique Dynamics of Jeddah’s Food & Hospitality Market', 'p3en-h2-1', 'h2'),
      b('As the commercial hub of the Western Region and gateway to the Two Holy Mosques, Jeddah experiences significant demand surges during Umrah and Hajj seasons as well as summer tourism.', 'p3en-b1'),
      b('Actionable Strategies to Lower Food Costs for Jeddah Kitchens', 'p3en-h2-2', 'h2'),
      b('1. Direct Sourcing from Tier-1 Importers', 'p3en-h3-1', 'h3'),
      b('Bypassing intermediary wholesalers can immediately reduce procurement expenses by 7% to 15%.', 'p3en-b2'),
      b('2. Leveraging Proximity to Jeddah Islamic Port', 'p3en-h3-2', 'h3'),
      b('Direct warehouse infrastructure near the port facilitates swift distribution of frozen proteins and grains without extra handling costs.', 'p3en-b3'),
    ],
  },
  {
    _id: 'article-essential-food-supplies-checklist-restaurants',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'قائمة المواد الغذائية الأساسية للمطاعم: دليلك لتأمين المخزون الشهري',
      en: 'Essential Food Supplies Checklist for Restaurants: Monthly Inventory Procurement Guide',
    },
    slug: {
      _type: 'slug',
      current: 'essential-food-supplies-checklist-restaurants',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'دليل المشتريات الشامل لكل ما يحتاجه المطبخ التجاري شهرياً، مع تقسيم المواد حسب الأصناف الجافة والمبردة والمجمدة، وكيفية حساب نقطة إعادة الطلب (Reorder Point).',
      en: 'Comprehensive monthly procurement checklist for commercial kitchens: dry staples, frozen proteins, canned goods, and automated inventory safety stock calculations.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'مستودعات المخزون الغذائي والسلع الأساسية للمطاعم - منافذ التوريد',
        en: 'Food inventory warehouse and basic staples for restaurants - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-1609ad70b2b0b19228ed6b054ce968896c3a5db5-1024x1024-png',
        _type: 'reference',
      },
    },
    author: 'إدارة سلاسل الإمداد | منافذ التوريد',
    publishedAt: '2026-11-01T13:00:00.000Z',
    order: 4,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'قائمة مستلزمات المطاعم الغذائية بالجملة | منافذ التوريد',
        en: 'Restaurant Food Supplies Master Checklist | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'دليل عملي لتأمين المواد الغذائية الشهرية للمطاعم: الأرز البسمتي، اللحوم والكبدة المجمدة، الزيوت، والمعلبات مع معادلة حساب نقطة إعادة الطلب لتفادي نفاذ المخزون.',
        en: 'Essential monthly checklist for commercial restaurants: basmati rice, frozen meats, oils, and canned foods with reorder point formulas.',
      },
    },
    body: [
      b('أهمية إعداد قائمة مشتريات معيارية (Master Supply Checklist)', 'p4-h2-1', 'h2'),
      b('تعتمد كفاءة المطابخ التجارية الكبرى على التنظيم الدقيق للمخزون. العشوائية في الشراء تؤدي إلى هدر رأس المال في سلع راكدة ونفاد مواد ضرورية أثناء فترات الذروة. إعداد قائمة شهرية ثابتة هو الخطوة الأولى لضبط نسبة تكلفة الأغذية (Food Cost Percentage).', 'p4-b1'),
      b('الأقسام الأربعة للمخزون الغذائي الشهري لأي مطعم', 'p4-h2-2', 'h2'),
      b('1. السلع الجافة والاستراتيجية (Dry Goods & Staples)', 'p4-h3-1', 'h3'),
      b('تشكل الأساس اليومي في المطبخ الشرقي والغربي: أرز بسمتي هندي طويل الحبة، زيوت القلي النباتية، زيت الذرة، وزيت الزيتون البكر، بالإضافة إلى السكر والدقيق والبهارات المتخصصة.', 'p4-b2'),
      b('2. البروتينات واللحوم المجمدة (Frozen Proteins)', 'p4-h3-2', 'h3'),
      b('لحوم بقري وضأن مجمدة بقطعيات متوافقة مع قائمة الوجبات، كبدة بقر مجمدة، ودواجن معتمدة بشهادات ذبح حلال مطابقة لاشتراطات هيئة الغذاء والدواء.', 'p4-b3'),
      b('3. معلبات الطهي والصلصات المركزة (Canned & Processed Foods)', 'p4-h3-3', 'h3'),
      b('معجون طماطم عالي التركيز (بريكس 28-30%)، حمص معلب، فول مدمس، فاصوليا، وتونة في عبوات خاصة بقطاع خدمات الطعام (Catering Cans).', 'p4-b4'),
      b('4. البقوليات والتمور الفاخرة', 'p4-h3-4', 'h3'),
      b('عدس، فريك، وتمور فاخرة (خلاص، صقعي، عجوة) مخصصة للضيافة والتحضير الفندقي.', 'p4-b5'),
      b('كيفية حساب نقطة إعادة الطلب (Reorder Point)', 'p4-h2-3', 'h2'),
      b('لحماية المطبخ من انقطاع أي صنف، استخدم المعادلة القياسية: نقطة إعادة الطلب = (متوسط الاستهلاك اليومي × زمن وصول الشحنة بالأيام) + مخزون الأمان الاحتياطي.', 'p4-b6'),
      b('تساعدك شركة منافذ التوريد في جدولة شحناتك وتوفير شحنات الطوارئ السريعة لضمان عدم توقف عمليات الطهي على الإطلاق.', 'p4-b7'),
    ],
    bodyEn: [
      b('The Strategic Value of a Master Kitchen Procurement Checklist', 'p4en-h2-1', 'h2'),
      b('Operating a professional commercial kitchen requires rigorous inventory planning. Unstructured ordering locks cash flow in slow-moving inventory while risking stockouts during peak hours.', 'p4en-b1'),
      b('Four Pillars of Monthly Restaurant Food Inventory', 'p4en-h2-2', 'h2'),
      b('1. Dry Staples: Grains, Flours, and Cooking Oils', 'p4en-h3-1', 'h3'),
      b('2. Frozen Proteins: Certified Beef, Lamb, and Frozen Liver', 'p4en-h3-2', 'h3'),
      b('3. Canned Ingredients & Tomato Paste in Foodservice Sizes', 'p4en-h3-3', 'h3'),
      b('4. Premium Dates and Legumes for Hospitality Preparation', 'p4en-h3-4', 'h3'),
    ],
  },
  {
    _id: 'article-annual-food-supply-contracts-restaurants-saudi-arabia',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'عقود التوريد الغذائي السنوية للمطاعم: الشروط والمزايا لضمان استقرار الأسعار',
      en: 'Annual Food Supply Contracts for Restaurants: Key Terms and Benefits for Price Stability',
    },
    slug: {
      _type: 'slug',
      current: 'annual-food-supply-contracts-restaurants-saudi-arabia',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'كيف تحمي مطعمك من تقلبات أسعار الغذاء العالمية؟ كل ما تحتاج معرفته عن صياغة عقود التوريد السنوية، شروط استبدال التالف، التزامات التسليم، والشروط الجزائية.',
      en: 'Protect your restaurant margins from commodity price fluctuations. Key provisions for annual supply agreements, delivery SLA guarantees, and payment facilities.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'عقود التوريد والشراكة الاستراتيجية مع سلاسل المطاعم في السعودية',
        en: 'Strategic food supply contracts and partnerships with Saudi restaurant chains',
      },
      asset: {
        _ref: 'image-3a8e9e36d14378c7597214c844242fc3a2c5cc57-1200x896-png',
        _type: 'reference',
      },
    },
    author: 'إدارة التعاقدات والشركات | منافذ التوريد',
    publishedAt: '2026-11-01T15:00:00.000Z',
    order: 5,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'عقود توريد مواد غذائية للمطاعم في السعودية | منافذ التوريد',
        en: 'Annual Food Supply Agreements for Restaurants in KSA | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'دليل صياغة وتوقيع عقود توريد الأغذية السنوية للمطاعم والفنادق: شروط تثبيت الأسعار، اتفاقيات مستوى الخدمة SLA، وسياسات الاستبدال الفوري.',
        en: 'Essential guide to annual commercial food supply agreements: price-lock mechanisms, SLA fulfillment guarantees, and replacement terms.',
      },
    },
    body: [
      b('تقلبات الأسعار العالمية وأثرها المباشر على قطاع المطاعم', 'p5-h2-1', 'h2'),
      b('تخضع أسعار السلع التموينية من أرز وزيوت ولحوم لتقلبات متواصلة متأثرة بأسعار الشحن البحري، أسعار الصرف، والتغيرات المناخية في بلدان المنشأ. الاعتماد على الشراء اليومي بالقطعة (Spot Buying) يجعل المطعم عرضة لتذبذب التكاليف وتهديد أرباحه الصافية.', 'p5-b1'),
      b('البنود الجوهرية الواجب توفرها في عقد التوريد الاحترافي', 'p5-h2-2', 'h2'),
      b('1. آلية تثبيت الأسعار (Price-Lock Agreement)', 'p5-h3-1', 'h3'),
      b('الاتفاق على تثبيت أسعار السلع الاستراتيجية لمدة 6 أو 12 شهراً، أو تحديد هامش تذبذب أقصى لا يتجاوزه المورد لحماية تسعير قائمة الطعام.', 'p5-b2'),
      b('2. اتفاقية مستوى الخدمة (Service Level Agreement - SLA)', 'p5-h3-2', 'h3'),
      b('تحديد نوافذ زمنية محددة للتوصيل (مثلاً: بين 06:00 صباحاً و 10:00 صباحاً)، والالتزام بدرجات حرارة استلام البضائع (تحت -18 مئوية للمجمدات).', 'p5-b3'),
      b('3. سياسة الاستبدال الفوري للبضائع غير المطابقة', 'p5-h3-3', 'h3'),
      b('إلزام المورد باستبدال أي شحنة يرفضها الشيف أو مراقب الجودة فورياً خلال مدة أقصاها ساعتان إلى أربع ساعات دون تعطيل العمل.', 'p5-b4'),
      b('4. مخزون الطوارئ المخصص (Safety Buffer Stock)', 'p5-h3-4', 'h3'),
      b('احتفاظ المورد بمخزون أمان مخصص للمطعم في مستودعاته يكفي لتشغيل أسبوعين إلى شهر لمواجهة أزمات سلاسل الإمداد العالمية.', 'p5-b5'),
      b('شراكة التعاقد والتوريد مع شركة منافذ التوريد', 'p5-h2-3', 'h2'),
      b('نوفر لسلاسل المطاعم والشركات في المملكة عقود توريد سنوية مرنة تتضمن أعلى مستويات الالتزام اللوجستي، وثبات الأسعار، وتسهيلات دفع مجدولة تدعم نمو علامتك التجارية بثقة وأمان.', 'p5-b6'),
    ],
    bodyEn: [
      b('Global Commodity Volatility and Restaurant Profitability', 'p5en-h2-1', 'h2'),
      b('Foodservice margins are acutely sensitive to shifts in global ocean freight and commodity markets. Spot buying exposes restaurant operators to sudden price spikes that erode profitability.', 'p5en-b1'),
      b('Key Clauses in a Professional Food Supply Contract', 'p5en-h2-2', 'h2'),
      b('1. Price-Lock Mechanisms for Core Commodities', 'p5en-h3-1', 'h3'),
      b('2. Service Level Agreements (SLA) with Clear Delivery Windows', 'p5en-h3-2', 'h3'),
      b('3. Rapid Return and Replacement Policies for Non-Conforming Goods', 'p5en-h3-3', 'h3'),
      b('4. Dedicated Buffer Inventory Stored in Supplier Facilities', 'p5en-h3-4', 'h3'),
    ],
  },
]

export const batch2Articles: ArticleData[] = [
  {
    _id: 'article-bulk-frozen-meat-procurement-guide-saudi-arabia',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'دليل شراء اللحوم المجمدة بالجملة في السعودية للمطاعم ومطابخ الإعاشة',
      en: 'Guide to Buying Bulk Frozen Meat in Saudi Arabia for Restaurants & Catering Kitchens',
    },
    slug: {
      _type: 'slug',
      current: 'bulk-frozen-meat-procurement-guide-saudi-arabia',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'دليل شامل ومفصل لمديري المشتريات وملاك المطابخ المركزية لشراء اللحوم المجمدة بالجملة: فحص الجودة، الشهادات الصحية، قطعيات اللحم الأنسب، وكيفية حساب تكلفة الكيلوجرام الصافي بعد الذوبان.',
      en: 'A comprehensive procurement guide for commercial kitchens and caterers buying wholesale frozen meat in Saudi Arabia: quality verification, halal certifications, and yield calculations.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'لحوم مجمدة عالية الجودة بالجملة للمطاعم - منافذ التوريد',
        en: 'Premium wholesale frozen meat for commercial restaurants - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-dbad52a6b1c48732859010b68eff40edcaf4c60d-1254x1254-png',
        _type: 'reference',
      },
    },
    author: 'قطاع اللحوم والبروتينات | منافذ التوريد',
    publishedAt: '2026-11-02T08:00:00.000Z',
    order: 6,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'شراء لحوم مجمدة بالجملة للمطاعم في السعودية | منافذ التوريد',
        en: 'Bulk Frozen Meat Procurement Guide in Saudi Arabia | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'دليل توريد اللحوم المجمدة للمطاعم ومطابخ الإعاشة في الرياض وجدة: معايير فحص الجودة، نسب الفاقد بعد الذوبان، واشتراطات شهادات الحلال المعتمدة.',
        en: 'Commercial frozen meat sourcing guide for Saudi kitchens: thawing yield metrics, cuts selection, halal certifications, and wholesale pricing.',
      },
    },
    body: [
      b('دور اللحوم المجمدة في ضبط تكاليف مطابخ الإعاشة والمطاعم', 'p6-h2-1', 'h2'),
      b('تمثل البروتينات البند الأكبر في فاتورة مشتريات أي مطعم أو مطبخ إعاشة مركزي، حيث تستحوذ وحدها على 35% إلى 50% من إجمالي تكلفة الأغذية (Food Cost). الاعتماد على اللحوم المجمدة المستوردة الموثوقة يوفر استقراراً سعرياً هائلاً وجودة قياسية متسقة على مدار العام، متجاوزاً تقلبات أسعار اللحوم الطازجة ومواسم شح المعروض.', 'p6-b1'),
      b('المعايير الأربعة الأساسية لاختيار شحنات اللحوم المجمدة', 'p6-h2-2', 'h2'),
      b('1. الشهادات الصحية وشهادة الذبح الحلال المعتمدة', 'p6-h3-1', 'h3'),
      b('يجب التحقق من أن شحنات اللحوم البقرية ولحوم الضأن مصحوبة بشهادة ذبح حلال صادرة عن جهات إسلامية معتمدة رسمياً لدى الهيئة العامة للغذاء والدواء السعودية (SFDA)، مع مطابقة رقم التشغيلة (Batch Number) المطبوع على الكرتون مع الشهادة الصحية البيطرية.', 'p6-b2'),
      b('2. حساب نسبة الفاقد بعد الذوبان (Thawing Yield Percentage)', 'p6-h3-2', 'h3'),
      b('اللحوم المجمدة الممتازة المجمدة بالتجميد الصدمي السريع (Blast Freezing) لا يتجاوز الفاقد من سوائلها عند الذوبان البطيء 3% إلى 5%، بينما الأنواع التجارية الرديئة تفقد ما يزيد عن 15% من وزنها سوائل، مما يرفع التكلفة الحقيقية للكيلوجرام الصافي المستخدم في الطهي.', 'p6-b3'),
      b('3. ملاءمة القطعيات لقائمة الطعام (Cut Specifications)', 'p6-h3-3', 'h3'),
      b('اختيار القطعيات المناسبة يوفر الجهد والتكلفة: قطعيات الرقبة (Neck) والكتف (Chuck) والموزات (Shank) مثالية للكبسات والطهي الطويل، بينما قطعيات التوب سايد (Topside) والسلفر سايد (Silverside) مثالية للشواء والروست والفرم للبرجر والشاورما.', 'p6-b4'),
      b('4. سلامة التغليف ومؤشرات التخزين الخالي من حروق التجميد', 'p6-h3-4', 'h3'),
      b('فحص الكراتين للتأكد من سلامة التغليف الفاكيوم (Vacuum Sealed)، وعدم وجود حروق تجميد (Freezer Burn) أو بلورات ثلجية كثيفة تدل على حدوث تذبذب حراري سابق أثناء النقل.', 'p6-b5'),
      b('توريد اللحوم المجمدة المعتمدة مع شركة منافذ التوريد', 'p6-h2-3', 'h2'),
      b('تستورد منافذ التوريد أجود قطعيات اللحوم البقرية ولحوم الضأن من مسالخ معتمدة عالمياً بالبرازيل والهند، وتخزنها في مستودعات تبريد مركزية عند -18° مئوية، مع التوصيل اليومي المباشر لجميع مناطق المملكة بسيارات مبردة مجهزة.', 'p6-b6'),
    ],
    bodyEn: [
      b('Stabilizing Commercial Kitchen Food Costs with Bulk Frozen Meat', 'p6en-h2-1', 'h2'),
      b('Proteins account for 35% to 50% of commercial kitchen procurement budgets. Sourcing certified frozen meat ensures continuous price stability and uniform yields throughout the operating year.', 'p6en-b1'),
      b('Four Pillars for Inspecting Commercial Frozen Meat Consignments', 'p6en-h2-2', 'h2'),
      b('1. Official Halal & Veterinary Health Documentation', 'p6en-h3-1', 'h3'),
      b('Verify that all beef and mutton shipments originate from SFDA-approved abattoirs with matching batch certificates.', 'p6en-b2'),
      b('2. Calculating Post-Thawing Drip Loss Yields', 'p6en-h3-2', 'h3'),
      b('Blast-frozen quality beef maintains drip loss below 5%, whereas inferior cuts lose over 15% of edible weight.', 'p6en-b3'),
      b('3. Precision Cut Selection for Menu Engineering', 'p6en-h3-3', 'h3'),
      b('Matching topside, chuck, and shank cuts directly to rice, stew, and burger applications maximizes prep kitchen labor efficiency.', 'p6en-b4'),
    ],
  },
  {
    _id: 'article-wholesale-frozen-liver-suppliers-riyadh-jeddah',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'موردين كبدة مجمدة بالجملة في الرياض وجدة: معايير الجودة وبلدان المنشأ',
      en: 'Wholesale Frozen Liver Suppliers in Riyadh & Jeddah: Quality Standards & Origins',
    },
    slug: {
      _type: 'slug',
      current: 'wholesale-frozen-liver-suppliers-riyadh-jeddah',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'دليل أصحاب مطاعم ومطابخ الكبدة والإفطار الشعبي في السعودية لاختيار أفضل أنواع الكبدة البقري المجمدة، ومقارنة بلدان المنشأ واللون والنضارة والشهادات الصحية المعتمدة.',
      en: 'Practical guide for breakfast and popular restaurant operators on procuring wholesale frozen beef liver, comparing origins, color, texture, and SFDA compliance.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'كبدة بقري مجمدة كرتون جملة للمطاعم - منافذ التوريد',
        en: 'Wholesale frozen beef liver blocks for commercial restaurants - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-6200e7bf56ec75a469c0ef2cc394343d5475996f-1672x941-png',
        _type: 'reference',
      },
    },
    author: 'فريق قطاع اللحوم المجمدة | منافذ التوريد',
    publishedAt: '2026-11-02T09:30:00.000Z',
    order: 7,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'موردين كبدة مجمدة بالجملة في الرياض وجدة | منافذ التوريد',
        en: 'Wholesale Frozen Liver Suppliers in Riyadh & Jeddah | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'توريد كبدة بقري مجمدة كراتين جملة للمطاعم في الرياض وجدة: جودة برازيلية منتقاة، تجميد سريع Blast Freezing، وتوصيل مبرد منتظم بأسعار منافسة.',
        en: 'Direct wholesale frozen beef liver supplies for restaurants in Riyadh and Jeddah: premium Brazilian cuts, rapid blast freezing, and daily refrigerated delivery.',
      },
    },
    body: [
      b('شعبية وجبة الكبدة في السوق السعودي وأهمية استمرارية التوريد', 'p7-h2-1', 'h2'),
      b('تعد وجبة الكبدة الطازجة والمجمدة المطهوة على الصاج من أكثر الوجبات استهلاكاً في المطاعم الشعبية، المقاهي، والبوفيهات في كافة مدن المملكة. استهلاك الكبدة بمعدل يومي مرتفع يتطلب شريك توريد قادراً على تلبية الطلب المتزايد بانتظام تام وبجودة نسيجية موحدة ترضي أذواق الزبائن.', 'p7-b1'),
      b('المواصفات الفنية للكبدة البقري المجمدة عالية الجودة', 'p7-h2-2', 'h2'),
      b('1. اللون الطبيعي وتجانس المظهر', 'p7-h3-1', 'h3'),
      b('يجب أن تتمتع الكبدة بلون بني محمر مشرق ومتجانس، خالية من الشحوب أو البقع الداكنة. عند فك التجميد البطيء داخل الثلاجة، يجب أن تحافظ على تماسكها وألا تصبح رخوة أو مفتتة عند التقطيع.', 'p7-b2'),
      b('2. ريادة المنشأ البرازيلي في السوق السعودي', 'p7-h3-2', 'h3'),
      b('تحظى الكبدة البقري البرازيلية بثقة واسعة لدى الشيفات وأصحاب المطاعم بفضل معايير الرعاية البيطرية الصارمة، والتغذية الطبيعية في المراعي، والذبح الحلال المؤكد بشهادات المنشأ الرسمية.', 'p7-b3'),
      b('3. تقنية التجميد الصدمي المباشر (Blast Freezing)', 'p7-h3-3', 'h3'),
      b('التجميد الصدمي فائق السرعة عقب فحص الكبدة مباشرة يمنع تكون بلورات ثلجية كبيرة تدمر نسيج الكبدة الداخلي، مما يحفظ طراوتها وعصارتها المميزة عند الطهي السريع بدرجات حرارة عالية.', 'p7-b4'),
      b('4. التعبئة الكرتونية المخصصة للمطاعم', 'p7-h3-4', 'h3'),
      b('تورد الكبدة في كراتين تجارية سعة 10 كجم إلى 20 كجم مقسمة داخلياً لسهولة استخدام الكمية المطلوبة يومياً وضبط المخزون بدقة.', 'p7-b5'),
      b('توريد الكبدة المجمدة مع منافذ التوريد', 'p7-h2-3', 'h2'),
      b('توفر شركة منافذ التوريد توريداً يومياً وأسبوعياً لكراتين الكبدة البقري المجمدة للمطاعم في الرياض، جدة، الدوادمي، وكافة المناطق بأسعار جملة مباشرة وأعلى معايير السلامة الغذائية.', 'p7-b6'),
    ],
    bodyEn: [
      b('The High Demand for Liver Across Saudi Food Service', 'p7en-h2-1', 'h2'),
      b('Liver is a staple breakfast and dinner dish across Saudi restaurants and fast-casual eateries, requiring uninterrupted supply of high-grade frozen beef liver.', 'p7en-b1'),
      b('Quality Benchmarks for Commercial Frozen Beef Liver', 'p7en-h2-2', 'h2'),
      b('1. Natural Reddish-Brown Color and Firm Texture', 'p7en-h3-1', 'h3'),
      b('2. Brazilian Origin Dominance in Consistency and Taste', 'p7en-h3-2', 'h3'),
      b('3. Instant Blast Freezing to Preserve Cell Integrity', 'p7en-h3-3', 'h3'),
      b('4. Foodservice-Grade Carton Packaging for Kitchen Prep Ease', 'p7en-h3-4', 'h3'),
    ],
  },
  {
    _id: 'article-cold-chain-logistics-frozen-meat-transportation-saudi-arabia',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'سلسلة التبريد (Cold Chain) في نقل اللحوم المجمدة: كيف تضمن سلامة الشحنات؟',
      en: 'Cold Chain Logistics in Frozen Meat Transportation: Ensuring Cargo Safety & Quality',
    },
    slug: {
      _type: 'slug',
      current: 'cold-chain-logistics-frozen-meat-transportation-saudi-arabia',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'تعرف على أهمية إدارة سلسلة التبريد اللوجستية لنقل الأغذية واللحوم المجمدة في بيئة المملكة الحارة، والمعايير الفنية للشاحنات المبردة وأجهزة تسجيل درجات الحرارة (Data Loggers).',
      en: 'Learn how temperature-controlled cold chain logistics safeguard frozen meat in Saudi Arabia’s arid climate, detailing reefer truck telemetry and food safety standards.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'شاحنات النقل المبرد اللوجستي لنقل الأغذية واللحوم المجمدة - منافذ التوريد',
        en: 'Refrigerated fleet for frozen meat and food supply logistics - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-31399ab1420f1da04c406f85aa7768354a2eb9e3-1024x1024-png',
        _type: 'reference',
      },
    },
    author: 'إدارة النقل واللوجستيات | منافذ التوريد',
    publishedAt: '2026-11-02T11:00:00.000Z',
    order: 8,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'سلسلة التبريد لنقل اللحوم المجمدة في السعودية | منافذ التوريد',
        en: 'Cold Chain Logistics for Frozen Meat in Saudi Arabia | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'دليل سلامة سلسلة التبريد اللوجستية للحوم والأغذية المجمدة في السعودية: الحفاظ على درجة -18 مئوية، أجهزة التتبع الحراري، والشاحنات المبردة المعتمدة.',
        en: 'Cold chain integrity guide for frozen meat distribution in KSA: -18C thermal compliance, digital data loggers, and refrigerated fleet standards.',
      },
    },
    body: [
      b('تحديات المناخ الحار وأهمية سلسلة التبريد المستمرة في السعودية', 'p8-h2-1', 'h2'),
      b('مع وصول درجات الحرارة في صيف المملكة إلى قرابة 50 درجة مئوية، تمثل إدارة سلسلة التبريد (Cold Chain) خط الدفاع الحاسم لسلامة الأغذية. كسر سلسلة التبريد ولو لساعة واحدة يتسبب في ذوبان سطحي للحوم وتكاثر البكتيريا وتلف نسيج البروتين الداخلي.', 'p8-b1'),
      b('الركائز الأربع لحماية سلسلة التبريد من المستودع إلى باب المطعم', 'p8-h2-2', 'h2'),
      b('1. الثبات الحراري الصارم عند (-18°C)', 'p8-h3-1', 'h3'),
      b('تشترط المواصفات القياسية السعودية والخليجية حفظ ونقل اللحوم المجمدة في درجات حرارة لا تزيد على -18 درجة مئوية في كافة مراحل الرحلة اللوجستية.', 'p8-b2'),
      b('2. أجهزة المراقبة والتسجيل الرقمي (Temperature Data Loggers)', 'p8-h3-2', 'h3'),
      b('تجهيز كبائن الشاحنات المبردة بأجهزة قياس حرارية متصلة بالأقمار الصناعية تسجل درجة الحرارة لحظياً وترسل تنبيهات فورية في حال حدوث أي تقلب حراري غير طبيعي.', 'p8-b3'),
      b('3. أرصفة التحميل المعزولة (Sealed Loading Docks)', 'p8-h3-3', 'h3'),
      b('تجهيز مستودعات اللحوم بستائر هوائية وأرصفة إحكام مطاطية متصلة بباب الشاحنة مباشرة لمنع دخول الهواء الساخن أو أشعة الشمس أثناء التحميل والتفريغ.', 'p8-b4'),
      b('4. بروتوكول فحص الاستلام بالمطعم', 'p8-h3-4', 'h3'),
      b('تزويد مسؤولي الاستلام في المطابخ بأجهزة قياس حرارة دقيقة تعمل بالمجس (Calibrated Probe) لقياس درجة حرارة قلب الشحنة قبل استلامها وتخزينها فوراً في الفريزر المركزي.', 'p8-b5'),
      b('التزام منافذ التوريد بأعلى معايير النقل المبرد', 'p8-h2-3', 'h2'),
      b('يمتلك أسطول منافذ التوريد أحدث وحدات التبريد العالمية وأنظمة التتبع اللحظي، مما يضمن وصول كل كرتون لحوم أو كبدة إلى مطبخك بكامل نضارته وجودته المطابقة لمعايير هيئة الغذاء والدواء.', 'p8-b6'),
    ],
    bodyEn: [
      b('Managing Cold Chain Integrity in High-Temperature Climates', 'p8en-h2-1', 'h2'),
      b('With summer ambient temperatures frequently exceeding 45°C in Saudi Arabia, unbroken cold chain logistics is mandatory to prevent thermal abuse and bacterial proliferation in frozen proteins.', 'p8en-b1'),
      b('Four Pillars of Commercial Cold Chain Security', 'p8en-h2-2', 'h2'),
      b('1. Uncompromising Thermal Baseline at -18°C', 'p8en-h3-1', 'h3'),
      b('2. Real-Time Telemetry and Automated IoT Data Loggers', 'p8en-h3-2', 'h3'),
      b('3. Climate-Sealed Cross-Docking Warehouse Infrastructure', 'p8en-h3-3', 'h3'),
      b('4. Kitchen Receiving Temperature Verification Protocols', 'p8en-h3-4', 'h3'),
    ],
  },
  {
    _id: 'article-sfda-regulations-importing-frozen-meat-saudi-arabia',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'اشتراطات هيئة الغذاء والدواء (SFDA) في استيراد وتداول اللحوم المجمدة',
      en: 'Saudi FDA (SFDA) Regulations for Importing and Handling Frozen Meat: Compliance Guide',
    },
    slug: {
      _type: 'slug',
      current: 'sfda-regulations-importing-frozen-meat-saudi-arabia',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'دليل شامل لاشتراطات ولوائح الهيئة العامة للغذاء والدواء السعودية في استيراد اللحوم ومنتجاتها: قائمة المسالخ المعتمدة، الفسح الجمركي، بطاقة البيانات، وفترات الصلاحية المقررة.',
      en: 'A comprehensive compliance guide to SFDA regulatory standards for importing frozen beef, lamb, and poultry: approved slaughterhouses, labeling mandates, and shelf-life rules.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'مطابقة اشتراطات هيئة الغذاء والدواء في استيراد وتخزين اللحوم - منافذ التوريد',
        en: 'SFDA food safety compliance in meat import and storage - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-4befc15708b0c5ae655e86a842a483facc23cad0-1408x768-png',
        _type: 'reference',
      },
    },
    author: 'إدارة الجودة والامتثال الرقابي | منافذ التوريد',
    publishedAt: '2026-11-02T13:00:00.000Z',
    order: 9,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'اشتراطات الغذاء والدواء لاستيراد اللحوم المجمدة بالسعودية | منافذ التوريد',
        en: 'SFDA Frozen Meat Importation Regulations & Standards | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'كل ما تحتاج معرفته عن لوائح هيئة الغذاء والدواء SFDA للحوم المجمدة: قائمة المسالخ المعتمدة، الفسح المخبري، بطاقة البيانات الإيضاحية، وشهادات الحلال الرسمية.',
        en: 'Complete regulatory overview of SFDA rules for imported frozen meats in Saudi Arabia: approved slaughterhouses, laboratory clearance, and labeling requirements.',
      },
    },
    body: [
      b('منظومة السلامة الغذائية وإشراف الهيئة العامة للغذاء والدواء (SFDA)', 'p9-h2-1', 'h2'),
      b('تطبق المملكة العربية السعودية عبر الهيئة العامة للغذاء والدواء واحداً من أدق الأنظمة الرقابية وأكثرها صرامة عالمياً في فحص ومطابقة المنتجات الغذائية المستوردة، لضمان سلامة وصحة المستهلكين وحماية منظومة الأمن الغذائي الوطني.', 'p9-b1'),
      b('الشروط والمتطلبات النظامية الأساسية لتداول اللحوم المستوردة', 'p9-h2-2', 'h2'),
      b('1. الاعتماد المسبق للمنشآت والمسالخ المصدرة', 'p9-h3-1', 'h3'),
      b('تحظر الهيئة استيراد أي شحنة لحوم إلا من مسالخ ومصانع لحوم معتمدة ومدرجة في القائمة الرسمية المحدثة للهيئة، بعد قيام فرق التفتيش السعودية بزيارة المنشأة والتأكد من مطابقتها للاشتراطات الفنية والصحية.', 'p9-b2'),
      b('2. شهادة الذبح الحلال الرسمية', 'p9-h3-2', 'h3'),
      b('يجب إرفاق شهادة حلال صادرة عن جهة إسلامية معترف بها رسمياً لدى مركز «حلال» التابع للهيئة، تؤكد أن الذبح تم باليد أو بالطرق الشرعية المقرة ودون تدويخ أو صعق مسبق ميت للحيوان.', 'p9-b3'),
      b('3. متطلبات بطاقة البيان الغذائي (Food Labeling)', 'p9-h3-3', 'h3'),
      b('إلزامية وجود ملصق باللغة العربية مطبوع مباشرة على العبوة يتضمن اسم الصنف، المنشأ، اسم ورقم المسلخ، تاريخ الذبح، تاريخ الإنتاج، تاريخ انتهاء الصلاحية، ودرجة حرارة الحفظ والتخزين.', 'p9-b4'),
      b('4. الفسح الجمركي والفحص المخبري في منافذ الدخول', 'p9-h3-4', 'h3'),
      b('سحب عينات عشوائية من كل إرسالية في المنافذ البحرية والجوية والبرية لفحص المتبقيات الدوائية ومضادات الميكروبات وخلوها التام من أي تلوث بكتيري.', 'p9-b5'),
      b('ضمان الموثوقية الكاملة مع شركة منافذ التوريد', 'p9-h2-3', 'h2'),
      b('تلتزم منافذ التوريد بالاستيراد الحصري من المسالخ المعتمدة لدى SFDA، وتزود عملاءها من المطاعم والفنادق بنسخ من شهادات الفسح المخبري وشهادات الحلال لتسهيل جولات التفتيش والرقابة البلدية.', 'p9-b6'),
    ],
    bodyEn: [
      b('SFDA Oversight: Ensuring National Food Safety in Saudi Arabia', 'p9en-h2-1', 'h2'),
      b('The Saudi Food and Drug Authority enforces globally recognized inspection standards to safeguard imported food consignments across all Saudi sea, air, and land entry ports.', 'p9en-b1'),
      b('Key Compliance Requirements for Imported Frozen Meat', 'p9en-h2-2', 'h2'),
      b('1. Pre-Approval of Foreign Slaughterhouses and Processing Plants', 'p9en-h3-1', 'h3'),
      b('2. Certified Halal Slaughter Credentials from Recognized Islamic Centers', 'p9en-h3-2', 'h3'),
      b('3. Arabic Bilingual Nutritional and Traceability Labeling', 'p9en-h3-3', 'h3'),
      b('4. Port Laboratory Clearance and Microbiological Screenings', 'p9en-h3-4', 'h3'),
    ],
  },
  {
    _id: 'article-brazilian-vs-indian-frozen-meat-restaurants-comparison',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'مقارنة اللحوم البرازيلية والهندية للمطاعم: درجات الجودة والاستخدام الأنسب',
      en: 'Brazilian vs Indian Frozen Meat for Restaurants: Quality Grading & Best Culinary Uses',
    },
    slug: {
      _type: 'slug',
      current: 'brazilian-vs-indian-frozen-meat-restaurants-comparison',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'مقارنة فنية ومالية دقيقة بين اللحوم البرازيلية والهندية المجمدة في المطاعم السعودية: نسبة الدهون، قوام النسيج، الأداء في الطهي والشواء، والجدوى الاقتصادية لكل صنف.',
      en: 'Detailed culinary and cost analysis comparing Brazilian and Indian frozen beef and buffalo for Saudi restaurants: fat marbling, tenderness, cook yield, and menu application.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'مقارنة قطعيات اللحوم المستوردة البرازيلية والهندية للمطابخ التجارية',
        en: 'Brazilian and Indian commercial imported beef cuts comparison - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-23e2d63d1bf5f20d65ae548a548b5627a82f59df-1024x1024-png',
        _type: 'reference',
      },
    },
    author: 'قسم الاستشارات وتطوير قوائم الطعام | منافذ التوريد',
    publishedAt: '2026-11-02T15:00:00.000Z',
    order: 10,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'مقارنة اللحوم البرازيلية والهندية للمطاعم بالجملة | منافذ التوريد',
        en: 'Brazilian vs Indian Frozen Meat for Commercial Kitchens | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'مقارنة شاملة بين اللحم البرازيلي والهندي للمطاعم في السعودية: قوام النسيج، امتصاص التوابل، الجدوى الاقتصادية، وتحديد الصنف الأنسب لأطباق الشواء والكبسة.',
        en: 'Comprehensive comparison of Brazilian vs Indian frozen beef for Saudi restaurants: tenderness, fat marbling, pricing yield, and optimal culinary recipes.',
      },
    },
    body: [
      b('المعادلة الحساسة بين الجودة والتكلفة في مطابخ المطاعم', 'p10-h2-1', 'h2'),
      b('تمثل اللحوم البرازيلية والهندية ركيزتي الاستيراد الأساسيتين في سوق اللحوم المجمدة السعودي. يمتلك كل منشأ خصائص نسيجية وطبيعة طهي ومستوى سعري مختلف، مما يستوجب على الشيف ومدير المشتريات مواءمة كل نوع مع الوصفة الملائمة لتحقيق أفضل تجربة طعام بأقل تكلفة هدر.', 'p10-b1'),
      b('خصائص ومميزات اللحوم البرازيلية المجمدة', 'p10-h2-2', 'h2'),
      b('1. طبيعة النسيج والتداخل الدهني (Marbling)', 'p10-h3-1', 'h3'),
      b('تتميز اللحوم البرازيلية بكونها لحوم أبقار (Beef) تتغذى على الأعشاب والمراعي المفتوحة، وتتمتع بنعومة واضحة في الألياف العضلية وتداخل دهني متوازن يمنحها عصارة غنية عند الطهي السريع.', 'p10-b2'),
      b('2. أفضل التطبيقات والاستخدامات في المطبخ', 'p10-h3-2', 'h3'),
      b('تتفوق في وجبات الشواء، الشاورما الممتازة، البرجر الفاخر، صواني الفرن، والستيك، حيث تبرز طراوة اللحم كعنصر تقييم أساسي لدى الزبون.', 'p10-b3'),
      b('خصائص ومميزات اللحوم الهندية المجمدة (البوفالو والجاموسي)', 'p10-h2-3', 'h2'),
      b('1. نسبة الدهون المنخفضة واللحم الأحمر الصافي (Lean Meat)', 'p10-h3-3', 'h3'),
      b('تتميز اللحوم الهندية بأنها شبه خالية من الدهون، ذات قوام صلب وقدرة عالية جداً على امتصاص التوابل والبهارات ونكهات المرق دون أن تفقد تماسكها أثناء الغليان المستمر.', 'p10-b4'),
      b('2. الجدوى الاقتصادية والتطبيقات المثالية', 'p10-h3-4', 'h3'),
      b('تعتبر الخيار الأول والأكثر ربحية لمطاعم الأرز البخاري، الكبسة، المندي، والبرياني، وكذلك لمطابخ الإعاشة الكبرى وحشوات المعجنات والسمبوسة ومفروم اللحم.', 'p10-b5'),
      b('المزيج الأمثل لمطعمك مع استشارات منافذ التوريد', 'p10-h2-4', 'h2'),
      b('تساعدك شركة منافذ التوريد في هندسة مشتريات البروتين بمطعمك من خلال توفير عينات فحص وتوريد منتظم لكلا النوعين بأوزان كرتونية مناسبة وأسعار جملة منافسة في كافة مناطق المملكة.', 'p10-b6'),
    ],
    bodyEn: [
      b('Balancing Quality & Procurement Budgets in Commercial Kitchens', 'p10en-h2-1', 'h2'),
      b('Brazilian and Indian frozen meats represent the dominant choices in the Saudi foodservice market, each delivering distinct culinary characteristics and economic yields.', 'p10en-b1'),
      b('Characteristics of Brazilian Frozen Beef', 'p10en-h2-2', 'h2'),
      b('Pasture-raised Brazilian beef offers natural marbling, fine muscle grain, and superior moisture retention, making it ideal for shawarma, burgers, and grilling applications.', 'p10en-b2'),
      b('Characteristics of Indian Frozen Buffalo & Beef', 'p10en-h2-3', 'h2'),
      b('Indian meat is lean with high protein density and exceptional spice absorption, making it the preferred and cost-effective choice for long-simmered rice dishes like Kabsa and Biryani.', 'p10en-b3'),
    ],
  },
]


export const batch3Articles: ArticleData[] = [
  {
    _id: 'article-hotel-hospitality-food-supply-makkah-madinah-jeddah',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'حلول التوريد الغذائي لقطاع الفنادق والضيافة في مكة والمدينة وجدة',
      en: 'Food Supply Solutions for Hospitality & Hotels in Makkah, Madinah & Jeddah',
    },
    slug: {
      _type: 'slug',
      current: 'hotel-hospitality-food-supply-makkah-madinah-jeddah',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'دليل إمداد الفنادق وقطاع الضيافة في المنطقة الغربية: خطط التوريد لمواسم الحج والعمرة، معايير البوفيهات المفتوحة، وتأمين السلع الأساسية والمجمدات بأعلى درجات الجاهزية دون انقطاع.',
      en: 'Complete food procurement and catering guide for Western Province hotels: Hajj & Umrah seasonal readiness, banquet supply logistics, and bulk food safety compliance.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'توريد مواد غذائية وإعاشة فنادق مكة وجدة والمدينة - منافذ التوريد',
        en: 'Hotel & Hospitality Food Supply in Makkah and Jeddah - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-b49c59a43c4b161df3b706b262ab2d9590549f19-1200x896-png',
        _type: 'reference',
      },
    },
    author: 'قطاع الفنادق والضيافة | منافذ التوريد',
    publishedAt: '2026-11-02T16:00:00.000Z',
    order: 11,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'شركات إعاشة وتوريد فنادق مكة والمدينة وجدة بالجملة | منافذ التوريد',
        en: 'Hotel Food Catering & Bulk Supply in Makkah, Madinah & Jeddah | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'حلول التوريد الغذائي الشاملة لفنادق مكة والمدينة المنورة وجدة: عقود إعاشة مواسم الحج والعمرة، تأمين اللحوم المجمدة والأرز والزيوت، وجداول تسليم دقيقة 24/7.',
        en: 'Hospitality catering and food procurement contracts in Makkah and Madinah: peak season logistics for Hajj & Umrah, meat supply, and bulk staples.',
      },
    },
    body: [
      b('ديناميكية قطاع الضيافة والفنادق في المنطقة الغربية', 'p11-h2-1', 'h2'),
      b('تتميز فنادق مكة المكرمة والمدينة المنورة وجدة بطبيعة تشغيلية فريدة على مستوى العالم؛ حيث تشهد فترات ذروة قياسية متتالية خلال مواسم العمرة وشهر رمضان المبارك وموسم الحج. تتطلب هذه المواسم رفع الطاقة الاستيعابية لمطابخ الفنادق بنسبة تتجاوز 400% أحياناً، مما يجعل استقرار سلاسل الإمداد الغذائي مسألة أمن تشغيلي وسمعة فندقية لا تقبل التهاون.', 'p11-b1'),
      b('التحديات اللوجستية في مواسم الحج والعمرة وكيف نتغلب عليها', 'p11-h2-2', 'h2'),
      b('1. تصاريح الدخول وأوقات التفريغ المقيدة في المنطقة المركزية', 'p11-h3-1', 'h3'),
      b('تخضع المناطق المركزية المحيطة بالحرم المكي والحرم النبوي الشريف لقيود مرورية صارمة وساعات محددة لدخول شاحنات الإمداد. تمتلك شركة منافذ التوريد أسطولاً مجهزاً ومجدولاً بتصاريح معتمدة وتنسيق مسبق للتفريغ في أوقات التهدئة المرورية لضمان وصول الشحنات دون تأخير دقيقة واحدة.', 'p11-b2'),
      b('2. إدارة المخزون الاستراتيجي المؤقت (Buffer Stocking)', 'p11-h3-2', 'h3'),
      b('بدلاً من إرهاق مستودعات الفنادق ذات المساحات المحدودة، نخصص مساحات تخزين مبردة وجافة في مستودعاتنا المركزية بجدة والرياض كأرصدة احتياطية مخصصة لكل فندق متعاقد، تُسحب منها الطلبيات اليومية بسلاسة.', 'p11-b3'),
      b('متطلبات قوائم الطعام والبوفيهات المفتوحة (Open Buffet Supply)', 'p11-h2-3', 'h2'),
      b('تتنوع جنسيات وثقافات نزلاء الفنادق والحجاج والمعتمرين، مما يتطلب توريد سلع غذائية تلبي أذواقاً عالمية متعددة:', 'p11-b4'),
      b('• الأرز البسمتي والمزة الهندي والباكستاني بأصناف متنوعة تناسب مختلف المطابخ الآسيوية والعربية.', 'p11-b5'),
      b('• اللحوم البقرية ولحوم الضأن المجمدة المعتمدة بشهادات ذبح حلال ومطابقة لاشتراطات SFDA الصارمة.', 'p11-b6'),
      b('• كبدة الأبقار والدواجن المجمدة، وزيوت القلي النباتية وزيت دوار الشمس بعبوات اقتصادية 18 لتراً.', 'p11-b7'),
      b('• السكر، الدقيق، البقوليات المعلبة، منتجات الطماطم، والأجبان بعبوات الخدمة الفندقية الفورية.', 'p11-b8'),
      b('مزايا التعاقد المؤسسي مع منافذ التوريد لقطاع الضيافة', 'p11-h2-4', 'h2'),
      b('نوفر لفنادق الـ 5 نجوم والـ 4 نجوم ومجموعات الضيافة أسعاراً تعاقدية ثابتة تغطي كامل الموسم، مع إمكانية التوريد الليلي أو الصباحي الباكر وفواتير ضريبية مفصلة معتمدة لدى هيئة الزكاة والضريبة والجمارك (ZATCA).', 'p11-b9'),
    ],
    bodyEn: [
      b('Hospitality Food Supply Dynamics in Western Province', 'p11en-h2-1', 'h2'),
      b('Hotels in Makkah, Madinah, and Jeddah operate under unprecedented demand surges during Ramadan, Hajj, and Umrah seasons, necessitating robust food supply lines.', 'p11en-b1'),
      b('Central Zone Logistics & Delivery Precision', 'p11en-h2-2', 'h2'),
      b('Strict municipal traffic curfews around the Holy Mosques require specialized delivery permits and strategic buffer inventory management, seamlessly executed by Mnaveth ALTourid.', 'p11en-b2'),
      b('Tailored Menus & Comprehensive Buffet Staples', 'p11en-h2-3', 'h2'),
      b('From premium Basmati rice and Halal certified meats to bulk frying oils and canned provisions, our multi-category wholesale catalog caters to diverse international pilgrim palettes.', 'p11en-b3'),
    ],
  },
  {
    _id: 'article-government-corporate-food-supply-contracts-saudi-arabia',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'عقود توريد الأغذية للجهات الحكومية والشركات الكبرى في السعودية',
      en: 'Food Supply Contracts for Government Entities & Mega Corporations in Saudi Arabia',
    },
    slug: {
      _type: 'slug',
      current: 'government-corporate-food-supply-contracts-saudi-arabia',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'استراتيجيات صياغة وترسية مناقصات التوريد الغذائي والإعاشة المؤسسية: الشروط الفنية، الضمانات البنكية، استقرار سلاسل الإمداد، وضمان التوافق مع منصة اعتماد ولوائح المشتريات الحكومية.',
      en: 'Strategic guide to corporate and government food procurement contracts in Saudi Arabia: Etimad platform compliance, tender SLAs, cold storage logistics, and supply guarantees.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'عقود ومناقصات توريد المواد الغذائية الحكومية - منافذ التوريد',
        en: 'Government & Corporate Food Supply Contracts - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-fe7f89322bd76cec74c8b4b52c3490705f59cc4a-1200x896-png',
        _type: 'reference',
      },
    },
    author: 'إدارة المناقصات والعقود الحكومية | منافذ التوريد',
    publishedAt: '2026-11-02T17:00:00.000Z',
    order: 12,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'عقود ومناقصات توريد الأغذية الحكومية والمؤسسية | منافذ التوريد',
        en: 'Government & Mega Corporate Food Procurement Contracts Saudi Arabia | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'شريكك المعتمد في مناقصات الإعاشة والتوريد الغذائي عبر منصة اعتماد في السعودية: اشتراطات التأهيل المسبق، السجلات التجارية المحدثة، وتأمين سلاسل الإمداد للجهات الحكومية والشركات الكبرى.',
        en: 'Certified food supply contractor for Saudi government tenders and corporate mega-camps: Etimad compliance, wholesale supply agreements, and strict SLA guarantees.',
      },
    },
    body: [
      b('أهمية الحوكمة والامتثال في مناقصات الإعاشة الحكومية', 'p12-h2-1', 'h2'),
      b('تتطلب مناقصات وعقود التوريد الغذائي للقطاعات العسكرية، المستشفيات الحكومية، السجون، الجامعات، والمدن الصناعية مستوى استثنائياً من الجاهزية الإدارية والملاءة المالية. لا يقتصر الأمر على تقديم أقل الأسعار، بل يرتكز التقييم الفني على موثوقية المستودعات، شهادات سلامة الغذاء، وسرعة الاستجابة للطوارئ.', 'p12-b1'),
      b('المتطلبات الأساسية للفوز بمناقصات التوريد الغذائي عبر منصة اعتماد', 'p12-h2-2', 'h2'),
      b('1. التأهيل النظامي والتراخيص الحكومية المحدثة', 'p12-h3-1', 'h3'),
      b('يجب أن يمتلك المورد سجلاً تجارياً نشطاً مصنفاً في تجارة الجملة للمواد الغذائية، شهادة عضوية الغرفة التجارية سارية، شهادة الزكاة والدخل، شهادة السعودة (نطاقات)، وشهادة مطابقة من الهيئة العامة للغذاء والدواء (SFDA).', 'p12-b2'),
      b('2. اتفاقيات مستوى الخدمة الصارمة (SLA) وجداول التسليم', 'p12-h3-2', 'h3'),
      b('تتضمن العقود الحكومية شروطاً جزائية صارمة في حال تأخر أي دفعة توريد أو نقص في مطابقة الأوزان والمواصفات الفنية. وضع خطة إمداد بديلة (Contingency Logistics) هو الشرط الجوهري لضمان استمرارية التوريد دون انقطاع.', 'p12-b3'),
      b('3. توفير عينات فحص مخبرية وشهادات الصلاحية الرسمية', 'p12-h3-3', 'h3'),
      b('تخضع الشحنات الغذائية في المستودعات الحكومية والشركات الكبرى لفحص استلام دقيق يشمل قياس درجات حرارة النقل، تواريخ الإنتاج والصلاحية، وسلامة العبوات الكرتونية من أي تلف ميكانيكي أو رطوبة.', 'p12-b4'),
      b('لماذا تختار الجهات والمقاولون الكبار شركة منافذ التوريد؟', 'p12-h2-3', 'h2'),
      b('تتمتع شركة منافذ التوريد بسجل حافل في تلبية متطلبات المشاريع الكبرى والمصانع؛ حيث نمتلك مستودعات مركزية مرخصة بالرياض وجدة، وأسطول شاحنات مبردة وجافة، وقدرة استيرادية مباشرة تضمن ثبات أسعار العقود طويلة الأجل بنظام الدفعات الدورية المعتمدة.', 'p12-b5'),
    ],
    bodyEn: [
      b('Governance & Compliance in Saudi Institutional Tenders', 'p12en-h2-1', 'h2'),
      b('Government catering and food supply tenders for military, healthcare, and educational institutions demand uncompromising standards of quality, financial stability, and SFDA compliance.', 'p12en-b1'),
      b('Key Prerequisites for Etimad Platform Food Tenders', 'p12en-h2-2', 'h2'),
      b('A valid commercial registry, ZATCA tax clearance, Saudization certificates, and rigorous SLA penalty agreements form the bedrock of winning government food contracts.', 'p12en-b2'),
      b('Corporate Supply Reliability with Mnaveth ALTourid', 'p12en-h2-3', 'h2'),
      b('Mnaveth ALTourid operates as a vetted, dependable food supply partner with expansive multi-city warehousing, direct import capabilities, and flexible periodic billing.', 'p12en-b3'),
    ],
  },
  {
    _id: 'article-labor-camp-catering-construction-food-supply-saudi',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'إعاشة وسكن العمال في المشاريع الكبرى: كيف تؤمن وجبات متوازنة بتكلفة مدروسة؟',
      en: 'Labor Camp & Megaproject Catering: Balancing Nutrition & Cost Efficiency in Saudi Arabia',
    },
    slug: {
      _type: 'slug',
      current: 'labor-camp-catering-construction-food-supply-saudi',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'دليل المقاولين وشركات الإنشاءات لإدارة تموين مخيمات العمال والمشاريع الإنشائية الضخمة: حساب كميات الإعاشة، توريد الأرز والزيوت واللحوم بالجملة، وتأمين معايير السلامة المهنية بأقل تكلفة هدر.',
      en: 'Sourcing food supplies for labor camps and massive construction projects in Saudi Arabia: wholesale grains, proteins, balanced nutritional quotas, and logistics delivery.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'توريد أغذية مخيمات العمال ومشاريع الإنشاءات في السعودية - منافذ التوريد',
        en: 'Labor camp food catering and megaproject supply - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-ffb7231f9d5cc6362d8238d8559a1bc8d6aa69af-1200x896-png',
        _type: 'reference',
      },
    },
    author: 'قسم إعاشة المشاريع والمقاولات | منافذ التوريد',
    publishedAt: '2026-11-02T18:00:00.000Z',
    order: 13,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'تموين سكن العمال ومشاريع المقاولات بالجملة في السعودية | منافذ التوريد',
        en: 'Labor Camp Food Catering & Construction Sites Wholesale Supply | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'توريد مواد غذائية جملة لمخيمات وسكن عمال مشاريع البنية التحتية والمقاولات في الرياض ونيوم وجدة: أرز، زيوت، لحوم مجمدة، ومعلبات بأسعار تنافسية وجداول تسليم دورية.',
        en: 'Bulk food supply for workforce camps and contractor residential complexes across Saudi megaprojects: cost-controlled wholesale food rations and dependable logistics.',
      },
    },
    body: [
      b('أهمية كفاءة التموين الغذائي في مواقع المشاريع الكبرى', 'p13-h2-1', 'h2'),
      b('تشهد المملكة نهضة إنشائية غير مسبوقة تماشياً مع رؤية السعودية 2030، حيث تضم مواقع المشاريع الكبرى (Gigaprojects) آلاف المهندسين والعمال. تمثل الإعاشة اليومية وسكن العمال عنصراً حاسماً في إنتاجية الموقع واستقراره؛ فالوجبة المتوازنة والمشبعة تحافظ على طاقة القوى العاملة، بينما التكلفة المنضبطة تمنع تآكل هوامش أرباح المقاول.', 'p13-b1'),
      b('هندسة المقررات الغذائية اليومية للعمال (Ration Planning)', 'p13-h2-2', 'h2'),
      b('1. الطاقة والنشويات الأساسية (الأرز والدقيق والزيوت)', 'p13-h3-1', 'h3'),
      b('يحتاج العامل في الأعمال الميدانية الشاقة إلى وجبات غنية بالطاقة. يشكل الأرز طويل الحبة (البسمتي الاقتصادي أو السيلا) والدقيق المخصص للمخابز الميدانية العنصر الأساسي، مع حساب معدل استهلاك وسطي يتراوح بين 180 إلى 220 غراماً من الأرز الجاف للعامل في الوجبة الواحدة.', 'p13-b2'),
      b('2. مصادر البروتين الاقتصادية والمغذية (اللحوم المجمدة والكبدة والبيض)', 'p13-h3-2', 'h3'),
      b('تعتبر اللحوم البقرية ولحوم الضأن المجمدة، بالإضافة إلى الكبدة المجمدة وقطع الدواجن، الخيارات الأكثر اقتصادية وموثوقية في مطابخ الإعاشة الكبرى نظراً لسهولة تخزينها في المستودعات الميدانية المبردة وثبات أسعارها التعاقدية مقارنة باللحوم الطازجة.', 'p13-b3'),
      b('3. البقوليات والصلصات والمكملات الغذائية', 'p13-h3-3', 'h3'),
      b('توريد العدس الأصفر والأحمر، الحمص، الفول المدمس، معجون الطماطم، والبهارات الهندية والعربية بالجملة في أكياس 20 كجم و 50 كجم يسهم في خفض تكلفة الوجبة الواحدة بما يصل إلى 30% مقارنة بالعبوات الاستهلاكية الصغيرة.', 'p13-b4'),
      b('سلاسل التوريد لمواقع المشاريع النائية والبعيدة', 'p13-h2-3', 'h2'),
      b('توفر شركة منافذ التوريد حلول الشحن البري المبرد والجاف مباشرة إلى مخيمات وسكن العمال في مختلف مدن ومناطق المملكة، مع جدولة شحنات أسبوعية أو نصف شهرية تضمن عدم انقطاع الإمداد حتى في الظروف المناخية القاسية.', 'p13-b5'),
    ],
    bodyEn: [
      b('The Role of Food Catering in Mega Construction Projects', 'p13en-h2-1', 'h2'),
      b('Across Saudi mega developments, feeding thousands of daily site workers requires careful nutritional planning, sanitary compliance, and rigorous cost engineering.', 'p13en-b1'),
      b('Daily Ration Calculations for High-Energy Field Work', 'p13en-h2-2', 'h2'),
      b('Caloric density hinges on bulk rice, high-yield edible oils, and cost-effective frozen proteins like beef and poultry, delivered in industrial 20kg to 50kg wholesale packings.', 'p13en-b2'),
      b('Remote Site Logistics Across the Kingdom', 'p13en-h2-3', 'h2'),
      b('Mnaveth ALTourid guarantees reliable scheduled supply dispatches to remote worker compounds and construction camps, maintaining cold chain integrity throughout transit.', 'p13en-b3'),
    ],
  },
  {
    _id: 'article-peak-season-food-supply-risk-management-ramadan-riyadh-season',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'إدارة مخاطر الإمداد الغذائي في مواسم الذروة بالمملكة (رمضان وموسم الرياض)',
      en: 'Managing Food Supply Risks During Peak Seasons in Saudi Arabia (Ramadan & Riyadh Season)',
    },
    slug: {
      _type: 'slug',
      current: 'peak-season-food-supply-risk-management-ramadan-riyadh-season',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'خطط الطوارئ الاستباقية لتأمين المخزون الغذائي الاستراتيجي وتفادي انقطاع التوريد أو قفزات الأسعار خلال شهر رمضان الفضيل والفعاليات الكبرى ومواسم السياحة والترفيه في السعودية.',
      en: 'Contingency supply chain planning for Saudi peak commercial periods: Ramadan buffer inventory, entertainment seasons rush, bulk logistics continuity, and price stabilization.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'إدارة سلاسل التوريد الغذائي في مواسم الذروة بالسعودية - منافذ التوريد',
        en: 'Peak season food supply chain management in Saudi Arabia - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-99e1addbc325b91a794a660bac22d691c75714b8-1734x907-png',
        _type: 'reference',
      },
    },
    author: 'إدارة التخطيط الاستراتيجي وسلاسل الإمداد | منافذ التوريد',
    publishedAt: '2026-11-02T19:00:00.000Z',
    order: 14,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'تأمين المخزون الغذائي لمواسم الذروة ورمضان وموسم الرياض بالجملة | منافذ التوريد',
        en: 'Securing Food Inventory During Peak Seasons (Ramadan & Riyadh Season) | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'كيف تدير مخاطر انقطاع الأغذية وتقلبات الأسعار في مواسم الذروة بالسعودية؟ خطط توريد شهر رمضان وموسم الرياض للمطاعم والفنادق وشركات الإعاشة بالجملة.',
        en: 'Strategies for managing food supply volatility in Saudi Arabia during Ramadan and Riyadh Season: buffer stocks, contract price locks, and contingency distribution.',
      },
    },
    body: [
      b('لماذا تتأزم سلاسل الإمداد الغذائي خلال مواسم الذروة؟', 'p14-h2-1', 'h2'),
      b('يشهد السوق السعودي طفرات استهلاكية كبرى تتكرر دورياً، أبرزها شهر رمضان المبارك، موسم الحج، ومواسم الترفيه الكبرى مثل موسم الرياض وفعاليات جدة والعلا. في هذه المواسم، يتضاعف الطلب على المواد الغذائية الأساسية (الأرز، الزيوت، الدواجن، واللحوم المجمدة) بنسب تتراوح بين 150% إلى 300%، مما يؤدي إلى شح معروض محلي واختناقات في أساطيل التوزيع وارتفاع حاد في الأسعار الفورية (Spot Market Prices).', 'p14-b1'),
      b('المحاور الأربعة لإدارة مخاطر التوريد الغذائي الاستباقية', 'p14-h2-2', 'h2'),
      b('1. التنبؤ المبكر بالطلب (Demand Forecasting & Buffer Stocking)', 'p14-h3-1', 'h3'),
      b('يجب على مديري المشتريات مراجعة بيانات الاستهلاك في المواسم السابقة قبل حلول الذروة بـ 60 إلى 90 يوماً على الأقل، وحجز كميات تعاقدية مسبقة مع الموردين المعتمدين لضمان تخصيص الحصص وتجنب الشراء الاضطراري بأسعار مرتفعة.', 'p14-b2'),
      b('2. عقود تثبيت الأسعار (Price Lock Agreements)', 'p14-h3-2', 'h3'),
      b('تتيح شركة منافذ التوريد لعملائها من الفنادق وسلاسل المطاعم وشركات الإعاشة توقيع عقود توريد موسمية بأسعار ثابتة ومحمية من تقلبات السوق العالمية، مما يمنح الشركات وضوحاً مالياً كاملاً في حساب تكلفة الوجبات وميزانيات التشغيل.', 'p14-b3'),
      b('3. تنويع مناشئ الاستيراد والبدائل الجاهزة', 'p14-h3-3', 'h3'),
      b('الاعتماد على مصدر واحد أو بلد منشأ وحيد يعرض المنشأة لمخاطر التوقف الفجائي بسبب تأخر الشحن البحري أو الإجراءات الجمركية. نحرص في منافذ التوريد على توفير بدائل مطابقة للمواصفات من البرازيل والهند ومصر لضمان التدفق السلس للبضائع.', 'p14-b4'),
      b('4. التنسيق اللوجستي على مدار الساعة (24/7 Dispatch)', 'p14-h3-4', 'h3'),
      b('خلال شهر رمضان ومواسم الفعاليات، تعمل مستودعاتنا ومستودعات فروعنا في الرياض والدوادمي وجدة بنظام النوبات المتتابعة لخدمة الطلبات الطارئة والتسليم الليلي قبل بدء ساعات الذروة التشغيلية.', 'p14-b5'),
    ],
    bodyEn: [
      b('Understanding Food Supply Volatility During Saudi Peak Periods', 'p14en-h2-1', 'h2'),
      b('Events like the holy month of Ramadan, Hajj, and Riyadh Season trigger unprecedented surges in food consumption, challenging inventory availability and baseline logistics.', 'p14en-b1'),
      b('Four Strategic Pillars for Mitigating Seasonal Food Risks', 'p14en-h2-2', 'h2'),
      b('Proactive demand forecasting 60-90 days in advance, fixed-price supply agreements, diversified sourcing origins, and 24/7 delivery dispatches safeguard business continuity.', 'p14en-b2'),
      b('Reliable Buffer Inventory Management with Mnaveth ALTourid', 'p14en-h2-3', 'h2'),
      b('Mnaveth ALTourid operates resilient regional warehouses and dedicated reefer delivery fleets to insulate commercial partners from market shortages during peak trading windows.', 'p14en-b3'),
    ],
  },
  {
    _id: 'article-haccp-iso-food-safety-standards-dry-cold-storage-saudi',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'معايير الهاسب (HACCP) ومطابقة الآيزو في مستودعات ومخازن الأغذية الجافة والمبردة',
      en: 'HACCP & ISO Food Safety Standards in Saudi Dry & Cold Storage Warehouses',
    },
    slug: {
      _type: 'slug',
      current: 'haccp-iso-food-safety-standards-dry-cold-storage-saudi',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'الدليل التقني لتطبيق نظم سلامة الغذاء HACCP و ISO 22000 في المستودعات الغذائية: نقاط التحكم الحرجة (CCPs)، اشتراطات مكافحة الآفات، وسجلات التتبع المعتمدة لدى SFDA.',
      en: 'Technical compliance manual for HACCP and ISO 22000 food safety standards in dry and refrigerated Saudi warehouses: critical control points, SFDA audits, and cold chain traceability.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'معايير الجودة وسلامة الغذاء والهاسب في مستودعات الأغذية - منافذ التوريد',
        en: 'HACCP & ISO Food Safety in Saudi Food Warehouses - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-f7afd3780d236ecc816f2b187e71005ea3d9e625-1451x1084-png',
        _type: 'reference',
      },
    },
    author: 'قطاع الجودة وسلامة الأغذية | منافذ التوريد',
    publishedAt: '2026-11-02T20:00:00.000Z',
    order: 15,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'معايير الهاسب والآيزو في مستودعات المواد الغذائية بالسعودية | منافذ التوريد',
        en: 'HACCP & ISO 22000 Standards in Saudi Food Storage Warehouses | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'دليل تطبيق معايير الهاسب HACCP وشهادات الآيزو في مستودعات الأغذية الجافة والمجمدة بالمملكة: اشتراطات هيئة الغذاء والدواء SFDA، مكافحة الآفات، وسجلات التتبع الدقيقة.',
        en: 'Comprehensive guide to HACCP compliance, ISO 22000 protocols, and SFDA warehouse licensing for dry, chilled, and frozen food storage in Saudi Arabia.',
      },
    },
    body: [
      b('أهمية معايير سلامة الغذاء العالمية في سلاسل الإمداد الحديثة', 'p15-h2-1', 'h2'),
      b('لم يعد الالتزام بمعايير سلامة الأغذية مجرد إجراء روتيني اختياري، بل غدا شرطاً نظامياً وتجارياً أساسياً للتعامل مع الفنادق العالمية وسلاسل المطاعم الكبرى والجهات الحكومية في المملكة. يمثل نظام تحليل المخاطر ونقاط التحكم الحرجة (HACCP) ومواصفة ISO 22000 الإطار العلمي الأوثق لمنع المخاطر البيولوجية والكيميائية والفيزيائية في بيئة التخزين والتوزيع.', 'p15-b1'),
      b('نقاط التحكم الحرجة (CCPs) في المستودعات الغذائية الجافة والمبردة', 'p15-h2-2', 'h2'),
      b('1. مراقبة درجات الحرارة والرطوبة في غرف التجميد والتبريد', 'p15-h3-1', 'h3'),
      b('تتطلب اللحوم والبروتينات المجمدة استقراراً تاماً عند درجة حرارة لا تتجاوز -18 درجة مئوية، بينما الأغذية الجافة (الأرز، الزيوت، المعلبات) تتطلب بيئة جافة مهواة بدرجة حرارة معتدلة ورطوبة لا تزيد عن 60% لتجنب تلف العبوات أو تكاثر الحشرات.', 'p15-b2'),
      b('2. برامج النظافة ومكافحة الآفات (Integrated Pest Management)', 'p15-h3-2', 'h3'),
      b('تطبيق برامج وقائية صارمة لعزل المستودعات عن طريق الستائر الهوائية، الأبواب الكهربائية سريعة الإغلاق، ومصائد الحشرات الإلكترونية المعتمدة غذائياً، مع عقود فحص دورية موثقة بسجلات تفقد معتمدة لدى الجهات الرقابية.', 'p15-b3'),
      b('3. نظام التتبع وإدارة المخزون وفق مبدأ (FEFO / FIFO)', 'p15-h3-3', 'h3'),
      b('الاعتماد على قاعدة «ما ينتهي أولاً يخرج أولاً» (First Expired, First Out) يضمن عدم بقاء أي صنف قريب من تاريخ انتهاء الصلاحية في المستودع، مع ربط كل كرتونة برقم تشغيلة إلكتروني يتيح تتبع مسار الشحنة من الميناء وحتى باب العميل.', 'p15-b4'),
      b('التزام شركة منافذ التوريد بأعلى معايير الجودة والسلامة', 'p15-h2-3', 'h2'),
      b('تخضع كافة مستودعات ومرافق شركة منافذ التوريد لرقابة صارمة ومطابقة دورية مع اشتراطات الهيئة العامة للغذاء والدواء (SFDA) والبلديات، مما يضمن لعملائنا استلام منتجات غذائية آمنة ومطابقة للمواصفات القياسية السعودية (SASO).', 'p15-b5'),
    ],
    bodyEn: [
      b('Global Food Safety Systems in Saudi Supply Chains', 'p15en-h2-1', 'h2'),
      b('Implementing HACCP and ISO 22000 food safety management systems ensures complete risk prevention across biological, physical, and chemical hazards in warehousing and logistics.', 'p15en-b1'),
      b('Critical Control Points (CCPs) in Ambient & Cold Storage', 'p15en-h2-2', 'h2'),
      b('From digital temperature logging at -18C for frozen meats to climate-controlled ambient zones for grains and oils, strict threshold controls protect cargo integrity.', 'p15en-b2'),
      b('FEFO Inventory Rotation & Full Batch Traceability', 'p15en-h2-3', 'h2'),
      b('Applying First Expired, First Out stock management paired with automated barcode tracking ensures full compliance with SFDA and SASO regulatory mandates.', 'p15en-b3'),
    ],
  },
]



export const batch4Articles: ArticleData[] = [
  {
    _id: 'article-indian-basmati-rice-wholesale-import-guide-saudi',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'دليل استيراد وشراء الأرز البسمتي الهندي بالجملة: الفروقات، التعتيق، والجودة',
      en: 'Sourcing & Buying Bulk Indian Basmati Rice in Saudi Arabia: Aging, Varieties & Yield',
    },
    slug: {
      _type: 'slug',
      current: 'indian-basmati-rice-wholesale-import-guide-saudi',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'دليلك الشامل لمديري المشتريات وملاك المطاعم في السعودية لشراء الأرز البسمتي بالجملة: الفروق بين مزة 1121 والسيلا والأبيض، معايير التعتيق، وكيفية حساب حجم التمدد بعد الطهي.',
      en: 'Complete procurement guide to wholesale Indian Basmati rice for commercial Saudi kitchens: 1121 Sella vs Creamy parboiled, aging criteria, and expansion cooking yields.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'أرز بسمتي هندي فاخر بالجملة للمطاعم - منافذ التوريد',
        en: 'Premium wholesale Indian Basmati rice for Saudi restaurants - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-59490b248b32e2013b3122cc27e0d7f9f9adc15d-1254x1254-png',
        _type: 'reference',
      },
    },
    author: 'قطاع الحبوب والأرز | منافذ التوريد',
    publishedAt: '2026-11-02T21:00:00.000Z',
    order: 16,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'شراء أرز بسمتي هندي بالجملة للمطاعم في السعودية | منافذ التوريد',
        en: 'Bulk Indian Basmati Rice Wholesale for Saudi Restaurants | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'دليل شراء الأرز البسمتي بالجملة في الرياض وجدة: مواصفات أرز مزة 1121، معايير التعتيق سنتين، نسبة التمدد ومقاومة التكسر في قدور الطهي الكبيرة.',
        en: 'Wholesale guide to Indian Basmati rice in Saudi Arabia: 1121 sella specifications, two-year aging metrics, grain elongation, and volume kitchen yield.',
      },
    },
    body: [
      b('مكانة الأرز البسمتي في قطاع المأكولات والمطاعم السعودي', 'p16-h2-1', 'h2'),
      b('يعد الأرز البسمتي السلعة التموينية الأكثر استهلاكاً وأهمية في قطاع المطاعم بالمملكة العربية السعودية؛ فهو المكون الرئيسي لأشهر الأطباق الوطنية مثل الكبسة، المندي، البخاري، والبرياني. اختيار الصنف الأنسب ليس مجرد مسألة نكهة، بل هو قرار اقتصادي يؤثر مباشرة على حجم إنتاجية المطبخ (Kitchen Yield) وهوامش الربح التشغيلية.', 'p16-b1'),
      b('أبرز أصناف الأرز البسمتي والفرق بين الأبيض والمزة (السيلا)', 'p16-h2-2', 'h2'),
      b('1. أرز بسمتي 1121 مزة (Sella Basmati)', 'p16-h3-1', 'h3'),
      b('يخضع أرز السيلا للبسترة والمعالجة بالبخار قبل التقشير، مما يجعل حبة الأرز صفراء ذهبية شديدة الصلابة ومقاومة للتكسر أثناء الطهي في القدور التجارية الضخمة ومواقد الضغط العالي. يتميز بنسبة تمدد مذهلة تصل إلى مرتين ونصف طول الحبة الأصلية.', 'p16-b2'),
      b('2. أرز بسمتي أبيض طويل الحبة (Traditional White Basmati)', 'p16-h3-2', 'h3'),
      b('يتميز برائحته العطرية الفواحة وقوامه الخفيف الناعم، وهو الخيار المفضل لمطاعم الفنادق الراقية ومطاعم المأكولات العالمية والبرياني الكشميري، ويتطلب مهارة وتحكماً دقيقاً في درجات حرارة النقع والغلي لتجنب التصاقه.', 'p16-b3'),
      b('أهمية التعتيق (Rice Aging) في تحسين جودة الطهي', 'p16-h2-3', 'h2'),
      b('الأرز البسمتي المعتق لمدة تتراوح بين سنة إلى سنتين يفقد نسبة الرطوبة الزائدة تدريجياً، مما يمنحه قدرة استثنائية على امتصاص المرق ودهون اللحم دون أن يتعجن، ويعطي حبات متفرقة ونثرية بالكامل عند التقديم للعميل.', 'p16-b4'),
      b('خدمات توريد الأرز بالجملة من منافذ التوريد', 'p16-h2-4', 'h2'),
      b('تستورد شركة منافذ التوريد أجود محاصيل بنجاب وهاريانا الهندية مباشرة في أكياس خيش وبولي بروبيلين محكمة الإغلاق بأوزان 10 كجم و 40 كجم، مع ضمان ثبات الجودة طوال العام بأسعار منافسة للمطاعم ومطابخ الإعاشة والفنادق.', 'p16-b5'),
    ],
    bodyEn: [
      b('Basmati Rice as the Cornerstone of Saudi Foodservice', 'p16en-h2-1', 'h2'),
      b('In Saudi culinary tradition, long-grain Basmati rice underpins signature dishes like Kabsa and Mandi, making grain yield and texture consistency critical for restaurant profitability.', 'p16en-b1'),
      b('Comparing 1121 Sella Parboiled vs Classic White Basmati', 'p16en-h2-2', 'h2'),
      b('Parboiled 1121 Sella delivers exceptional heat resistance and double grain elongation in high-volume commercial pots, while White Basmati provides unmatched natural aroma for premium hotel banquets.', 'p16en-b2'),
      b('Direct Indian Mill Import & Bulk Sourcing with Mnaveth ALTourid', 'p16en-h2-3', 'h2'),
      b('Mnaveth ALTourid supplies aged Basmati rice directly to Saudi restaurateurs in 10kg and 40kg wholesale bags with guaranteed lot consistency across all seasons.', 'p16en-b3'),
    ],
  },
  {
    _id: 'article-wholesale-cooking-oil-food-service-factories-saudi',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'توريد زيوت الطعام بالجملة للمطابخ والمصانع: مقارنة بين أنواع الزيوت وأسعارها',
      en: 'Wholesale Cooking Oil Procurement for Restaurants & Food Processors in Saudi Arabia',
    },
    slug: {
      _type: 'slug',
      current: 'wholesale-cooking-oil-food-service-factories-saudi',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'مقارنة اقتصادية وتقنية بين زيوت القلي النباتية، زيت النخيل (أولين)، زيت الذرة، وزيت دوار الشمس للمطاعم ومصانع الأغذية: نقطة الدخان، ثبات القلي المتكرر، وتوفير التكاليف.',
      en: 'Sourcing commercial cooking oils in Saudi Arabia: palm olein, sunflower, corn, and vegetable frying blends for industrial kitchens, high smoke points, and bulk tin pricing.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'توريد زيوت طعام وقلي بالجملة للمطاعم والمصانع - منافذ التوريد',
        en: 'Wholesale cooking oils for commercial restaurants - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-9e386b13a5e41e6cc5dd811f350dbaa7846006ca-1200x896-png',
        _type: 'reference',
      },
    },
    author: 'قطاع الزيوت والمواد التموينية | منافذ التوريد',
    publishedAt: '2026-11-02T21:30:00.000Z',
    order: 17,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'توريد زيوت طعام وقلي بالجملة للمطاعم في السعودية | منافذ التوريد',
        en: 'Commercial Cooking & Frying Oil Wholesale Supply Saudi Arabia | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'أسعار صفائح زيت القلي بالجملة للمطاعم في الرياض وجدة: زيت دوار الشمس، زيت الذرة، وزيت أولين النخيل عبوات 17 و 18 لتراً بجودة عالية ونقطة دخان مرتفعة.',
        en: 'Bulk commercial frying oil distributor in Saudi Arabia: 18L tins of palm olein, sunflower oil, and corn oil for fast food chains and catering kitchens.',
      },
    },
    body: [
      b('أثر جودة ونوع زيت القلي على تكاليف ونكهة الطعام', 'p17-h2-1', 'h2'),
      b('تستهلك مطابخ المطاعم ومصانع الأغذية كميات ضخمة من زيوت الطعام أسبوعياً، خاصة في مطاعم البروستد، الفلافل، المعجنات، والشاورما. إن اختيار الزيت الخاطئ قد يؤدي إلى سرعة احتراقه، اسوداد لون الوجبات، وتكرار تفريغ المقالي، مما يضاعف تكلفة الزيت المهدر ويسيء لتجربة الزبون.', 'p17-b1'),
      b('مقارنة بين أشهر أنواع زيوت الطهي والقلي التجارية', 'p17-h2-2', 'h2'),
      b('1. زيت أولين النخيل (Palm Olein Frying Oil)', 'p17-h3-1', 'h3'),
      b('يعتبر الزيت الأكثر كفاءة واقتصادية لمقالي الغمر العميق (Deep Frying). يتميز بنقطة دخان فائقة الارتفاع (235° مئوية) ومقاومة عالية للتأكسد والتحلل الحراري، مما يجعله يدوم لفترات تشغيل أطول بنسبة 40% مقارنة بالزيوت الخفيفة.', 'p17-b2'),
      b('2. زيت دوار الشمس وزيت الذرة النقي', 'p17-h3-2', 'h3'),
      b('الخيار الذهبي لمطاعم الوجبات الصحية، المعجنات الفاخرة، والطبخ الخفيف. يتميز بلونه الفاتح الشفاف وخلوه التام من أي طعم أو رائحة تؤثر على نكهة المكونات الأصلية.', 'p17-b3'),
      b('3. مزيج زيوت القلي المزدوج (Blended Frying Oil)', 'p17-h3-3', 'h3'),
      b('مزيج علمي مدروس يجمع بين ثبات زيت النخيل وخفة زيت الصويا ودوار الشمس، مما يعطي توازناً مثالياً بين المقرمشة السطحية والتكلفة التنافسية.', 'p17-b4'),
      b('تأمين توريد دوري لصفائح الزيت مع منافذ التوريد', 'p17-h2-3', 'h2'),
      b('توفر شركة منافذ التوريد صفائح صفيح متينة ومحكمة الإغلاق سعة 17 لتراً و 18 لتراً، وجوالين بلاستيكية غذائية معتمدة لدى SFDA، مع إمكانية التوريد الأسبوعي المنتظم لمستودعات مطعمك مباشرة بأسعار الجملة المباشرة.', 'p17-b5'),
    ],
    bodyEn: [
      b('The Economics of Commercial Frying Oils in Foodservice', 'p17en-h2-1', 'h2'),
      b('Commercial fryers in Saudi fast food and catering operations process hundreds of liters weekly; oil thermal stability directly impacts kitchen overhead and food crispiness.', 'p17en-b1'),
      b('Palm Olein vs Sunflower vs Blended Vegetable Oils', 'p17en-h2-2', 'h2'),
      b('Palm olein delivers unmatched longevity with a 235C smoke point for high-turnover deep frying, while pure sunflower oil is optimal for light sauteing and delicate flavor preservation.', 'p17en-b2'),
      b('Bulk Tins & Regular Delivery from Mnaveth ALTourid', 'p17en-h2-3', 'h2'),
      b('We distribute certified 17L and 18L industrial tins across Riyadh and Jeddah, supporting restaurant groups with contract supply predictability.', 'p17en-b3'),
    ],
  },
  {
    _id: 'article-wholesale-canned-food-tomato-paste-legumes-saudi',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'معلبات الطماطم والبقوليات بالجملة: دليلك لأفضل العبوات والموردين المعتمدين',
      en: 'Wholesale Canned Food: Bulk Tomato Paste & Legumes for Catering in Saudi Arabia',
    },
    slug: {
      _type: 'slug',
      current: 'wholesale-canned-food-tomato-paste-legumes-saudi',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'دليل التوريد المؤسسي للمعلبات الغذائية: معجون الطماطم بتركيز بريكس 28-30%، الفول المدمس، الحمص، واللوبيا، والعبوات الفندقية المناسبة لتشغيل المطابخ الكبرى دون هدر.',
      en: 'Commercial catering guide to wholesale canned provisions: brix 28-30% tomato paste, fava beans, chickpeas, and industrial A10 packings for Saudi foodservice operators.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'معلبات غذائية ومعجون طماطم وبقوليات بالجملة - منافذ التوريد',
        en: 'Wholesale canned foods and tomato paste - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-8d0c38aa65a3536935c0ad34ff0e5adf05c9943a-1200x896-png',
        _type: 'reference',
      },
    },
    author: 'قسم المواد الجافة والمعلبات | منافذ التوريد',
    publishedAt: '2026-11-02T22:00:00.000Z',
    order: 18,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'توريد معلبات غذائية ومعجون طماطم بالجملة في السعودية | منافذ التوريد',
        en: 'Wholesale Canned Foods & Bulk Tomato Paste Supplier Saudi Arabia | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'مورد معتمد للمعلبات الغذائية بالجملة للمطاعم والفنادق: معجون طماطم عبوات كبيرة A10، فول مدمس، حمص حب، وفاصولياء حمراء بأسعار تنافسية في الرياض وجدة.',
        en: 'Institutional distributor of wholesale canned foods in Saudi Arabia: bulk tomato paste (Brix 28-30%), canned chickpeas, fava beans, and sweet corn.',
      },
    },
    body: [
      b('دور المعلبات الغذائية في استقرار مطابخ الإعاشة والمطاعم', 'p18-h2-1', 'h2'),
      b('تمثل المعلبات الغذائية شريان الحياة في مطابخ التموين السريع والفنادق ومطاعم المأكولات الشعبية والشامية في المملكة. توفر الأغذية المعلبة جاهزية فورية للتحضير، وتلغي هدر التقشير والنقع الطويل، مع تميزها بصلاحية تمتد إلى عامين أو ثلاثة أعوام في بيئة التخزين الجاف المعتدلة.', 'p18-b1'),
      b('معايير جودة معجون الطماطم للمطاعم والمطابخ المركزية', 'p18-h2-2', 'h2'),
      b('1. نسبة التركيز والمواد الصلبة الذائبة (Brix Degree)', 'p18-h3-1', 'h3'),
      b('يعد تركيز بريكس 28% إلى 30% المعيار الذهبي للمطاعم الممتازة؛ حيث يوفر قواماً كثيفاً ولوناً أحمر طبيعياً دون الحاجة لإضافة أصباغ، وتمنح الملعقة الواحدة منه تركيزاً يعادل ثلاثة أضعاف الصلصات التجارية الخفيفة.', 'p18-b2'),
      b('2. حجم ونوعية العبوات الاقتصادية (Foodservice Size A10)', 'p18-h3-2', 'h3'),
      b('بدلاً من شراء العلب الصغيرة سعة 135 غراماً، توفر عبوات الحجم الفندقي الكبير (A10 بوزن 3 كجم إلى 4.5 كجم) وفراً مالياً يصل إلى 35% في فاتورة المشتريات الشهرية، مع سرعة تفريغ في قدور الطبخ الكبيرة.', 'p18-b3'),
      b('البقوليات المعلبة الأكثر طلباً لقطاع الضيافة والإفطار', 'p18-h2-3', 'h2'),
      b('• الفول المدمس السادة وفول الخلطات بعبوات الكيلوجرام والعبوات الفندقية لمطاعم الإفطار والبوفيهات.', 'p18-b4'),
      b('• الحمص الحب المسلوق لتحضير متبل ومسبحة الحمص الطازجة بجودة ناعمة ومتجانسة.', 'p18-b5'),
      b('• الفاصولياء الحمراء والبيضاء، الذرة الحلوة، والفطر (المشروم) المقطع لمطاعم البيتزا والباستا والسلطات.', 'p18-b6'),
      b('خدمات التخزين والتوريد للمعلبات من منافذ التوريد', 'p18-h2-4', 'h2'),
      b('نضمن تخزين كافة الشحنات في مستودعات جافة مكيفة ومطابقة لاشتراطات SFDA، مع توصيل سريع بالكرتون والباليتات الكاملة إلى باب مطبخك في جميع مدن المملكة.', 'p18-b7'),
    ],
    bodyEn: [
      b('Strategic Importance of Canned Provisions in High-Turnover Kitchens', 'p18en-h2-1', 'h2'),
      b('Canned foods guarantee immediate culinary readiness, consistent portion yields, and a 2-3 year ambient shelf life, eliminating pre-soaking and preparation downtime.', 'p18en-b1'),
      b('Tomato Paste Quality Metrics & Brix Concentration', 'p18en-h2-2', 'h2'),
      b('Commercial kitchens rely on Brix 28-30% paste for robust color and rich viscosity; institutional A10 (3kg-4.5kg) tins reduce packaging waste and deliver 35% procurement savings.', 'p18en-b2'),
      b('Comprehensive Legumes Catalog with Mnaveth ALTourid', 'p18en-h2-3', 'h2'),
      b('From fava beans and chickpeas to mushrooms and sweet corn, Mnaveth ALTourid distributes certified canned provisions directly to restaurant chains and central kitchens.', 'p18en-b3'),
    ],
  },
  {
    _id: 'article-premium-dates-wholesale-hospitality-corporate-saudi',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'توريد التمور الفاخرة لقطاع الضيافة والشركات في المملكة',
      en: 'Sourcing Premium Saudi Dates Wholesale for Luxury Hospitality & Corporate Gifting',
    },
    slug: {
      _type: 'slug',
      current: 'premium-dates-wholesale-hospitality-corporate-saudi',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'دليل اختيار وتوريد التمور السعودية الفاخرة (السكري، العجوة، الخلاص، والمجدول) للفنادق والشركات والجهات الحكومية: معايير الفرز، التغليف الفردي الفاخر، واشتراطات التخزين المبرد.',
      en: 'Commercial guide to buying premium Saudi dates for corporate amenities and luxury hotels: Sukkari, Ajwa, Khalas, and Medjool grading, hygienic packaging, and cold storage.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'توريد تمور سعودية فاخرة بالجملة للفنادق والشركات - منافذ التوريد',
        en: 'Premium Saudi dates wholesale for corporate hospitality - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-654b7c3d5ab43686e0309e2c1655a9db56ee6527-1200x896-png',
        _type: 'reference',
      },
    },
    author: 'قطاع التمور والضيافة السعودية | منافذ التوريد',
    publishedAt: '2026-11-02T22:30:00.000Z',
    order: 19,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'توريد تمور فاخرة بالجملة للفنادق والشركات في السعودية | منافذ التوريد',
        en: 'Premium Saudi Dates Wholesale Supplier for Hospitality & Corporate | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'مورد معتمد للتمور السعودية الفاخرة لقطاع الضيافة والفنادق والجهات الحكومية: سكري القصيم، خلاص الأحساء، وعجوة المدينة المنورة مغلفة فردياً وجملة بأسعار منافسة.',
        en: 'Wholesale distributor of premium Saudi dates for luxury hotels, airlines, and corporate events: Sukkari, Khalas, and Ajwa in elegant individual and bulk packaging.',
      },
    },
    body: [
      b('التمور كأيقونة للضيافة السعودية الأصيلة', 'p19-h2-1', 'h2'),
      b('تمثل التمور رمز الكرم وعنوان الهوية الثقافية في المملكة العربية السعودية. تقدم التمور الفاخرة يومياً في ردهات فنادق الـ 5 نجوم، مجالس الإدارات، قاعات المؤتمرات، والطيران الملكي والتجاري. اختيار الصنف المصنف درجة أولى وحجم الحبة وتناسق لونها يعكس فخامة المنشأة واعتناءها بأدق تفاصيل تجربة ضيوفها.', 'p19-b1'),
      b('أشهر أصناف التمور للقطاع المؤسسي والضيافة', 'p19-h2-2', 'h2'),
      b('1. سكري القصيم المفتل والجالكسي', 'p19-h3-1', 'h3'),
      b('يعد السكري المفتل الخيار الأول والأكثر طلباً في ضيافة القهوة السعودية بالشركات والفنادق، بفضل لونه الذهبي الفاتح وقوامه المقرمش اللذيذ وحلاوته الطبيعية المتوازنة.', 'p19-b2'),
      b('2. خلاص الأحساء والخرج الفاخر', 'p19-h3-2', 'h3'),
      b('يتميز بقوامه الدبق الناعم ونكهته العسلية الغنية، وهو الصنف الأنسب لتقديم التمور المحشوة بالمكسرات الفاخرة (اللوز والبيكان) وتوزيعات الهدايا المؤسسية.', 'p19-b3'),
      b('3. عجوة المدينة المنورة المباركة', 'p19-h3-3', 'h3'),
      b('الخيار الاستراتيجي الأول لفنادق مكة المكرمة والمدينة المنورة وهدايا كبار الشخصيات والوفود الدولية القادمة للمملكة لقيمتها التاريخية والدينية ومذاقها الفريد.', 'p19-b4'),
      b('أنماط التعبئة والتغليف الحديثة المعتمدة لدى منافذ التوريد', 'p19-h2-3', 'h2'),
      b('توفر شركة منافذ التوريد حلول تغليف فردي معقم (Single Wrapped) تحافظ على نظافة الحبة وتمنع ملامستها بالأيدي في بوفيهات الفنادق وغرف النزلاء، بالإضافة إلى كراتين الجملة المبردة سعة 3 كجم و 5 كجم والمحفوظة في مستودعات تبريد متحكم برطوبتها لضمان طراوة التمر طوال العام.', 'p19-b5'),
    ],
    bodyEn: [
      b('Dates as the Signature of Saudi Hospitality', 'p19en-h2-1', 'h2'),
      b('Premium Saudi dates represent cultural heritage and premier hospitality across 5-star hotel lobbies, royal lounges, and corporate executive suites.', 'p19en-b1'),
      b('Premier Date Varieties for Corporate Hospitality', 'p19en-h2-2', 'h2'),
      b('Crisp golden Qassim Sukkari is the hallmark pairing for Arabic coffee, rich Al-Ahsa Khalas is perfect for artisan nut fillings, and Madinah Ajwa serves as the ultimate gift of honor.', 'p19en-b2'),
      b('Hygienic Single-Wrap & Bulk Packaging with Mnaveth ALTourid', 'p19en-h2-3', 'h2'),
      b('Mnaveth ALTourid distributes individually flow-wrapped hygienic dates and climate-stored wholesale boxes to premier hospitality clients throughout the Kingdom.', 'p19en-b3'),
    ],
  },
  {
    _id: 'article-future-saudi-food-trade-supply-chains-vision-2030',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'مستقبل التجارة وسلاسل الإمداد الغذائي في السعودية وفق رؤية 2030',
      en: 'The Future of Food Trading & Supply Chains in Saudi Arabia Under Vision 2030',
    },
    slug: {
      _type: 'slug',
      current: 'future-saudi-food-trade-supply-chains-vision-2030',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'نظرة استشرافية على تحول قطاع التوريد الغذائي B2B في المملكة: الموانئ اللوجستية الذكية، منصات الربط الرقمي، مبادرات الأمن الغذائي الوطني، ودور منافذ التوريد في تمكين الشركات.',
      en: 'In-depth analysis of Saudi Arabia\'s food logistics revolution under Vision 2030: automated cold hubs, digital procurement platforms, national food security, and agile B2B distribution.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'مستقبل سلاسل الإمداد الغذائي في السعودية ورؤية 2030 - منافذ التوريد',
        en: 'Future of food supply chains in Saudi Arabia under Vision 2030 - Mnaveth ALTourid',
      },
      asset: {
        _ref: 'image-501b2f1789b17aa3d5227d0cf5539dabebcd6b66-1734x907-png',
        _type: 'reference',
      },
    },
    author: 'الإدارة العامة للأبحاث واستراتيجيات السوق | منافذ التوريد',
    publishedAt: '2026-11-02T23:00:00.000Z',
    order: 20,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'مستقبل سلاسل الإمداد الغذائي والتجارة في السعودية رؤية 2030 | منافذ التوريد',
        en: 'Future of Food Supply Chains & B2B Trading in Saudi Arabia Vision 2030 | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'كيف تعيد رؤية السعودية 2030 تشكيل قطاع التوريد الغذائي؟ الموانئ اللوجستية الجافة، التحول الرقمي في مشتريات الأغذية، واستراتيجيات تعزيز الأمن الغذائي الوطني.',
        en: 'Exploring the transformation of food supply chains in Saudi Arabia: Vision 2030 logistics hubs, cold chain digitalization, and national food security architecture.',
      },
    },
    body: [
      b('التحول الهيكلي لقطاع الأغذية والخدمات اللوجستية في السعودية', 'p20-h2-1', 'h2'),
      b('يشهد قطاع الأغذية والمشروبات (F&B) وسلاسل الإمداد اللوجستية في المملكة ثورة تحديث جذرية في إطار رؤية السعودية 2030. لم تعد تجارة المواد الغذائية بالجملة تعتمد على الطرق التقليدية غير المنظمة، بل تحولت إلى صناعة مؤسسية ذكية ترتكز على المراكز اللوجستية الجافة، الحاويات المبردة الذكية، والمنصات الرقمية المترابطة مع الهيئات الحكومية.', 'p20-b1'),
      b('أبرز ركائز مستقبل التوريد الغذائي في المملكة', 'p20-h2-2', 'h2'),
      b('1. تعزيز منظومة الأمن الغذائي الوطني (National Food Security)', 'p20-h3-1', 'h3'),
      b('تركز الاستراتيجية الوطنية للأمن الغذائي على تأمين مخزونات كافية من السلع الاستراتيجية الأساسية (القمح، الأرز، الزيوت، واللحوم) وتوسيع الشراكات الزراعية والتجارية العالمية مع دول المنشأ، مما يضمن استقرار الإمدادات وتجنب تقلبات الأسواق العالمية.', 'p20-b2'),
      b('2. الموانئ الجافة والمناطق اللوجستية الحرة', 'p20-h3-2', 'h3'),
      b('إطلاق المخطط العام للمراكز اللوجستية يربط الموانئ البحرية الرئيسية (ميناء جدة الإسلامي وميناء الملك عبد العزيز بالدمام) بالموانئ الجافة في الرياض والقصيم عبر شبكات السكك الحديدية الحديثة، مما يقلص زمن الإفراج الجمركي ونقل البضائع من أسابيع إلى أيام معدودة.', 'p20-b3'),
      b('3. أتمتة سلاسل التبريد والتتبع الرقمي (Cold Chain Automation)', 'p20-h3-3', 'h3'),
      b('الاعتماد المتزايد على مستشعرات إنترنت الأشياء (IoT) لمراقبة حرارة البضائع أثناء النقل البحري والبري لحظياً، وربطها بنظام الفاتورة الإلكترونية ومنصات الربط الجمركي «فسح»، لضمان أعلى مستويات الشفافية وسلامة الأغذية.', 'p20-b4'),
      b('دور شركة منافذ التوريد في قيادة هذا التحول', 'p20-h2-3', 'h2'),
      b('تتبنى شركة منافذ التوريد للتجارة أحدث معايير التحول الرقمي وحوكمة سلاسل الإمداد، من خلال مستودعاتنا المركزية وشبكة فروعنا الموسعة، لنكون الذراع الموثوق لقطاع المطاعم، الفنادق، المصانع، والمشاريع الكبرى في بناء مستقبل غذائي مستدام وواعد.', 'p20-b5'),
    ],
    bodyEn: [
      b('Structural Transformation of Saudi Food Logistics', 'p20en-h2-1', 'h2'),
      b('Under Saudi Vision 2030, the foodservice and bulk trading sector is evolving into an integrated, digitized ecosystem driven by state-of-the-art cold hubs and dry port corridors.', 'p20en-b1'),
      b('Key Pillars Shaping the Next Decade of Food Procurement', 'p20en-h2-2', 'h2'),
      b('National food security buffers, automated IoT temperature monitoring, FASAH customs integration, and direct rail logistics ensure seamless trade from maritime docks to commercial kitchens.', 'p20en-b2'),
      b('Leading the B2B Supply Frontier with Mnaveth ALTourid', 'p20en-h2-3', 'h2'),
      b('Mnaveth ALTourid continues to pioneer tech-enabled B2B food distribution across Saudi Arabia, empowering hotels, mega-camps, and restaurant groups with resilient supply chain architectures.', 'p20en-b3'),
    ],
  },
]



export const batch5PrArticles: ArticleData[] = [
  {
    _id: 'article-pr-1',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: '«منافذ التوريد» تعزز منظومة الإمداد الغذائي لقطاع المطاعم والفنادق بالمملكة وتواكب مستهدفات رؤية 2030',
      en: 'Mnaveth ALTourid Expands Integrated Food Supply Networks for Saudi Hospitality and Restaurant Sectors in Line with Vision 2030',
    },
    slug: {
      _type: 'slug',
      current: 'mnaveth-altourid-food-supply-chain-expansion-vision-2030',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'الرياض - أعلنت شركة منافذ التوريد للتجارة (سجل تجاري 1116011768) عن توسيع عملياتها اللوجستية وتدشين منظومة إمداد متطورة لخدمة قطاعات الضيافة والمطاعم والمطابخ المركزية بالمملكة، دعماً لمستهدفات رؤية السعودية 2030.',
      en: 'Riyadh - Mnaveth ALTourid Trading Co. (CR 1116011768) announced the strategic expansion of its cold chain logistics network to serve hospitality, central kitchens, and food service sectors across Saudi Arabia.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'شركة منافذ التوريد للتجارة - تعزيز سلاسل الإمداد الغذائي بالمملكة ورؤية 2030',
        en: 'Mnaveth ALTourid Trading Co. - Food Supply Chain Expansion Saudi Vision 2030',
      },
      asset: {
        _ref: 'image-9f31e0e949c883074cb01bc21f6808bfaf1138c4-1234x1274-png',
        _type: 'reference',
      },
    },
    author: 'المركز الإعلامي - شركة منافذ التوريد',
    publishedAt: '2026-11-03T10:00:00.000Z',
    order: 21,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'بيان صحفي: منافذ التوريد تعزز سلاسل الإمداد الغذائي لقطاع المطاعم والفنادق بالمملكة | رؤية 2030',
        en: 'Press Release: Mnaveth ALTourid Expands Food Supply Chain Infrastructure in Saudi Arabia',
      },
      description: {
        _type: 'localizedText',
        ar: 'بيان صحفي رسمي: شركة منافذ التوريد للتجارة توسع أسطول التوزيع المبرد ومراكز التخزين اللوجستي في الرياض والمنطقة الغربية لتلبية الطلب المتنامي في قطاع الإعاشة والضيافة والمطاعم.',
        en: 'Official press release: Mnaveth ALTourid Trading Co. scales up cold storage hubs and reefer transport to empower Saudi hotels, restaurants, and catering contractors.',
      },
    },
    body: [
      b('إعلان صحفي رسمي: شراكات استراتيجية لدعم الأمن الغذائي ومشاريع الضيافة', 'pr1-h2-1', 'h2'),
      b('الرياض، المملكة العربية السعودية — أعلنت شركة منافذ التوريد للتجارة (سجل تجاري: 1116011768)، إحدى الشركات الوطنية الرائدة في قطاع تجارة الجملة والتوريد الغذائي بالمملكة، عن إطلاق خطتها التوسعية الشاملة لتطوير سلاسل الإمداد والتوزيع المبرد للسلع الغذائية الاستراتيجية والبروتينات المجمدة، تزامناً مع الطفرة الاقتصادية والنمو المتسارع لقطاع السياحة والترفيه والمطاعم في إطار مستهدفات رؤية السعودية 2030.', 'pr1-b1'),
      b('توسيع شبكة المستودعات المركزية في الرياض والغربية', 'pr1-h2-2', 'h2'),
      b('وفي تصريح للإدارة التنفيذية، أكدت «منافذ التوريد» رفع الطاقة الاستيعابية لمستودعاتها المركزية في الرياض ومنطقة الحائر، بالتوازي مع توسيع نطاق العمليات في المنطقة الغربية (جدة، مكة المكرمة، والمدينة المنورة) لتلبية متطلبات كبرى سلاسل المطاعم، والمطابخ السحابية، وشركات الإعاشة المتعاقدة مع المشاريع الكبرى ومواسم العمرة والحج.', 'pr1-b2'),
      b('منظومة تبريد متقدمة ومطابقة شاملة لاشتراطات SFDA', 'pr1-h2-3', 'h2'),
      b('تعتمد الشركة أحدث تقنيات إدارة سلاسل التبريد (Cold Chain Integrity) مع مراقبة حرارية لحظية للشحنات على مدار الساعة لضمان وصول اللحوم المجمدة والكبدة والسلع التموينية بأعلى معايير السلامة والجودة المعتمدة من الهيئة العامة للغذاء والدواء (SFDA) والأنظمة الصحية الدولية (HACCP).', 'pr1-b3'),
      b('التزام راسخ بدعم الشركاء التجاريين وعقود التوريد الحكومية', 'pr1-h2-4', 'h2'),
      b('واختتم البيان بالتأكيد على جاهزية منافذ التوريد لتوقيع وتفعيل عقود التوريد السنوية والتنافس في منصات الأعمال المعتمدة (مثل منصة اعتماد والغرف التجارية)، مع تقديم حلول تموينية مرنة تضمن ثبات الأسعار وتدفق المخزون الاستراتيجي دون انقطاع.', 'pr1-b4'),
    ],
    bodyEn: [
      b('Official Press Release: Strengthening Food Security and Hospitality Supply Chains', 'pr1en-h2-1', 'h2'),
      b('Riyadh, Saudi Arabia — Mnaveth ALTourid Trading Co. (Commercial Registration: 1116011768), a premier Saudi wholesale and institutional food supplier, announced today the strategic scale-up of its temperature-controlled logistics infrastructure to support the rapid growth of Saudi hospitality, mega-events, and restaurant brands under Vision 2030.', 'pr1en-b1'),
      b('Centralized Cold Hubs in Riyadh and Western Province', 'pr1en-h2-2', 'h2'),
      b('The expansion enhances cold storage capacity across Riyadh and Western Province distribution hubs, enabling reliable supply continuity for hotels, cloud kitchens, and institutional catering contractors.', 'pr1en-b2'),
      b('Full Compliance with SFDA & HACCP Standards', 'pr1en-h2-3', 'h2'),
      b('Through active IoT thermal tracking and rigorous cold chain controls, Mnaveth ALTourid ensures all meats, proteins, and dry goods maintain unbroken freshness and strict adherence to Saudi Food and Drug Authority regulations.', 'pr1en-b3'),
    ],
  },
  {
    _id: 'article-pr-2',
    _type: 'article',
    title: {
      _type: 'localizedString',
      ar: 'مسيرة 22 عاماً في قيادة سلاسل التوريد الغذائي: كيف رسخت «منافذ التوريد» معايير الجودة وسلامة الغذاء منذ 2004؟',
      en: 'A 22-Year Legacy in Food Supply Leadership: How Mnaveth ALTourid Redefined Quality and Cold Chain Standards Since 2004',
    },
    slug: {
      _type: 'slug',
      current: '22-years-excellence-food-supply-saudi-arabia-since-2004',
    },
    excerpt: {
      _type: 'localizedText',
      ar: 'تقرير شامل يسلط الضوء على رحلة شركة منافذ التوريد للتجارة منذ انطلاقتها عام 2004، ونجاحها في بناء شبكة إمداد غذائي موثوقة تخدم أكثر من 500 عميل وتدير ما يزيد عن 1,200 شحنة سنوية عبر أرجاء المملكة.',
      en: 'An in-depth business report chronicling Mnaveth ALTourid Trading Co.’s 22-year journey since 2004, scaling institutional wholesale distribution to over 500 corporate clients with 1,200+ annual shipments across Saudi Arabia.',
    },
    coverImage: {
      _type: 'localizedImage',
      alt: {
        _type: 'localizedString',
        ar: 'مستودعات شركة منافذ التوريد للتجارة - 22 عاماً من الخبرة والريادة في التوريد الغذائي',
        en: 'Mnaveth ALTourid Warehouses - 22 Years of Supply Chain Excellence Since 2004',
      },
      asset: {
        _ref: 'image-6b3ae46a1f5a6338a75c86b55c4853c8b3b6e00a-1408x768-png',
        _type: 'reference',
      },
    },
    author: 'قسم الدراسات الاقتصادية والتوريد | منافذ التوريد',
    publishedAt: '2026-11-03T11:00:00.000Z',
    order: 22,
    visible: true,
    seo: {
      _type: 'seo',
      title: {
        _type: 'localizedString',
        ar: 'تقرير أعمال: 22 عاماً من الريادة في سلاسل التوريد الغذائي بالمملكة | شركة منافذ التوريد للتجارة',
        en: 'B2B Report: 22 Years of Food Logistics Excellence in Saudi Arabia | Mnaveth ALTourid',
      },
      description: {
        _type: 'localizedText',
        ar: 'قصة نجاح B2B: كيف تمكنت شركة منافذ التوريد للتجارة منذ تأسيسها عام 2004 من كسب ثقة كبرى الفنادق والمطاعم والمطابخ المركزية بالمملكة عبر الالتزام الصارم بسلامة الغذاء وضمان استقرار الأسعار.',
        en: 'Business feature: Exploring the 22-year heritage of Mnaveth ALTourid Trading Co. since 2004, serving premier restaurants, hotels, and institutional catering groups across the Kingdom.',
      },
    },
    body: [
      b('من التأسيس إلى الريادة الوطنية: ربع قرن من الثقة والتميز', 'pr2-h2-1', 'h2'),
      b('عندما انطلقت شركة منافذ التوريد للتجارة في العاصمة الرياض عام 2004، كان قطاع تجارة الأغذية بالجملة يعتمد على قنوات تقليدية. وعلى مدار أكثر من عقدين (22 عاماً)، وضعت الشركة نصب أعينها التحول إلى شريك استراتيجي طويل الأمد لقطاع الأعمال، وليس مجرد مورد بضائع عابر.', 'pr2-b1'),
      b('أرقام وإنجازات تعكس حجم الحضور في السوق السعودي', 'pr2-h2-2', 'h2'),
      b('اليوم، تفخر «منافذ التوريد» بسجل حافل يضم أكثر من 500 عميل نشط في قطاعات الفنادق، المستشفيات، سلاسل المطاعم، والجهات الحكومية، مع إدارة وتشغيل ما يزيد عن 1,200 شحنة تجارية سنوياً ترتبط بمصادر توريد معتمدة من أكثر من 20 دولة حول العالم.', 'pr2-b2'),
      b('ثلاث ركائز جعلت «منافذ التوريد» الخيار الأول لمديري المشتريات', 'pr2-h2-3', 'h2'),
      b('1. سلامة سلسلة التبريد المعتمدة: التزام لا يقبل المساومة مع شهادات الحلال واشتراطات هيئة الغذاء والدواء (SFDA).', 'pr2-b3'),
      b('2. استقرار الأسعار والوفرة الدائمة: حماية الشركاء من تقلبات الأسواق العالمية عبر تعاقدات زراعية واستيرادية طويلة الأجل للسلع الاستراتيجية مثل الأرز البسمتي الهندي وزيوت الطعام واللحوم المجمدة.', 'pr2-b4'),
      b('3. سرعة الاستجابة والمرونة التشغيلية: مستودعات متطورة وأسطول نقل مجهز وموزع جغرافياً يتيح التوصيل في أوقات قياسية ودعم العمليات على مدار الساعة.', 'pr2-b5'),
      b('التطلع نحو المستقبل: شريك موثوق لمشاريع المملكة الكبرى', 'pr2-h2-4', 'h2'),
      b('مع استمرار التوسع العمراني والسياحي، تواصل «منافذ التوريد» الاستثمار في الرقمنة اللوجستية وتوسيع محفظة المنتجات لتظل الذراع التمويني الأكثر اعتمادية لقطاع الأعمال السعودي.', 'pr2-b6'),
    ],
    bodyEn: [
      b('From Foundation to National Leadership: Over Two Decades of B2B Excellence', 'pr2en-h2-1', 'h2'),
      b('Founded in Riyadh in 2004, Mnaveth ALTourid Trading Co. has transformed into a strategic supply chain cornerstone for hospitality, healthcare, and commercial food enterprises across Saudi Arabia.', 'pr2en-b1'),
      b('Milestones Defining Market Trust', 'pr2en-h2-2', 'h2'),
      b('With over 500 active B2B clients, 1,200+ annual shipments, and direct sourcing from 20+ partner nations, Mnaveth ALTourid delivers unmatched reliability in frozen proteins, basmati rice, and dry staples.', 'pr2en-b2'),
      b('Uncompromising Commitment to Safety & Price Stability', 'pr2en-h2-3', 'h2'),
      b('Through active SFDA regulatory compliance, HACCP benchmarks, and forward contracting, the company insulates commercial buyers from global commodity volatility.', 'pr2en-b3'),
    ],
  },
]

export const allArticles: ArticleData[] = [
  ...batch1Articles,
  ...batch2Articles,
  ...batch3Articles,
  ...batch4Articles,
  ...batch5PrArticles,
]
