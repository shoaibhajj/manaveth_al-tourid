import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { ShareActions } from '@/components/share-actions'
import { getLocale } from '@/lib/locale-server'
import { localePath } from '@/lib/i18n'
import { getServiceBySlug } from '@/lib/sanity/details'
import { imageUrl } from '@/lib/sanity/image'
import { getSiteUrl } from '@/lib/site-url'

const textFor = (value: any, locale: 'ar' | 'en') => value?.[locale] || value?.ar || value?.en || ''

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [{ slug }, locale, base, draft] = await Promise.all([params, getLocale(), getSiteUrl(), draftMode()])
  const service = await getServiceBySlug(slug)
  if (!service) return { title: 'Service', robots: { index: false, follow: false } }
  const title = textFor(service.seo?.title, locale) || textFor(service.name, locale)
  const description = textFor(service.seo?.description, locale) || textFor(service.longDescription, locale) || textFor(service.description, locale)
  const path = `/services/${slug}`
  const image = imageUrl(service.seo?.shareImage, 1200) || imageUrl(service.image, 1200)
  return {
    title,
    description,
    alternates: { canonical: `${base}${localePath(path, locale)}`, languages: { ar: `${base}${path}`, en: `${base}/en${path}`, 'x-default': `${base}${path}` } },
    openGraph: { type: 'website', title, description, url: `${base}${localePath(path, locale)}`, images: image ? [image] : undefined },
    robots: draft.isEnabled ? { index: false, follow: false } : undefined,
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale, base] = await Promise.all([params, getLocale(), getSiteUrl()])
  const service = await getServiceBySlug(slug)
  if (!service) notFound()
  const title = textFor(service.name, locale)
  const description = textFor(service.description, locale)
  const details = textFor(service.longDescription, locale)
  const image = imageUrl(service.image, 1400)
  const path = `/services/${slug}`
  const shareUrl = `${base}${localePath(path, locale)}`
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <article className="grid gap-10 md:grid-cols-2 md:items-center">
        {image ? <img src={image} alt={title} className="aspect-[4/3] w-full rounded-3xl object-cover" /> : null}
        <div className="flex flex-col gap-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{locale === 'ar' ? 'خدمة' : 'Service'}</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
          {description ? <p className="text-lg leading-8 text-muted-foreground">{description}</p> : null}
          {details ? <p className="leading-8 text-muted-foreground">{details}</p> : null}
          <a href={locale === 'ar' ? '/#contact' : '/en/#contact'} className="w-fit rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">{locale === 'ar' ? 'اطلب هذه الخدمة' : 'Request this service'}</a>
        </div>
      </article>
      <div className="mt-10 border-t border-border pt-6"><ShareActions url={shareUrl} title={title} locale={locale} /></div>
    </main>
  )
}
