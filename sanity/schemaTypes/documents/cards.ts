import { defineArrayMember, defineField, defineType, type FieldDefinition } from 'sanity'
import { displayOrderings, iconOptions, iconTitles, orderField, statusLabels, visibleField } from '../../lib/fields'
import { emailMessage, requiredTranslation } from '../../lib/localization'
import { cardPreview } from '../../lib/preview'

const iconField = defineField({
  name: 'icon',
  title: 'الأيقونة',
  type: 'string',
  options: { list: iconOptions },
  group: 'content',
})

function defineIconCard(name: string, title: string, extraFields: FieldDefinition[] = []) {
  return defineType({
    name,
    title,
    type: 'document',
    groups: [
      { name: 'content', title: 'المحتوى', default: true },
      { name: 'display', title: 'العرض' },
    ],
    fields: [
      defineField({ name: 'name', title: 'الاسم', type: 'localizedString', group: 'content', validation: requiredTranslation }),
      defineField({
        name: 'description',
        title: 'الوصف',
        type: 'localizedText',
        group: 'content',
        validation: requiredTranslation,
      }),
      iconField,
      defineField({ name: 'image', title: 'الصورة', type: 'localizedImage', group: 'content' }),
      ...extraFields,
      { ...orderField, group: 'display' },
      { ...visibleField, group: 'display' },
    ],
    orderings: displayOrderings,
    preview: cardPreview({ detail: 'icon', detailLabels: iconTitles }),
  })
}

export const service = defineIconCard('service', 'خدمة')

export const sector = defineIconCard('sector', 'قطاع')

export const stat = defineType({
  name: 'stat',
  title: 'إحصائية',
  type: 'document',
  fields: [
    defineField({
      name: 'value',
      title: 'الرقم',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({ name: 'prefix', title: 'ما قبل الرقم', description: 'اختياري، مثل «+».', type: 'string' }),
    defineField({ name: 'suffix', title: 'ما بعد الرقم', description: 'اختياري، مثل «+» أو «K».', type: 'string' }),
    defineField({ name: 'label', title: 'الوصف', type: 'localizedString', validation: requiredTranslation }),
    defineField({ name: 'icon', title: 'الأيقونة', type: 'string', options: { list: iconOptions } }),
    orderField,
    visibleField,
  ],
  orderings: displayOrderings,
  preview: {
    select: { value: 'value', prefix: 'prefix', suffix: 'suffix', ar: 'label.ar', en: 'label.en', visible: 'visible', order: 'order' },
    prepare: ({ value, prefix, suffix, ar, en, visible, order }) => ({
      title: `${visible === false ? '[مخفي] ' : ''}${prefix ?? ''}${value ?? '؟'}${suffix ?? ''} · ${ar || en || 'بدون وصف'}`,
      subtitle: [
        visible === false ? statusLabels.hidden : statusLabels.visible,
        ar && en ? en : undefined,
        order != null ? `الترتيب ${order}` : undefined,
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})

export const productCategory = defineType({
  name: 'productCategory',
  title: 'تصنيف منتجات',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'الاسم', type: 'localizedString', validation: requiredTranslation }),
    orderField,
    visibleField,
  ],
  orderings: displayOrderings,
  preview: cardPreview({ media: 'none' }),
})

export const product = defineType({
  name: 'product',
  title: 'منتج',
  type: 'document',
  groups: [
    { name: 'content', title: 'المحتوى', default: true },
    { name: 'pricing', title: 'الأسعار' },
    { name: 'display', title: 'العرض' },
  ],
  fields: [
    defineField({ name: 'name', title: 'الاسم', type: 'localizedString', group: 'content', validation: requiredTranslation }),
    defineField({
      name: 'slug',
      title: 'المعرّف في الرابط (Slug)',
      description: 'يُستخدم في عنوان المنتج عند إضافة صفحات تفاصيل لاحقًا. يُنشأ من الاسم الإنجليزي؛ اكتب الاسم الإنجليزي أولًا.',
      type: 'slug',
      group: 'content',
      options: { source: 'name.en', maxLength: 96 },
    }),
    defineField({
      name: 'description',
      title: 'الوصف',
      type: 'localizedText',
      group: 'content',
      validation: requiredTranslation,
    }),
    defineField({ name: 'image', title: 'الصورة', type: 'localizedImage', group: 'content' }),
    defineField({
      name: 'category',
      title: 'التصنيف',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      group: 'content',
    }),
    defineField({
      name: 'showPrice',
      title: 'إظهار السعر في الموقع',
      description: 'أوقفه ليظهر «السعر عند الطلب» بدل أي سعر مكتوب أدناه.',
      type: 'boolean',
      initialValue: false,
      group: 'pricing',
    }),
    defineField({
      name: 'price',
      title: 'سعر واحد',
      description: 'اختياري. يُستخدم عندما لا توجد أسعار حسب الكمية.',
      type: 'unitPrice',
      group: 'pricing',
    }),
    defineField({
      name: 'priceTiers',
      title: 'أسعار حسب الكمية',
      description: 'عند إضافتها تظهر بدل السعر الواحد.',
      type: 'array',
      of: [defineArrayMember({ type: 'priceTier' })],
      group: 'pricing',
    }),
    defineField({
      name: 'featured',
      title: 'منتج مميز',
      description: 'المنتجات المميزة يمكن أن تظهر في الصفحة الرئيسية (يظهر منها ثلاثة).',
      type: 'boolean',
      initialValue: false,
      group: 'display',
    }),
    { ...orderField, group: 'display' },
    { ...visibleField, group: 'display' },
  ],
  orderings: displayOrderings,
  preview: cardPreview({ detail: 'category.name.ar', detailFallback: 'category.name.en' }),
})

export const place = defineType({
  name: 'place',
  title: 'فرع أو مستودع',
  type: 'document',
  groups: [
    { name: 'content', title: 'التفاصيل', default: true },
    { name: 'location', title: 'الموقع' },
    { name: 'contact', title: 'التواصل' },
    { name: 'display', title: 'العرض' },
  ],
  fields: [
    defineField({
      name: 'kind',
      title: 'النوع',
      type: 'string',
      options: {
        list: [
          { title: 'فرع', value: 'branch' },
          { title: 'مستودع', value: 'warehouse' },
        ],
        layout: 'radio',
      },
      initialValue: 'branch',
      group: 'content',
    }),
    defineField({ name: 'name', title: 'الاسم', type: 'localizedString', group: 'content', validation: requiredTranslation }),
    defineField({ name: 'description', title: 'الوصف', type: 'localizedText', group: 'content' }),
    defineField({ name: 'image', title: 'الصورة', type: 'localizedImage', group: 'content' }),
    defineField({ name: 'city', title: 'المدينة', type: 'localizedString', group: 'location' }),
    defineField({
      name: 'address',
      title: 'العنوان',
      description: 'اكتب العنوان فقط بعد التأكد منه.',
      type: 'localizedText',
      group: 'location',
    }),
    defineField({
      name: 'mapUrl',
      title: 'رابط خرائط Google',
      description: 'رابط منسوخ من خرائط Google (مشاركة ثم نسخ الرابط).',
      type: 'url',
      group: 'location',
      validation: (rule) => rule.uri({ scheme: ['https', 'http'] }),
    }),
    defineField({
      name: 'mapQuery',
      title: 'نص الموقع أو الإحداثيات',
      description: 'يُستخدم عند عدم وجود رابط خريطة، مثل اسم المكان أو «24.7136,46.6753».',
      type: 'string',
      group: 'location',
    }),
    defineField({
      name: 'phone',
      title: 'الهاتف',
      description: 'اتركه فارغًا حتى يتوفر الرقم.',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'email',
      title: 'البريد الإلكتروني',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.custom(emailMessage).warning(),
    }),
    defineField({
      name: 'manager',
      title: 'المسؤول',
      description: 'الموظف المسؤول عن هذا المكان، ويُستخدم غالبًا للمستودعات.',
      type: 'contactPerson',
      group: 'contact',
    }),
    { ...orderField, group: 'display' },
    { ...visibleField, group: 'display' },
  ],
  orderings: displayOrderings,
  preview: cardPreview({ detail: 'kind', detailLabels: { branch: 'فرع', warehouse: 'مستودع' } }),
})
