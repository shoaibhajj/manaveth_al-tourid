'use client'

import { MessageCircle } from 'lucide-react'
import { whatsappUrl, type WhatsappChannel } from '@/lib/content/contact'
import { ActionLink } from './action-link'
import { useContent, useLocale } from './locale-provider'

function WidgetButton({ channel, side }: { channel: WhatsappChannel; side: 'left-4' | 'right-4' }) {
  const { t } = useLocale()

  return (
    <ActionLink
      href={whatsappUrl(channel.number, t(channel.message))}
      external
      className={`pointer-events-auto fixed bottom-24 ${side} z-40 flex items-center gap-2 rounded-full bg-whatsapp p-3.5 font-bold text-whatsapp-foreground shadow-lg shadow-forest-deep/30 transition-transform sm:px-5 sm:py-3`}
      activeClassName="hover:-translate-y-0.5 hover:shadow-xl"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
      <span className="sr-only sm:not-sr-only sm:text-sm">{t(channel.shortLabel)}</span>
      <span className="sr-only">{t(channel.label)}</span>
    </ActionLink>
  )
}

export function WhatsappWidget() {
  const { contact } = useContent()
  const { orders, quote } = contact.whatsapp

  return (
    <>
      <WidgetButton channel={orders} side="left-4" />
      <WidgetButton channel={quote} side="right-4" />
    </>
  )
}
