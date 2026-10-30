import { defineField, defineType } from 'sanity'
import { partialTranslationMessage } from '../../lib/localization'

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Short text (AR / EN)',
  type: 'object',
  options: { columns: 2 },
  fields: [
    defineField({ name: 'ar', title: 'العربية (Arabic)', type: 'string' }),
    defineField({ name: 'en', title: 'English', type: 'string' }),
  ],
  validation: (rule) => rule.custom(partialTranslationMessage).warning(),
})

export const localizedText = defineType({
  name: 'localizedText',
  title: 'Long text (AR / EN)',
  type: 'object',
  options: { columns: 2 },
  fields: [
    defineField({ name: 'ar', title: 'العربية (Arabic)', type: 'text', rows: 4 }),
    defineField({ name: 'en', title: 'English', type: 'text', rows: 4 }),
  ],
  validation: (rule) => rule.custom(partialTranslationMessage).warning(),
})

export const localizedImage = defineType({
  name: 'localizedImage',
  title: 'Image with alt text (AR / EN)',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      description: 'Describes the image for screen readers and search engines, in both languages.',
      type: 'localizedString',
    }),
  ],
})
