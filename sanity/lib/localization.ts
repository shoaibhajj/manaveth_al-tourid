import type { Rule } from 'sanity'

export const languages = [
  { id: 'ar', title: 'العربية' },
  { id: 'en', title: 'English' },
] as const

export type LocalizedValue = { ar?: string; en?: string } | undefined

/** Arabic is the primary language. English is optional, so only a missing Arabic text next to an English one is flagged. */
export function partialTranslationMessage(value: LocalizedValue): true | string {
  if (!value) return true
  const hasArabic = Boolean(value.ar?.trim())
  const hasEnglish = Boolean(value.en?.trim())
  if (hasEnglish && !hasArabic) {
    return 'النص العربي ناقص. يمكنك الحفظ الآن وإكماله لاحقًا.'
  }
  return true
}

/** Warns when a field that the site always shows is empty in both languages. */
export function emptyTranslationMessage(value: LocalizedValue): true | string {
  if (!value?.ar?.trim() && !value?.en?.trim()) {
    return 'هذا الحقل مطلوب: اكتب النص العربي (النص الإنجليزي اختياري). يمكنك الحفظ الآن وإكماله لاحقًا.'
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
    : 'اكتب الرقم بالصيغة الدولية وبالأرقام فقط (بدون + أو مسافات أو شرطات)، مثال: 9665XXXXXXXX.'
}

export const invalidEmailMessage = 'هذا لا يبدو بريدًا إلكترونيًا صحيحًا.'

export function emailMessage(value: string | undefined): true | string {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : invalidEmailMessage
}
