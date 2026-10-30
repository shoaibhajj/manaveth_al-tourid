export type Locale = 'ar' | 'en'
export type Localized = Record<Locale, string>
export type Direction = 'rtl' | 'ltr'

export const LOCALE_COOKIE = 'locale'
export const defaultLocale: Locale = 'ar'

export const isLocale = (value: unknown): value is Locale => value === 'ar' || value === 'en'
export const directionOf = (locale: Locale): Direction => (locale === 'ar' ? 'rtl' : 'ltr')
