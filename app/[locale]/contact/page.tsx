import type { Metadata } from 'next'
import Link from 'next/link'
import { defaultLocale, isLocale, localePath, type Locale } from '@/lib/i18n'
import { getLayoutContent } from '@/lib/sanity/get-content'
import { getSiteUrl } from '@/lib/site-url'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { JsonLd } from '@/components/json-ld'
import {
  Building2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
} from 'lucide-react'

export const dynamicParams = false

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
      ? 'اتصل بنا ومواقع الفروع والمستودعات | شركة منافذ التوريد'
      : 'Contact Us, Cold Storage & Distribution Hubs | Mnaveth ALTourid'

  const description =
    locale === 'ar'
      ? 'تواصل مع إدارة مبيعات الجملة بشركة منافذ التوريد للتجارة (سجل تجاري 1116011768): هاتف مبيعات مباشر، واتساب فوري، مستودع السلي بالرياض، ومستودع الخمرة بجدة.'
      : 'Connect with Mnaveth ALTourid wholesale desk (CR 1116011768): direct phone, WhatsApp quotes, Al-Sulai Riyadh hub and Al-Khumrah Jeddah facility.'

  return buildMetadata({
    path: '/contact',
    locale,
    title,
    description,
    keywords: [
      'رقم منافذ التوريد',
      'واتساب منافذ التوريد',
      'مستودع السلي الرياض',
      'مستودع الخمرة جدة',
      'توريد أغذية للمطاعم',
    ],
  })
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const isAr = locale === 'ar'

  const [layout, base] = await Promise.all([getLayoutContent(), getSiteUrl()])
  const phone = layout.contact?.directPhone || layout.contact?.phone || '+966509971699'
  const email = layout.contact?.supportEmail || 'info@mnafeth.com'
  const quotesNumber = (layout.contact?.whatsapp?.quote?.number || layout.contact?.phone || '966509971699').replace(/\D/g, '')
  const ordersNumber = (layout.contact?.whatsapp?.orders?.number || quotesNumber || '966503000295').replace(/\D/g, '')
  const cr = layout.site?.brand?.commercialRegistration || '1116011768'

  const whatsappOrdersUrl = `https://wa.me/${ordersNumber}?text=${encodeURIComponent(
    isAr ? 'السلام عليكم، أود التواصل بخصوص طلب توريد أصناف غذائية.' : 'Hello, I want to discuss placing a wholesale order.'
  )}`
  const whatsappQuotesUrl = `https://wa.me/${quotesNumber}?text=${encodeURIComponent(
    isAr ? 'السلام عليكم، أود الحصول على عرض سعر وتفاصيل عقود التوريد.' : 'Hello, I would like to request a wholesale contract proposal.'
  )}`

  const customHours = isAr ? layout.contact?.workingHours?.ar : layout.contact?.workingHours?.en

  const hubs = [
    {
      name: isAr ? 'المستودع المركزي ومنطقة الرياض' : 'Central Logistics Hub (Riyadh)',
      district: isAr ? 'حي السلي الصناعي، الرياض' : 'Al-Sulai Industrial District, Riyadh',
      type: isAr ? 'مستودع تبريد وتجميد مرخص SFDA' : 'SFDA-Licensed Cold & Ambient Facility',
      hours: customHours || (isAr ? 'السبت - الخميس: 7:00 ص - 6:00 م' : 'Sat - Thu: 7:00 AM - 6:00 PM'),
      mapUrl: 'https://maps.google.com/?q=24.6333,46.8167',
    },
    {
      name: isAr ? 'مركز توزيع المنطقة الغربية (جدة)' : 'Western Province Distribution Hub (Jeddah)',
      district: isAr ? 'منطقة الخمرة اللوجستية، جدة' : 'Al-Khumrah Logistics Zone, Jeddah',
      type: isAr ? 'مركز توزيع وشحن مبرد لمطاعم وفنادق الغربية' : 'Refrigerated Transshipment Center',
      hours: customHours || (isAr ? 'السبت - الخميس: 7:30 ص - 5:30 م' : 'Sat - Thu: 7:30 AM - 5:30 PM'),
      mapUrl: 'https://maps.google.com/?q=21.3167,39.2667',
    },
  ]

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: isAr ? 'صفحة التواصل والمستودعات' : 'Contact & Distribution Hubs',
    url: `${base}${localePath('/contact', locale)}`,
    mainEntity: {
      '@type': 'WholesaleStore',
      name: isAr ? 'شركة منافذ التوريد للتجارة' : 'Mnaveth ALTourid Trading Co.',
      telephone: phone,
      email,
      parentOrganization: { '@id': `${base}/#organization` },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '08:00',
          closes: '17:00',
        },
      ],
    },
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20" dir={isAr ? 'rtl' : 'ltr'}>
      <JsonLd schema={contactSchema} />

      {/* Hero Header */}
      <section className="bg-slate-900 pt-28 md:pt-36 pb-16 text-white md:pb-20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
            <Building2 className="h-4 w-4" />
            <span>{isAr ? 'خدمة العملاء ومبيعات الجملة B2B' : 'Wholesale Client Support'}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white">
            {isAr ? 'اتصل بشركة منافذ التوريد للتجارة' : 'Contact Mnaveth ALTourid Trading Co.'}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            {isAr
              ? 'فريق مبيعات الجملة والدعم اللوجستي على أتم الاستعداد لخدمة استفسارات المطاعم، الفنادق، ومطابخ الإعاشة على مدار الأسبوع.'
              : 'Our foodservice procurement desk is ready to support quotes, delivery schedules, and contracts.'}
          </p>

          <div className="mt-4 text-xs text-slate-400">
            {isAr ? `السجل التجاري المعتمد: ${cr}` : `Commercial Registration: ${cr}`}
          </div>
        </div>
      </section>

      {/* Primary Contact Channels */}
      <section className="container mx-auto px-4 max-w-5xl -mt-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Phone className="h-6 w-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">{isAr ? 'الاتصال الهاتفي المباشر' : 'Direct Phone Desk'}</h2>
            <p className="mt-1 text-xs text-slate-500">{isAr ? 'للاستفسارات والمبيعات الفورية' : 'Instant sales & inquiries'}</p>
            <div className="mt-4">
              <a
                href={`tel:${phone}`}
                className="text-lg font-bold text-emerald-600 hover:underline ltr:inline-block"
                dir="ltr"
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">{isAr ? 'خدمة الواتساب التفاعلية' : 'Wholesale WhatsApp'}</h2>
            <p className="mt-1 text-xs text-slate-500">{isAr ? 'طلب عروض الأسعار والكتالوج' : 'Fast quotes & catalog PDFs'}</p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={whatsappQuotesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-500"
              >
                <span>{isAr ? 'طلب عرض سعر فوري' : 'Request Instant Quote'}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">{isAr ? 'البريد الإلكتروني الرسمي' : 'Official Email'}</h2>
            <p className="mt-1 text-xs text-slate-500">{isAr ? 'للمناقصات والعقود الرسمية' : 'Tenders & corporate agreements'}</p>
            <div className="mt-4">
              <a
                href={`mailto:${email}`}
                className="text-base font-bold text-blue-600 hover:underline"
              >
                {email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Distribution Hubs & Locations (P4 requirement 3: العناوين والخرائط وساعات العمل) */}
      <section className="container mx-auto px-4 max-w-5xl py-16">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            {isAr ? 'المواقع الفعلية والمستودعات' : 'Physical Facilities'}
          </span>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            {isAr ? 'عناوين مستودعات التبريد والتوزيع' : 'Cold Warehouses & Logistics Hubs'}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {hubs.map((hub, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex rounded-xl bg-slate-100 p-3 text-slate-700">
                  <MapPin className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{isAr ? 'مستودع مرخص SFDA' : 'SFDA Licensed'}</span>
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-900">{hub.name}</h3>

              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>{hub.district}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>{hub.type}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>{hub.hours}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <a
                  href={hub.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  <span>{isAr ? 'فتح الموقع عبر خرائط جوجل' : 'Open in Google Maps'}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Operating Hours Note */}
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-700 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-amber-900 text-sm">
                {isAr ? 'جدول الدوام وتوريد الطوارئ' : 'Operating Hours & Emergency Dispatches'}
              </h4>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                {isAr
                  ? 'تعمل مكاتب المبيعات من السبت إلى الخميس (8:00 صباحاً حتى 5:00 مساءً). وتعمل شاحنات النقل المبرد فجراً ومساءً على مدار الأسبوع لتلبية احتياجات المطاعم والفنادق مع تأمين شحنات الطوارئ للعملاء المتعاقدين.'
                  : 'Commercial desks operate Saturday through Thursday (8:00 AM – 5:00 PM). Refrigerated fleet dispatches operate around the clock according to contract routes.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
