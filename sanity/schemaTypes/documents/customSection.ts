import { defineArrayMember, defineField, defineType } from 'sanity'
import { iconOptions, visibleField } from '../../lib/fields'
import { requiredTranslation } from '../../lib/localization'

export const customSection = defineType({
  name: 'customSection',
  title: 'الأقسام المخصصة والقابلة للتكرار',
  type: 'document',
  fields: [
    visibleField,
    defineField({
      name: 'internalName',
      title: 'اسم القسم الداخلي (للتعريف)',
      description: 'مثال: عروض خاصة، أو خدمات الشحن الموسمي، إلخ.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'العنوان الرئيسي للقسم',
      type: 'localizedString',
      validation: requiredTranslation,
    }),
    defineField({
      name: 'eyebrow',
      title: 'نص صغير فوق العنوان',
      type: 'localizedString',
    }),
    defineField({
      name: 'description',
      title: 'نص وصفي تمهيدي',
      type: 'localizedText',
    }),
    defineField({
      name: 'layout',
      title: 'نوع التصميم والمظهر',
      type: 'string',
      options: {
        list: [
          { title: 'شبكة بطاقات (Cards Grid - مثل الخدمات والقطاعات)', value: 'cards' },
          { title: 'نص وصورة جانبية (Media & Text - مثل من نحن)', value: 'mediaText' },
          { title: 'شريط ترويجي مع زر اتصال (Call To Action Banner)', value: 'banner' },
        ],
        layout: 'radio',
      },
      initialValue: 'cards',
    }),
    defineField({
      name: 'image',
      title: 'صورة القسم',
      type: 'localizedImage',
      hidden: ({ document }) => document?.layout === 'cards',
    }),
    defineField({
      name: 'cards',
      title: 'البطاقات المعروضة',
      type: 'array',
      hidden: ({ document }) => document?.layout !== 'cards',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'customCard',
          title: 'بطاقة',
          fields: [
            defineField({ name: 'icon', title: 'الأيقونة', type: 'string', options: { list: iconOptions } }),
            defineField({ name: 'title', title: 'عنوان البطاقة', type: 'localizedString', validation: requiredTranslation }),
            defineField({ name: 'text', title: 'نص البطاقة', type: 'localizedText' }),
            defineField({ name: 'image', title: 'صورة البطاقة', type: 'localizedImage' }),
            defineField({ name: 'href', title: 'رابط الزر (مثل: /#contact أو رابط خارجي)', type: 'string', initialValue: '/#contact' }),
            defineField({ name: 'ctaLabel', title: 'نص الزر', type: 'localizedString' }),
          ],
          preview: {
            select: { ar: 'title.ar', en: 'title.en', media: 'image.ar' },
            prepare: ({ ar, en, media }) => ({ title: ar || en || 'بطاقة جديدة', media }),
          },
        }),
      ],
    }),
    defineField({
      name: 'buttonLabel',
      title: 'نص زر الإجراء (CTA)',
      type: 'localizedString',
    }),
    defineField({
      name: 'buttonHref',
      title: 'رابط زر الإجراء',
      type: 'string',
      initialValue: '/#contact',
    }),
  ],
  preview: {
    select: {
      name: 'internalName',
      titleAr: 'title.ar',
      layout: 'layout',
      visible: 'visible',
    },
    prepare: ({ name, titleAr, layout, visible }) => ({
      title: titleAr || name || 'قسم مخصص',
      subtitle: `${name ? `[${name}] ` : ''}(${layout || 'cards'}) · ${visible === false ? '❌ مخفي' : '✅ ظاهر'}`,
    }),
  },
})
