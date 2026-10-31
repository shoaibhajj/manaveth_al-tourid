'use client'

import { useEffect, useState } from 'react'
import type { Locale } from '@/lib/i18n'

export function VisitorCounter({ locale }: { locale: Locale }) {
  const [state, setState] = useState<{ count: number; enabled: boolean } | null>(null)

  useEffect(() => {
    let active = true
    fetch('/api/visitor-count', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' } })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (active && data && typeof data.count === 'number') setState({ count: data.count, enabled: data.enabled !== false })
      })
      .catch(() => undefined)
    return () => { active = false }
  }, [])

  if (state?.enabled === false) return null
  const label = locale === 'ar' ? 'عدد الزيارات' : 'Visits'
  const count = state ? new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(state.count) : '…'
  return <p className="text-center text-xs text-cream/60" aria-live="polite"><span>{label}: </span><span dir="ltr" className="font-semibold tabular-nums text-cream">{count}</span></p>
}
