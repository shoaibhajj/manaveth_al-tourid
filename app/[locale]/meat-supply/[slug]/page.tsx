import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { defaultLocale, isLocale, localePath, type Locale } from '@/lib/i18n'
import { getSectorData, getConfirmedCityData, getMeatSupplyPageData, VERIFIED_CITIES } from '@/lib/sanity/meat-supply'
import { sanityServerClient } from '@/lib/sanity/server-client'
import { confirmedCitiesQuery } from '@/lib/sanity/queries'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { JsonLd } from '@/components/json-ld'
import {
  ShieldCheck,
  Snowflake,
  Truck,
  Building2,
  Utensils,
  Hotel,
  MapPin,
  Clock,
  Package,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = new Set(['restaurants', 'hotels', 'catering', ...Object.keys(VERIFIED_CITIES)])
  if (sanityServerClient) {
    try {
      const cities = await sanityServerClient.fetch(confirmedCitiesQuery)
      for (const city of (cities ?? []) as any[]) if (city.slug) slugs.add(city.slug)
    } catch {
      // Existing verified routes remain available if Sanity is unavailable during build.
    }
  }
  const params: { locale: string; slug: string }[] = []
  for (const locale of ['ar', 'en']) {
    for (const slug of slugs) {
      params.push({ locale, slug })
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
  const isAr = locale === 'ar'

  const sector = getSectorData(slug, locale)
  if (sector) {
    return buildMetadata({
      path: `/meat-supply/${slug}`,
      locale,
      title: sector.title,
      description: sector.description,
    })
  }

  const city = await getConfirmedCityData(slug, locale)
  if (city) {
    const title = isAr
      ? `توريد لحوم مجمدة بالجملة في ${city.name} للمطاعم والفنادق | منافذ التوريد`
      : `Wholesale Frozen Meat Supply in ${city.name} for Restaurants | Mnaveth ALTourid`
    const verifiedDetails = [city.coveredDistricts, city.deliveryTime, city.coldChainFacility].filter(Boolean).join(' ')
    const description = isAr
      ? `توريد اللحوم المجمدة بالجملة للمطاعم والفنادق في ${city.name}. ${verifiedDetails}`
      : `Wholesale frozen meat supply for restaurants and hotels in ${city.name}. ${verifiedDetails}`

    return buildMetadata({
      path: `/meat-supply/${slug}`,
      locale,
      title,
      description,
    })
  }

  return { title: 'Meat Supply', robots: { index: false, follow: false } }
}

export default async function MeatSupplySubPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug, locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const isAr = locale === 'ar'

  const sector = getSectorData(slug, locale)
  const city = await getConfirmedCityData(slug, locale)

  if (!sector && !city) {
    notFound()
  }

  const { contacts } = await getMeatSupplyPageData(locale)

  const defaultWhatsappMsg = encodeURIComponent(
    isAr
      ? `السلام عليكم، أود الاستفسار عن عروض توريد اللحوم المجمدة بخصوص (${sector ? sector.h1 : city?.name}).`
      : `Hello, I want to inquire about frozen meat supply regarding (${sector ? sector.h1 : city?.name}).`
  )
  const hasWhatsapp = Boolean(contacts.whatsapp && contacts.whatsapp.replace(/\D/g, '').length >= 7)
  const whatsappUrl = hasWhatsapp
    ? `https://wa.me/${contacts.whatsapp.replace(/\D/g, '')}?text=${defaultWhatsappMsg}`
    : localePath('/contact', locale)

  // Render Sector Sub-Page (P3)
  if (sector) {
    const sectorSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: sector.h1,
          description: sector.description,
          provider: { '@id': 'https://mnaveth.com/#organization' },
          areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: sector.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        },
      ],
    }

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
        <JsonLd schema={sectorSchema} />

        {/* Hero */}
        <section className="bg-slate-900 pt-28 md:pt-36 pb-16 text-white md:pb-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
              <ShieldCheck className="h-4 w-4" />
              <span>{isAr ? 'حلول قطاعية معتمدة · توريد مباشر B2B' : 'Industry-Specific Meat Solutions'}</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-3xl font-extrabold sm:text-4xl md:text-5xl text-white">
              {sector.h1}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
              {sector.description}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-emerald-500"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{isAr ? 'طلب تسعير وعينات للقطاع' : 'Request Sector Quote & Samples'}</span>
              </a>
              <Link
                href={localePath('/meat-supply', locale)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/20"
              >
                <span>{isAr ? 'العودة لمركز توريد اللحوم' : 'Meat Supply Hub'}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Sector Specific Pillars */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex rounded-xl bg-red-50 p-3 text-red-600">
                  <Utensils className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isAr ? 'القطعيات ومواصفات اللحم المناسبة' : 'Curated Primal Cuts'}
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {sector.suitableCuts.map((cut, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{cut}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Package className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isAr ? 'مواصفات التعبئة والكراتين' : 'Packaging Specifications'}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{sector.packagingSpecs}</p>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Truck className="h-4 w-4 text-emerald-600" />
                    <span>{isAr ? 'نمط ومواعيد التسليم' : 'Delivery Cadence'}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{sector.deliveryPattern}</p>
                </div>
              </div>
            </div>

            {/* Contract terms banner */}
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-emerald-900">
                    {isAr ? 'شروط وعقود التوريد المؤسسي' : 'Institutional Contracting Terms'}
                  </h3>
                  <p className="mt-1 text-sm text-emerald-800">{sector.contractTerms}</p>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-emerald-500"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{isAr ? 'استفسر عن العقد' : 'Inquire Terms'}</span>
                </a>
              </div>
            </div>

            {/* Sector FAQs */}
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                {isAr ? 'أسئلة شائعة حول توريد هذا القطاع' : 'Sector FAQs'}
              </h2>
              <div className="space-y-4">
                {sector.faqs.map((f, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900">{f.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Render City Sub-Page (P2)
  if (city) {
    const citySchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WholesaleStore',
          name: isAr ? `مستودع شركة منافذ التوريد في ${city.name}` : `Mnaveth Wholesale Hub in ${city.name}`,
          description: city.coveredDistricts,
          parentOrganization: { '@id': 'https://mnaveth.com/#organization' },
          areaServed: { '@type': 'City', name: city.name },
        },
        {
          '@type': 'FAQPage',
          mainEntity: city.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        },
      ],
    }

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
        <JsonLd schema={citySchema} />

        {/* Hero */}
        <section className="bg-slate-900 pt-28 md:pt-36 pb-16 text-white md:pb-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
              <MapPin className="h-4 w-4" />
              <span>{city.region}</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-3xl font-extrabold sm:text-4xl md:text-5xl text-white">
              {isAr
                ? `توريد اللحوم المجمدة بالجملة في مدينة ${city.name}`
                : `Wholesale Frozen Meat Supply in ${city.name}`}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
              {isAr
                ? `التوريد المباشر للمطاعم والفنادق ومطابخ الإعاشة في ${city.name} عبر شاحنات تبريد يومية ومستودعات مرخصة SFDA.`
                : `Direct temperature-monitored meat distribution to restaurants, hotels and kitchens in ${city.name}.`}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-emerald-500"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{isAr ? `طلب تسعير لمطاعم ${city.name}` : `Inquire for ${city.name}`}</span>
              </a>
              <Link
                href={localePath('/meat-supply', locale)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/20"
              >
                <span>{isAr ? 'العودة لمركز التوريد' : 'All Meat Supply'}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* City Operational Attributes (P2: strictly >= 3 factual fields) */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isAr ? 'الأحياء والمناطق المغطاة' : 'Covered Districts'}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{city.coveredDistricts}</p>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    <span>{isAr ? 'نقطة أو مستودع الاستلام' : 'Distribution Point'}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{city.pickupPoint}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Clock className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isAr ? 'زمن وجدولة التوصيل المبرد' : 'Cold Delivery Schedule'}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{city.deliveryTime}</p>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Package className="h-4 w-4 text-emerald-600" />
                    <span>{isAr ? 'الحد الأدنى للطلب (MOQ)' : 'Minimum Order'}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{city.minOrder}</p>
                </div>
              </div>
            </div>

            {/* Facility certification */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  {isAr ? 'تراخيص سلسلة التبريد وسلامة الغذاء' : 'Cold Chain & SFDA Compliance'}
                </h3>
              </div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{city.coldChainFacility}</p>
            </div>

            {/* City FAQs */}
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                {isAr ? `أسئلة شائعة حول التوريد في ${city.name}` : `${city.name} Supply FAQs`}
              </h2>
              <div className="space-y-4">
                {city.faqs.map((f, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900">{f.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return null
}
