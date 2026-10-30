import type { Localized } from '../i18n'
import type { IconKey } from './types'

export type NavItem = { id: string; href: string; label: Localized }

export const site = {
  brand: {
    name: { ar: 'منافذ التوريد', en: 'Mnaveeh ALTourid' } satisfies Localized,
    subtitle: { ar: 'Mnaveeh ALTourid · since 2001', en: 'Food supply · since 2001' } satisfies Localized,
    homeLabel: { ar: 'منافذ التوريد - الرئيسية', en: 'Mnaveeh ALTourid - Home' } satisfies Localized,
    // Replace these files with the approved logo and company photos; no code changes are needed.
    logo: '/images/logo.png',
    heroImage: '/images/hero.png',
    aboutImage: '/images/about.png',
    ctaImage: '/images/cta.png',
  },
  metadata: {
    title: {
      ar: 'منافذ التوريد | شريكك الموثوق في توريد المواد الغذائية منذ 2001',
      en: 'Mnaveeh ALTourid | Your trusted partner in food supply since 2001',
    } satisfies Localized,
    description: {
      ar: 'منافذ التوريد شركة رائدة في استيراد وتوريد وتوزيع المواد الغذائية، من المصدر إلى وجهتك بجودة عالمية وسلاسل إمداد متكاملة للمطاعم والفنادق والقطاعات المختلفة.',
      en: 'Mnaveeh ALTourid is a leading importer, supplier and distributor of food products, from source to destination with global quality and integrated supply chains for restaurants, hotels and many other sectors.',
    } satisfies Localized,
    productsTitle: { ar: 'المنتجات | منافذ التوريد', en: 'Products | Mnaveeh ALTourid' } satisfies Localized,
    branchesTitle: { ar: 'الفروع | منافذ التوريد', en: 'Branches | Mnaveeh ALTourid' } satisfies Localized,
  },
  nav: [
    { id: 'home', href: '/#home', label: { ar: 'الرئيسية', en: 'Home' } },
    { id: 'about', href: '/#about', label: { ar: 'من نحن', en: 'About' } },
    { id: 'services', href: '/#services', label: { ar: 'خدماتنا', en: 'Services' } },
    { id: 'products', href: '/products', label: { ar: 'المنتجات', en: 'Products' } },
    { id: 'gallery', href: '/#gallery', label: { ar: 'المعرض', en: 'Gallery' } },
    { id: 'sectors', href: '/#sectors', label: { ar: 'القطاعات', en: 'Sectors' } },
    { id: 'branches', href: '/branches', label: { ar: 'الفروع', en: 'Branches' } },
    { id: 'contact', href: '/#contact', label: { ar: 'تواصل معنا', en: 'Contact' } },
  ] satisfies NavItem[],
  ui: {
    requestQuote: { ar: 'طلب عرض سعر', en: 'Request a quote' },
    switchLanguage: { ar: 'Switch to English', en: 'التبديل إلى العربية' },
    languageButton: { ar: 'EN', en: 'عربي' },
    mainNav: { ar: 'القائمة الرئيسية', en: 'Main navigation' },
    mobileNav: { ar: 'قائمة الجوال', en: 'Mobile navigation' },
    openMenu: { ar: 'فتح القائمة', en: 'Open menu' },
    closeMenu: { ar: 'إغلاق القائمة', en: 'Close menu' },
    close: { ar: 'إغلاق', en: 'Close' },
    previous: { ar: 'السابق', en: 'Previous' },
    next: { ar: 'التالي', en: 'Next' },
    openInMaps: { ar: 'فتح في خرائط Google', en: 'Open in Google Maps' },
    mapOf: { ar: 'خريطة', en: 'Map of' },
    orderViaWhatsapp: { ar: 'اطلب عبر واتساب', en: 'Order via WhatsApp' },
    priceOnRequest: { ar: 'السعر عند الطلب - اطلب عرض سعر', en: 'Price on request - ask for a quote' },
    priceByQuantity: { ar: 'السعر حسب الكمية', en: 'Price by quantity' },
    comingSoon: { ar: 'سيُضاف قريبًا', en: 'Coming soon' },
    unavailableHint: { ar: 'هذا الرابط غير متاح حاليًا', en: 'This link is not available yet' },
    viewImage: { ar: 'عرض الصورة', en: 'View image' },
    playVideo: { ar: 'تشغيل الفيديو', en: 'Play video' },
    video: { ar: 'فيديو', en: 'Video' },
    branch: { ar: 'فرع', en: 'Branch' },
    warehouse: { ar: 'مستودع', en: 'Warehouse' },
  },
  hero: {
    badge: { ar: 'خبرة موثوقة منذ عام 2001', en: 'Trusted experience since 2001' },
    titleLines: [
      { ar: 'شريكك الموثوق في', en: 'Your trusted partner in' },
      { ar: 'توريد المواد الغذائية', en: 'food supply' },
    ] satisfies Localized[],
    subtitle: {
      ar: 'من المصدر إلى وجهتك .. بجودة عالمية وسلاسل إمداد متكاملة.',
      en: 'From source to destination, with global quality and integrated supply chains.',
    },
    primaryCta: { ar: 'طلب عرض سعر', en: 'Request a quote' },
    secondaryCta: { ar: 'تعرف علينا', en: 'Get to know us' },
    imageAlt: {
      ar: 'ميناء تجاري عند الغروب فيه سفينة حاويات وشاحنة ومستودع',
      en: 'A commercial port at sunset with a container ship, a truck and a warehouse',
    },
    scrollLabel: { ar: 'انتقل إلى قسم من نحن', en: 'Scroll to the about section' },
    features: [
      { icon: 'concierge', label: { ar: 'توريد المواد الغذائية', en: 'Food supply' } },
      { icon: 'store', label: { ar: 'المطاعم والفنادق', en: 'Restaurants & hotels' } },
      { icon: 'truck', label: { ar: 'النقل البري', en: 'Land transport' } },
      { icon: 'ship', label: { ar: 'الاستيراد البحري', en: 'Sea import' } },
    ] satisfies { icon: IconKey; label: Localized }[],
  },
  about: {
    eyebrow: { ar: 'من نحن', en: 'About us' },
    title: { ar: 'خبرة طويلة في توريد المواد الغذائية', en: 'Long experience in food supply' },
    text: {
      ar: 'منافذ التوريد شركة رائدة في مجال استيراد وتوريد وتوزيع المواد الغذائية. نربط المصدر بالأسواق المحلية والإقليمية من خلال حلول متكاملة وآمنة تضمن أعلى معايير الجودة والكفاءة في سلسلة الإمداد.',
      en: 'Mnaveeh ALTourid is a leading company in importing, supplying and distributing food products. We connect the source to local and regional markets through integrated, safe solutions that uphold the highest standards of quality and efficiency across the supply chain.',
    },
    cta: { ar: 'المزيد عن الشركة', en: 'More about the company' },
    imageAlt: {
      ar: 'موظف يراجع المخزون في مستودع منافذ التوريد',
      en: 'A team member checking inventory in the company warehouse',
    },
    badgeLabel: { ar: 'خبرة منذ', en: 'Experience since' },
    badgeValue: '2001',
    pillars: [
      {
        icon: 'globe',
        title: { ar: 'خبرة منذ 2001', en: 'Experience since 2001' },
        text: { ar: 'أكثر من عقدين من النجاح', en: 'More than two decades of success' },
      },
      {
        icon: 'shield',
        title: { ar: 'حلول متكاملة', en: 'Integrated solutions' },
        text: { ar: 'من الاستيراد حتى التوصيل', en: 'From import to delivery' },
      },
      {
        icon: 'handshake',
        title: { ar: 'شراكات قوية', en: 'Strong partnerships' },
        text: { ar: 'شبكة واسعة من الموردين حول العالم', en: 'A wide network of suppliers worldwide' },
      },
      {
        icon: 'gem',
        title: { ar: 'جودة مضمونة', en: 'Guaranteed quality' },
        text: { ar: 'منتجات مختارة وفق معايير عالمية', en: 'Products selected to global standards' },
      },
    ] satisfies { icon: IconKey; title: Localized; text: Localized }[],
  },
  servicesSection: {
    eyebrow: { ar: 'خدماتنا', en: 'Our services' },
    title: { ar: 'حلول متكاملة لسلسلة الإمداد الغذائية', en: 'Integrated food supply chain solutions' },
  },
  productsSection: {
    eyebrow: { ar: 'منتجاتنا', en: 'Our products' },
    title: { ar: 'منتجات مختارة بجودة موثوقة', en: 'Selected products of trusted quality' },
    subtitle: {
      ar: 'اطلع على بعض منتجاتنا واطلبها مباشرة عبر واتساب.',
      en: 'Browse some of our products and order them directly on WhatsApp.',
    },
    cta: { ar: 'عرض جميع المنتجات', en: 'View all products' },
  },
  productsPage: {
    eyebrow: { ar: 'المنتجات', en: 'Products' },
    title: { ar: 'منتجاتنا الغذائية', en: 'Our food products' },
    subtitle: {
      ar: 'تشكيلة متنوعة من المواد الغذائية بأسعار واضحة، مع أسعار خاصة للكميات الكبيرة.',
      en: 'A varied range of food products with clear prices and special rates for larger quantities.',
    },
    ctaTitle: { ar: 'لم تجد ما تبحث عنه؟', en: 'Can’t find what you need?' },
    ctaText: {
      ar: 'اطلب عرض سعر مخصصًا لاحتياجات شركتك وسنرد عليك في أقرب وقت.',
      en: 'Request a tailored quote for your company’s needs and we will get back to you shortly.',
    },
  },
  gallerySection: {
    eyebrow: { ar: 'معرض الأعمال', en: 'Our work' },
    title: { ar: 'من المصدر إلى وجهتك ... في كل خطوة', en: 'From source to destination ... every step of the way' },
    subtitle: {
      ar: 'شاهد جانبًا من عملياتنا ومنتجاتنا',
      en: 'See a glimpse of our operations and products',
    },
    showAll: { ar: 'عرض الكل', en: 'Show all' },
    tabsLabel: { ar: 'تصنيفات المعرض', en: 'Gallery categories' },
    all: { ar: 'الكل', en: 'All' },
  },
  stats: {
    label: { ar: 'إحصائيات الشركة', en: 'Company statistics' },
    items: [
      { icon: 'award', value: 24, label: { ar: 'عام من الخبرة', en: 'Years of experience' } },
      { icon: 'users', value: 500, label: { ar: 'عميل من القطاعات المختلفة', en: 'Clients across sectors' } },
      { icon: 'container', value: 1200, label: { ar: 'شحنة سنويًا', en: 'Shipments per year' } },
      { icon: 'globe', value: 20, label: { ar: 'دولة موردة', en: 'Supplier countries' } },
    ] satisfies { icon: IconKey; value: number; label: Localized }[],
  },
  sectorsSection: {
    eyebrow: { ar: 'قطاعاتنا', en: 'Our sectors' },
    title: { ar: 'القطاعات التي نخدمها', en: 'The sectors we serve' },
    subtitle: { ar: 'نلبي احتياجات مجموعة واسعة من القطاعات', en: 'We meet the needs of a wide range of sectors' },
  },
  branchesSection: {
    eyebrow: { ar: 'فروعنا', en: 'Our branches' },
    title: { ar: 'قريبون منك أينما كنت', en: 'Close to you, wherever you are' },
    subtitle: {
      ar: 'تعرف على مواقع فروعنا وافتحها مباشرة في خرائط Google.',
      en: 'Find our branch locations and open them directly in Google Maps.',
    },
    cta: { ar: 'عرض جميع الفروع', en: 'View all branches' },
  },
  branchesPage: {
    eyebrow: { ar: 'الفروع', en: 'Branches' },
    title: { ar: 'فروعنا ومواقعنا', en: 'Our branches and locations' },
    subtitle: {
      ar: 'اعثر على أقرب فرع إليك وافتح موقعه في خرائط Google بضغطة واحدة.',
      en: 'Find your nearest branch and open its location in Google Maps in one tap.',
    },
    branchesTitle: { ar: 'الفروع', en: 'Branches' },
    warehousesTitle: { ar: 'المستودعات', en: 'Warehouses' },
  },
  contact: {
    titleStart: { ar: 'دعنا نكون', en: 'Let us be' },
    titleHighlight: { ar: 'شريكك في النجاح', en: 'your partner in success' },
    text: {
      ar: 'تواصل معنا اليوم للحصول على عرض سعر مفصل لأعمالك واحتياجاتك.',
      en: 'Contact us today for a detailed quote tailored to your business and needs.',
    },
    phone: { ar: 'الهاتف', en: 'Phone' },
    email: { ar: 'البريد الإلكتروني', en: 'Email' },
    address: { ar: 'العنوان', en: 'Address' },
  },
  footer: {
    description: {
      ar: 'شريكك الموثوق في توريد المواد الغذائية، من المصدر إلى وجهتك بجودة عالمية وسلاسل إمداد متكاملة.',
      en: 'Your trusted partner in food supply, from source to destination with global quality and integrated supply chains.',
    },
    quickLinks: { ar: 'روابط سريعة', en: 'Quick links' },
    services: { ar: 'خدماتنا', en: 'Our services' },
    contact: { ar: 'تواصل معنا', en: 'Contact us' },
    rights: { ar: 'منافذ التوريد. جميع الحقوق محفوظة.', en: 'Mnaveeh ALTourid. All rights reserved.' },
  },
}
