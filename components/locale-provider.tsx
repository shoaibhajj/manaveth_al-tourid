'use client'

import { createContext, useContext, useMemo } from 'react'
import type { SiteContent } from '@/lib/content/model'
import { directionOf, localePath, type Direction, type Locale, type Localized } from '@/lib/i18n'

type LocaleContextValue = {
  locale: Locale
  dir: Direction
  t: (value: Localized) => string
  /** Prefixes internal links with /en when the page is English. */
  localize: (path: string) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)
const ContentContext = createContext<SiteContent | null>(null)

export function LocaleProvider({
  locale,
  content,
  children,
}: {
  locale: Locale
  content: SiteContent
  children: React.ReactNode
}) {
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: directionOf(locale),
      t: (v) => v[locale],
      localize: (path) => localePath(path, locale),
    }),
    [locale],
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
