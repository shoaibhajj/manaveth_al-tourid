import type { Localized } from '../i18n'

export type PostComment = {
  id: string
  author: string
  role?: string
  text: string
  date: string
  rating?: number
}

export type CompanyPost = {
  id: string
  slug: string
  title: Localized
  badge: Localized
  badgeType: 'event' | 'partnership' | 'quality' | 'award' | 'logistics'
  publishedAt: string
  author: Localized
  readTime: Localized
  coverImage: string
  videoUrl?: string
  excerpt: Localized
  body: Localized[]
  highlights?: Localized[]
  initialLikes: number
  initialComments: PostComment[]
  pinned?: boolean
}

export const initialCompanyPosts: CompanyPost[] = [
  {
    id: 'post-food-show-riyadh',
    slug: 'saudi-food-show-strategic-supply-partner',
    title: {
      ar: '«منافذ التوريد» شريك تموين استراتيجي في معرض الرياض الدولي للأغذية والمشروبات (Saudi Food Show)',
      en: 'Mnaveth ALTourid as Strategic Supply Partner at Saudi Food Show Riyadh',
    },
    badge: { ar: 'معارض دولية', en: 'International Expos' },
    badgeType: 'event',
    publishedAt: '2026-11-05',
    author: { ar: 'المركز الإعلامي', en: 'Media Center' },
    readTime: { ar: 'قراءة دقيقتين', en: '2 min read' },
    coverImage: '/images/s-hotel.png',
    excerpt: {
      ar: 'شهد جناح منافذ التوريد إقبالاً واسعاً من كبرى سلاسل المطاعم وقطاع الضيافة بالرياض، حيث تم استعراض منظومة سلاسل الإمداد المبرد وتوقيع مذكرات تفاهم توريد استراتيجية.',
      en: 'Mnaveth ALTourid booth welcomed major restaurant chains and hospitality leaders in Riyadh, showcasing cold chain solutions and signing strategic supply MoUs.',
    },
    body: [
      {
        ar: 'ضمن مشاركتها في فعاليات معرض الرياض الدولي للأغذية والمشروبات، استعرضت شركة منافذ التوريد للتجارة حلولها اللوجستية المتكاملة لتأمين السلع التموينية واللحوم المجمدة والأرز البسمتي الفاخر لقطاعات الفنادق والمطاعم والمطابخ المركزية بالمملكة.',
        en: 'Participating in the Saudi Food Show Riyadh, Mnaveth ALTourid Trading Co. presented its comprehensive cold chain logistics, supplying frozen meats, premium basmati rice, and dry commodities to hotels and restaurants.',
      },
      {
        ar: 'وأكدت الإدارة التنفيذية خلال اللقاءات الثنائية مع الشركاء التجاريين التزام الشركة بدعم مستهدفات رؤية 2030 في تعزيز الأمن الغذائي ورفع كفاءة سلاسل الإمداد المحلية، مع تدشين باقات توريد مخصصة تلبي أعلى اشتراطات الجودة والاعتماد.',
        en: 'Executive leadership reaffirmed the company’s dedication to Saudi Vision 2030 food security goals, establishing custom wholesale procurement packages meeting the highest culinary specifications.',
      },
    ],
    highlights: [
      { ar: 'توقيع اتفاقيات توريد مع أكثر من 18 علامة تجارية ومطبخاً مركزياً', en: '18+ new supply partnerships signed with hotel brands' },
      { ar: 'استعراض أحدث تقنيات الفحص المخبري وسلاسل التبريد المباشر', en: 'Live showcase of cold chain IoT tracking & quality checks' },
    ],
    initialLikes: 184,
    initialComments: [
      {
        id: 'c1',
        author: 'الشيف فهد المطيري',
        role: 'مدير مشتريات سلسلة مطاعم سحابية',
        text: 'خطوة ممتازة ومشاركة مشرفة، نفتخر بتعاملنا مع منافذ التوريد والتزامكم الدقيق بمواعيد التوصيل وجودة اللحوم.',
        date: 'منذ يومين',
        rating: 5,
      },
      {
        id: 'c2',
        author: 'م. خالد الدوسري',
        role: 'مدير الإعاشة والضيافة - الرياض',
        text: 'جناح مميز واحترافي، التطور الذي تشهده الشركة في سلاسل التبريد يعكس خبرة سنوات طويلة.',
        date: 'منذ 3 أيام',
        rating: 5,
      },
    ],
    pinned: true,
  },
  {
    id: 'post-brazil-exclusive-agency',
    slug: 'exclusive-brazilian-meat-supply-agency-saudi-arabia',
    title: {
      ar: 'توقيع عقد وكالة حصرية مع كبرى شركات اللحوم البرازيلية لتوريد الأبقار والعجول الفاخرة للسوق السعودي',
      en: 'Signing Exclusive Agency Agreement for Premium Brazilian Beef Wholesale in Saudi Arabia',
    },
    badge: { ar: 'وكالات حصرية', en: 'Exclusive Agency' },
    badgeType: 'partnership',
    publishedAt: '2026-11-01',
    author: { ar: 'إدارة الاستيراد والعلاقات الدولية', en: 'Import & Global Trade' },
    readTime: { ar: 'قراءة 3 دقائق', en: '3 min read' },
    coverImage: '/images/service-sea.png',
    excerpt: {
      ar: 'أبرمت منافذ التوريد اتفاقية حصرية تاريخية مع إحدى أقدم وأكبر المزارع والمذابح المعتمدة في البرازيل، لتأمين تدفق مستمر لأجود قطعيات اللحوم المجمدة بأسعار تنافسية وثبات عالي.',
      en: 'Mnaveth ALTourid signed an exclusive supply agreement with certified Brazilian beef producers, securing consistent premium frozen meat flow for Saudi foodservice operators.',
    },
    body: [
      {
        ar: 'في خطوة استراتيجية تعزز مكانة «منافذ التوريد» كأحد أسرع الموردين نمواً في قطاع البروتينات واللحوم المجمدة، أعلنت الشركة عن حصولها على حقوق الوكالة والتوزيع الحصري بالمملكة لنخبة من منتجات اللحوم البرازيلية الفاخرة.',
        en: 'In a milestone move, Mnaveth ALTourid secured exclusive distribution rights across Saudi Arabia for top-tier Brazilian beef cuts and frozen provisions.',
      },
      {
        ar: 'تتميز هذه المنتجات بخضوعها الكامل لاشتراطات الهيئة العامة للغذاء والدواء (SFDA)، وشهادات الذبح الحلال الصادرة من المراكز الإسلامية المعتمدة رسمياً، مع الحفاظ على سلسلة تبريد مغلقة من موانئ الشحن حتى مستودعات العميل.',
        en: 'All imports strictly adhere to SFDA standards and certified Halal slaughter requirements, transported via monitored refrigerated sea containers.',
      },
    ],
    highlights: [
      { ar: 'مطابقة 100% لاشتراطات SFDA والذبح الحلال المعتمد', en: '100% Halal certified and SFDA regulatory compliant' },
      { ar: 'ثبات سنوي في الأسعار وتدفق المخزون لكبرى المطاعم والفنادق', en: 'Stable annual price agreements for hospitality partners' },
    ],
    initialLikes: 256,
    initialComments: [
      {
        id: 'c3',
        author: 'عبدالرحمن العتيبي',
        role: 'مستثمر في قطاع الأغذية والمطاعم',
        text: 'أفضل خبر لقطاع المطاعم، توفر اللحوم البرازيلية المعتمدة بثبات أسعار يحل أكبر تحدي كنا نواجهه.',
        date: 'منذ 5 أيام',
      },
    ],
    pinned: true,
  },
  {
    id: 'post-iso-quality-certification',
    slug: 'iso-22000-food-safety-management-certification-renewed',
    title: {
      ar: '«منافذ التوريد» تحصد تجديد شهادة ISO 22000 لسلامة الغذاء وعلامة الجودة لسلاسل التبريد',
      en: 'Mnaveth ALTourid Renews ISO 22000 Food Safety Certification & Cold Chain Quality Seal',
    },
    badge: { ar: 'علامة الجودة والآيزو', en: 'ISO & Quality Mark' },
    badgeType: 'quality',
    publishedAt: '2026-10-28',
    author: { ar: 'إدارة الجودة والامتثال', en: 'Quality & Compliance Dept' },
    readTime: { ar: 'قراءة دقيقتين', en: '2 min read' },
    coverImage: '/images/warehouse-main.png',
    excerpt: {
      ar: 'اجتازت مرافق التخزين المركزي وأسطول التوزيع التابع للشركة أعلى معايير التدقيق الدولي، ليتم تجديد اعتماد شهادة الآيزو 22000 وشهادة الهاسب (HACCP) لجودة سلاسل الإمداد الغذائي.',
      en: 'Central storage facilities and transport fleet successfully passed international audits, renewing ISO 22000 and HACCP food safety certifications.',
    },
    body: [
      {
        ar: 'أعلنت إدارة الجودة بشركة منافذ التوريد للتجارة عن استكمال متطلبات الفحص والتدقيق الميداني الشامل لمستودعات الشركة الرئيسية، وتجديد اعتماد شهادة الأيزو ISO 22000 لنظم إدارة سلامة الغذاء وشهادة HACCP الدولية.',
        en: 'Mnaveth ALTourid Quality Department announced successful completion of comprehensive field audits, re-certifying central cold facilities under ISO 22000 and HACCP.',
      },
      {
        ar: 'يشمل الاعتماد نظم المراقبة الحرارية اللحظية داخل غرف التجميد التي تعمل عند -18 درجة مئوية، ومسارات التفريغ المعزولة، وبروتوكولات التطهير والفحص المخبري الدوري للعينات قبل توزيعها على العملاء.',
        en: 'The certification encompasses real-time temperature tracking inside -18C cold vaults, insulated loading docks, and routine laboratory testing protocols.',
      },
    ],
    initialLikes: 147,
    initialComments: [
      {
        id: 'c4',
        author: 'د. سامي الجبير',
        role: 'استشاري سلامة الغذاء والجودة',
        text: 'مبارك هذا الإنجاز، تطبيق معايير ISO 22000 في التخزين المبرد يضمن للعملاء سلامة متناهية.',
        date: 'منذ أسبوع',
      },
    ],
  },
  {
    id: 'post-hajj-umrah-honor-award',
    slug: 'hajj-umrah-catering-supply-distinction-award',
    title: {
      ar: 'درع تكريم وشهادة شكر لمنافذ التوريد لتميزها في تأمين إمدادات الإعاشة بمواسم الحج والعمرة',
      en: 'Mnaveth ALTourid Honored for Outstanding Hospitality Supply During Hajj & Umrah Seasons',
    },
    badge: { ar: 'تكريم وإنجازات', en: 'Honor & Recognition' },
    badgeType: 'award',
    publishedAt: '2026-10-20',
    author: { ar: 'المركز الإعلامي', en: 'Media Center' },
    readTime: { ar: 'قراءة دقيقة', en: '1 min read' },
    coverImage: '/images/branches-hero.png',
    excerpt: {
      ar: 'تسلّمت الشركة درع شكر وتقدير من كبرى شركات الإعاشة تقديراً لالتزامها الاستثنائي وسرعة الاستجابة في تزويد مطابخ المشاعر المقدسة بالسلع الغذائية والبروتينات دون انقطاع.',
      en: 'The company received a certificate of appreciation and honor for seamless, uninterrupted food supply to holy sites and mega-scale catering operations.',
    },
    body: [
      {
        ar: 'تقديراً للجهود الميدانية المستمرة في دعم قطاع الإعاشة والضيافة، تسلمت شركة منافذ التوريد درع التقدير لمساهمتها الفعالة في تغذية آلاف الوجبات اليومية خلال مواسم الذروة في مكة المكرمة والمدينة المنورة.',
        en: 'In recognition of tireless operational excellence, Mnaveth ALTourid was awarded honors for supplying hundreds of thousands of daily meals during peak seasons in Makkah and Madinah.',
      },
      {
        ar: 'وأشاد المتعاقدون بالمرونة التشغيلية العالية للشركة وقدرة أسطولها على الوصول في أدق المواعيد وبأعلى درجات الجاهزية والسلامة.',
        en: 'Catering contractors praised the team’s rapid fulfillment agility and unbroken cold chain integrity under high-demand operational conditions.',
      },
    ],
    initialLikes: 312,
    initialComments: [
      {
        id: 'c5',
        author: 'أبو فيصل الحربي',
        role: 'مدير العمليات بمجموعة إعاشة - الغربية',
        text: 'تستحقون كل التقدير والشكر، كنتم عوناً كبيراً لنا في إنجاح خطة الإعاشة وضمان توفر المواد بجودة لا يعلى عليها.',
        date: 'منذ أسبوعين',
      },
    ],
  },
  {
    id: 'post-smart-fleet-launch',
    slug: 'smart-iot-reefer-fleet-expansion-riyadh-depot',
    title: {
      ar: 'تدشين أسطول الشاحنات المبردة الذكية المزودة بحساسات IoT الحرارية وتوسعة مستودعات الرياض',
      en: 'Deployment of IoT Smart Refrigerated Truck Fleet and Expansion of Riyadh Central Hub',
    },
    badge: { ar: 'توسع لوجستي', en: 'Logistics Expansion' },
    badgeType: 'logistics',
    publishedAt: '2026-10-15',
    author: { ar: 'إدارة العمليات واللوجستيات', en: 'Operations & Logistics' },
    readTime: { ar: 'قراءة دقيقتين', en: '2 min read' },
    coverImage: '/images/g-truck.png',
    excerpt: {
      ar: 'ضمن خطتها لتطوير كفاءة التوزيع السريع، أضافت منافذ التوريد شاحنات مجهزة بنظم تتبع رقمية وتقارير حرارية حية مع توسيع الطاقة الاستيعابية لمستودعات الدار البيضاء.',
      en: 'Expanding rapid delivery capability, Mnaveth ALTourid inducted smart reefer trucks featuring live digital thermal telemetry and expanded Riyadh warehouse capacity.',
    },
    body: [
      {
        ar: 'دشنت شركة منافذ التوريد للتجارة دفعة جديدة من الشاحنات المبردة والمجمدة المجهزة بأنظمة تتبع ذكية عن بعد ترسل تقارير لحظية عن درجة الحرارة والرطوبة لضمان سلامة الشحنات الحساسة.',
        en: 'Mnaveth ALTourid commissioned a new fleet of temperature-controlled vehicles with IoT telemetry providing live thermal monitoring.',
      },
      {
        ar: 'تأتي هذه الخطوة بالتوازي مع إضافة مساحات تخزين جديدة ومناطق تجهيز طلبات سريعة لتلبية طلبات التوريد اليومية لسلاسل المطاعم في وقت قياسي.',
        en: 'This aligns with added capacity at the central Riyadh depot, enabling same-day wholesale dispatch for partner restaurants.',
      },
    ],
    initialLikes: 198,
    initialComments: [],
  },
]
