import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { defaultLocale, isLocale, localePath, type Locale } from '@/lib/i18n'
import { getContent } from '@/lib/sanity/get-content'
import { sanityServerClient } from '@/lib/sanity/server-client'
import { aboutPageQuery } from '@/lib/sanity/queries'
import { getSiteUrl } from '@/lib/site-url'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { buildOrganizationSchema } from '@/lib/seo/schema/organization'
import { JsonLd } from '@/components/json-ld'
import {
  ShieldCheck,
  Building2,
  Truck,
  Award,
  CheckCircle2,
  MapPin,
  FileCheck,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'

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
  const isAr = locale === 'ar'
  const customAbout = sanityServerClient ? await sanityServerClient.fetch(aboutPageQuery).catch(() => null) : null
  const customSeo = customAbout?.seo

  const title = (isAr ? customSeo?.title?.ar : customSeo?.title?.en) || (isAr
    ? 'عن شركة منافذ التوريد | توريد اللحوم بالجملة في السعودية'
    : 'About Mnaveth ALTourid | Wholesale Meat Supply in Saudi Arabia')

  const description = (isAr ? customSeo?.description?.ar : customSeo?.description?.en) || (isAr
    ? 'تعرف على شركة منافذ التوريد المتخصصة في توريد اللحوم بالجملة لقطاع الأعمال في المملكة العربية السعودية.'
    : 'Learn about Mnaveth ALTourid, a wholesale meat supplier serving businesses across Saudi Arabia.')

  return buildMetadata({
    path: '/about',
    locale,
    title,
    description,
    isIndexable: true,
  })
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  const isAr = locale === 'ar'

  const [content, base, sanityAbout] = await Promise.all([
    getContent(),
    getSiteUrl(),
    sanityServerClient ? sanityServerClient.fetch(aboutPageQuery).catch(() => null) : Promise.resolve(null),
  ])
  const aboutDoc = sanityAbout || content.aboutPage
  const badgeText = (isAr ? aboutDoc?.badge?.ar : aboutDoc?.badge?.en) || (isAr ? 'توريد بالجملة لقطاع الأعمال' : 'Wholesale supply for businesses')
  const heroTitle = (isAr ? aboutDoc?.title?.ar : aboutDoc?.title?.en) || (isAr ? 'شركة منافذ التوريد للتجارة' : 'Mnaveth ALTourid Trading Co.')
  const heroSubtitle = (isAr ? aboutDoc?.subtitle?.ar : aboutDoc?.subtitle?.en) || (isAr ? 'شركة متخصصة في توريد منتجات اللحوم بالجملة لقطاع الأعمال في المملكة العربية السعودية.' : 'A wholesale supplier focused on meat products for businesses across Saudi Arabia.')
  const legalName = isAr ? aboutDoc?.legalName?.ar : aboutDoc?.legalName?.en
  const crNumber = aboutDoc?.crNumber || content.site.brand.commercialRegistration
  const headquarters = (isAr ? aboutDoc?.headquarters?.ar : aboutDoc?.headquarters?.en)
  const activity = (isAr ? aboutDoc?.activity?.ar : aboutDoc?.activity?.en) || (isAr ? 'توريد منتجات اللحوم بالجملة لقطاع الأعمال' : 'Wholesale meat supply for businesses')
  const foodSafety = (isAr ? aboutDoc?.foodSafety?.ar : aboutDoc?.foodSafety?.en)
  const coldChain = (isAr ? aboutDoc?.coldChain?.ar : aboutDoc?.coldChain?.en)
  const ctaTitle = (isAr ? aboutDoc?.ctaTitle?.ar : aboutDoc?.ctaTitle?.en) || (isAr ? 'هل تود استعراض أصنافنا أو طلب عرض سعر رسمي؟' : 'Ready to explore our catalog or request a quote?')
  const ctaSubtitle = (isAr ? aboutDoc?.ctaSubtitle?.ar : aboutDoc?.ctaSubtitle?.en) || (isAr ? 'تصفح قائمة الأصناف المعتمدة أو تواصل مباشرة مع فريق المبيعات والتعاقدات.' : 'Browse certified products or get in touch with our commercial sales department.')

  const pillars = (aboutDoc?.pillars || []).filter((pillar: any) =>
    (isAr ? pillar.title?.ar : pillar.title?.en || pillar.title?.ar) &&
    (isAr ? pillar.description?.ar : pillar.description?.en || pillar.description?.ar)
  )
  const visiblePillars = pillars.length ? pillars : [
    { title: { ar: 'أصنافنا الرئيسية', en: 'Our Core Products' }, description: { ar: 'كبدة كلاسيك وكبدة جوني جولد، مخ، لسان، وريش.', en: 'Classic and Johny Gold liver, brain, tongue, and ribs.' }, icon: 'award' },
    { title: { ar: 'توريد بالجملة', en: 'Wholesale Supply' }, description: { ar: 'تركيز الشركة على توريد منتجات اللحوم لقطاع الأعمال في المملكة العربية السعودية.', en: 'Focused wholesale meat supply for businesses across Saudi Arabia.' }, icon: 'truck' },
    { title: { ar: 'تغطية التوريد', en: 'Supply Coverage' }, description: { ar: 'تغطية المدن الرئيسية، والمناطق الأبعد حسب الطلب أو للكميات الكبيرة.', en: 'Coverage for major cities, with farther regions served by order or for large quantities.' }, icon: 'fileCheck' },
  ]
  const orgSchema = buildOrganizationSchema(content.site, locale, base)

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${base}${localePath('/about', locale)}#webpage`,
    url: `${base}${localePath('/about', locale)}`,
    name: heroTitle,
    about: { '@id': `${base}/#organization` },
    publisher: { '@id': `${base}/#organization` },
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-20">
      <JsonLd graph={[orgSchema, aboutPageSchema]} />

      {/* Hero Header */}
      <div className="rounded-3xl bg-forest-deep px-6 py-12 sm:px-12 sm:py-16 text-cream shadow-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 border border-gold/40 px-4 py-1 text-xs font-bold text-gold mb-4">
          <ShieldCheck className="size-4" />
          <span>{badgeText}</span>
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-cream tracking-tight max-w-4xl mx-auto leading-tight">
          {heroTitle}
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-cream/80 leading-relaxed">
          {heroSubtitle}
        </p>
      </div>

      {/* Official Legal Entity Credentials (G2) */}
      {(legalName || crNumber || headquarters || activity || foodSafety || coldChain) && <section className="mt-12 rounded-2xl border border-forest/15 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-forest/10 pb-4">
          <Building2 className="size-5 text-forest" />
          <h2 className="text-lg sm:text-xl font-bold text-forest-deep">
            {isAr ? 'بيانات الشركة' : 'Company Information'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          {legalName && <div className="rounded-xl bg-[#FBF8F2] p-4 border border-forest/10">
            <span className="text-xs text-forest/60 block mb-1 font-medium">
              {isAr ? 'الاسم القانوني الكامل' : 'Legal Corporate Name'}
            </span>
            <strong className="text-forest-deep font-bold text-base block">
              {legalName}
            </strong>
          </div>}

          {crNumber && <div className="rounded-xl bg-[#FBF8F2] p-4 border border-forest/10">
            <span className="text-xs text-forest/60 block mb-1 font-medium">
              {isAr ? 'رقم السجل التجاري' : 'Commercial Registration (CR)'}
            </span>
            <strong className="text-forest-deep font-mono font-bold text-base block">
              {crNumber}
            </strong>
          </div>}

          {headquarters && <div className="rounded-xl bg-[#FBF8F2] p-4 border border-forest/10">
            <span className="text-xs text-forest/60 block mb-1 font-medium">
              {isAr ? 'المقر الرئيسي' : 'Headquarters'}
            </span>
            <strong className="text-forest-deep font-bold text-base block">
              {headquarters}
            </strong>
          </div>}

          {activity && <div className="rounded-xl bg-[#FBF8F2] p-4 border border-forest/10">
            <span className="text-xs text-forest/60 block mb-1 font-medium">
              {isAr ? 'النشاط الرئيسي' : 'Core Business Activity'}
            </span>
            <strong className="text-forest-deep font-bold block">
              {activity}
            </strong>
          </div>}

          {foodSafety && <div className="rounded-xl bg-[#FBF8F2] p-4 border border-forest/10">
            <span className="text-xs text-forest/60 block mb-1 font-medium">
              {isAr ? 'مطابقة سلامة الغذاء' : 'Food Safety Standard'}
            </span>
            <strong className="text-emerald-700 font-bold block">
              {foodSafety}
            </strong>
          </div>}

          {coldChain && <div className="rounded-xl bg-[#FBF8F2] p-4 border border-forest/10">
            <span className="text-xs text-forest/60 block mb-1 font-medium">
              {isAr ? 'سلسلة التبريد (Cold Chain)' : 'Cold Chain Logistics'}
            </span>
            <strong className="text-forest-deep font-bold block">
              {coldChain}
            </strong>
          </div>}
        </div>
      </section>}

      {/* Strategic Supply Pillars */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {visiblePillars.map((pillar: any, index: number) => {
          const Icon = pillar.icon === 'truck' ? Truck : pillar.icon === 'fileCheck' ? FileCheck : Award
          return <div key={`${pillar.title?.ar || pillar.title?.en}-${index}`} className="rounded-2xl border border-forest/15 bg-white p-6 shadow-xs">
            <Icon className="size-8 text-gold mb-3" />
            <h3 className="text-base font-bold text-forest-deep mb-2">{(isAr ? pillar.title?.ar : pillar.title?.en) || pillar.title?.ar}</h3>
            <p className="text-xs text-forest/70 leading-relaxed">{(isAr ? pillar.description?.ar : pillar.description?.en) || pillar.description?.ar}</p>
          </div>
        })}
      </section>

      {/* Direct Action Links */}
      <section className="mt-14 rounded-2xl bg-forest px-8 py-10 text-cream flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">
            {ctaTitle}
          </h2>
          <p className="text-xs sm:text-sm text-cream/75 mt-1">
            {ctaSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={localePath('/catalog', locale)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gold px-5 py-2.5 text-xs font-black text-forest-deep hover:bg-gold/90 transition-transform active:scale-95 shadow-md"
          >
            <span>{isAr ? 'كتالوج الأصناف (PDF)' : 'Browse Catalog (PDF)'}</span>
            {isAr ? <ArrowLeft className="size-3.5" /> : <ArrowRight className="size-3.5" />}
          </Link>

          <Link
            href={localePath('/branches', locale)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-cream hover:bg-white/20 transition-colors"
          >
            <span>{isAr ? 'الفروع والمستودعات' : 'Branches & Hubs'}</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
