import type { Metadata } from 'next'
import Image from 'next/image'
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
  const [service, base] = await Promise.all([getServiceBySlug(slug), getSiteUrl()])
  if (!service) return notFound()

  const title = textFor(service.name, locale)
  const description = textFor(service.description, locale)
  const details = textFor(service.longDescription, locale)
  const image = imageUrl(service.image, 1400)
  const servicePath = `/services/${slug}`
  const shareUrl = `${base}${localePath(servicePath, locale)}`

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <JsonLd graph={serviceDetailGraph(service, locale, base)} />
      <article className="flex flex-col gap-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {locale === 'ar' ? 'خدمة تموينية' : 'Service'}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
        {description ? <p className="text-xl leading-8 text-muted-foreground">{description}</p> : null}
        {image ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-forest/5 shadow-md">
            <Image
              src={image}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="prose prose-invert max-w-none text-foreground/90">
          <p className="leading-8">{details || description}</p>
        </div>
        <ShareActions title={title} url={shareUrl} locale={locale} />
      </article>
    </main>
  )
}
