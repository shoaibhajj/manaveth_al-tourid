'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { whatsappUrl, type WhatsappChannel } from '@/lib/content/contact'
import { ActionLink } from './action-link'
import { useContent, useLocale } from './locale-provider'

function WidgetButton({
  channel,
  side,
  isElevated,
}: {
  channel: WhatsappChannel
  side: 'left-4' | 'right-4'
  isElevated: boolean
}) {
  const { t } = useLocale()

  return (
    <ActionLink
      href={whatsappUrl(channel.number, t(channel.message))}
      external
      className={`pointer-events-auto fixed bottom-4 ${side} z-40 flex items-center gap-2 rounded-full bg-whatsapp p-3.5 font-bold text-whatsapp-foreground shadow-lg shadow-forest-deep/30 transition-all duration-500 ease-out sm:px-5 sm:py-3 ${
        isElevated ? '-translate-y-24 md:-translate-y-20 shadow-2xl' : 'translate-y-0'
      }`}
      activeClassName="hover:scale-105 hover:shadow-xl"
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
  const [isElevated, setIsElevated] = useState(false)

  useEffect(() => {
    const handleCheck = () => {
      const footerBottom = document.getElementById('site-footer-bottom') || document.querySelector('footer')
      if (!footerBottom) return
      const rect = footerBottom.getBoundingClientRect()
      // When the top of the footer bottom bar reaches within 100px of the viewport bottom
      const threshold = window.innerHeight - 100
      setIsElevated(rect.top <= threshold)
    }

    handleCheck()
    window.addEventListener('scroll', handleCheck, { passive: true })
    window.addEventListener('resize', handleCheck, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleCheck)
      window.removeEventListener('resize', handleCheck)
    }
  }, [])

  return (
    <>
      <WidgetButton channel={orders} side="left-4" isElevated={isElevated} />
      <WidgetButton channel={quote} side="right-4" isElevated={isElevated} />
    </>
  )
}
