'use client'

import { useEffect, useState } from 'react'
import type { Locale } from '@/lib/i18n'

export function VisitorCounter({ locale }: { locale: Locale }) {
  const [state, setState] = useState<{ count: number; enabled: boolean } | null>(null)

  useEffect(() => {
    let active = true
    fetch('/api/visitor-count', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data && typeof data.count === 'number') {
          setState({ count: data.count, enabled: data.enabled !== false })
        }
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])

  if (state?.enabled === false) return null

  const label = locale === 'ar' ? 'إجمالي الزيارات' : 'Total Visits'
  // Always format count using English / Western digits (e.g. 2, 150, 1,200)
  const count = state ? new Intl.NumberFormat('en-US').format(state.count) : '…'

  return (
    <div
      className="inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-forest-deep/80 px-4 py-1.5 text-xs text-cream/80 shadow-[0_0_15px_-3px_rgba(212,175,55,0.2)] backdrop-blur-md transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_20px_-2px_rgba(212,175,55,0.35)]"
      aria-live="polite"
    >
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      <span className="font-medium tracking-wide text-cream/75">{label}</span>
      <span className="h-3 w-px bg-gold/25" aria-hidden="true" />
      <span dir="ltr" className="font-mono text-[13px] font-bold tabular-nums text-gold">
        {count}
      </span>
    </div>
  )
}
