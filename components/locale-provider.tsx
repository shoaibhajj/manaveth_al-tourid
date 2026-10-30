'use client'

import { createContext, useCallback, useContext, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { SiteContent } from '@/lib/content/model'
import { directionOf, LOCALE_COOKIE, type Direction, type Locale, type Localized } from '@/lib/i18n'

type LocaleContextValue = {
  locale: Locale
  dir: Direction
  setLocale: (locale: Locale) => void
  t: (value: Localized) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)
const ContentContext = createContext<SiteContent | null>(null)

export function LocaleProvider({
  initialLocale,
  content,
  children,
}: {
  initialLocale: Locale
  content: SiteContent
  children: React.ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const router = useRouter()
  const [, startTransition] = useTransition()

  const setLocale = useCallback(
    (next: Locale) => {
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
      document.documentElement.lang = next
      document.documentElement.dir = directionOf(next)
      setLocaleState(next)
      // Re-render the server tree so page metadata follows the new language.
      startTransition(() => router.refresh())
    },
    [router],
  )

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dir: directionOf(locale), setLocale, t: (v) => v[locale] }),
    [locale, setLocale],
  )

  return (
    <LocaleContext.Provider value={value}>
      <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within LocaleProvider')
  return ctx
}
