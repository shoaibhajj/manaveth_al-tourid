import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocale } from '@/lib/locale-server'
import { getProductBySlug } from '@/lib/sanity/details'
import { imageUrl } from '@/lib/sanity/image'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product' }
  const title = product.name?.ar || product.name?.en || 'Product'
  return { title, description: product.description?.ar || product.description?.en }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()])
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  const title = product.name?.[locale] || product.name?.en || product.name?.ar
  const description = product.description?.[locale] || product.description?.en || product.description?.ar
  const image = imageUrl(product.image, 1200)
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        {image ? <img src={image} alt={title} className="aspect-[4/3] w-full rounded-3xl object-cover" /> : null}
        <article className="flex flex-col gap-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Product</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-lg leading-8 text-muted-foreground">{description}</p>
          <a href="/#contact" className="w-fit rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Request a quote</a>
        </article>
      </div>
    </main>
  )
}
