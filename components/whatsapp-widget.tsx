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
        isElevated ? '-translate-y-32 md:-translate-y-20 shadow-2xl' : 'translate-y-0'
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
      const footerBottom = document.getElementById('site-footer-bottom')
      if (footerBottom) {
        const rect = footerBottom.getBoundingClientRect()
        // Elevated when the footer bottom bar is in view or approaching within 100px
        setIsElevated(rect.top <= window.innerHeight + 100 && rect.bottom >= 0)
        return
      }

      const footer = document.getElementById('site-footer') || document.querySelector('footer')
      if (footer) {
        const rect = footer.getBoundingClientRect()
        setIsElevated(rect.bottom <= window.innerHeight + 150)
        return
      }

      // Scroll-based fallback
      const scrollBottom = window.innerHeight + window.scrollY
      const docHeight = document.documentElement.scrollHeight
      setIsElevated(docHeight - scrollBottom < 220)
    }

    handleCheck()
    window.addEventListener('scroll', handleCheck, { passive: true })
    window.addEventListener('resize', handleCheck, { passive: true })

    const target = document.getElementById('site-footer-bottom') || document.getElementById('site-footer')
    let observer: IntersectionObserver | null = null
    if (target && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsElevated(true)
          } else {
            handleCheck()
          }
        },
        { root: null, rootMargin: '0px 0px 100px 0px' }
      )
      observer.observe(target)
    }

    return () => {
      window.removeEventListener('scroll', handleCheck)
      window.removeEventListener('resize', handleCheck)
      if (observer) observer.disconnect()
    }
  }, [])

  return (
    <>
      <WidgetButton channel={orders} side="left-4" isElevated={isElevated} />
      <WidgetButton channel={quote} side="right-4" isElevated={isElevated} />
    </>
  )
}
