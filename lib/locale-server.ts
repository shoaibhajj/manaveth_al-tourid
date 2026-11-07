import { defaultLocale, type Locale } from './i18n'

/**
 * Returns the default locale ('ar').
 * D1: Locale is now passed directly via route params in app/[locale]/...
 * This helper avoids calling headers() so routes remain fully static.
 */
export async function getLocale(): Promise<Locale> {
  return defaultLocale
}
