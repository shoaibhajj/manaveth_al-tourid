import { headers } from 'next/headers'
import { defaultLocale, isLocale, LOCALE_HEADER, type Locale } from './i18n'

export async function getLocale(): Promise<Locale> {
  const requested = (await headers()).get(LOCALE_HEADER)
  return isLocale(requested) ? requested : defaultLocale
}
