import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { defaultLocale, isLocale, localePath, type Locale } from '@/lib/i18n'
import { getMeatSupplyPageData } from '@/lib/sanity/meat-supply'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { JsonLd } from '@/components/json-ld'
import { ShieldCheck, Snowflake, Truck, FileText, CheckCircle2, MessageCircle, ArrowRight, Building2, Utensils, Hotel } from 'lucide-react'

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale

  const title =
    locale === 'ar'
      ? 'توريد اللحوم المجمدة بالجملة في السعودية | منافذ التوريد'
      : 'Wholesale Frozen Meat Supply in Saudi Arabia | Mnaveth ALTourid'

  const description =
    locale === 'ar'
      ? 'توريد لحوم بالجملة للمطاعم والفنادق في المملكة العربية السعودية، مع التركيز على كبدة Classic وJohny Gold والمخ واللسان والريش. المدن الرئيسية عبر أسطول الشركة، والمناطق الأبعد للطلبات أو الكميات الكبيرة.'
      : 'Wholesale meat supply for restaurants and hotels across Saudi Arabia, specializing in Classic and Johny Gold liver, brain, tongue and ribs. Major cities are served by the company fleet; farther areas are arranged for orders or larger quantities.'

  return buildMetadata({
    path: '/meat-supply',
    locale,
    title,
    description,
    keywords: [
      'توريد لحوم',
      'توريد لحوم مجمدة',
      'مورد لحوم للمطاعم',
      'شركات توريد لحوم',
      'لحوم مجمدة جملة',
      'توريد لحوم في السعودية',
      'مورد لحوم في المملكة العربية السعودية',
      'موردين لحوم الرياض',
      'مورد لحوم جدة',
      'مورد لحوم مكة',
    ],
  })
}

export default async function MeatSupplyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const isAr = locale === 'ar'

  const { products, contacts } = await getMeatSupplyPageData(locale)

  const defaultWhatsappMsg = encodeURIComponent(
    isAr
      ? 'السلام عليكم، أود الاستفسار عن عروض وأسعار توريد اللحوم المجمدة للمنشأة (مطعم/فندق/إعاشة).'
      : 'Hello, I would like to inquire about wholesale frozen meat supply for our establishment.'
  )
  const hasWhatsapp = Boolean(contacts.whatsapp && contacts.whatsapp.replace(/\D/g, '').length >= 7)
  const whatsappUrl = hasWhatsapp
    ? `https://wa.me/${contacts.whatsapp.replace(/\D/g, '')}?text=${defaultWhatsappMsg}`
    : localePath('/contact', locale)

  // Schema: WebPage + FAQPage + Service
  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': 'https://mnaveth.com/meat-supply#service',
        name: isAr ? 'توريد اللحوم المجمدة بالجملة' : 'Wholesale Frozen Meat Supply',
        serviceType: 'B2B Meat Distribution',
        provider: {
          '@id': 'https://mnaveth.com/#organization',
        },
        areaServed: [
          { '@type': 'Country', name: 'Saudi Arabia' },
          ...[
            'Riyadh',
            'Jeddah',
            'Makkah',
            'Madinah',
            'Dammam',
            'Al Khobar',
            'Dhahran',
            'Taif',
            'Buraidah',
            'Abha',
            'Khamis Mushait',
            'Jubail',
            'Al-Ahsa',
            'Yanbu',
            'Tabuk',
            'Hail',
            'Jazan',
            'Najran',
            'Al-Baha',
          ].map((name) => ({ '@type': 'City', name })),
        ],
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          eligibleCustomerType: 'https://schema.org/Business',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://mnaveth.com/meat-supply#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: isAr ? 'ما هي مصادر ومناشئ اللحوم المجمدة الموردة؟' : 'What are the sources of imported frozen meats?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: isAr
                ? 'نستورد اللحوم من كبرى المسالخ المعتمدة في البرازيل والهند، مع شهادات ذبح حلال إسلامية وفحص مخبري كامل من الهيئة العامة للغذاء والدواء SFDA.'
                : 'Meats are sourced from federally inspected abattoirs in Brazil and India, with 100% Halal certification and complete SFDA clearance.',
            },
          },
          {
            '@type': 'Question',
            name: isAr ? 'ما هو الحد الأدنى للطلب (MOQ) لتوريد اللحوم؟' : 'What is the minimum order quantity (MOQ)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: isAr
                ? 'الحد الأدنى للطلب الفوري هو 30 إلى 50 كرتون، مع إمكانية جدولة عقود توريد أسبوعية أو شهرية للكميات الأكبر والحاويات الكاملة.'
                : 'Minimum order quantity is 30 to 50 master cartons, with scheduled contracts for volume buyers and full container loads.',
            },
          },
          {
            '@type': 'Question',
            name: isAr ? 'كيف يتم التحقق من ثبات سلسلة التبريد أثناء التوصيل؟' : 'How is cold chain integrity guaranteed during transit?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: isAr
                ? 'يتم النقل عبر أسطول شاحنات مبردة مجهزة بحساسات رقمية ترصد درجة الحرارة عند -18° مئوية بشكل مستمر لضمان عدم تعرض اللحوم لأي ذوبان جزئي.'
                : 'Transit is managed via refrigerated trucks maintaining a strict -18°C temperature with digital data loggers.',
            },
          },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
      <JsonLd schema={pageSchema} />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-28 md:pt-36 pb-16 text-white md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-300 md:text-sm">
            <Snowflake className="h-4 w-4" />
            <span>{isAr ? 'سلسلة تبريد معتمدة -18°م · تراخيص الغذاء والدواء SFDA' : 'SFDA Certified Cold Chain · -18°C'}</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white">
            {isAr ? 'توريد اللحوم المجمدة بالجملة في السعودية' : 'Wholesale Frozen Meat Supply in Saudi Arabia'}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
            {isAr
              ? 'الشريك التمويني المعتمد للمطاعم، سلاسل البرجر، الفنادق، ومطابخ الإعاشة. توريد لحوم بقر وضأن وكبدة مجمدة بمواصفات قياسية موحدة وأسعار جملة منافسة.'
              : 'Reliable meat supply partner for restaurant chains, hotels, and central kitchens across Saudi Arabia. Certified Halal beef, mutton, and liver.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-emerald-500 hover:shadow-emerald-600/30"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{isAr ? 'طلب تسعير فوري عبر الواتساب' : 'Request Instant Quote via WhatsApp'}</span>
            </a>
            <Link
              href={localePath('/catalog', locale)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <span>{isAr ? 'تحميل كتالوج الأصناف المحدث' : 'Download Catalog PDF'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars: What, Who, Where, MOQ */}
      <section className="border-y border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-red-100 p-2 text-red-600">
                <Utensils className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{isAr ? 'ماذا نورد؟' : 'What We Supply'}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {isAr
                  ? 'لحوم بقرية وضأن وكبدة مجمدة مستوردة من البرازيل والهند (توب سايد، سيلفر سايد، مكعبات، مفروم برجر 80/20 و 85/15).'
                  : 'Imported frozen beef, mutton, and liver from Brazil and India (topside, silverside, diced cubes, burger mince).'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-blue-100 p-2 text-blue-600">
                <Building2 className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{isAr ? 'لمن نورد؟' : 'Who We Serve'}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {isAr
                  ? 'مطاعم الشاورما والبرجر والمشاوي، الفنادق 4 و 5 نجوم، مطابخ الإعاشة المركزية، ومجمعات المشاريع الكبرى.'
                  : 'Fast-casual restaurant chains, 4 & 5-star hotels, industrial catering kitchens, and workforce camp dining.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-amber-100 p-2 text-amber-600">
                <Truck className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{isAr ? 'أين نغطي؟' : 'Coverage Areas'}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {isAr
                  ? 'أسطول شاحنات مبردة يومية تغطي الرياض، جدة، ومكة المكرمة مع شبكة شحن مبرد لباقي مدن المملكة.'
                  : 'Daily temperature-controlled refrigerated delivery across Riyadh, Jeddah, Makkah, and nationwide corridors.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{isAr ? 'الحد الأدنى للطلب (MOQ)' : 'Minimum Order'}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {isAr
                  ? '30 إلى 50 كرتون للطلبات المجدولة، وتسهيلات تعاقدية لطلبات الحاويات الكاملة وعقود الإعاشة السنوية.'
                  : '30 to 50 master cartons for scheduled routes; volume contract pricing for container allocations.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Products & Cuts Table */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                {isAr ? 'قائمة الأصناف والقطعيات المتاحة' : 'Available Cuts & Specs'}
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {isAr ? 'جدول منتجات اللحوم المجمدة من الكتالوج المعتمد' : 'Live Frozen Meat Catalog Table'}
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              {isAr ? 'يتم تحديث البيانات تلقائياً من نظام إدارة المنتجات Sanity' : 'Live data synchronized directly with Sanity Studio'}
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm text-slate-600" dir={isAr ? 'rtl' : 'ltr'}>
              <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-4">{isAr ? 'المنتج / الصنف' : 'Product Cut'}</th>
                  <th scope="col" className="px-6 py-4">{isAr ? 'المنشأ والمسلخ' : 'Origin & Plant'}</th>
                  <th scope="col" className="px-6 py-4">{isAr ? 'نوع القطعية والوزن' : 'Cut & Packing'}</th>
                  <th scope="col" className="px-6 py-4">{isAr ? 'الاستخدام التجاري' : 'Application'}</th>
                  <th scope="col" className="px-6 py-4">{isAr ? 'سلسلة الحفظ' : 'Cold Storage'}</th>
                  <th scope="col" className="px-6 py-4">{isAr ? 'السعر التقديري' : 'Price / Terms'}</th>
                  <th scope="col" className="px-6 py-4 text-center">{isAr ? 'طلب التوريد' : 'Order'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((item) => {
                  const itemWhatsappMsg = encodeURIComponent(
                    isAr
                      ? `السلام عليكم، أرغب بطلب توريد منتج (${item.name}) لمنشأتنا.`
                      : `Hello, I want to order wholesale product (${item.name}).`
                  )
                  const itemOrderUrl = hasWhatsapp
                    ? `https://wa.me/${contacts.whatsapp.replace(/\D/g, '')}?text=${itemWhatsappMsg}`
                    : localePath('/contact', locale)

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <Link href={localePath(`/products/${item.slug}`, locale)} className="hover:text-emerald-600 hover:underline">
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                          {item.origin}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{item.cutOrType}</div>
                        <div className="text-xs text-slate-500">{item.packaging}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">{item.usage}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                          <Snowflake className="h-3 w-3" />
                          {item.storage}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {item.priceFormatted ? (
                          item.priceFormatted
                        ) : (
                          <span className="text-xs font-normal text-slate-500">
                            {isAr ? 'حسب حجم الطلب والعقد' : 'Quote per volume'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a
                          href={itemOrderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{isAr ? 'اطلب الآن' : 'Inquire'}</span>
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sector Sub-Pages Navigation */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {isAr ? 'حلول توريد مخصصة حسب قطاع عملك' : 'Specialized Supply Solutions by Industry Sector'}
            </h2>
            <p className="mt-2 text-slate-600">
              {isAr ? 'اختر قطاعك للاطلاع على القطعيات المناسبة ونمط التسليم وشروط التعاقد' : 'Explore cut profiles, delivery cadences, and agreements tailored to your sector'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href={localePath('/meat-supply/restaurants', locale)}
              className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-xl bg-amber-50 p-3 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition">
                <Utensils className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition">
                {isAr ? 'توريد مطاعم البرجر والشاورما والمشاوي' : 'Restaurant & Fast Casual Chains'}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {isAr
                  ? 'قطعيات توب سايد وسيلفر سايد منزوعة العظم ونسب دهن برجر 80/20 ثابتة لضمان توحيد مذاق الوجبات.'
                  : 'Boneless topside, silverside, and standardized 80/20 burger formulations with daily route dispatch.'}
              </p>
              <div className="mt-6 flex items-center gap-1 text-sm font-bold text-emerald-600">
                <span>{isAr ? 'تفاصيل قطاع المطاعم' : 'Explore Restaurants'}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href={localePath('/meat-supply/hotels', locale)}
              className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <Hotel className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition">
                {isAr ? 'توريد الفنادق والضيافة الفاخرة' : 'Hospitality & 5-Star Hotels'}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {isAr
                  ? 'شهادات سلامة الغذاء HACCP وتوريد مجدول لأرصفة الفنادق مع سجلات درجات الحرارة الرقمية.'
                  : 'HACCP-compliant hotel banquet provisioning with signed cold-chain thermograph receipts.'}
              </p>
              <div className="mt-6 flex items-center gap-1 text-sm font-bold text-emerald-600">
                <span>{isAr ? 'تفاصيل قطاع الفنادق' : 'Explore Hospitality'}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href={localePath('/meat-supply/catering', locale)}
              className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition">
                {isAr ? 'توريد مطابخ الإعاشة وحقول العمل' : 'Industrial Catering & Worksite Camps'}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {isAr
                  ? 'طاقات استيعابية ضخمة، كراتين جملة 25 كجم، عقود سنوية مدعومة باحتياطي مخزون استراتيجي.'
                  : 'High-tonnage container dispatches, 25kg bulk master packs, and buffered tender contracts.'}
              </p>
              <div className="mt-6 flex items-center gap-1 text-sm font-bold text-emerald-600">
                <span>{isAr ? 'تفاصيل قطاع الإعاشة' : 'Explore Catering'}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* City Hubs (Riyadh & Jeddah) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {isAr ? 'مستودعات ومراكز التوزيع اللوجستي المعتمدة' : 'Verified Distribution Centers & City Corridors'}
            </h2>
            <p className="mt-2 text-slate-600">
              {isAr ? 'شبكة مستودعات تبريد وتوزيع مرخصة رسمياً في كبرى مدن المملكة' : 'Licensed cold storage facilities serving core urban markets'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href={localePath('/meat-supply/riyadh', locale)}
              className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition">
                  {isAr ? 'مركز توزيع الرياض المركزي (السلي)' : 'Riyadh Central Hub (Al-Sulai)'}
                </h3>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {isAr ? 'توريد يومي فجرًا' : 'Daily 4-8 AM'}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {isAr
                  ? 'تغطية كاملة لمستودعات السلي الصناعية، الشفا، العارض، السليمانية، والعليا مع إمكانية الاستلام الذاتي المباشر.'
                  : 'Serving Al-Sulai, Al-Shifa, Al-Arid, Olaya, and Greater Riyadh with dock pickup and scheduled route dispatches.'}
              </p>
              <div className="mt-6 flex items-center gap-1 text-sm font-bold text-emerald-600">
                <span>{isAr ? 'مستودع الرياض وشروط التوصيل' : 'View Riyadh Details'}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href={localePath('/meat-supply/jeddah', locale)}
              className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition">
                  {isAr ? 'مركز توزيع الغربية وجدة (الخمرة)' : 'Western Province Hub (Jeddah - Al-Khumrah)'}
                </h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {isAr ? 'شحن مكة وجدة' : 'Jeddah & Makkah'}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {isAr
                  ? 'خدمة منطقة الخمرة اللوجستية ومحيط الميناء ومطاعم جدة وفنادق المشاعر بمكة المكرمة بشاحنات تبريد مجهزة.'
                  : 'Serving Al-Khumrah logistics zone, Jeddah port district, and Makkah hotel feeding lines.'}
              </p>
              <div className="mt-6 flex items-center gap-1 text-sm font-bold text-emerald-600">
                <span>{isAr ? 'مستودع جدة وشروط التوصيل' : 'View Jeddah Details'}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Order Mechanism & Contract Steps */}
      <section className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              {isAr ? 'آلية طلب التوريد والتعاقد المؤسسي' : 'Contracting & Order Fulfillment Workflow'}
            </h2>
            <p className="mt-2 text-slate-400">
              {isAr ? '4 خطوات سريعة ومرنة لبدء توريد اللحوم المجمدة لمنشأتكم' : '4 seamless steps from quotation to refrigerated dock fulfillment'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-6">
              <div className="mb-3 text-3xl font-black text-amber-400">01</div>
              <h3 className="text-lg font-bold">{isAr ? 'تحديد الكميات والأصناف' : 'Demand Specification'}</h3>
              <p className="mt-2 text-sm text-slate-300">
                {isAr
                  ? 'إرسال قائمة القطعيات المطلوبة والكميات التقديرية عبر الواتساب أو البريد للحصول على عرض سعر فوري.'
                  : 'Share your required cuts and volume projections to receive a detailed wholesale proposal.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-6">
              <div className="mb-3 text-3xl font-black text-amber-400">02</div>
              <h3 className="text-lg font-bold">{isAr ? 'فحص العينات والمواصفة' : 'Sample Verification'}</h3>
              <p className="mt-2 text-sm text-slate-300">
                {isAr
                  ? 'توفير عينات تجريبية للمطبخ المركزي للتحقق من نسب الدهن وطراوة اللحم ومطابقة اشتراطاتكم.'
                  : 'Test sample master cuts in your kitchen to inspect yield, fat consistency, and flavor.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-6">
              <div className="mb-3 text-3xl font-black text-amber-400">03</div>
              <h3 className="text-lg font-bold">{isAr ? 'توقيع العقد وجدولة الدفع' : 'Contract & Terms'}</h3>
              <p className="mt-2 text-sm text-slate-300">
                {isAr
                  ? 'اعتماد اتفاقية التوريد الشهرية أو السنوية وتحديد مواعيد التسليم وتسهيلات الدفع للشركات المؤهلة.'
                  : 'Execute vendor agreement defining delivery cadence, index pricing, and credit terms.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-6">
              <div className="mb-3 text-3xl font-black text-amber-400">04</div>
              <h3 className="text-lg font-bold">{isAr ? 'الشحن المبرد الدوري' : 'Cold-Chain Delivery'}</h3>
              <p className="mt-2 text-sm text-slate-300">
                {isAr
                  ? 'التسليم المباشر في المواعيد المحددة بشاحنات مبردة عند -18°م مع بطاقة فحص الحرارة المعتمدة.'
                  : 'Scheduled route delivery with signed temperature receipts certifying -18°C adherence.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {isAr ? 'الأسئلة الشائعة حول توريد اللحوم المجمدة' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? 'ما هي مصادر ومناشئ اللحوم المجمدة الموردة؟' : 'What are the sources of imported frozen meats?'}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {isAr
                  ? 'نستورد اللحوم من كبرى المسالخ المعتمدة في البرازيل والهند، مع شهادات ذبح حلال إسلامية وفحص مخبري كامل من الهيئة العامة للغذاء والدواء SFDA.'
                  : 'Meats are sourced from federally inspected abattoirs in Brazil and India, with 100% Halal certification and complete SFDA clearance.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? 'ما هو الحد الأدنى للطلب (MOQ) لتوريد اللحوم؟' : 'What is the minimum order quantity (MOQ)?'}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {isAr
                  ? 'الحد الأدنى للطلب الفوري هو 30 إلى 50 كرتون، مع إمكانية جدولة عقود توريد أسبوعية أو شهرية للكميات الأكبر والحاويات الكاملة.'
                  : 'Minimum order quantity is 30 to 50 master cartons, with scheduled contracts for volume buyers and full container loads.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? 'كيف يتم التحقق من ثبات سلسلة التبريد أثناء التوصيل؟' : 'How is cold chain integrity guaranteed during transit?'}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {isAr
                  ? 'يتم النقل عبر أسطول شاحنات مبردة مجهزة بحساسات رقمية ترصد درجة الحرارة عند -18° مئوية بشكل مستمر لضمان عدم تعرض اللحوم لأي ذوبان جزئي.'
                  : 'Transit is managed via refrigerated trucks maintaining a strict -18°C temperature with digital data loggers.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating / Footer WhatsApp Bar */}
      <section className="bg-emerald-600 py-10 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {isAr ? 'هل تبحث عن عقد توريد لحوم مجمدة موثوق لمنشأتك؟' : 'Ready to Secure a Reliable Wholesale Meat Supply?'}
          </h2>
          <p className="mt-2 text-emerald-100">
            {isAr
              ? 'تواصل مباشرة مع فريق مبيعات الجملة عبر الواتساب للحصول على جدول الأسعار المحدث وعينات الاختبار'
              : 'Speak directly with our B2B team on WhatsApp for latest price schedules and test samples'}
          </p>
          <div className="mt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-emerald-800 shadow-md transition hover:bg-slate-100"
            >
              <MessageCircle className="h-5 w-5 text-emerald-600" />
              <span>{isAr ? 'تحدث مع مسؤول مبيعات اللحوم' : 'WhatsApp Wholesale Desk'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
