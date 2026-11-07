import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { ShareActions } from '@/components/share-actions'
import { defaultLocale, isLocale, localePath, type Locale } from '@/lib/i18n'
import { getServiceBySlug } from '@/lib/sanity/details'
import { getDetailSlugs } from '@/lib/sanity/articles'
import { imageUrl } from '@/lib/sanity/image'
import { serviceDetailGraph } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site-url'
import { buildMetadata } from '@/lib/seo/build-metadata'
import {
  Building2,
  CheckCircle2,
  Clock,
  FileCheck2,
  HelpCircle,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react'

const textFor = (value: any, locale: 'ar' | 'en') => value?.[locale] || value?.ar || value?.en || ''

export const dynamicParams = true

export async function generateStaticParams() {
  const details = await getDetailSlugs()
  const services = Array.isArray(details?.services) ? details.services : []
  const params: { locale: string; slug: string }[] = []
  for (const s of services) {
    if (s?.slug) {
      params.push({ locale: 'ar', slug: s.slug })
      params.push({ locale: 'en', slug: s.slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const service = await getServiceBySlug(slug)
  if (!service) return { title: 'Service', robots: { index: false, follow: false } }

  const title =
    textFor(service.seo?.title, locale) ||
    (locale === 'ar'
      ? `${textFor(service.name, locale)} في السعودية للشركات والمطاعم | منافذ التوريد`
      : `${textFor(service.name, locale)} in Saudi Arabia for B2B | Mnaveth ALTourid`)

  const description =
    textFor(service.seo?.description, locale) ||
    textFor(service.longDescription, locale) ||
    textFor(service.description, locale)

  const path = `/services/${slug}`
  const image = imageUrl(service.seo?.shareImage, 1200) || imageUrl(service.image, 1200)

  return buildMetadata({
    path,
    locale,
    title,
    description,
    image,
    isIndexable: Boolean(service.visible !== false),
  })
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug, locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const isAr = locale === 'ar'

  const [service, base] = await Promise.all([getServiceBySlug(slug), getSiteUrl()])
  if (!service) return notFound()

  const title = textFor(service.name, locale)
  const description = textFor(service.description, locale)
  const details = textFor(service.longDescription, locale)
  const image = imageUrl(service.image, 1400)
  const servicePath = `/services/${slug}`
  const shareUrl = `${base}${localePath(servicePath, locale)}`

  const whatsappMsg = encodeURIComponent(
    isAr
      ? `السلام عليكم، أود الاستفسار عن خدمة (${title}) لمنشأتنا.`
      : `Hello, I would like to inquire about the service (${title}) for our business.`
  )
  const whatsappUrl = `https://wa.me/966551065715?text=${whatsappMsg}`

  // Standardized B2B Service Structure (Task P4)
  const phases = isAr
    ? [
        {
          num: '01',
          title: 'تحليل الاحتياج وقائمة الأصناف',
          desc: 'دراسة قائمة التموين المطلوبة وجداول الاستهلاك اليومي أو الأسبوعي وتقدير حجم الطلب بدقة.',
        },
        {
          num: '02',
          title: 'التسعير المؤسسي وفحص العينات',
          desc: 'تقديم عرض سعر تنافسي مدعوم بعينات تجريبية للمطابخ المركزية للتحقق من الجودة وثبات المواصفة.',
        },
        {
          num: '03',
          title: 'اعتماد عقد التوريد وجدولة المستودعات',
          desc: 'توقيع اتفاقية التوريد مع تسهيلات الدفع، وتخصيص المخزون في مستودعاتنا المرخصة بالرياض وجدة.',
        },
        {
          num: '04',
          title: 'التوزيع والشحن الدوري المبرد',
          desc: 'تسليم منتظم في المواعيد المحددة عبر شاحنات مجهزة بحساسات رقمية مع فواتير وإشعارات استلام موثقة.',
        },
      ]
    : [
        {
          num: '01',
          title: 'Requirement & Volume Audit',
          desc: 'Auditing menu item consumption and demand cadences to project optimal procurement allocations.',
        },
        {
          num: '02',
          title: 'Proposal & Sample Validation',
          desc: 'Issuing volume pricing alongside kitchen testing packs to confirm specifications and yield.',
        },
        {
          num: '03',
          title: 'Agreement & Stock Allocation',
          desc: 'Finalizing vendor contract terms and reserving buffer stock in licensed cold storage facilities.',
        },
        {
          num: '04',
          title: 'Refrigerated Route Delivery',
          desc: 'Executing scheduled deliveries using telematics-monitored refrigerated fleet with delivery receipts.',
        },
      ]

  const serviceFaqs = isAr
    ? [
        {
          q: 'ما هي الشروط والمتطلبات لبدء عقد الخدمة؟',
          a: 'توفر سجل تجاري ساري، وتحديد موقع الاستلام ورصيف التفريغ، وتحديد متوسط حجم الطلب الدوري.',
        },
        {
          q: 'ما هي المدن والمناطق المغطاة ضمن هذه الخدمة؟',
          a: 'الخدمة متوفرة حالياً في منطقة الرياض ومنطقة مكة المكرمة (جدة ومكة المكرمة) مع خطوط إمداد سريعة لباقي المناطق.',
        },
        {
          q: 'هل تتوفر فواتير ضريبية إلكترونية معتمدة؟',
          a: 'نعم، جميع معاملاتنا التوريدية تصدر بفواتير ضريبية رسمية متوافقة كلياً مع متطلبات هيئة الزكاة والضريبة والجمارك (ZATCA).',
        },
      ]
    : [
        {
          q: 'What are the vendor onboarding requirements?',
          a: 'A valid commercial registration (CR), designated receiving dock location, and estimated procurement volume.',
        },
        {
          q: 'Which geographic regions are served under this service?',
          a: 'Direct daily operations cover Riyadh Region and Makkah Province (Jeddah & Makkah) with intercity corridors.',
        },
        {
          q: 'Are official ZATCA e-invoices provided with shipments?',
          a: 'Yes, all wholesale transactions comply fully with ZATCA phase 2 electronic invoicing regulations.',
        },
      ]

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20" dir={isAr ? 'rtl' : 'ltr'}>
      <JsonLd graph={serviceDetailGraph(service, locale, base)} />

      {/* Hero Header */}
      <section className="bg-slate-900 py-16 text-white md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            <span>{isAr ? 'خدمة تموينية معتمدة B2B' : 'B2B Foodservice Solution'}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white">
            {title}
          </h1>

          {description ? (
            <p className="mt-4 max-w-3xl text-lg text-slate-300 leading-relaxed">{description}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-emerald-500"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{isAr ? 'طلب عرض سعر للخدمة' : 'Request Service Quotation'}</span>
            </a>
            <Link
              href={localePath('/catalog', locale)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/20"
            >
              <span>{isAr ? 'استعراض كتالوج الأصناف' : 'Browse Item Catalog'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Image */}
      {image ? (
        <section className="container mx-auto px-4 max-w-5xl -mt-8">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-slate-800 shadow-xl border border-slate-700/50">
            <Image
              src={image}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </section>
      ) : null}

      {/* Scope & Target Audience (P4 requirement 1) */}
      <section className="container mx-auto px-4 max-w-5xl py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {isAr ? 'نطاق الخدمة وطبيعة العمل' : 'Service Scope'}
            </h2>
            <div className="mt-4 text-sm leading-relaxed text-slate-600 space-y-3">
              <p>{details || description}</p>
              <p>
                {isAr
                  ? 'نوفر منظومة إمداد متكاملة تغطي سلاسل التبريد والتخزين، مع التزام صارم بالمواصفات المعتمدة من الهيئة العامة للغذاء والدواء SFDA.'
                  : 'We manage end-to-end supply logistics backed by SFDA-compliant cold storage and traceable temperature integrity.'}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex rounded-xl bg-amber-50 p-3 text-amber-600">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {isAr ? 'لمن تناسب هذه الخدمة؟' : 'Target Sectors'}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{isAr ? 'مطاعم الوجبات السريعة والشاورما والبرجر والمشاوي' : 'Commercial restaurants, burger and grill concepts'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{isAr ? 'فنادق 4 و 5 نجوم وقاعات المؤتمرات والضيافة' : '4 & 5-star hotels and luxury banquet operators'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{isAr ? 'مطابخ الإعاشة المركزية وشركات المقاولات وحقول العمل' : 'Central catering kitchens and infrastructure worksite camps'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{isAr ? 'المستشفيات والجامعات والمجمعات السكنية المغلقة' : 'Hospitals, institutions and university compounds'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Workflow Phases (P4 requirement 1: المراحل) */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              {isAr ? 'آلية العمل والتنفيذ' : 'Process Workflow'}
            </span>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {isAr ? 'مراحل تقديم الخدمة والتعاقد التمويني' : 'Service Execution & Onboarding Stages'}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((p, i) => (
              <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                <div className="text-2xl font-black text-emerald-600">{p.num}</div>
                <h3 className="mt-2 text-base font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Cities & Requirements (P4 requirement 1: المدن والمتطلبات) */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <MapPin className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {isAr ? 'المدن والمناطق المغطاة' : 'Geographic Coverage'}
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <div>
                  <strong className="text-slate-800">{isAr ? 'مدينة الرياض:' : 'Riyadh:'}</strong>{' '}
                  {isAr
                    ? 'مستودع السلي المركزي مع شحن يومي فجرًا ومسائي لكافة الأحياء والمطاعم.'
                    : 'Al-Sulai distribution hub with daily refrigerated morning dispatches.'}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <div>
                  <strong className="text-slate-800">{isAr ? 'منطقة مكة المكرمة (جدة ومكة):' : 'Western Province (Jeddah & Makkah):'}</strong>{' '}
                  {isAr
                    ? 'مركز توزيع الخمرة اللوجستي المبرد لخدمة مطاعم جدة وفنادق المشاعر.'
                    : 'Al-Khumrah cold facility serving Jeddah venues and Makkah hotel commissaries.'}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex rounded-xl bg-purple-50 p-3 text-purple-600">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {isAr ? 'شروط ومتطلبات التعاقد التمويني' : 'Procurement Requirements'}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{isAr ? 'سجل تجاري نشط صادر من وزارة التجارة' : 'Active Commercial Registration certificate'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{isAr ? 'شهادة تسجيل ضريبة القيمة المضافة ZATCA' : 'VAT Registration Certificate'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{isAr ? 'رصيف استلام مهيأ للتفريغ والتخزين المبرد' : 'Designated receiving dock with cold holding capacity'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{isAr ? 'الالتزام بالحد الأدنى للطلب المجدول' : 'Commitment to agreed route minimum order quantity'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQs (P4 requirement 1: الأسئلة) */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            {isAr ? 'أسئلة شائعة حول الخدمة' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-4">
            {serviceFaqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{faq.q}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Share & Contact */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-8">
          <ShareActions title={title} url={shareUrl} locale={locale} />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-emerald-500"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{isAr ? 'محادثة مسؤول المبيعات' : 'Talk with Account Manager'}</span>
          </a>
        </div>
      </section>
    </main>
  )
}
