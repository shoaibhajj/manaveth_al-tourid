'use client'

import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '@/lib/content/contact'
import { useContent, useLocale } from './locale-provider'

export function ProductDetailActions({ productName }: { productName: { ar: string; en: string } }) {
  const { t, localize } = useLocale()
  const { contact, site } = useContent()
  const message = t(contact.productOrderMessage).replace('{product}', t(productName))
  const href = whatsappUrl(contact.whatsapp.orders.number, message)
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
      <MessageCircle className="size-5" aria-hidden="true" />
      {t(site.ui.orderViaWhatsapp)}
    </a>
  )
}
