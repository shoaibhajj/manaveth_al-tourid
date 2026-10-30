import { defineArrayMember, defineField, defineType, type FieldDefinition } from 'sanity'
import { iconOptions, orderField, statusLabels, visibleField } from '../../lib/fields'
import { requiredTranslation } from '../../lib/localization'

const sectionHeaderFields = [
  visibleField,
  defineField({ name: 'title', title: 'العنوان', type: 'localizedString', validation: requiredTranslation }),
  defineField({ name: 'eyebrow', title: 'نص صغير فوق العنوان', type: 'localizedString' }),
  defineField({ name: 'description', title: 'نص تمهيدي', type: 'localizedText' }),
]

function defineSection(name: string, title: string, extraFields: FieldDefinition[] = []) {
  return defineType({
    name,
    title,
    type: 'object',
    fieldsets: [{ name: 'advanced', title: 'خيارات متقدمة', options: { collapsible: true, collapsed: true } }],
    fields: [...sectionHeaderFields, ...extraFields, { ...orderField, fieldset: 'advanced' }],
    preview: {
      select: { ar: 'title.ar', en: 'title.en', visible: 'visible', order: 'order' },
      prepare: ({ ar, en, visible, order }) => ({
        title: ar || en || title,
        subtitle: [visible === false ? statusLabels.hidden : statusLabels.visible, order != null ? `الترتيب ${order}` : undefined]
          .filter(Boolean)
          .join(' · '),
      }),
    },
  })
}

export const heroSection = defineType({
  name: 'heroSection',
  title: 'الواجهة الرئيسية',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'العنوان الرئيسي', type: 'localizedString', validation: requiredTranslation }),
    defineField({ name: 'text', title: 'النص الداعم', type: 'localizedText', validation: requiredTranslation }),
    defineField({
      name: 'mediaType',
      title: 'خلفية الواجهة',
      type: 'string',
      options: {
        list: [
          { title: 'صورة', value: 'image' },
          { title: 'فيديو', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'image',
      title: 'الصورة',
      type: 'localizedImage',
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      name: 'videoFile',
      title: 'ملف الفيديو',
      description: 'ارفع فيديو قصيرًا ومضغوطًا، أو الصق رابط فيديو في الحقل التالي.',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'رابط الفيديو',
      type: 'url',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoPoster',
      title: 'صورة غلاف الفيديو',
      description: 'اختيارية. تظهر أثناء تحميل الفيديو.',
      type: 'localizedImage',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'buttons',
      title: 'الأزرار',
      description: 'ثلاثة أزرار كحد أقصى.',
      type: 'array',
      of: [defineArrayMember({ type: 'ctaButton' })],
      validation: (rule) => rule.max(3),
    }),
    defineField({ name: 'badge', title: 'شارة صغيرة فوق العنوان', type: 'localizedString' }),
    defineField({
      name: 'features',
      title: 'مزايا سريعة',
      description: 'تظهر أسفل الواجهة الرئيسية. أربع مزايا كحد أقصى.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'heroFeature',
          fields: [
            defineField({ name: 'icon', title: 'الأيقونة', type: 'string', options: { list: iconOptions } }),
            defineField({ name: 'label', title: 'النص', type: 'localizedString', validation: requiredTranslation }),
          ],
          preview: { select: { ar: 'label.ar', en: 'label.en' }, prepare: ({ ar, en }) => ({ title: ar || en }) },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
  ],
})

export const aboutSection = defineSection('aboutSection', 'من نحن', [
  defineField({
    name: 'paragraphs',
    title: 'الفقرات',
    type: 'array',
    of: [defineArrayMember({ type: 'localizedText' })],
  }),
  defineField({
    name: 'highlights',
    title: 'نقاط بارزة',
    description: 'نقاط قصيرة تظهر بجانب النص.',
    type: 'array',
    of: [defineArrayMember({ type: 'localizedString' })],
  }),
  defineField({ name: 'image', title: 'الصورة', type: 'localizedImage' }),
  defineField({
    name: 'pillars',
    title: 'ركائز الشركة',
    description: 'أربع بطاقات صغيرة تظهر أسفل نص التعريف.',
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        name: 'aboutPillar',
        fields: [
          defineField({ name: 'icon', title: 'الأيقونة', type: 'string', options: { list: iconOptions } }),
          defineField({ name: 'title', title: 'العنوان', type: 'localizedString', validation: requiredTranslation }),
          defineField({ name: 'text', title: 'الوصف', type: 'localizedString' }),
        ],
        preview: { select: { ar: 'title.ar', en: 'title.en' }, prepare: ({ ar, en }) => ({ title: ar || en }) },
      }),
    ],
    validation: (rule) => rule.max(4),
  }),
])

export const servicesSection = defineSection('servicesSection', 'الخدمات')

export const gallerySection = defineSection('gallerySection', 'معرض الأعمال', [
  defineField({
    name: 'showCategoryFilter',
    title: 'إظهار تصفية التصنيفات',
    type: 'boolean',
    initialValue: true,
  }),
])

export const statsSection = defineSection('statsSection', 'الإحصائيات')

export const sectorsSection = defineSection('sectorsSection', 'القطاعات')

export const featuredProductsSection = defineSection('featuredProductsSection', 'المنتجات المميزة', [
  defineField({
    name: 'products',
    title: 'المنتجات المختارة',
    description:
      'اختر حتى ثلاثة منتجات للصفحة الرئيسية. إن تركتها فارغة يمكن للموقع أن يعرض المنتجات المعلّمة كمميزة.',
    type: 'array',
    of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
    validation: (rule) => rule.max(3).unique(),
  }),
  defineField({
    name: 'buttonLabel',
    title: 'نص الزر',
    description: 'الزر الذي يفتح صفحة المنتجات.',
    type: 'localizedString',
  }),
])

export const branchesSection = defineSection('branchesSection', 'الفروع', [
  defineField({ name: 'showMap', title: 'إظهار روابط الخريطة', type: 'boolean', initialValue: true }),
])

export const contactSection = defineSection('contactSection', 'تواصل معنا', [
  defineField({ name: 'image', title: 'الصورة', type: 'localizedImage' }),
  defineField({
    name: 'buttons',
    title: 'الأزرار',
    description: 'ثلاثة أزرار كحد أقصى.',
    type: 'array',
    of: [defineArrayMember({ type: 'ctaButton' })],
    validation: (rule) => rule.max(3),
  }),
])

export const footerSection = defineType({
  name: 'footerSection',
  title: 'التذييل',
  type: 'object',
  fields: [
    visibleField,
    defineField({ name: 'description', title: 'وصف مختصر', type: 'localizedText' }),
    defineField({
      name: 'links',
      title: 'الروابط',
      type: 'array',
      of: [defineArrayMember({ type: 'link' })],
    }),
    defineField({ name: 'copyright', title: 'سطر حقوق النشر', type: 'localizedString' }),
  ],
})
