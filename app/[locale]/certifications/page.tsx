import type { Metadata } from 'next'
import Link from 'next/link'
import { defaultLocale, isLocale, localePath, type Locale } from '@/lib/i18n'
import { sanityFetch } from '@/lib/sanity/live'
import { defineQuery } from 'next-sanity'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { JsonLd } from '@/components/json-ld'
import { Award, CheckCircle2, Calendar, Building2, ShieldCheck, Download, ArrowLeft, ArrowRight } from 'lucide-react'

export const dynamicParams = false

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }]
}

export const certificationsPageQuery = defineQuery(`*[_type == "certificationsPage"][0]{
  title,
  h1,
  badge,
  intro,
  seo
}`)

export const certificatesQuery = defineQuery(`*[_type == "certificate"] | order(validUntil desc){
  _id,
  name,
  issuer,
  description,
  category,
  validUntil,
  "fileUrl": file.asset->url
}`)

const FALLBACK_CERTIFICATES = [
  {
    id: 'sfda-license',
    name: {
      ar: 'ترخيص واعتماد مستودعات التبريد والتخزين الغذائي',
      en: 'Licensed & Audited Cold Storage & Food Warehouses',
    },
    issuer: {
      ar: 'الهيئة العامة للغذاء والدواء (SFDA)',
      en: 'Saudi Food and Drug Authority (SFDA)',
    },
    validUntil: '2027-12-31',
    description: {
      ar: 'ترخيص رسمي لمستودعات التبريد والتجميد وسلاسل الإمداد الغذائي لضمان تطبيق متطلبات اللائحة الفنية لسلامة الأغذية.',
      en: 'Official accreditation for cold chain storage facilities compliant with technical regulations for food safety.',
    },
    category: 'regulatory',
  },
  {
    id: 'halal-certification',
    name: {
      ar: 'شهادات الذبح الحلال الإسلامي للحوم والدواجن المستوردة',
      en: '100% Islamic Halal Slaughter Certificates',
    },
    issuer: {
      ar: 'المركز السعودي للحلال وهيئات التوثيق الإسلامية المعتمدة',
      en: 'Saudi Halal Center & Authorized Islamic Certification Bodies',
    },
    validUntil: '2027-06-30',
    description: {
      ar: 'شهادات رسمية تؤكد الذبح وفق الشريعة الإسلامية لكافة شحنات اللحوم البقرية وضأن وكبدة البرازيل والهند.',
      en: 'Mandatory Halal slaughter certification covering all imported beef, mutton, and poultry consignments.',
    },
    category: 'quality',
  },
  {
    id: 'haccp-compliance',
    name: {
      ar: 'شهادة نظام تحليل المخاطر ونقاط التحكم الحرجة (HACCP)',
      en: 'Hazard Analysis Critical Control Point (HACCP)',
    },
    issuer: {
      ar: 'منظمات سلامة الغذاء الدولية المعتمدة',
      en: 'Accredited International Food Safety Auditors',
    },
    validUntil: '2026-11-30',
    description: {
      ar: 'إدارة وتوثيق نقاط التحكم الحرجة لسلسلة التبريد من موانئ الاستيراد وحتى مستودعات العميل النهائي.',
      en: 'Strict critical control point monitoring across refrigerated logistics from ports to client dock.',
    },
    category: 'quality',
  },
  {
    id: 'cr-license',
    name: {
      ar: 'السجل التجاري لمزاولة نشاط تجارة وتوزيع المواد الغذائية بالجملة',
      en: 'Commercial Registration CR 1116011768',
    },
    issuer: {
      ar: 'وزارة التجارة - المملكة العربية السعودية',
      en: 'Ministry of Commerce - Kingdom of Saudi Arabia',
    },
    validUntil: '2028-10-15',
    description: {
      ar: 'سجل تجاري نظامي رقم 1116011768 يخول الشركة ممارسة أنشطة توريد المواد التموينية واللحوم للمنشآت.',
      en: 'Official commercial authorization granting wholesale foodservice distribution across Saudi Arabia.',
    },
    category: 'regulatory',
  },
]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale

  const title =
    locale === 'ar'
      ? 'الشهادات والاعتمادات الرسمية والتراخيص | شركة منافذ التوريد'
      : 'Certifications, Accreditations & Regulatory Licenses | Mnaveth ALTourid'

  const description =
    locale === 'ar'
      ? 'سجل التراخيص والشهادات الرسمية لشركة منافذ التوريد: اعتمادات هيئة الغذاء والدواء SFDA، شهادات الذبح الحلال، السجل التجاري 1116011768، ومعايير HACCP.'
      : 'Official regulatory accreditations of Mnaveth ALTourid: SFDA warehouse license, 100% Halal slaughter, HACCP compliance, CR 1116011768.'

  return buildMetadata({
    path: '/certifications',
    locale,
    title,
    description,
    keywords: [
      'شهادات منافذ التوريد',
      'ترخيص الغذاء والدواء',
      'شهادة حلال',
      'اعتماد HACCP',
      'السجل التجاري 1116011768',
    ],
  })
}

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const isAr = locale === 'ar'

  let customCertPage: any = null
  let sanityCertificates: any[] = []
  if (sanityFetch) {
    try {
      const [pageRes, certsRes] = await Promise.all([
        sanityFetch({ query: certificationsPageQuery, tags: ['certificationsPage'] }),
        sanityFetch({ query: certificatesQuery, tags: ['certificates'] }),
      ])
      if (pageRes?.data) customCertPage = pageRes.data
      if (Array.isArray(certsRes?.data) && certsRes.data.length > 0) {
        sanityCertificates = certsRes.data
      }
    } catch {}
  }

  const items =
    sanityCertificates.length > 0
      ? sanityCertificates.map((c) => ({
          id: c._id,
          name: c.name?.[locale] || c.name?.ar || c.name?.en || '',
          issuer: c.issuer?.[locale] || c.issuer?.ar || c.issuer?.en || (isAr ? 'جهة حكومية معتمدة' : 'Authorized Body'),
          validUntil: c.validUntil || (isAr ? 'سارية المفعول' : 'Valid'),
          fileUrl: c.fileUrl,
        }))
      : FALLBACK_CERTIFICATES.map((c) => ({
          id: c.id,
          name: c.name[locale],
          issuer: c.issuer[locale],
          validUntil: c.validUntil,
          description: c.description[locale],
          fileUrl: undefined,
        }))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: isAr ? 'الشهادات والاعتمادات الرسمية' : 'Certifications & Accreditations',
    url: 'https://mnaveth.com/certifications',
    publisher: { '@id': 'https://mnaveth.com/#organization' },
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20" dir={isAr ? 'rtl' : 'ltr'}>
      <JsonLd schema={schema} />

      {/* Header */}
      <section className="bg-slate-900 pt-28 md:pt-36 pb-16 text-white md:pb-20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
            <ShieldCheck className="h-4 w-4" />
            <span>{customCertPage?.badge?.[locale] || (isAr ? 'الامتثال الرقابي وسلامة الغذاء' : 'Regulatory & Quality Compliance')}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white">
            {customCertPage?.h1?.[locale] || (isAr ? 'الشهادات والتراخيص الرسمية' : 'Official Certifications & Accreditations')}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            {isAr
              ? 'تلتزم شركة منافذ التوريد بأعلى معايير الرقابة والتراخيص الحكومية المعتمدة لضمان جودة وسلامة كل شحنة تموينية تصل لعملائنا.'
              : 'Mnaveth ALTourid maintains comprehensive accreditations from food safety authorities, ensuring absolute product integrity.'}
          </p>
        </div>
      </section>

      {/* Certificates Grid */}
      <section className="container mx-auto px-4 max-w-5xl py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600">
                    <Award className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{isAr ? `تاريخ الصلاحية: ${item.validUntil}` : `Valid Until: ${item.validUntil}`}</span>
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900 leading-snug">{item.name}</h2>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{isAr ? `الجهة المانحة: ${item.issuer}` : `Issuer: ${item.issuer}`}</span>
                </div>

                {item.description ? (
                  <p className="mt-4 text-sm leading-relaxed text-slate-500 border-t border-slate-100 pt-4">
                    {item.description}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isAr ? 'اعتماد موثق ونشط' : 'Verified & Active'}</span>
                </span>

                {item.fileUrl ? (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isAr ? 'عرض الوثيقة' : 'View Document'}</span>
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* SFDA Compliance Callout */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                {isAr ? 'هل تحتاج وثائق الفسح المخبري لشحنة معينة؟' : 'Need Batch Lab Clearance Certificates?'}
              </h3>
              <p className="text-sm text-slate-600 max-w-2xl">
                {isAr
                  ? 'نوفر لكافة عملائنا من المطاعم والفنادق شهادات الإفراج الجمركي والفحص المخبري الصادرة من هيئة الغذاء والدواء مع كل فاتورة توريد.'
                  : 'Full laboratory test documentation and official port release dockets are supplied alongside delivery manifests.'}
              </p>
            </div>
            <a
              href="https://wa.me/966551065715"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-emerald-500"
            >
              <span>{isAr ? 'طلب ملف التوثيق الرقابي' : 'Request Compliance Pack'}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
