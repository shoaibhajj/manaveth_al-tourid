import type { Rule } from 'sanity'

export const languages = [
  { id: 'ar', title: 'العربية (Arabic)' },
  { id: 'en', title: 'English' },
] as const

export type LocalizedValue = { ar?: string; en?: string } | undefined

/** Warns when only one of the two languages is filled in. Saving and publishing stay possible. */
export function partialTranslationMessage(value: LocalizedValue): true | string {
  if (!value) return true
  const missing = languages.filter((language) => !value[language.id]?.trim())
  if (missing.length === 0 || missing.length === languages.length) return true
  return `Missing translation: ${missing.map((language) => language.title).join(', ')}. You can save now and complete it later.`
}

/** Warns when a field that the site shows is still empty in both languages. */
export function emptyTranslationMessage(value: LocalizedValue): true | string {
  if (!value?.ar?.trim() && !value?.en?.trim()) {
    return 'Add the Arabic and English text. You can save now and complete it later.'
  }
  return true
}

/** Use as `validation: requiredTranslation` on localized fields the site always shows. */
export const requiredTranslation = (rule: Rule) => rule.custom<LocalizedValue>(emptyTranslationMessage).warning()

/** International digits only, e.g. 9665XXXXXXXX. Empty is allowed until the owner provides the number. */
export function phoneNumberMessage(value: string | undefined): true | string {
  if (!value) return true
  return /^\d{8,15}$/.test(value.trim())
    ? true
    : 'Use international format with digits only (no +, spaces or dashes), for example 9665XXXXXXXX.'
}
