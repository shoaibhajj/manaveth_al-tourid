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
