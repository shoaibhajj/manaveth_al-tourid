import { defineArrayMember, defineField, defineType, type FieldDefinition } from 'sanity'
import { displayOrderings, iconOptions, orderField, visibleField } from '../../lib/fields'
import { requiredTranslation } from '../../lib/localization'
import { cardPreview } from '../../lib/preview'

const iconField = defineField({
  name: 'icon',
  title: 'Icon',
  type: 'string',
  options: { list: iconOptions },
})

function defineIconCard(name: string, title: string, extraFields: FieldDefinition[] = []) {
  return defineType({
    name,
    title,
    type: 'document',
    fields: [
      defineField({ name: 'name', title: 'Name', type: 'localizedString', validation: requiredTranslation }),
      defineField({ name: 'description', title: 'Description', type: 'localizedText', validation: requiredTranslation }),
      iconField,
      defineField({ name: 'image', title: 'Image', type: 'localizedImage' }),
      ...extraFields,
      orderField,
      visibleField,
    ],
    orderings: displayOrderings,
    preview: cardPreview({ detail: 'icon' }),
  })
}

export const service = defineIconCard('service', 'Service — خدمة')

export const sector = defineIconCard('sector', 'Sector — قطاع')

export const stat = defineType({
  name: 'stat',
  title: 'Statistic — إحصائية',
  type: 'document',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({ name: 'prefix', title: 'Prefix', description: 'Optional, for example "+".', type: 'string' }),
    defineField({ name: 'suffix', title: 'Suffix', description: 'Optional, for example "+" or "K".', type: 'string' }),
    defineField({ name: 'label', title: 'Label', type: 'localizedString', validation: requiredTranslation }),
    orderField,
    visibleField,
  ],
  orderings: displayOrderings,
  preview: {
    select: { value: 'value', prefix: 'prefix', suffix: 'suffix', ar: 'label.ar', en: 'label.en', visible: 'visible', order: 'order' },
    prepare: ({ value, prefix, suffix, ar, en, visible, order }) => ({
      title: `${visible === false ? '[Hidden] ' : ''}${prefix ?? ''}${value ?? '?'}${suffix ?? ''} · ${ar || en || 'No label'}`,
      subtitle: [visible === false ? 'Hidden' : 'Visible', ar && en ? en : undefined, order != null ? `#${order}` : undefined]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})

export const productCategory = defineType({
  name: 'productCategory',
  title: 'Product category — تصنيف المنتجات',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'localizedString', validation: requiredTranslation }),
    orderField,
    visibleField,
  ],
  orderings: displayOrderings,
  preview: cardPreview({ media: 'none' }),
})

export const product = defineType({
  name: 'product',
  title: 'Product — منتج',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'pricing', title: 'Pricing' },
    { name: 'display', title: 'Display' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'localizedString', group: 'content', validation: requiredTranslation }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Used for the product address when detail pages are added. Generated from the English name.',
      type: 'slug',
      group: 'content',
      options: { source: 'name.en', maxLength: 96 },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localizedText',
      group: 'content',
      validation: requiredTranslation,
    }),
    defineField({ name: 'image', title: 'Image', type: 'localizedImage', group: 'content' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      group: 'content',
    }),
    defineField({
      name: 'showPrice',
      title: 'Show price on site',
      description: 'Turn off to show "price on request" instead of any price below.',
      type: 'boolean',
      initialValue: false,
      group: 'pricing',
    }),
    defineField({
      name: 'price',
      title: 'Single price',
      description: 'Optional. Used when there are no quantity prices.',
      type: 'unitPrice',
      group: 'pricing',
    }),
    defineField({
      name: 'priceTiers',
      title: 'Quantity prices',
      description: 'Prices by quantity. When present they are shown instead of the single price.',
      type: 'array',
      of: [defineArrayMember({ type: 'priceTier' })],
      group: 'pricing',
    }),
    defineField({
      name: 'featured',
      title: 'Featured product',
      description: 'Featured products can appear on the home page (three are shown there).',
      type: 'boolean',
      initialValue: false,
      group: 'display',
    }),
    { ...orderField, group: 'display' },
    { ...visibleField, group: 'display' },
  ],
  orderings: displayOrderings,
  preview: cardPreview({ detail: 'category.name.en' }),
})

export const place = defineType({
  name: 'place',
  title: 'Branch or warehouse — فرع أو مستودع',
  type: 'document',
  groups: [
    { name: 'content', title: 'Details', default: true },
    { name: 'location', title: 'Location' },
    { name: 'contact', title: 'Contact' },
    { name: 'display', title: 'Display' },
  ],
  fields: [
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Branch', value: 'branch' },
          { title: 'Warehouse', value: 'warehouse' },
        ],
        layout: 'radio',
      },
      initialValue: 'branch',
      group: 'content',
    }),
    defineField({ name: 'name', title: 'Name', type: 'localizedString', group: 'content', validation: requiredTranslation }),
    defineField({ name: 'description', title: 'Description', type: 'localizedText', group: 'content' }),
    defineField({ name: 'image', title: 'Image', type: 'localizedImage', group: 'content' }),
    defineField({ name: 'city', title: 'City', type: 'localizedString', group: 'location' }),
    defineField({
      name: 'address',
      title: 'Address',
      description: 'Only enter an address once it is confirmed.',
      type: 'localizedText',
      group: 'location',
    }),
    defineField({
      name: 'mapUrl',
      title: 'Google Maps link',
      description: 'A link copied from Google Maps (Share, then Copy link).',
      type: 'url',
      group: 'location',
      validation: (rule) => rule.uri({ scheme: ['https', 'http'] }),
    }),
    defineField({
      name: 'mapQuery',
      title: 'Location text or coordinates',
      description: 'Used when there is no map link, for example a place name or "24.7136,46.6753".',
      type: 'string',
      group: 'location',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      description: 'Leave empty until the number is provided.',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
      validation: (rule) =>
        rule
          .custom((value?: string) =>
            !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'This does not look like an email address.',
          )
          .warning(),
    }),
    defineField({
      name: 'manager',
      title: 'Person in charge',
      description: 'The employee responsible for this place, mostly used for warehouses.',
      type: 'contactPerson',
      group: 'contact',
    }),
    { ...orderField, group: 'display' },
    { ...visibleField, group: 'display' },
  ],
  orderings: displayOrderings,
  preview: cardPreview({ detail: 'kind' }),
})
