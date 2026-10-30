import { defineArrayMember, defineField, defineType, type FieldDefinition } from 'sanity'
import { orderField, visibleField } from '../../lib/fields'
import { requiredTranslation } from '../../lib/localization'

const sectionHeaderFields = [
  visibleField,
  orderField,
  defineField({ name: 'eyebrow', title: 'Small label above the title', type: 'localizedString' }),
  defineField({ name: 'title', title: 'Title', type: 'localizedString', validation: requiredTranslation }),
  defineField({ name: 'description', title: 'Intro text', type: 'localizedText' }),
]

function defineSection(name: string, title: string, extraFields: FieldDefinition[] = []) {
  return defineType({
    name,
    title,
    type: 'object',
    fields: [...sectionHeaderFields, ...extraFields],
    preview: {
      select: { ar: 'title.ar', en: 'title.en', visible: 'visible', order: 'order' },
      prepare: ({ ar, en, visible, order }) => ({
        title: ar || en || title,
        subtitle: [visible === false ? 'Hidden' : 'Visible', order != null ? `#${order}` : undefined]
          .filter(Boolean)
          .join(' · '),
      }),
    },
  })
}

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Headline', type: 'localizedString', validation: requiredTranslation }),
    defineField({ name: 'text', title: 'Supporting text', type: 'localizedText', validation: requiredTranslation }),
    defineField({
      name: 'mediaType',
      title: 'Background media',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'localizedImage',
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video file',
      description: 'Upload a short, compressed video. Alternatively paste a video address below.',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video address',
      type: 'url',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoPoster',
      title: 'Video cover image',
      description: 'Optional. Shown while the video loads.',
      type: 'localizedImage',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'ctaButton' })],
      validation: (rule) => rule.max(3),
    }),
  ],
})

export const aboutSection = defineSection('aboutSection', 'About', [
  defineField({
    name: 'paragraphs',
    title: 'Paragraphs',
    type: 'array',
    of: [defineArrayMember({ type: 'localizedText' })],
  }),
  defineField({
    name: 'highlights',
    title: 'Highlights',
    description: 'Short points shown next to the text.',
    type: 'array',
    of: [defineArrayMember({ type: 'localizedString' })],
  }),
  defineField({ name: 'image', title: 'Image', type: 'localizedImage' }),
])

export const servicesSection = defineSection('servicesSection', 'Services')

export const gallerySection = defineSection('gallerySection', 'Work gallery', [
  defineField({
    name: 'showCategoryFilter',
    title: 'Show category filter',
    type: 'boolean',
    initialValue: true,
  }),
])

export const statsSection = defineSection('statsSection', 'Statistics')

export const sectorsSection = defineSection('sectorsSection', 'Sectors')

export const featuredProductsSection = defineSection('featuredProductsSection', 'Featured products', [
  defineField({
    name: 'products',
    title: 'Chosen products',
    description:
      'Pick up to three products for the home page. If left empty, the site can fall back to products marked as featured.',
    type: 'array',
    of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
    validation: (rule) => rule.max(3).unique(),
  }),
  defineField({ name: 'buttonLabel', title: 'Button label', description: 'The button that opens the products page.', type: 'localizedString' }),
])

export const branchesSection = defineSection('branchesSection', 'Branches', [
  defineField({ name: 'showMap', title: 'Show map links', type: 'boolean', initialValue: true }),
])

export const contactSection = defineSection('contactSection', 'Contact', [
  defineField({ name: 'image', title: 'Image', type: 'localizedImage' }),
  defineField({
    name: 'buttons',
    title: 'Buttons',
    type: 'array',
    of: [defineArrayMember({ type: 'ctaButton' })],
    validation: (rule) => rule.max(3),
  }),
])

export const footerSection = defineType({
  name: 'footerSection',
  title: 'Footer',
  type: 'object',
  fields: [
    defineField({ name: 'visible', title: 'Visible on site', type: 'boolean', initialValue: true }),
    defineField({ name: 'description', title: 'Short description', type: 'localizedText' }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({ type: 'link' })],
    }),
    defineField({ name: 'copyright', title: 'Copyright line', type: 'localizedString' }),
  ],
})
