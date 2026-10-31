import { notFound } from 'next/navigation'
import { getLocale } from '@/lib/locale-server'
import { getServiceBySlug } from '@/lib/sanity/details'

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()])
  const service = await getServiceBySlug(slug)
  if (!service) notFound()
  const title = service.name?.[locale] || service.name?.en || service.name?.ar
  const description = service.description?.[locale] || service.description?.en || service.description?.ar
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <article className="flex flex-col gap-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Service</p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-lg leading-8 text-muted-foreground">{description}</p>
        <a href="/#contact" className="w-fit rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Request a quote</a>
      </article>
    </main>
  )
}
