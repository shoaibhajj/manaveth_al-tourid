import type { Metadata } from 'next'
import Link from 'next/link'
import { defaultLocale, isLocale, localePath, type Locale } from '@/lib/i18n'
import { getMeatSupplyPageData } from '@/lib/sanity/meat-supply'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { getSiteUrl } from '@/lib/site-url'
import { JsonLd } from '@/components/json-ld'
import { ArrowLeft, ArrowRight, Beef, MapPin, Truck } from 'lucide-react'

const readLocalized = (value: any, locale: Locale, fallback = ''): string => {
  if (typeof value === 'string') return value
  return value?.[locale] || value?.ar || value?.en || fallback
}

const defaultSpecialties = [
  { ar: 'كبدة Classic', en: 'Classic liver' },
  { ar: 'كبدة Johny Gold', en: 'Johny Gold liver' },
  { ar: 'مخ', en: 'Brain' },
  { ar: 'لسان', en: 'Tongue' },
  { ar: 'ريش', en: 'Ribs' },
]

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }]
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const { customDoc } = await getMeatSupplyPageData(locale)
  const seo = customDoc?.seo
  const title = readLocalized(seo?.title, locale) || readLocalized(customDoc?.title, locale) ||
    (locale === 'ar' ? 'توريد لحوم بالجملة في السعودية | منافذ التوريد' : 'Wholesale Meat Supply in Saudi Arabia | Mnaveth ALTourid')
  const description = readLocalized(seo?.description, locale) || readLocalized(customDoc?.intro, locale) ||
    (locale === 'ar' ? 'توريد اللحوم بالجملة للمطاعم والمنشآت في المملكة العربية السعودية.' : 'Wholesale meat supply for restaurants and businesses across Saudi Arabia.')
  const keywords = (customDoc?.targetPhrases || []).map((phrase: any) => readLocalized(phrase, locale)).filter(Boolean)
  return buildMetadata({ path: '/meat-supply', locale, title, description, keywords })
}

export default async function MeatSupplyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const isAr = locale === 'ar'
  const [{ customDoc, cities }, siteUrl] = await Promise.all([getMeatSupplyPageData(locale), getSiteUrl()])
  const badge = readLocalized(customDoc?.eyebrow, locale, isAr ? 'منتجات لحوم بالجملة' : 'Wholesale meat products')
  const title = readLocalized(customDoc?.h1, locale, isAr ? 'توريد لحوم بالجملة في السعودية' : 'Wholesale meat supply in Saudi Arabia')
  const intro = readLocalized(customDoc?.intro, locale, isAr
    ? 'توريد اللحوم بالجملة للمطاعم والفنادق ومطابخ الإعاشة في المملكة العربية السعودية.'
    : 'Wholesale meat supply for restaurants, hotels, and catering kitchens across Saudi Arabia.')
  const coverage = readLocalized(customDoc?.serviceCoverage, locale, isAr
    ? 'نخدم المدن الرئيسية بسيارات الشركة، وتُنسق الطلبات أو الكميات الكبيرة للمناطق الأبعد.'
    : 'Company vehicles serve major cities; orders or larger quantities can be arranged for farther areas.')
  const specialties = (customDoc?.coreSpecialties?.length ? customDoc.coreSpecialties : defaultSpecialties)
    .map((item: any) => readLocalized(item, locale)).filter(Boolean)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}${localePath('/meat-supply', locale)}#service`,
    name: title,
    description: intro,
    provider: { '@id': `${siteUrl}/#organization` },
    areaServed: [
      { '@type': 'Country', name: isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia' },
      ...cities.map((city: any) => ({ '@type': 'City', name: city.name })),
    ],
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
      <JsonLd schema={schema} />
      <section className="bg-[#102c24] px-4 pb-16 pt-28 text-white md:pb-24 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/5 px-4 py-2 text-sm text-amber-200"><Beef className="size-4" />{badge}</p>
          <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-4xl md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/75 md:text-lg">{intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={localePath('/catalog', locale)} className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 font-bold text-[#102c24] hover:bg-amber-200">{isAr ? 'استعراض الكتالوج' : 'View the catalog'}{isAr ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}</Link>
            <Link href={localePath('/contact', locale)} className="rounded-xl border border-white/25 px-5 py-3 font-semibold text-white hover:bg-white/10">{isAr ? 'بيانات التواصل' : 'Contact details'}</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-bold text-amber-700">{isAr ? 'تخصص الشركة' : 'Our specialties'}</p>
          <h2 className="mt-2 text-2xl font-black text-[#102c24] md:text-3xl">{isAr ? 'أصناف اللحوم الرئيسية' : 'Core meat products'}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((name: string, index: number) => <article key={`${name}-${index}`} className="rounded-2xl border border-[#102c24]/10 bg-white p-6 shadow-sm"><span className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-[#102c24] text-amber-200"><Beef className="size-5" /></span><h3 className="text-xl font-bold text-[#102c24]">{name}</h3></article>)}
        </div>
      </section>
      <section className="border-y border-[#102c24]/10 bg-white py-14 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-[0.7fr_1.3fr] md:items-start">
          <div><span className="inline-flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800"><Truck className="size-6" /></span><h2 className="mt-4 text-2xl font-black text-[#102c24]">{isAr ? 'تغطية التوريد في السعودية' : 'Supply coverage in Saudi Arabia'}</h2></div>
          <div><p className="text-base leading-8 text-slate-700">{coverage}</p>{cities.length > 0 && <ul className="mt-6 flex flex-wrap gap-2">{cities.map((city: any) => <li key={city.slug}><Link href={localePath(`/meat-supply/${city.slug}`, locale)} className="inline-flex items-center gap-1.5 rounded-full border border-[#102c24]/15 bg-[#f7f6f2] px-3 py-1.5 text-sm font-medium text-[#102c24] hover:border-amber-600"><MapPin className="size-3.5" />{city.name}</Link></li>)}</ul>}</div>
        </div>
      </section>
    </main>
  )
}