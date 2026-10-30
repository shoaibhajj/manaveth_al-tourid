import { defineField, defineType } from 'sanity'
import { partialTranslationMessage } from '../../lib/localization'

export const localizedString = defineType({
  name: 'localizedString',
  title: 'نص قصير (عربي / إنجليزي)',
  type: 'object',
  options: { columns: 2 },
  fields: [
    defineField({ name: 'ar', title: 'العربية (مطلوب)', type: 'string' }),
    defineField({ name: 'en', title: 'English (اختياري)', type: 'string' }),
  ],
  validation: (rule) => rule.custom(partialTranslationMessage).warning(),
})

export const localizedText = defineType({
  name: 'localizedText',
  title: 'نص طويل (عربي / إنجليزي)',
  type: 'object',
  options: { columns: 2 },
  fields: [
    defineField({ name: 'ar', title: 'العربية (مطلوب)', type: 'text', rows: 4 }),
    defineField({ name: 'en', title: 'English (اختياري)', type: 'text', rows: 4 }),
  ],
  validation: (rule) => rule.custom(partialTranslationMessage).warning(),
})

export const localizedImage = defineType({
  name: 'localizedImage',
  title: 'صورة مع نص بديل (عربي / إنجليزي)',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'النص البديل',
      description: 'يصف الصورة لقارئات الشاشة ومحركات البحث. العربية مطلوبة والإنجليزية اختيارية.',
      type: 'localizedString',
    }),
  ],
})
