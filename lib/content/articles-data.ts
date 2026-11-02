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
        en: 'Food supplies for restaurants and hotels in Riyadh - Mnaveeh ALTourid',
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
        en: 'Best Food Supply Companies for Restaurants in Riyadh | Mnaveeh',
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
      b('Why Partner with Mnaveeh ALTourid in Riyadh?', 'p1en-h2-3', 'h2'),
      b('Serving the Saudi market since 2004, Mnaveeh ALTourid provides end-to-end commercial food supply solutions from its central warehouses in Riyadh.', 'p1en-b5'),
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
        en: 'Cloud Kitchen Food Supply Solutions in Saudi Arabia | Mnaveeh',
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
        en: 'Wholesale Food Suppliers for Restaurants in Jeddah | Mnaveeh',
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
        en: 'Food inventory warehouse and basic staples for restaurants - Mnaveeh',
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
        en: 'Restaurant Food Supplies Master Checklist | Mnaveeh ALTourid',
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
        en: 'Annual Food Supply Agreements for Restaurants in KSA | Mnaveeh',
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
        en: 'Premium wholesale frozen meat for commercial restaurants - Mnaveeh',
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
        en: 'Bulk Frozen Meat Procurement Guide in Saudi Arabia | Mnaveeh',
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
        en: 'Wholesale frozen beef liver blocks for commercial restaurants - Mnaveeh',
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
        en: 'Wholesale Frozen Liver Suppliers in Riyadh & Jeddah | Mnaveeh',
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
        en: 'Refrigerated fleet for frozen meat and food supply logistics - Mnaveeh',
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
        en: 'Cold Chain Logistics for Frozen Meat in Saudi Arabia | Mnaveeh',
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
        en: 'SFDA food safety compliance in meat import and storage - Mnaveeh',
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
        en: 'SFDA Frozen Meat Importation Regulations & Standards | Mnaveeh',
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
        en: 'Brazilian and Indian commercial imported beef cuts comparison - Mnaveeh',
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
        en: 'Brazilian vs Indian Frozen Meat for Commercial Kitchens | Mnaveeh',
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

export const allArticles: ArticleData[] = [...batch1Articles, ...batch2Articles]
