'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n'

export function ShareActions({ url, title, locale }: { url: string; title: string; locale: Locale }) {
  const [copied, setCopied] = useState(false)
  const copyLabel = locale === 'ar' ? (copied ? 'تم نسخ الرابط' : 'نسخ الرابط') : copied ? 'Link copied' : 'Copy link'
  const shareLabel = locale === 'ar' ? 'مشاركة' : 'Share'
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt(locale === 'ar' ? 'انسخ الرابط' : 'Copy the link', url)
    }
  }

  async function nativeShare() {
    if (!navigator.share) return
    try {
      await navigator.share({ title, url })
    } catch {
      // The visitor dismissed the native share sheet.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm" aria-label={shareLabel}>
      <span className="me-1 font-semibold text-muted-foreground">{shareLabel}:</span>
      <a className="rounded-full border border-border px-3 py-1.5 hover:border-gold" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">Facebook</a>
      <a className="rounded-full border border-border px-3 py-1.5 hover:border-gold" href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer">X</a>
      <a className="rounded-full border border-border px-3 py-1.5 hover:border-gold" href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <button type="button" onClick={copyLink} className="rounded-full border border-border px-3 py-1.5 hover:border-gold">{copyLabel}</button>
      {'share' in navigator ? <button type="button" onClick={nativeShare} className="rounded-full border border-border px-3 py-1.5 hover:border-gold">{locale === 'ar' ? 'مشاركة من الجهاز' : 'More options'}</button> : null}
    </div>
  )
}
