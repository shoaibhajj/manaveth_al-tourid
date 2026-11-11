import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '10ol7pkg'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN

if (!token) {
  console.log('⚠️ No SANITY_API_WRITE_TOKEN provided in environment.')
  console.log('To seed directly to live dataset, run:')
  console.log('  SANITY_API_WRITE_TOKEN=<your_token> npx tsx scripts/seed/seed-sanity-pages.ts')
}

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2024-01-01',
})

export const SEED_DATA = {
  landingPageMeatSupply: {
    _id: 'meat-supply',
    _type: 'landingPage',
    title: {
      _type: 'localizedString',
      ar: 'توريد اللحوم المجمدة بالجملة للمطاعم والفنادق | منافذ التوريد',
      en: 'Wholesale Frozen Meat & Poultry Supply in Saudi Arabia | Mnaveth ALTourid',
    },
    slug: {
      _type: 'slug',
      current: 'meat-supply',
    },
    h1: {
      _type: 'localizedString',
      ar: 'توريد اللحوم المجمدة والدواجن بالجملة لكبرى المطاعم والإعاشة',
      en: 'Wholesale Frozen Meat & Poultry Supply for Catering & Restaurants',
    },
    eyebrow: {
      _type: 'localizedString',
      ar: 'اعتماد الغذاء والدواء SFDA · ذبح حلال 100% · توريد مبرد ومجمد',
      en: 'SFDA Approved · 100% Halal Slaughter · Cold Chain Logistics',
    },
    intro: {
      _type: 'localizedText',
      ar: 'شركة منافذ التوريد للتجارة شريكك المعتمد في استيراد وتوريد اللحوم البقرية ولحوم الضأن والكبدة المجمدة وقطعيات الدواجن الفاخرة مباشرة من كبرى المسالخ المعتمدة في البرازيل والهند، مع الالتزام التام بالمواصفات القياسية السعودية وتأمين الفنادق والمطاعم ومطابخ الإعاشة.',
      en: 'Mnaveth ALTourid is your certified partner for importing and supplying bulk frozen beef, mutton, beef liver, and poultry cuts directly from SFDA-approved abattoirs in Brazil and India to restaurants, hotels, and institutional caterers.',
    },
    minOrderText: {
      _type: 'localizedString',
      ar: 'الحد الأدنى للطلب: 50 كرتون أو 1 طن مع عقود توريد دورية ميسرة',
      en: 'MOQ: 50 Master Cartons or 1 Ton with Scheduled Contract Deliveries',
    },
    whatsappButtonText: {
      _type: 'localizedString',
      ar: 'طلب تسعير توريد اللحوم الفوري',
      en: 'Request Instant Meat Supply Quote',
    },
  },
  certificationsPage: {
    _id: 'certificationsPage',
    _type: 'certificationsPage',
    title: {
      _type: 'localizedString',
      ar: 'الشهادات والاعتمادات الرسمية وسلامة الغذاء | منافذ التوريد',
      en: 'Official Certifications & Food Safety Accreditations | Mnaveth ALTourid',
    },
    h1: {
      _type: 'localizedString',
      ar: 'الشهادات والتراخيص الرسمية',
      en: 'Official Certifications & Accreditations',
    },
    badge: {
      _type: 'localizedString',
      ar: 'الامتثال الرقابي وسلامة الغذاء',
      en: 'Regulatory & Quality Compliance',
    },
    intro: {
      _type: 'localizedText',
      ar: 'تلتزم شركة منافذ التوريد بأعلى معايير الرقابة والتراخيص الحكومية المعتمدة لدى هيئة الغذاء والدواء (SFDA) لضمان جودة وسلامة كل شحنة تموينية تصل لعملائنا في كافة مناطق المملكة.',
      en: 'Mnaveth ALTourid maintains comprehensive accreditations from food safety authorities (SFDA), ensuring absolute product integrity across Saudi Arabia.',
    },
  },
  aboutPage: {
    _id: 'aboutPage',
    _type: 'aboutPage',
    badge: {
      _type: 'localizedString',
      ar: 'سجل تجاري معتمد: 1116011768',
      en: 'Commercial Registration: 1116011768',
    },
    title: {
      _type: 'localizedString',
      ar: 'شركة منافذ التوريد للتجارة',
      en: 'Mnaveth ALTourid Trading Co.',
    },
    subtitle: {
      _type: 'localizedText',
      ar: 'رواد تجارة الجملة والتوريد التمويني المتخصص للمطاعم، الفنادق، ومطابخ الإعاشة الكبرى في المملكة العربية السعودية منذ عام 2004.',
      en: 'Leading foodservice wholesale distributor supplying premium meats, basmati rice, frying oils, and dry goods to commercial hospitality kitchens across Saudi Arabia since 2004.',
    },
    legalName: {
      _type: 'localizedString',
      ar: 'شركة منافذ التوريد للتجارة',
      en: 'Mnaveth ALTourid Trading Co.',
    },
    crNumber: '1116011768',
    headquarters: {
      _type: 'localizedString',
      ar: 'الرياض - المملكة العربية السعودية',
      en: 'Riyadh, Kingdom of Saudi Arabia',
    },
    activity: {
      _type: 'localizedString',
      ar: 'تجارة الجملة في المواد الغذائية واللحوم والإعاشة',
      en: 'Wholesale Foodservice Supply & Meats',
    },
    foodSafety: {
      _type: 'localizedString',
      ar: 'مستودعات مرخصة ومطابقة لاشتراطات SFDA',
      en: 'SFDA Licensed & Inspected Facilities',
    },
    coldChain: {
      _type: 'localizedString',
      ar: 'أسطول شاحنات مبردة ومجمدة (-18° إلى +4°)',
      en: 'Dedicated Temperature-Controlled Fleet',
    },
    ctaTitle: {
      _type: 'localizedString',
      ar: 'هل تود استعراض أصنافنا أو طلب عرض سعر رسمي؟',
      en: 'Ready to explore our catalog or request a quote?',
    },
    ctaSubtitle: {
      _type: 'localizedText',
      ar: 'تصفح قائمة الأصناف المعتمدة أو تواصل مباشرة مع فريق المبيعات والتعاقدات.',
      en: 'Browse certified products or get in touch with our commercial sales department.',
    },
  },
  certificates: [
    {
      _id: 'cert-sfda',
      _type: 'certificate',
      name: {
        _type: 'localizedString',
        ar: 'ترخيص استيراد وتخزين المواد الغذائية من هيئة الغذاء والدواء (SFDA)',
        en: 'SFDA Food Import & Cold Storage License',
      },
      issuer: {
        _type: 'localizedString',
        ar: 'الهيئة العامة للغذاء والدواء - المملكة العربية السعودية',
        en: 'Saudi Food & Drug Authority (SFDA)',
      },
      description: {
        _type: 'localizedText',
        ar: 'ترخيص رسمي معتمد يتيح استيراد وتخزين وتوزيع اللحوم والسلع التموينية وفق معايير اللائحة الفنية الخليجية.',
        en: 'Official accreditation authorizing import, warehousing, and nationwide distribution under GSO technical standards.',
      },
      category: 'sfda',
      validUntil: '2027-12-31',
    },
    {
      _id: 'cert-halal',
      _type: 'certificate',
      name: {
        _type: 'localizedString',
        ar: 'شهادة الذبح الحلال الصادرة من المراكز الإسلامية المعتمدة',
        en: 'Certified 100% Halal Slaughterhouse Accreditation',
      },
      issuer: {
        _type: 'localizedString',
        ar: 'المراكز الإسلامية المعتمدة لدى هيئة الغذاء والدواء السعودية (FAMBRAS / IBALINK)',
        en: 'SFDA-Accredited Islamic Certification Bodies (FAMBRAS / IBALINK)',
      },
      description: {
        _type: 'localizedText',
        ar: 'إشراف ورقابة إسلامية كاملة على عمليات الذبح والتشفية والتجميد لكافة شحنات اللحوم البرازيلية والهندية.',
        en: 'Full Islamic supervision of slaughtering, deboning, and freezing processes for all meat consignments.',
      },
      category: 'halal',
      validUntil: '2027-06-30',
    },
    {
      _id: 'cert-haccp',
      _type: 'certificate',
      name: {
        _type: 'localizedString',
        ar: 'شهادة نظام إدارة سلامة الغذاء (HACCP & ISO 22000)',
        en: 'HACCP & ISO 22000 Food Safety Management Certification',
      },
      issuer: {
        _type: 'localizedString',
        ar: 'منظمة معايير الجودة الدولية المعتمدة',
        en: 'Accredited International Quality Assurance Body',
      },
      description: {
        _type: 'localizedText',
        ar: 'إدارة متكاملة لنقاط التحكم الحرجة (CCPs) وسلاسل التبريد والتحكم في درجات الحرارة أثناء التخزين والنقل.',
        en: 'Comprehensive Critical Control Point (CCP) management and active temperature monitoring during storage and transit.',
      },
      category: 'quality',
      validUntil: '2026-11-30',
    },
    {
      _id: 'cert-cr',
      _type: 'certificate',
      name: {
        _type: 'localizedString',
        ar: 'السجل التجاري المعتمد لتجارة الجملة للمواد الغذائية (1116011768)',
        en: 'Commercial Registration (CR: 1116011768)',
      },
      issuer: {
        _type: 'localizedString',
        ar: 'وزارة التجارة - المملكة العربية السعودية',
        en: 'Ministry of Commerce - Saudi Arabia',
      },
      description: {
        _type: 'localizedText',
        ar: 'سجل تجاري نظامي ساري المفعول رقم 1116011768 بمزاولة نشاط استيراد وتجارة الجملة في المواد الغذائية واللحوم.',
        en: 'Official Commercial Registration No. 1116011768 for food wholesale, importing, and distribution operations.',
      },
      category: 'cr',
      validUntil: '2028-12-31',
    },
  ],
  cities: [
    {
      _id: 'city-riyadh',
      _type: 'city',
      name: { _type: 'localizedString', ar: 'الرياض', en: 'Riyadh' },
      slug: { _type: 'slug', current: 'riyadh' },
      region: 'central',
      isSupplyConfirmed: true,
      dailyColdFleetCapacity: '120 طن يومياً',
      fulfillmentLeadTimeHours: 24,
      centralWarehouseAddress: 'حي السلي الصناعي، الرياض',
    },
    {
      _id: 'city-jeddah',
      _type: 'city',
      name: { _type: 'localizedString', ar: 'جدة', en: 'Jeddah' },
      slug: { _type: 'slug', current: 'jeddah' },
      region: 'western',
      isSupplyConfirmed: true,
      dailyColdFleetCapacity: '90 طن يومياً',
      fulfillmentLeadTimeHours: 24,
      centralWarehouseAddress: 'منطقة الخمرة اللوجستية، جدة',
    },
    {
      _id: 'city-makkah',
      _type: 'city',
      name: { _type: 'localizedString', ar: 'مكة المكرمة', en: 'Makkah' },
      slug: { _type: 'slug', current: 'makkah' },
      region: 'western',
      isSupplyConfirmed: true,
      dailyColdFleetCapacity: '80 طن يومياً',
      fulfillmentLeadTimeHours: 12,
      centralWarehouseAddress: 'إمداد مباشر من مركز الخمرة بجدة',
    },
    {
      _id: 'city-madinah',
      _type: 'city',
      name: { _type: 'localizedString', ar: 'المدينة المنورة', en: 'Madinah' },
      slug: { _type: 'slug', current: 'madinah' },
      region: 'western',
      isSupplyConfirmed: true,
      dailyColdFleetCapacity: '50 طن يومياً',
      fulfillmentLeadTimeHours: 24,
      centralWarehouseAddress: 'المنطقة الصناعية، المدينة المنورة',
    },
    {
      _id: 'city-dammam',
      _type: 'city',
      name: { _type: 'localizedString', ar: 'الدمام والخبر', en: 'Dammam & Khobar' },
      slug: { _type: 'slug', current: 'dammam' },
      region: 'eastern',
      isSupplyConfirmed: true,
      dailyColdFleetCapacity: '60 طن يومياً',
      fulfillmentLeadTimeHours: 36,
      centralWarehouseAddress: 'المدينة الصناعية الثانية، الدمام',
    },
    {
      _id: 'city-qassim',
      _type: 'city',
      name: { _type: 'localizedString', ar: 'القصيم وبُريدة', en: 'Qassim & Buraidah' },
      slug: { _type: 'slug', current: 'qassim' },
      region: 'central',
      isSupplyConfirmed: true,
      dailyColdFleetCapacity: '40 طن يومياً',
      fulfillmentLeadTimeHours: 24,
      centralWarehouseAddress: 'إمداد مبرد مجدول من مستودع الرياض',
    },
    {
      _id: 'city-dawadmi',
      _type: 'city',
      name: { _type: 'localizedString', ar: 'الدوادمي وعفيف', en: 'Dawadmi & Afif' },
      slug: { _type: 'slug', current: 'dawadmi' },
      region: 'central',
      isSupplyConfirmed: true,
      dailyColdFleetCapacity: '25 طن أسبوعياً',
      fulfillmentLeadTimeHours: 48,
      centralWarehouseAddress: 'خط رحلات التوريد المجدولة لمنطقة وسط وغرب الرياض',
    },
  ],
  coreMeatProducts: [
    {
      _id: 'product-frozen-liver-classic',
      _type: 'product',
      name: {
        _type: 'localizedString',
        ar: 'كبدة ضأن مجمدة - كلاسيك توماس فودز أسترالي',
        en: 'Thomas Foods Classic Australian Frozen Ovine Liver',
      },
      slug: { _type: 'slug', current: 'frozen-liver-classic' },
      sku: 'MNV-LV-01',
      productType: 'meat',
      description: {
        _type: 'localizedText',
        ar: 'كبدة ضأن أسترالية مجمدة ومفرغة من الهواء (Thomas Foods Classic)، نسيج متماسك ونكهة طبيعية، مذبوحة حلال 100% ومطابقة لاشتراطات SFDA.',
        en: 'Premium Australian vacuum-packed frozen ovine liver (Thomas Foods Classic), firm texture, Halal certified, and SFDA compliant.',
      },
      longDescription: {
        _type: 'localizedText',
        ar: 'الصنف الأول المفضل لمطاعم الإفطار ومحلات الكبدة المقلقلة والصاج في السعودية. كبدة ضأن أسترالية أصلية من مسالخ توماس فودز (Est 53) بتغليف فاكيوم محكم يحمي النسيج من حروق التجميد ويمنع فقدان السوائل عند التقطيع.',
        en: 'The top choice for breakfast diners and traditional skillet liver restaurants across Saudi Arabia. Authentic Australian ovine liver from Thomas Foods International (Est 53) in vacuum packaging.',
      },
      storageState: 'frozen',
      featured: true,
      isCoreSpecialty: true,
      targetPhrases: [
        { _type: 'localizedString', ar: 'توريد كبدة كلاسيك بالجملة للمطاعم', en: 'Thomas Foods Classic lamb liver wholesale supplier' },
        { _type: 'localizedString', ar: 'كبدة ضأن أسترالية توماس فودز', en: 'Australian Thomas Foods ovine liver for foodservice' },
      ],
      order: 1,
      visible: true,
    },
    {
      _id: 'product-frozen-ribs-wagstaff',
      _type: 'product',
      name: {
        _type: 'localizedString',
        ar: 'ريش ضأن بالعظم مجمدة - واجستاف أسترالي (O-Rack Ribs)',
        en: 'Wagstaff Australian Bone-in Ovine Rack Ribs',
      },
      slug: { _type: 'slug', current: 'frozen-ribs-wagstaff' },
      sku: 'MNV-RB-01',
      productType: 'meat',
      description: {
        _type: 'localizedText',
        ar: 'أضلاع وريش لحم ضأن أسترالي بالعظم عالية الجودة من مسالخ واجستاف المعتمدة، مغلفة بالفاكيوم ومجمدة عند -18°م.',
        en: 'Premium Australian bone-in ovine rack cuts from Wagstaff abattoirs (Est 46), vacuum packed and frozen at -18°C.',
      },
      longDescription: {
        _type: 'localizedText',
        ar: 'ريش ضأن بالعظم (Bone in Ovine "O-RCK" Rack) مستوردة مباشرة من أستراليا من شركة واجستاف (Wagstaff - Est 46). مثالية لمطاعم المشاوي الفاخرة، الفنادق، ومطابخ الولائم، مع تتبيل متجانس وطراوة فائقة بعد الطهي.',
        en: 'Authentic Australian bone-in ovine rack cuts from Wagstaff (Est 46 Cranbourne, Victoria). Ideal for upscale barbecue dining, hotels, and banquet operations.',
      },
      storageState: 'frozen',
      featured: true,
      isCoreSpecialty: true,
      targetPhrases: [
        { _type: 'localizedString', ar: 'ريش ضأن أسترالي بالجملة للمطاعم', en: 'Australian lamb rack ribs wholesale supplier' },
        { _type: 'localizedString', ar: 'توريد ريش ضأن للمطاعم والفنادق', en: 'Wholesale frozen lamb ribs for restaurants and hotels' },
      ],
      order: 5,
      visible: true,
    },
    {
      _id: 'product-frozen-liver-johny-gold',
      _type: 'product',
      name: {
        _type: 'localizedString',
        ar: 'كبدة مجمدة - جوني جولد (Johny Gold)',
        en: 'Johny Gold Premium Frozen Liver',
      },
      slug: { _type: 'slug', current: 'frozen-liver-johny-gold' },
      sku: 'MNV-LV-02',
      productType: 'meat',
      description: {
        _type: 'localizedText',
        ar: 'كبدة ضأن مجمدة درجة أولى علامة جوني جولد الشهيرة، نسيج طازج ومذاق ممتاز تلبي تطلعات أرقى مطاعم الكبدة المقلقلة.',
        en: 'Premium Grade-A frozen ovine liver under the renowned Johny Gold brand, tender texture and superior taste.',
      },
      storageState: 'frozen',
      featured: true,
      isCoreSpecialty: true,
      targetPhrases: [
        { _type: 'localizedString', ar: 'كبدة جوني جولد بالجملة', en: 'Johny Gold frozen liver wholesale supplier' },
        { _type: 'localizedString', ar: 'توريد كبدة جوني جولد للمطاعم', en: 'Johny Gold liver for restaurants and foodservice' },
      ],
      order: 2,
      visible: true,
    },
    {
      _id: 'product-frozen-brain',
      _type: 'product',
      name: {
        _type: 'localizedString',
        ar: 'مخ مجمد بالجملة للمطاعم (عجل / ضأن)',
        en: 'Wholesale Frozen Brain (Veal & Ovine)',
      },
      slug: { _type: 'slug', current: 'frozen-brain' },
      sku: 'MNV-BR-01',
      productType: 'meat',
      description: {
        _type: 'localizedText',
        ar: 'مخ عجل وضأن مجمد ومفرز بعناية بأعلى معايير النظافة والتعقيم، نسيج متماسك مثالي للمطاعم وبوفيهات المأكولات الشعبية.',
        en: 'Carefully sorted and blast-frozen veal and ovine brain for commercial restaurants and traditional eateries.',
      },
      storageState: 'frozen',
      featured: true,
      isCoreSpecialty: true,
      targetPhrases: [
        { _type: 'localizedString', ar: 'مخ عجل وضأن مجمد بالجملة للمطاعم', en: 'Wholesale frozen veal and lamb brain supplier' },
        { _type: 'localizedString', ar: 'توريد مخ مجمد للمطاعم والفنادق', en: 'Frozen brain for restaurants and hotels' },
      ],
      order: 3,
      visible: true,
    },
    {
      _id: 'product-frozen-tongue',
      _type: 'product',
      name: {
        _type: 'localizedString',
        ar: 'لسان بقري / عجل مجمد بالجملة',
        en: 'Wholesale Frozen Beef & Veal Tongue',
      },
      slug: { _type: 'slug', current: 'frozen-tongue' },
      sku: 'MNV-TG-01',
      productType: 'meat',
      description: {
        _type: 'localizedText',
        ar: 'ألسنة بقر وعجل مجمدة عالية الجودة منزوعة الزوائد، نسيج لحمي ممتاز ومذاق غني للمطاعم والمطابخ التجارية.',
        en: 'Premium frozen beef and veal tongues trimmed of excess fat, rich flavor and tender texture for foodservice.',
      },
      storageState: 'frozen',
      featured: true,
      isCoreSpecialty: true,
      targetPhrases: [
        { _type: 'localizedString', ar: 'لسان بقري وعجل مجمد بالجملة', en: 'Wholesale frozen beef and veal tongue supplier' },
        { _type: 'localizedString', ar: 'توريد لسان بقري للمطاعم', en: 'Frozen beef tongue for restaurants and foodservice' },
      ],
      order: 4,
      visible: true,
    },
  ],
}

async function seed() {
  if (!token) {
    console.log('Seed data is ready. Provide SANITY_API_WRITE_TOKEN to apply directly.')
    return
  }

  console.log('Starting Sanity seeding to dataset:', dataset)

  // 1. Landing Page
  console.log('Creating landingPage meat-supply...')
  await client.createOrReplace(SEED_DATA.landingPageMeatSupply)

  // 2. Certifications Page
  console.log('Creating certificationsPage...')
  await client.createOrReplace(SEED_DATA.certificationsPage)

  // 2.5 About Page
  console.log('Creating aboutPage...')
  await client.createOrReplace(SEED_DATA.aboutPage)

  // 3. Certificates
  for (const cert of SEED_DATA.certificates) {
    console.log('Creating certificate:', cert._id)
    await client.createOrReplace(cert)
  }

  // 4. Cities
  for (const city of SEED_DATA.cities) {
    console.log('Creating city:', city._id)
    await client.createOrReplace(city)
  }

  // 4.5 Core Meat Products
  for (const prod of SEED_DATA.coreMeatProducts) {
    console.log('Creating core meat product:', prod._id)
    await client.createOrReplace(prod)
  }

  // 5. Update meat products with productType
  const meatProducts = [
    'cat-beef-topside',
    'cat-beef-silver',
    'cat-beef-liver',
    'product-fresh-produce',
    'product-olive-oil',
  ]
  for (const pid of meatProducts) {
    console.log('Patching meat productType:', pid)
    await client.patch(pid).set({ productType: 'meat' }).commit().catch(() => {})
  }

  const poultryProducts = ['cat-chicken-breast', 'cat-whole-chicken']
  for (const pid of poultryProducts) {
    console.log('Patching poultry productType:', pid)
    await client.patch(pid).set({ productType: 'poultry' }).commit().catch(() => {})
  }

  console.log('✅ Seeding completed successfully!')
}

seed().catch(console.error)
