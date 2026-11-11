import type { Metadata } from 'next'
import Link from 'next/link'
import { defaultLocale, isLocale, localePath, type Locale } from '@/lib/i18n'
import { sanityServerClient } from '@/lib/sanity/server-client'
import { defineQuery } from 'next-sanity'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { getSiteUrl } from '@/lib/site-url'
import { JsonLd } from '@/components/json-ld'
import { Award, CheckCircle2, Calendar, Building2, ShieldCheck, Download } from 'lucide-react'

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale
  let page: any = null
  if (sanityServerClient) {
    try {
      page = await sanityServerClient.fetch(certificationsPageQuery)
    } catch {
      // Keep safe generic metadata when Sanity is unavailable during build.
    }
  }

  const title = (locale === 'ar' ? page?.seo?.title?.ar || page?.title?.ar : page?.seo?.title?.en || page?.title?.en) || (locale === 'ar'
    ? 'الشهادات والوثائق الرسمية | شركة منافذ التوريد'
    : 'Certificates & Official Documents | Mnaveth ALTourid')

  const description = (locale === 'ar' ? page?.seo?.description?.ar : page?.seo?.description?.en || page?.seo?.description?.ar) || (locale === 'ar'
    ? 'الوثائق والشهادات التي تنشرها شركة منافذ التوريد في المملكة العربية السعودية.'
    : 'Documents and certificates published by Mnaveth ALTourid in Saudi Arabia.')

  return buildMetadata({
    path: '/certifications',
    locale,
    title,
    description,
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
  if (sanityServerClient) {
    try {
      const [pageRes, certsRes] = await Promise.all([
        sanityServerClient.fetch(certificationsPageQuery),
        sanityServerClient.fetch(certificatesQuery),
      ])
      if (pageRes) customCertPage = pageRes
      if (Array.isArray(certsRes)) sanityCertificates = certsRes
    } catch {}
  }

  const items = sanityCertificates.map((c) => ({
          id: c._id,
          name: c.name?.[locale] || c.name?.ar || c.name?.en || '',
          issuer: c.issuer?.[locale] || c.issuer?.ar || c.issuer?.en || '',
          validUntil: c.validUntil || '',
          description: c.description?.[locale] || c.description?.ar || c.description?.en || '',
          fileUrl: c.fileUrl,
        }))

  const siteUrl = await getSiteUrl()
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: isAr ? 'الشهادات والوثائق المنشورة' : 'Published Certificates & Documents',
    url: `${siteUrl}${localePath('/certifications', locale)}`,
    publisher: { '@id': `${siteUrl}/#organization` },
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20" dir={isAr ? 'rtl' : 'ltr'}>
      <JsonLd schema={schema} />

      {/* Header */}
      <section className="bg-slate-900 pt-28 md:pt-36 pb-16 text-white md:pb-20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
            <ShieldCheck className="h-4 w-4" />
            <span>{customCertPage?.badge?.[locale] || (isAr ? 'الوثائق التي أضافتها الشركة' : 'Documents added by the company')}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white">
            {customCertPage?.h1?.[locale] || (isAr ? 'الشهادات والتراخيص الرسمية' : 'Official Certifications & Accreditations')}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            {customCertPage?.intro?.[locale] || customCertPage?.intro?.ar || (isAr
              ? 'تعرض هذه الصفحة الوثائق والشهادات التي أضافتها الشركة ونشرتها.'
              : 'This page displays documents and certificates added and published by the company.')}
          </p>
        </div>
      </section>

      {/* Certificates Grid */}
      <section className="container mx-auto px-4 max-w-5xl py-12">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            {isAr ? 'لا توجد وثائق منشورة حاليًا.' : 'There are no published documents yet.'}
          </div>
        ) : <div className="grid gap-6 md:grid-cols-2">
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
                    {item.validUntil ? <><Calendar className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{isAr ? `تاريخ الصلاحية: ${item.validUntil}` : `Valid Until: ${item.validUntil}`}</span></> : (isAr ? 'وثيقة منشورة' : 'Published document')}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900 leading-snug">{item.name}</h2>

                {item.issuer && <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{isAr ? `الجهة المانحة: ${item.issuer}` : `Issuer: ${item.issuer}`}</span>
                </div>}

                {item.description ? (
                  <p className="mt-4 text-sm leading-relaxed text-slate-500 border-t border-slate-100 pt-4">
                    {item.description}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isAr ? 'وثيقة منشورة' : 'Published document'}</span>
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
        </div>}

      </section>
    </main>
  )
}
