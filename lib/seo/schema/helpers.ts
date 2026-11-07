import type { Locale } from '@/lib/i18n'

export function compact<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: any = {}
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined && val !== null && val !== '') {
      if (typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length === 0) {
        continue
      }
      result[key] = val
    }
  }
  return result
}

export function t(val: any, locale: Locale): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  return val[locale] || val.ar || val.en || ''
}

export function absoluteUrl(path: string, base: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const normalizedBase = base.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}
