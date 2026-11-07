import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { ShareActions } from '@/components/share-actions'
import { getLocale } from '@/lib/locale-server'
import { localePath } from '@/lib/i18n'
import { getServiceBySlug } from '@/lib/sanity/details'
import { imageUrl } from '@/lib/sanity/image'
import { serviceDetailGraph } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site-url'
import { buildMetadata } from '@/lib/seo/build-metadata'

const textFor = (value: any, locale: 'ar' | 'en') => value?.[locale] || value?.ar || value?.en || ''

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()])
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

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale, base] = await Promise.all([params, getLocale(), getSiteUrl()])
  const service = await getServiceBySlug(slug)
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
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{locale === 'ar' ? 'خدمة تموينية' : 'Service'}</p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
        {description ? <p className="text-xl leading-8 text-muted-foreground">{description}</p> : null}
        {image ? <img src={image} alt={title} className="aspect-[16/9] w-full rounded-3xl object-cover" /> : null}
        <div className="prose prose-invert max-w-none text-foreground/90">
          <p className="leading-8">{details || description}</p>
        </div>
        <ShareActions title={title} url={shareUrl} locale={locale} />
      </article>
    </main>
  )
}
