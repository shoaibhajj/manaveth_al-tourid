import { defineField, defineType } from 'sanity'
import { phoneNumberMessage, requiredTranslation } from '../../lib/localization'

export const seoFields = [
  defineField({
    name: 'title',
    title: 'Page title',
    description: 'Shown in browser tabs and search results. Around 60 characters works best.',
    type: 'localizedString',
  }),
  defineField({
    name: 'description',
    title: 'Description',
    description: 'Search result summary. Around 155 characters works best.',
    type: 'localizedText',
  }),
  defineField({
    name: 'shareImage',
    title: 'Share image',
    description: 'Shown when the page is shared on social networks. Recommended size 1200 × 630.',
    type: 'localizedImage',
  }),
]

export const seo = defineType({
  name: 'seo',
  title: 'Search engine data',
  type: 'object',
  fields: seoFields,
})

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'localizedString', validation: requiredTranslation }),
    defineField({
      name: 'href',
      title: 'Address',
      description: 'A page path such as /products, an in-page anchor such as /#contact, or a full https:// address.',
      type: 'string',
    }),
  ],
  preview: {
    select: { ar: 'label.ar', en: 'label.en', href: 'href' },
    prepare: ({ ar, en, href }) => ({ title: ar || en || 'Untitled link', subtitle: href }),
  },
})

export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'localizedString', validation: requiredTranslation }),
    defineField({
      name: 'href',
      title: 'Address',
      description: 'A page path such as /products, an in-page anchor such as /#contact, or a full https:// address.',
      type: 'string',
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: { ar: 'label.ar', en: 'label.en', href: 'href', style: 'style' },
    prepare: ({ ar, en, href, style }) => ({
      title: ar || en || 'Untitled button',
      subtitle: [style, href].filter(Boolean).join(' · '),
    }),
  },
})

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: ['facebook', 'instagram', 'x', 'linkedin', 'youtube', 'tiktok', 'snapchat', 'telegram', 'other'].map(
          (value) => ({ title: value, value }),
        ),
      },
    }),
    defineField({ name: 'url', title: 'Address', type: 'url', validation: (rule) => rule.uri({ scheme: ['https', 'http'] }) }),
  ],
  preview: {
    select: { platform: 'platform', url: 'url' },
    prepare: ({ platform, url }) => ({ title: platform || 'Social link', subtitle: url }),
  },
})

export const contactPerson = defineType({
  name: 'contactPerson',
  title: 'Person in charge',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'localizedString' }),
    defineField({
      name: 'phone',
      title: 'Phone',
      description: 'Leave empty until the number is provided.',
      type: 'string',
    }),
  ],
  preview: {
    select: { ar: 'name.ar', en: 'name.en', phone: 'phone' },
    prepare: ({ ar, en, phone }) => ({ title: ar || en || 'Person in charge', subtitle: phone }),
  },
})

export const whatsappChannel = defineType({
  name: 'whatsappChannel',
  title: 'WhatsApp channel',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description: 'Full label, for example "WhatsApp: Request a quote".',
      type: 'localizedString',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'shortLabel',
      title: 'Short label',
      description: 'Compact label on the floating button, for example "Quotes".',
      type: 'localizedString',
    }),
    defineField({
      name: 'purpose',
      title: 'Purpose',
      description: 'Internal note about what this number is used for.',
      type: 'localizedText',
    }),
    defineField({
      name: 'message',
      title: 'Pre-filled message',
      description: 'The text that appears ready to send when a visitor opens the chat.',
      type: 'localizedText',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'number',
      title: 'Number',
      description:
        'International format, digits only, for example 9665XXXXXXXX. Leave empty until the owner provides it; the button stays disabled.',
      type: 'string',
      validation: (rule) => rule.custom(phoneNumberMessage).warning(),
    }),
    defineField({ name: 'visible', title: 'Visible on site', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { ar: 'name.ar', en: 'name.en', number: 'number', visible: 'visible' },
    prepare: ({ ar, en, number, visible }) => ({
      title: ar || en || 'WhatsApp channel',
      subtitle: [visible === false ? 'Hidden' : 'Visible', number || 'No number yet'].join(' · '),
    }),
  },
})

export const unitPrice = defineType({
  name: 'unitPrice',
  title: 'Price',
  type: 'object',
  fields: [
    defineField({
      name: 'amount',
      title: 'Price',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'unit',
      title: 'Sale unit',
      description: 'For example "per carton" or "per kg".',
      type: 'localizedString',
    }),
  ],
  preview: {
    select: { amount: 'amount', ar: 'unit.ar', en: 'unit.en' },
    prepare: ({ amount, ar, en }) => ({ title: amount != null ? String(amount) : 'No price', subtitle: ar || en }),
  },
})

export const priceTier = defineType({
  name: 'priceTier',
  title: 'Quantity price',
  type: 'object',
  fields: [
    defineField({ name: 'minQuantity', title: 'Minimum quantity', type: 'number', validation: (rule) => rule.min(0) }),
    defineField({
      name: 'maxQuantity',
      title: 'Maximum quantity',
      description: 'Optional. Leave empty for "and above".',
      type: 'number',
      validation: (rule) =>
        rule.min(0).custom((value, context) => {
          const min = (context.parent as { minQuantity?: number } | undefined)?.minQuantity
          return value != null && min != null && value < min ? 'The maximum must not be lower than the minimum.' : true
        }),
    }),
    defineField({
      name: 'unit',
      title: 'Sale unit',
      description: 'For example "carton" or "kg".',
      type: 'localizedString',
    }),
    defineField({ name: 'price', title: 'Price', type: 'number', validation: (rule) => rule.min(0) }),
    defineField({
      name: 'label',
      title: 'Custom label',
      description: 'Optional. Overrides the label generated from the quantities.',
      type: 'localizedString',
    }),
  ],
  preview: {
    select: { min: 'minQuantity', max: 'maxQuantity', price: 'price', ar: 'unit.ar', en: 'unit.en' },
    prepare: ({ min, max, price, ar, en }) => ({
      title: `${min ?? '?'}${max != null ? `–${max}` : '+'} ${ar || en || ''}`.trim(),
      subtitle: price != null ? `Price: ${price}` : 'No price yet',
    }),
  },
})
