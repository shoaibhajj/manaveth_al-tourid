'use client'

import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '@/lib/content/contact'
import type { Product } from '@/lib/content/products'
import { ActionLink } from './action-link'
import { useContent, useLocale } from './locale-provider'

const formatAmount = (amount: number) => amount.toLocaleString('en-US')

function PriceBlock({ product }: { product: Product }) {
  const { t } = useLocale()
  const { site, currency } = useContent()
  const cur = t(currency)

  if (product.tiers) {
    return (
      <div className="rounded-xl bg-secondary/70 p-3">
        <p className="mb-2 text-xs font-bold text-muted-foreground">
          {t(site.ui.priceByQuantity)} · {t(product.tiers.unit)}
        </p>
        <ul className="space-y-1.5">
          {product.tiers.items.map((tier) => (
            <li key={tier.label.en} className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-forest">{t(tier.label)}</span>
              <span className="font-extrabold text-forest tabular-nums">
                {formatAmount(tier.amount)} <span className="text-xs font-bold text-muted-foreground">{cur}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (product.price) {
    return (
      <p className="flex items-baseline gap-1.5 rounded-xl bg-secondary/70 p-3">
        <span className="text-2xl font-extrabold text-forest tabular-nums">{formatAmount(product.price.amount)}</span>
        <span className="text-sm font-bold text-muted-foreground">
          {cur} {t(product.price.unit)}
        </span>
      </p>
    )
  }

  return <p className="rounded-xl bg-secondary/70 p-3 text-sm font-medium text-muted-foreground">{t(site.ui.priceOnRequest)}</p>
}

export function ProductCard({ product }: { product: Product }) {
  const { t } = useLocale()
  const { site, contact } = useContent()
  const orderUrl = whatsappUrl(
    contact.whatsapp.orders.number,
    t(contact.productOrderMessage).replace('{product}', t(product.name)),
  )

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[border-color,box-shadow] duration-500 hover:border-gold hover:shadow-xl hover:shadow-gold/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={t(product.alt)}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-bold text-forest">{t(product.name)}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(product.description)}</p>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <PriceBlock product={product} />
          <ActionLink
            href={orderUrl}
            external
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-forest px-5 py-3 font-bold text-cream transition-colors"
            activeClassName="hover:bg-forest-deep hover:text-gold"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            {t(site.ui.orderViaWhatsapp)}
          </ActionLink>
        </div>
      </div>
    </article>
  )
}
