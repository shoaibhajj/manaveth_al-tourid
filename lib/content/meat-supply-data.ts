import type { Locale } from '../i18n'

export interface MeatProductRow {
  id: string
  slug: string
  name: string
  categoryName: string
  origin: string
  cutOrType: string
  packaging: string
  usage: string
  storage: string
  certifications: string
  priceFormatted?: string
  rawPrice?: number
}

export interface SectorLandingData {
  slug: 'restaurants' | 'hotels' | 'catering'
  title: string
  h1: string
  description: string
  suitableCuts: string[]
  packagingSpecs: string
  deliveryPattern: string
  contractTerms: string
  faqs: { question: string; answer: string }[]
}

export interface CityLandingData {
  slug: string
  name: string
  region: string
  coveredDistricts: string
  deliveryTime: string
  minOrder: string
  pickupPoint: string
  coldChainFacility: string
  faqs: { question: string; answer: string }[]
}

export const SECTORS_CONTENT: Record<'restaurants' | 'hotels' | 'catering', Record<Locale, SectorLandingData>> = {
  restaurants: {
    ar: {
      slug: 'restaurants',
      title: 'توريد لحوم مجمدة للمطاعم ومحلات البرجر والشاورما بالجملة | منافذ التوريد',
      h1: 'توريد اللحوم المجمدة لمطاعم البرجر والشاورما والمشاوي',
      description:
        'حلول توريد لحوم مجمدة مصممة خصيصاً للمطاعم وسلاسل الوجبات السريعة في السعودية. نلتزم بثبات مواصفات القطعية ونسب الدهن والوزن لضمان ثبات جودة أطباقكم وتكلفة الوجبة.',
      suitableCuts: [
        'لحم توب سايد بقري برازيلي للشاورما والستيك',
        'سيلفر سايد ورول بقري لمكعبات المشاوي والكباب',
        'لحم بقر مفروم مجمد بنسب دهن 80/20 و 85/15 للبرجر',
        'كبدة بقرية برازيلية منزوعة العروق لمطاعم الإفطار',
      ],
      packagingSpecs: 'كراتين رئيسية 20 كجم و 25 كجم مفرغة من الهواء مع بطاقة وزن ومواصفة معتمدة.',
      deliveryPattern: 'شحن يومي صباحي مبكر بسيارات مبردة مرخصة (-18°م) قبل ساعات التشغيل وتجهيز الوجبات.',
      contractTerms: 'عقود توريد شهرية وسنوية مرنة تضمن تثبيت الأسعار واستمرارية المخزون دون انقطاع.',
      faqs: [
        {
          question: 'ما هي نسبة الدهن المتوفرة في اللحم المفروم المخصص للبرجر؟',
          answer: 'نوفر نسب دهن قياسية 80/20 و 85/15 تلبي متطلبات تحضير أقراص البرجر العصيرية بدون تفتت أثناء الشواء.',
        },
        {
          question: 'هل يمكن فحص عينات قبل توقيع عقد التوريد السنوي؟',
          answer: 'نعم، نوفر عينات اختبار معتمدة لمطابخ التجارب بالمطاعم للتحقق من نسبة الهدر وثبات المواصفة.',
        },
      ],
    },
    en: {
      slug: 'restaurants',
      title: 'Wholesale Frozen Meat Supply for Restaurants & Chains | Mnaveth ALTourid',
      h1: 'Frozen Meat Supply for Restaurant Chains, Burger & Grill Concepts',
      description:
        'Customized frozen beef and mutton supply for restaurants and fast-casual brands in Saudi Arabia. Consistent cut dimensions, precise fat-to-lean ratios, and uninterrupted scheduled delivery.',
      suitableCuts: [
        'Brazilian Boneless Topside for Shawarma and Steaks',
        'Silverside and Rump for Kabab and Diced Skewers',
        'Minced Beef with 80/20 and 85/15 lean-to-fat ratios for Burgers',
        'Vein-free Brazilian Beef Liver for Diners and Breakfast Concepts',
      ],
      packagingSpecs: '20 kg & 25 kg master cartons, vacuum sealed with traceable batch tags.',
      deliveryPattern: 'Daily early-morning temperature-controlled delivery at -18°C before prep hours.',
      contractTerms: 'Flexible monthly and annual wholesale agreements with guaranteed price stability.',
      faqs: [
        {
          question: 'What fat percentages are available for commercial burger patties?',
          answer: 'We provide consistent 80/20 and 85/15 formulations to ensure optimal burger juiciness and zero crumble.',
        },
        {
          question: 'Can restaurant operators test cuts prior to annual agreements?',
          answer: 'Yes, certified kitchen trial packs are provided to verify cooking yield and cut consistency.',
        },
      ],
    },
  },
  hotels: {
    ar: {
      slug: 'hotels',
      title: 'توريد لحوم الفنادق وقاعات الضيافة الفاخرة بالجملة | منافذ التوريد',
      h1: 'توريد اللحوم المجمدة المعتمدة للفنادق والضيافة العالمية',
      description:
        'توريد لحوم معتمدة حلال ومطابقة لاشتراطات سلامة الغذاء HACCP للفنادق ذات تصنيف 4 و 5 نجوم وقاعات الاحتفالات. نوفر قطعيات فاخرة موحدة الحجم تلبي معايير كبار الطهاة.',
      suitableCuts: [
        'تندرلوين وتوب سايد منزوع الدهن للبوفيهات الفندقية',
        'ستريبلوين وبقر ممتاز للمناسبات والولائم الكبرى',
        'أوزي لحم ضأن بالعظم وموزات ضأن للطبخ العربي الفاخر',
        'قطعيات هندي وبرازيلي معقمة ومطابقة لأعلى اشتراطات الجودة',
      ],
      packagingSpecs: 'تغليف فردي وصناديق مطابقة للمواصفات الصحية الفندقية سعة 15-20 كجم.',
      deliveryPattern: 'تسليم مجدول في أرصفة استلام البضائع الفندقية مع سجل درجات حرارة شاحنة النقل.',
      contractTerms: 'عقود رسمية تتوافق مع لوائح التوريد الفندقي وتسهيلات ائتمانية للجهات المصنفة.',
      faqs: [
        {
          question: 'هل اللحوم الموردة مصحوبة بشهادات الذبح الحلال والفحص المخبري؟',
          answer: 'جميع الشحنات مصحوبة بشهادات ذبح حلال رسمية معتمدة من المركز السعودي للحلال وفسح هيئة الغذاء والدواء SFDA.',
        },
        {
          question: 'كيف تتم مراقبة سلسلة التبريد أثناء النقل إلى الفندق؟',
          answer: 'الشاحنات مجهزة بحساسات رقمية متصلة تسجل درجة الحرارة لحظياً عند -18°م، ويُسلم تقرير الحرارة مع فاتورة الاستلام.',
        },
      ],
    },
    en: {
      slug: 'hotels',
      title: 'Institutional Meat Supply for 4 & 5-Star Hotels | Mnaveth ALTourid',
      h1: 'Certified Frozen Meat Supply for Luxury Hotels and Banquets',
      description:
        'HACCP-compliant frozen meat logistics for luxury hospitality operators and high-capacity banquet facilities across Saudi Arabia, meeting executive chef specifications.',
      suitableCuts: [
        'Trimmed Boneless Tenderloin and Topside for Banquets',
        'Striploin and Premium Primal Cuts for Dining Rooms',
        'Bone-in Mutton Carcasses and Shanks for Traditional Hospitality',
        'Certified Halal Boneless Portions with uniform specifications',
      ],
      packagingSpecs: 'Hospitality-grade packaging in 15-20 kg cartons with batch test certificates.',
      deliveryPattern: 'Scheduled delivery to hotel receiving bays with authenticated cold-chain temperature logs.',
      contractTerms: 'Institutional vendor compliance with corporate credit facilities for approved hotel groups.',
      faqs: [
        {
          question: 'Are all shipments backed by Halal and veterinary laboratory clearances?',
          answer: 'Every shipment includes official Saudi Halal Center documentation and SFDA port entry releases.',
        },
        {
          question: 'How is cold chain integrity audited upon hotel delivery?',
          answer: 'Refrigerated trucks utilize telematics-connected data loggers maintaining -18°C throughout transit.',
        },
      ],
    },
  },
  catering: {
    ar: {
      slug: 'catering',
      title: 'توريد لحوم مطابخ الإعاشة وشركات التموين وحقول العمل | منافذ التوريد',
      h1: 'توريد اللحوم بالجملة لمطابخ الإعاشة المركزية والمشاريع الكبرى',
      description:
        'طاقة توريدية ضخمة تلبي احتياجات مطابخ الإعاشة الميدانية، ومشاريع البنية التحتية، والمجمعات العمالية، والمستشفيات، بأسعار تنافسية وحاويات منتظمة.',
      suitableCuts: [
        'مكعبات لحم بقري مجمد مسبقة التقطيع للطهي الجماعي',
        'لحم عجل وهندي مفروم ناعم وخشن لإنتاج كميات الإعاشة',
        'أرباع لحم ضأن مجمدة لولائم التموين الكبرى',
        'كبدة ولحوم سريعة التحضير لخطوط التغذية المفتوحة',
      ],
      packagingSpecs: 'أحجام تجارية واقتصادية كراتين 20 و 25 كجم مهيأة للتفريغ السريع والتخزين المركزي.',
      deliveryPattern: 'إمداد بأسطول شاحنات مبردة سعات 5 إلى 20 طن مباشرة إلى المستودعات الميدانية.',
      contractTerms: 'عقود توريد مشاريع طويلة الأجل مع جداول توريد أسبوعية ثابتة وتأمين طوارئ المخزون.',
      faqs: [
        {
          question: 'ما هي الطاقة الاستيعابية اليومية لتوريد مطابخ الإعاشة الضخمة؟',
          answer: 'تصل طاقتنا التوريدية إلى عشرات الأطنان أسبوعياً من مستودعاتنا المركزية المرخصة في الرياض وجدة.',
        },
        {
          question: 'هل الأسعار ثابتة طوال مدة عقد مشروع الإعاشة؟',
          answer: 'نقدم صيغ عقود توريد بمؤشرات تسعير ثابتة تضمن للمقاولين سلامة حساب التكاليف طوال فترة المشروع.',
        },
      ],
    },
    en: {
      slug: 'catering',
      title: 'Institutional Meat Supply for Catering & Remote Camps | Mnaveth ALTourid',
      h1: 'High-Volume Meat Supply for Central Catering & Worksite Camps',
      description:
        'Industrial-scale meat supply for central catering facilities, infrastructure worksites, educational institutions, and healthcare complexes with reliable bulk container logistics.',
      suitableCuts: [
        'Pre-diced beef cubes for high-capacity batch stewing',
        'Fine and coarse minced beef for central commissary production',
        'Frozen mutton quarters for institutional banqueting',
        'Ready-to-cook institutional beef cuts',
      ],
      packagingSpecs: 'Bulk master cartons 20 kg & 25 kg optimized for industrial kitchens and cold stores.',
      deliveryPattern: 'Heavy-duty fleet delivery from 5-ton to 20-ton refrigerated units directly to camp sites.',
      contractTerms: 'Long-term worksite project contracts with weekly scheduled allocations and emergency buffer stocks.',
      faqs: [
        {
          question: 'What is the weekly capacity for high-volume catering contracts?',
          answer: 'Our licensed cold warehouses in Riyadh and Jeddah dispatch multiple container loads weekly with zero stockouts.',
        },
        {
          question: 'Can pricing remain fixed over multi-month catering tenders?',
          answer: 'We provide structured institutional agreements that insulate catering operators against spot market volatility.',
        },
      ],
    },
  },
}

export const VERIFIED_CITIES: Record<string, Record<Locale, CityLandingData>> = {
  riyadh: {
    ar: {
      slug: 'riyadh',
      name: 'الرياض',
      region: 'منطقة الرياض',
      coveredDistricts:
        'مستودعات السلي الصناعية، الشفا، العارض، حي المصانع، السليمانية، العليا، الدرعية، والخرج.',
      deliveryTime: 'توصيل يومي فجرًا من الساعة 4:00 إلى 8:00 صباحًا من مستودع السلي المركزي.',
      minOrder: '30 كرتون للحوم المجمدة أو 500 كجم إجمالي توريد للمطاعم والفنادق.',
      pickupPoint: 'مستودع شركة منافذ التوريد المركزي - حي السلي التجاري، الرياض.',
      coldChainFacility: 'مستودعات تبريد وتجميد مرخصة ومسجلة رسميًا لدى الهيئة العامة للغذاء والدواء SFDA.',
      faqs: [
        {
          question: 'هل يتوفر استلام فوري من مستودع الرياض؟',
          answer: 'نعم، يمكن للمطاعم والشركات الاستلام المباشر بشاحنات مبردة من مستودع السلي بعد تأكيد إذن الصرف.',
        },
        {
          question: 'كم يستغرق التوصيل داخل مدينة الرياض وضواحيها؟',
          answer: 'يتم التوصيل خلال أقل من 12 إلى 24 ساعة للطلبات المجدولة على مدار 6 أيام أسبوعياً.',
        },
      ],
    },
    en: {
      slug: 'riyadh',
      name: 'Riyadh',
      region: 'Riyadh Region',
      coveredDistricts:
        'Al-Sulai Logistics Hub, Al-Shifa, Al-Arid, Al-Masan’e, Olaya, Sulaimaniyah, Diriyah, and Al-Kharj.',
      deliveryTime: 'Daily early morning delivery between 4:00 AM and 8:00 AM dispatched from Al-Sulai hub.',
      minOrder: '30 cartons of frozen meat or 500 kg minimum order quantity for commercial kitchens.',
      pickupPoint: 'Mnaveth ALTourid Central Cold Distribution Warehouse - Al-Sulai, Riyadh.',
      coldChainFacility: 'Licensed deep-freeze facility officially approved and inspected by the Saudi FDA.',
      faqs: [
        {
          question: 'Is direct dock pickup available at the Riyadh warehouse?',
          answer: 'Yes, commercial clients with refrigerated transport may collect directly following order confirmation.',
        },
        {
          question: 'What is the delivery lead time across Riyadh city?',
          answer: 'Orders are fulfilled within 12 to 24 hours via scheduled refrigerated route trucks.',
        },
      ],
    },
  },
  jeddah: {
    ar: {
      slug: 'jeddah',
      name: 'جدة',
      region: 'منطقة مكة المكرمة والساحل الغربي',
      coveredDistricts:
        'منطقة الخمرة اللوجستية، حي النزهة، ميناء جدة الإسلامي، البلد، التحلية، ومحيط مطار الملك عبدالعزيز، مع إمداد فنادق مكة المكرمة.',
      deliveryTime: 'جدولة مسائية وصباحية منتظمة من مستودع الخمرة المبرد لتفادي أوقات الذروة.',
      minOrder: '40 كرتون أو 750 كجم لمطاعم جدة وفنادق المشاعر ومكة المكرمة.',
      pickupPoint: 'مركز التوزيع اللوجستي المبرد - منطقة الخمرة الصناعية، جدة.',
      coldChainFacility: 'مستودع لوجستي مبرد مرخص ومطابق لمعايير الحفظ الدولي لسلامة الأغذية.',
      faqs: [
        {
          question: 'هل تشمل التغطية فنادق مكة المكرمة خلال مواسم العمرة والحج؟',
          answer: 'نعم، نوفر خطوط إمداد مبردة يومية مخصصة لفنادق الإيواء ومطابخ التموين بمكة المكرمة وجدة.',
        },
        {
          question: 'ما هي آلية فحص الشحنات عند رصيف الاستلام في جدة؟',
          answer: 'يتم توفير بطاقة حرارية رقمية مسجلة لبيان درجات الحرارة طوال الرحلة لضمان عدم حدوث أي انقطاع في التبريد.',
        },
      ],
    },
    en: {
      slug: 'jeddah',
      name: 'Jeddah',
      region: 'Makkah Province & Western Logistics Corridor',
      coveredDistricts:
        'Al-Khumrah Logistics Zone, Al-Nuzhah, Jeddah Islamic Port district, Al-Balad, Tahlia, and Makkah hotel supply lines.',
      deliveryTime: 'Off-peak scheduled night and early morning dispatches from Al-Khumrah cold facility.',
      minOrder: '40 master cartons or 750 kg minimum order for Jeddah restaurants and hospitality venues.',
      pickupPoint: 'Mnaveth Cold Logistics Center - Al-Khumrah Industrial District, Jeddah.',
      coldChainFacility: 'SFDA-registered temperature-monitored facility operating at continuous -18°C.',
      faqs: [
        {
          question: 'Does the Jeddah distribution network serve Makkah hospitality operators?',
          answer: 'Yes, dedicated refrigerated lines run daily between Jeddah hubs and Makkah hotel commissaries.',
        },
        {
          question: 'How is temperature compliance documented upon Western Province deliveries?',
          answer: 'Digital data-logger readings certifying continuous -18°C cold-chain are signed off with delivery dockets.',
        },
      ],
    },
  },
}
